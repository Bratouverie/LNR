import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// transitionCandidate — FSM workflow engine
//
// Body: {
//   token: string,            // JWT from secretLogin
//   candidateId: string,
//   targetStatus: string,     // new FSM status
//   reason?: string,          // reject:REASON_CODE or free text
//   comment?: string,        // optional comment
//   metadata?: object         // extra fields to update
// }
// Returns: { success, candidate, transition: { from, to } }
// ═══════════════════════════════════════════════════════════════

const encoder = new TextEncoder();

function base64urlToBytes(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function verifyJWT(token, secret) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sigB64] = parts;
  const data = `${headerB64}.${payloadB64}`;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const sigBytes = base64urlToBytes(sigB64);
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(data));
  if (!valid) return null;
  const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
  const payload = JSON.parse(payloadJson);
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
  return payload;
}

// ── FSM Transition Map ──
const TRANSITIONS = {
  pending:           ['assigned'],
  assigned:          ['anketa_pending', 'rejected'],
  anketa_pending:    ['anketa_filled', 'rejected'],
  anketa_filled:     ['sb_check', 'rejected'],
  sb_check:          ['ready_for_medical', 'rejected'],
  ready_for_medical: ['medical_passed', 'rejected'],
  medical_passed:    ['contract_signed', 'rejected'],
  contract_signed:   ['completed', 'rejected'],
  completed:         [],
  rejected:          [],
};

const ROLE_LEVELS = { manager: 1, security_officer: 2, super_admin: 3 };

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, candidateId, targetStatus, reason, comment, metadata } = body;
    if (!token || !candidateId || !targetStatus) {
      return Response.json({ error: 'token, candidateId, targetStatus are required' }, { status: 400 });
    }

    // ── 1. Verify JWT ──
    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // ── 2. Verify manager exists and is active ──
    const manager = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!manager) {
      return Response.json({ error: 'Manager not found' }, { status: 404 });
    }
    if (!manager.isActive || manager.isBlocked) {
      await base44.asServiceRole.entities.AuditLog.create({
        actor: `manager:${manager.id}`,
        action: 'transition_blocked_inactive',
        statusCode: 403,
        details: { reason: manager.isBlocked ? 'blocked' : 'inactive' },
      });
      return Response.json({ error: 'Account is inactive or blocked' }, { status: 403 });
    }

    const actorId = `manager:${manager.id}`;
    const ipAddr = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;

    // ── 3. Fetch candidate ──
    const candidate = await base44.asServiceRole.entities.Candidate.get(candidateId);
    if (!candidate) {
      await base44.asServiceRole.entities.AuditLog.create({
        actor: actorId,
        action: 'transition_candidate_not_found',
        resource: `candidate:${candidateId}`,
        statusCode: 404,
        ipAddress: ipAddr,
        details: { targetStatus },
      });
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const currentStatus = candidate.status;

    // ── 4. Validate transition is allowed by FSM ──
    const allowedTargets = TRANSITIONS[currentStatus] || [];
    if (!allowedTargets.includes(targetStatus)) {
      await base44.asServiceRole.entities.CandidateLog.create({
        candidateId,
        action: 'transition',
        from: currentStatus,
        to: targetStatus,
        actor: actorId,
        reason: 'INVALID_TRANSITION',
        ipAddress: ipAddr,
      });
      return Response.json({
        error: `Invalid transition: ${currentStatus} → ${targetStatus}`,
        currentStatus,
        allowedTransitions: allowedTargets,
      }, { status: 409 });
    }

    // ── 5. Owner check (manager can only transition own candidates; security_officer+ bypass) ──
    const managerLevel = ROLE_LEVELS[manager.role] || 0;
    const isOwner = candidate.managerId === manager.id;
    const canBypass = managerLevel >= 2;

    if (!isOwner && !canBypass) {
      await base44.asServiceRole.entities.AuditLog.create({
        actor: actorId,
        action: 'transition_owner_denied',
        resource: `candidate:${candidateId}`,
        statusCode: 403,
        ipAddress: ipAddr,
        details: { candidateManagerId: candidate.managerId, requesterId: manager.id },
      });
      return Response.json({ error: 'You can only transition your own candidates' }, { status: 403 });
    }

    // ── 6. If rejecting, validate reason ──
    if (targetStatus === 'rejected') {
      if (!reason) {
        return Response.json({ error: 'reason is required when rejecting a candidate' }, { status: 400 });
      }
      if (reason.startsWith('reject:')) {
        const reasonCode = reason.substring(7);
        const rejectReasons = await base44.asServiceRole.entities.RejectReason.filter({ code: reasonCode, isActive: true });
        if (!rejectReasons || rejectReasons.length === 0) {
          return Response.json({ error: `Invalid reject reason code: ${reasonCode}` }, { status: 400 });
        }
        const applicableStages = rejectReasons[0].applicableStages || [];
        if (applicableStages.length > 0 && !applicableStages.includes(currentStatus)) {
          return Response.json({
            error: `Reject reason "${reasonCode}" is not applicable at stage "${currentStatus}"`,
            applicableStages,
          }, { status: 400 });
        }
      }
    }

    // ── 7. Execute transition ──
    const updateData = { status: targetStatus };
    if (metadata && typeof metadata === 'object') {
      const allowedMetaFields = ['assemblyPointId', 'rewardMultiplier', 'documents', 'city', 'desiredPosition'];
      for (const field of allowedMetaFields) {
        if (metadata[field] !== undefined) {
          updateData[field] = metadata[field];
        }
      }
    }

    const updatedCandidate = await base44.asServiceRole.entities.Candidate.update(candidateId, updateData);

    // ── 8. Log transition to CandidateLog ──
    await base44.asServiceRole.entities.CandidateLog.create({
      candidateId,
      action: 'transition',
      from: currentStatus,
      to: targetStatus,
      actor: actorId,
      reason: reason || null,
      ipAddress: ipAddr,
    });

    // ── 9. Optional comment log ──
    if (comment) {
      await base44.asServiceRole.entities.CandidateLog.create({
        candidateId,
        action: 'comment',
        actor: actorId,
        reason: comment,
        ipAddress: ipAddr,
      });
    }

    // ── 10. Audit log ──
    await base44.asServiceRole.entities.AuditLog.create({
      actor: actorId,
      action: 'transition',
      resource: `candidate:${candidateId}`,
      statusCode: 200,
      ipAddress: ipAddr,
      details: { from: currentStatus, to: targetStatus, reason: reason || null },
    });

    return Response.json({
      success: true,
      candidate: updatedCandidate,
      transition: { from: currentStatus, to: targetStatus },
    });
  } catch (error) {
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.AuditLog.create({
        actor: 'system',
        action: 'transition_error',
        statusCode: 500,
        details: { error: error.message },
      });
    } catch {}
    return Response.json({ error: error.message }, { status: 500 });
  }
});
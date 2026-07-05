import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// transitionCandidate — FSM workflow engine
//
// Body: {
//   token: string,           // JWT from secretLogin
//   candidateId: string,
//   targetStatus: string,    // new FSM status
//   reason?: string,          // reject:REASON_ID or free text
//   comment?: string,         // optional comment
//   metadata?: object         // extra fields to update (e.g., assemblyPointId)
// }
//
// Returns: { success, candidate, transition: { from, to } }
// ═══════════════════════════════════════════════════════════════

// ── FSM Transition Map ──
// Each key = current status, value = array of allowed target statuses
const TRANSITIONS = {
  pending:           ['assigned'],
  assigned:          ['anketa_pending', 'rejected'],
  anketa_pending:    ['anketa_filled', 'rejected'],
  anketa_filled:     ['sb_check', 'rejected'],
  sb_check:          ['ready_for_medical', 'rejected'],
  ready_for_medical: ['medical_passed', 'rejected'],
  medical_passed:    ['contract_signed', 'rejected'],
  contract_signed:   ['completed', 'rejected'],
  completed:         [],   // terminal state
  rejected:          [],   // terminal state
};

// Statuses that require a reject reason
const REJECT_STATES = ['sb_check', 'ready_for_medical'];
// Actually any state can reject, but these MUST have a reason

// Role hierarchy for owner-check bypass
const ROLE_LEVELS = {
  manager: 1,
  security_officer: 2,
  super_admin: 3,
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, candidateId, targetStatus, reason, comment, metadata } = body;

    // ── 1. Validate input ──
    if (!token || !candidateId || !targetStatus) {
      return Response.json({ error: 'token, candidateId, targetStatus are required' }, { status: 400 });
    }

    // ── 2. Authenticate manager ──
    const authRes = await base44.functions.invoke('authenticateManager', {
      token,
      requiredRole: 'manager',
    });
    const auth = authRes.data || authRes;
    if (!auth.authenticated) {
      return Response.json({ error: 'Authentication failed' }, { status: 401 });
    }
    const manager = auth.manager;
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

    // ── 5. Owner check (manager can only transition own candidates) ──
    // security_officer and super_admin can bypass
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

    // ── 6. If rejecting, validate reason exists ──
    if (targetStatus === 'rejected') {
      if (!reason) {
        return Response.json({ error: 'reason is required when rejecting a candidate' }, { status: 400 });
      }
      // Verify reject reason code exists (if it looks like a code: prefix "reject:")
      if (reason.startsWith('reject:')) {
        const reasonCode = reason.substring(7);
        const rejectReason = await base44.asServiceRole.entities.RejectReason.filter({ code: reasonCode, isActive: true });
        if (!rejectReason || rejectReason.length === 0) {
          return Response.json({ error: `Invalid reject reason code: ${reasonCode}` }, { status: 400 });
        }
        // Verify the reason is applicable to the current stage
        const applicableStages = rejectReason[0].applicableStages || [];
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
      // Merge allowed metadata fields
      const allowedMetaFields = ['assemblyPointId', 'rewardMultiplier', 'documents', 'city', 'desiredPosition'];
      for (const field of allowedMetaFields) {
        if (metadata[field] !== undefined) {
          updateData[field] = metadata[field];
        }
      }
    }

    const updatedCandidate = await base44.asServiceRole.entities.Candidate.update(candidateId, updateData);

    // ── 8. Log to CandidateLog ──
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
    // Log unexpected errors
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
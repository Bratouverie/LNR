import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// submitSbReview — Public endpoint: approve or reject candidate
//
// Body: { token: string (sb_review JWT), decision: 'approved'|'rejected', reason?: string, comment?: string }
// Returns: { success, status }
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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, decision, reason, comment } = body;
    if (!token) {
      return Response.json({ error: 'token is required' }, { status: 400 });
    }
    if (!decision || !['approved', 'rejected'].includes(decision)) {
      return Response.json({ error: 'decision must be approved or rejected' }, { status: 400 });
    }
    if (decision === 'rejected' && !reason) {
      return Response.json({ error: 'reason is required when rejecting' }, { status: 400 });
    }

    // ── 1. Verify SB JWT ──
    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload || payload.type !== 'sb_review') {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { candidateId } = payload;

    // ── 2. Check token not already used ──
    const tokenRecords = await base44.asServiceRole.entities.SbReviewToken.filter({ candidateId, token });
    if (tokenRecords.length > 0 && tokenRecords[0].usedAt && tokenRecords[0].decision) {
      return Response.json({ error: 'This SB review link has already been used' }, { status: 409 });
    }

    // ── 3. Fetch candidate ──
    const candidate = await base44.asServiceRole.entities.Candidate.get(candidateId);
    if (!candidate) {
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const currentStatus = candidate.status;
    const newStatus = decision === 'approved' ? 'ready_for_medical' : 'rejected';

    // ── 4. Update candidate status ──
    await base44.asServiceRole.entities.Candidate.update(candidateId, { status: newStatus });

    // ── 5. Log transition ──
    await base44.asServiceRole.entities.CandidateLog.create({
      candidateId,
      action: 'transition',
      from: currentStatus,
      to: newStatus,
      actor: 'security_officer',
      reason: decision === 'rejected' ? `reject:${reason}` : 'sb_approved',
    });

    // ── 6. Update SB token record ──
    if (tokenRecords.length > 0) {
      await base44.asServiceRole.entities.SbReviewToken.update(tokenRecords[0].id, {
        usedAt: new Date().toISOString(),
        decision,
        decidedBy: 'sb_officer',
        reason: reason || null,
        comment: comment || null,
      });
    }

    // ── 7. Audit log ──
    await base44.asServiceRole.entities.AuditLog.create({
      actor: 'security_officer',
      action: `sb_${decision}`,
      resource: `candidate:${candidateId}`,
      statusCode: 200,
      details: { from: currentStatus, to: newStatus, reason: reason || null },
    });

    // ── 8. Send email to manager (non-blocking) ──
    if (candidate.managerId) {
      try {
        const manager = await base44.asServiceRole.entities.Manager.get(candidate.managerId);
        if (manager && manager.email) {
          const subject = decision === 'approved'
            ? `СБ одобрила кандидата: ${candidate.fullName}`
            : `СБ отклонила кандидата: ${candidate.fullName}`;
          const emailBody = decision === 'approved'
            ? `Кандидат ${candidate.fullName} одобрен СБ.\nСтатус: готов к медкомиссии.`
            : `Кандидат ${candidate.fullName} отклонён СБ.\nПричина: ${reason}\nКомментарий: ${comment || '—'}`;
          await base44.integrations.Core.SendEmail({
            to: manager.email,
            subject,
            body: emailBody,
            from_name: 'CRM Система',
          });
        }
      } catch {}
    }

    return Response.json({
      success: true,
      status: newStatus,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
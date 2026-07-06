import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

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

    const { token, reviewId, reason } = body;
    if (!token || !reviewId) {
      return Response.json({ error: 'token and reviewId are required' }, { status: 400 });
    }
    if (!reason) {
      return Response.json({ error: 'reason is required when rejecting a review' }, { status: 400 });
    }

    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const manager = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!manager) {
      return Response.json({ error: 'Manager not found' }, { status: 404 });
    }
    if (!manager.isActive || manager.isBlocked) {
      return Response.json({ error: 'Account is inactive or blocked' }, { status: 403 });
    }

    if (manager.role !== 'super_admin') {
      await base44.asServiceRole.entities.AuditLog.create({
        actor: `manager:${manager.id}`,
        action: 'review_reject_denied',
        resource: `review:${reviewId}`,
        statusCode: 403,
        details: { reason: 'insufficient_role', role: manager.role },
      });
      return Response.json({ error: 'Only super_admin can moderate reviews' }, { status: 403 });
    }

    const actorId = `manager:${manager.id}`;
    const ipAddr = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;

    const now = new Date().toISOString();
    const updated = await base44.asServiceRole.entities.Review.update(reviewId, {
      status: 'rejected',
      rejectedAt: now,
      rejectionReason: reason,
      approvedAt: null,
    });

    await base44.asServiceRole.entities.AuditLog.create({
      actor: actorId,
      action: 'review_rejected',
      resource: `review:${reviewId}`,
      statusCode: 200,
      ipAddress: ipAddr,
      details: { reason, reviewName: updated?.name || null },
    });

    return Response.json({ success: true, review: updated });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
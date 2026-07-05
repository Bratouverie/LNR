import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// toggleManagerStatus — Activate/deactivate or block/unblock a manager
//
// Body: {
//   token: string,
//   managerId: string,
//   action: 'activate' | 'deactivate' | 'block' | 'unblock'
// }
// Returns: { success, manager }
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

const ACTIONS = {
  activate: { isActive: true },
  deactivate: { isActive: false },
  block: { isBlocked: true },
  unblock: { isBlocked: false },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, managerId, action } = body;
    if (!token) return Response.json({ error: 'token is required' }, { status: 401 });
    if (!managerId || !action) {
      return Response.json({ error: 'managerId and action are required' }, { status: 400 });
    }
    if (!ACTIONS[action]) {
      return Response.json({ error: 'Invalid action. Use: activate, deactivate, block, unblock' }, { status: 400 });
    }

    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) return Response.json({ error: 'Invalid or expired token' }, { status: 401 });

    const caller = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!caller || !caller.isActive || caller.isBlocked) {
      return Response.json({ error: 'Account inactive or blocked' }, { status: 403 });
    }
    if (caller.role !== 'super_admin') {
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Prevent self-deactivation/self-block
    if (managerId === caller.id) {
      return Response.json({ error: 'Cannot modify your own account' }, { status: 400 });
    }

    const updated = await base44.asServiceRole.entities.Manager.update(managerId, ACTIONS[action]);

    await base44.asServiceRole.entities.AuditLog.create({
      actor: `manager:${caller.id}`,
      action: `manager_${action}`,
      resource: `manager:${managerId}`,
      statusCode: 200,
      details: { targetManager: updated.fullName },
    });

    const { secretCode, ...safeManager } = updated;
    return Response.json({ success: true, manager: safeManager });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
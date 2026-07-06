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

    const { token, status } = body;
    if (!token) {
      return Response.json({ error: 'token is required' }, { status: 400 });
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
      return Response.json({ error: 'Only super_admin can view review moderation' }, { status: 403 });
    }

    const filter = { isDeleted: { $ne: true } };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const reviews = await base44.asServiceRole.entities.Review.filter(filter, '-created_date', 200);

    return Response.json({ reviews });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// saveAssemblyPoint — Creates or updates an AssemblyPoint
//
// Body: {
//   token: string,
//   id?: string,           // if present → update, else → create
//   name: string,
//   city: string,
//   lat: number,
//   lng: number,
//   description?: string,
//   phone?: string,
//   workHours?: string
// }
// Returns: { success, assemblyPoint }
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

    const { token, id, name, city, lat, lng, description, phone, workHours } = body;
    if (!token) return Response.json({ error: 'token is required' }, { status: 401 });
    if (!name || !city || lat === undefined || lng === undefined) {
      return Response.json({ error: 'name, city, lat, lng are required' }, { status: 400 });
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

    const data = {
      name, city, lat, lng,
      description: description || null,
      phone: phone || null,
      workHours: workHours || null,
    };

    let assemblyPoint;
    if (id) {
      assemblyPoint = await base44.asServiceRole.entities.AssemblyPoint.update(id, data);
    } else {
      assemblyPoint = await base44.asServiceRole.entities.AssemblyPoint.create(data);
    }

    return Response.json({ success: true, assemblyPoint });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
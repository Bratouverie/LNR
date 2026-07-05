import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// createManager — Creates a new Manager account (super_admin only)
//
// Body: {
//   token: string,
//   fullName: string,
//   phone: string,
//   email?: string,
//   secretCode: string,   // plaintext — will be hashed SHA-256
//   role: 'manager' | 'security_officer' | 'super_admin',
//   agencyId?: string,
//   isActive?: boolean
// }
//
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

async function sha256Hex(text) {
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const VALID_ROLES = ['manager', 'security_officer', 'super_admin'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, fullName, phone, email, secretCode, role, agencyId, isActive } = body;
    if (!token) return Response.json({ error: 'token is required' }, { status: 401 });
    if (!fullName || !phone || !secretCode || !role) {
      return Response.json({ error: 'fullName, phone, secretCode, role are required' }, { status: 400 });
    }
    if (!VALID_ROLES.includes(role)) {
      return Response.json({ error: 'Invalid role' }, { status: 400 });
    }

    // ── Verify JWT ──
    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) return Response.json({ error: 'Invalid or expired token' }, { status: 401 });

    // ── Verify caller is super_admin ──
    const caller = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!caller || !caller.isActive || caller.isBlocked) {
      return Response.json({ error: 'Account inactive or blocked' }, { status: 403 });
    }
    if (caller.role !== 'super_admin') {
      return Response.json({ error: 'Only super_admin can create managers' }, { status: 403 });
    }

    // ── Hash secretCode ──
    const hashedCode = await sha256Hex(secretCode);

    // ── Create manager ──
    const manager = await base44.asServiceRole.entities.Manager.create({
      fullName,
      phone,
      email: email || null,
      secretCode: hashedCode,
      role,
      agencyId: agencyId || null,
      isActive: isActive !== undefined ? isActive : true,
      isBlocked: false,
      loginAttempts: 0,
      createdByManagerId: caller.id,
    });

    // ── Audit log ──
    await base44.asServiceRole.entities.AuditLog.create({
      actor: `manager:${caller.id}`,
      action: 'manager_created',
      resource: `manager:${manager.id}`,
      statusCode: 200,
      details: { fullName, role, agencyId: agencyId || null },
    });

    // Return manager WITHOUT secretCode hash
    const { secretCode: _omit, ...safeManager } = manager;
    return Response.json({ success: true, manager: safeManager });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
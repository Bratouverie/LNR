import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// authenticateManager — Auth + RBAC middleware (combined)
// Combines: middleware/auth.ts + middleware/rbac.ts
//
// Called by: future protected endpoints (via base44.functions.invoke)
// Body: { token: string, requiredRole?: string }
// Returns: { authenticated: true, manager: { id, fullName, role, agencyId, email } }
//
// ownerCheck is NOT done here — each endpoint filters by manager.id inline:
//   const auth = await base44.functions.invoke('authenticateManager', { token, requiredRole: 'manager' });
//   const candidates = await base44.entities.Candidate.filter({ managerId: auth.data.manager.id });
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

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );

  const sigBytes = base64urlToBytes(sigB64);
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(data));
  if (!valid) return null;

  const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
  const payload = JSON.parse(payloadJson);

  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;

  return payload;
}

// Role hierarchy: higher level = more permissions
const ROLE_LEVELS = {
  manager: 1,
  security_officer: 2,
  super_admin: 3,
};

function hasRequiredRole(userRole, requiredRole) {
  if (!requiredRole) return true;
  const userLevel = ROLE_LEVELS[userRole] || 0;
  const requiredLevel = ROLE_LEVELS[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, requiredRole } = body;
    if (!token || typeof token !== 'string') {
      return Response.json({ error: 'token is required' }, { status: 400 });
    }

    // ── 1. Verify JWT (auth.ts) ──
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
        action: 'auth_blocked_inactive',
        statusCode: 403,
        details: { reason: manager.isBlocked ? 'blocked' : 'inactive' },
      });
      return Response.json({ error: 'Account is inactive or blocked' }, { status: 403 });
    }

    // ── 3. RBAC: check role (rbac.ts) ──
    if (requiredRole && !hasRequiredRole(manager.role, requiredRole)) {
      await base44.asServiceRole.entities.AuditLog.create({
        actor: `manager:${manager.id}`,
        action: 'rbac_denied',
        statusCode: 403,
        details: { requiredRole, actualRole: manager.role },
      });
      return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // ── 4. Return authenticated context ──
    // ownerCheck is done by the calling endpoint (filter by manager.id)
    return Response.json({
      authenticated: true,
      manager: {
        id: manager.id,
        fullName: manager.fullName,
        role: manager.role,
        agencyId: manager.agencyId || null,
        email: manager.email || null,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
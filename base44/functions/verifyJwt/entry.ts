// ═══════════════════════════════════════════════════════════════
// verifyJwt — Utility function to verify HS256 JWT tokens
// Called by: frontend (token validation), other backend functions
// Body: { token: string }
// Returns: { valid: boolean, payload?: { managerId, agencyId, role, email, exp } }
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

  // Import key and verify signature
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

  // Decode payload
  const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
  const payload = JSON.parse(payloadJson);

  // Check expiry
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;

  return payload;
}

Deno.serve(async (req) => {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token } = body;
    if (!token || typeof token !== 'string') {
      return Response.json({ error: 'token is required' }, { status: 400 });
    }

    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) {
      return Response.json({ valid: false, error: 'Invalid or expired token' }, { status: 401 });
    }

    return Response.json({
      valid: true,
      payload: {
        managerId: payload.managerId,
        agencyId: payload.agencyId,
        role: payload.role,
        email: payload.email,
        exp: payload.exp,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
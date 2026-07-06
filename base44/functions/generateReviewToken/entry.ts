import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// generateReviewToken — Creates a 30-day JWT magic link for post-contract review
//
// Body: { token: string (manager JWT), candidateId: string }
// Returns: { success, reviewToken, expiresAt, link }
// ═══════════════════════════════════════════════════════════════

const encoder = new TextEncoder();

function base64urlFromString(str) {
  const bytes = encoder.encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

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

async function signHMACSHA256(data, secret) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64urlFromString(JSON.stringify(header));
  const payloadB64 = base64urlFromString(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;
  const sig = await signHMACSHA256(data, secret);
  return `${data}.${sig}`;
}

const REVIEW_TOKEN_TTL_SEC = 30 * 24 * 60 * 60; // 30 days

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, candidateId } = body;
    if (!token || !candidateId) {
      return Response.json({ error: 'token and candidateId are required' }, { status: 400 });
    }

    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) {
      return Response.json({ error: 'Invalid or expired manager token' }, { status: 401 });
    }

    const manager = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!manager || !manager.isActive || manager.isBlocked) {
      return Response.json({ error: 'Manager not found or inactive' }, { status: 403 });
    }

    const candidate = await base44.asServiceRole.entities.Candidate.get(candidateId);
    if (!candidate) {
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const exp = Math.floor(Date.now() / 1000) + REVIEW_TOKEN_TTL_SEC;
    const reviewJwt = await generateJWT(
      { candidateId, type: 'candidate_review', exp },
      Deno.env.get('JWT_SECRET')
    );

    const expiresAt = new Date(exp * 1000).toISOString();
    await base44.asServiceRole.entities.ReviewToken.create({
      candidateId,
      token: reviewJwt,
      expiresAt,
    });

    const link = `${req.headers.get('origin') || 'https://vosstanovim-dnr.ru'}/candidate-review?token=${reviewJwt}`;

    return Response.json({ success: true, reviewToken: reviewJwt, expiresAt, link });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
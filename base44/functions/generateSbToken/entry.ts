import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// generateSbToken — Creates a 24h JWT magic link for SB officer review
//
// Body: { token: string (manager JWT), candidateId: string }
// Returns: { success, sbToken, expiresAt, link }
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

const SB_TOKEN_TTL_SEC = 24 * 60 * 60; // 24 hours

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

    // ── 1. Verify manager JWT ──
    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) {
      return Response.json({ error: 'Invalid or expired manager token' }, { status: 401 });
    }

    const manager = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!manager || !manager.isActive || manager.isBlocked) {
      return Response.json({ error: 'Manager not found or inactive' }, { status: 403 });
    }

    // ── 2. Fetch candidate ──
    const candidate = await base44.asServiceRole.entities.Candidate.get(candidateId);
    if (!candidate) {
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // ── 3. Generate SB JWT (24h expiry) ──
    const exp = Math.floor(Date.now() / 1000) + SB_TOKEN_TTL_SEC;
    const sbJwt = await generateJWT(
      { candidateId, type: 'sb_review', exp },
      Deno.env.get('JWT_SECRET')
    );

    // ── 4. Invalidate previous unused SB tokens ──
    const oldTokens = await base44.asServiceRole.entities.SbReviewToken.filter({
      candidateId,
      usedAt: null,
    });
    for (const old of oldTokens) {
      await base44.asServiceRole.entities.SbReviewToken.update(old.id, { usedAt: new Date().toISOString() });
    }

    // ── 5. Create SbReviewToken ──
    const expiresAt = new Date(exp * 1000).toISOString();
    const sbToken = await base44.asServiceRole.entities.SbReviewToken.create({
      candidateId,
      token: sbJwt,
      expiresAt,
    });

    // ── 6. Transition candidate → sb_check if currently anketa_filled ──
    if (candidate.status === 'anketa_filled') {
      await base44.asServiceRole.entities.Candidate.update(candidateId, { status: 'sb_check' });
      await base44.asServiceRole.entities.CandidateLog.create({
        candidateId,
        action: 'transition',
        from: 'anketa_filled',
        to: 'sb_check',
        actor: `manager:${manager.id}`,
        reason: 'sb_token_generated',
      });
    }

    // ── 7. Audit log ──
    await base44.asServiceRole.entities.AuditLog.create({
      actor: `manager:${manager.id}`,
      action: 'sb_token_generated',
      resource: `candidate:${candidateId}`,
      statusCode: 200,
      details: { expiresAt },
    });

    const link = `${req.headers.get('origin') || 'https://vosstanovim-dnr.ru'}/sb-review?token=${sbJwt}`;

    return Response.json({
      success: true,
      sbToken: sbJwt,
      expiresAt,
      link,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
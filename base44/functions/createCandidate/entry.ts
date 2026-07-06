import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// createCandidate — Admin directly creates a candidate + anketa token
//
// Body: { token: string (manager JWT), fullName, phone, email, city, desiredPosition, managerId? }
// Returns: { success, candidateId, anketaToken, link, status }
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

const ANKETA_TOKEN_TTL_SEC = 7 * 24 * 60 * 60;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, fullName, phone, email, city, desiredPosition, managerId } = body;
    if (!token) {
      return Response.json({ error: 'token is required' }, { status: 400 });
    }

    // ── 1. Verify manager JWT ──
    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const adminManager = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!adminManager || !adminManager.isActive || adminManager.isBlocked) {
      return Response.json({ error: 'Manager not found or inactive' }, { status: 403 });
    }

    if (adminManager.role !== 'super_admin') {
      return Response.json({ error: 'Only super admins can create candidates directly' }, { status: 403 });
    }

    // ── 2. Validate required fields ──
    if (!fullName || !phone) {
      return Response.json({ error: 'fullName and phone are required' }, { status: 400 });
    }

    // ── 3. Resolve manager (auto-assign if not provided) ──
    let assignedManagerId = managerId;
    if (!assignedManagerId) {
      const activeManagers = await base44.asServiceRole.entities.Manager.filter({
        isActive: true,
        isBlocked: false,
        role: 'manager',
      });
      if (activeManagers.length > 0) {
        // Simple load-balance: pick the one with fewest candidates
        let minCount = Infinity;
        for (const m of activeManagers) {
          const count = await base44.asServiceRole.entities.Candidate.filter({ managerId: m.id });
          if (count.length < minCount) {
            minCount = count.length;
            assignedManagerId = m.id;
          }
        }
      } else {
        assignedManagerId = adminManager.id;
      }
    }

    // ── 4. Create candidate ──
    const candidate = await base44.asServiceRole.entities.Candidate.create({
      managerId: assignedManagerId,
      fullName,
      phone,
      email: email || null,
      city: city || null,
      desiredPosition: desiredPosition || null,
      status: 'anketa_pending',
      source: 'web_form',
    });

    // ── 5. Generate anketa token (7 days) ──
    const exp = Math.floor(Date.now() / 1000) + ANKETA_TOKEN_TTL_SEC;
    const anketaJwt = await generateJWT(
      { candidateId: candidate.id, type: 'anketa', exp },
      Deno.env.get('JWT_SECRET')
    );

    const expiresAt = new Date(exp * 1000).toISOString();
    await base44.asServiceRole.entities.AnketaToken.create({
      candidateId: candidate.id,
      token: anketaJwt,
      expiresAt,
    });

    // ── 6. Log ──
    await base44.asServiceRole.entities.CandidateLog.create({
      candidateId: candidate.id,
      action: 'created',
      actor: `manager:${adminManager.id}`,
      reason: 'candidate_created_manual',
    });

    await base44.asServiceRole.entities.AuditLog.create({
      actor: `manager:${adminManager.id}`,
      action: 'candidate_created_manual',
      resource: `candidate:${candidate.id}`,
      statusCode: 200,
      details: { fullName, phone, assignedManagerId },
    });

    // ── 7. Send email to candidate (non-blocking) ──
    if (email) {
      try {
        const link = `${req.headers.get('origin') || 'https://vosstanovim-dnr.ru'}/candidate-anketa?token=${anketaJwt}`;
        await base44.integrations.Core.SendEmail({
          to: email,
          subject: 'Заполните анкету — Портал восстановления',
          body: [
            `Здравствуйте, ${fullName}!`,
            '',
            'Вам необходимо заполнить анкету кандидата.',
            `Ссылка: ${link}`,
            '',
            'Ссылка действительна 7 дней.',
            '',
            'С уважением,',
            'Команда Портала восстановления',
          ].join('\n'),
          from_name: 'Портал восстановления',
        });
      } catch {}
    }

    const link = `${req.headers.get('origin') || 'https://vosstanovim-dnr.ru'}/candidate-anketa?token=${anketaJwt}`;

    return Response.json({
      success: true,
      candidateId: candidate.id,
      anketaToken: anketaJwt,
      link,
      status: 'anketa_pending',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
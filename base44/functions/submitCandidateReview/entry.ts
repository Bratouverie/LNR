import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// submitCandidateReview — Public endpoint: submit post-contract review
//
// Body: { token, name, position, city, stars, text, monthsInProgram, photo }
// Returns: { success, reviewId }
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

function sanitize(val, minLen, maxLen) {
  if (typeof val !== 'string') return '';
  return val.replace(/<[^>]*>/g, '').replace(/[<>"'&]/g, '').trim().slice(0, maxLen);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, name, position, city, stars, text, monthsInProgram, photo } = body;
    if (!token) {
      return Response.json({ error: 'token is required' }, { status: 400 });
    }

    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload || payload.type !== 'candidate_review') {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { candidateId } = payload;

    // Check token not used
    const tokenRecords = await base44.asServiceRole.entities.ReviewToken.filter({ candidateId, token });
    if (tokenRecords.length > 0 && tokenRecords[0].usedAt) {
      return Response.json({ error: 'Review already submitted' }, { status: 409 });
    }

    // Validate
    const sName = sanitize(name, 2, 100);
    const sPosition = sanitize(position, 1, 100);
    const sCity = sanitize(city, 2, 100);
    const sText = sanitize(text, 10, 1000);
    const nStars = Number(stars);
    const nMonths = Number(monthsInProgram);

    if (!sName) return Response.json({ error: 'Имя: 2-100 символов' }, { status: 400 });
    if (!sPosition) return Response.json({ error: 'Укажите должность' }, { status: 400 });
    if (!sCity) return Response.json({ error: 'Город: 2-100 символов' }, { status: 400 });
    if (!nStars || nStars < 1 || nStars > 5) return Response.json({ error: 'Оценка: 1-5' }, { status: 400 });
    if (!sText) return Response.json({ error: 'Текст: 10-1000 символов' }, { status: 400 });
    if (!nMonths || nMonths < 1 || nMonths > 12) return Response.json({ error: 'Месяцы: 1-12' }, { status: 400 });
    if (!photo) return Response.json({ error: 'Загрузите фото' }, { status: 400 });

    const review = await base44.asServiceRole.entities.Review.create({
      name: sName, position: sPosition, city: sCity, stars: nStars, text: sText,
      monthsInProgram: nMonths, photo, status: 'pending', candidateId,
    });

    // Mark token as used
    if (tokenRecords.length > 0) {
      await base44.asServiceRole.entities.ReviewToken.update(tokenRecords[0].id, {
        usedAt: new Date().toISOString(),
        reviewId: review.id,
      });
    }

    return Response.json({ success: true, reviewId: review.id });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
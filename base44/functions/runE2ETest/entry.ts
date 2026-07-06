import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// runE2ETest — End-to-end lifecycle test using direct entity operations
//
// Body: {} (no auth needed — uses service role)
// Returns: { results: [...], summary: { total, passed, failed } }
// ═══════════════════════════════════════════════════════════════

const encoder = new TextEncoder();

function base64urlFromString(str) {
  const bytes = encoder.encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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

Deno.serve(async (req) => {
  const results = [];
  const base44 = createClientFromRequest(req);
  const sr = base44.asServiceRole;
  const testId = `e2e_${Date.now()}`;
  let candidateId = null;
  let anketaTokenId = null;
  let sbTokenId = null;
  let rewardId = null;

  const check = (name, condition, details) => {
    results.push({ name, status: condition ? 'PASS' : 'FAIL', details: details || null });
    return condition;
  };

  try {
    // ── 1. Create test candidate ──
    const candidate = await sr.entities.Candidate.create({
      fullName: `E2E Test ${testId}`,
      phone: '+79990000000',
      email: `e2e-${testId}@test.com`,
      status: 'pending',
      source: 'web_form',
    });
    candidateId = candidate.id;
    check('1. Create candidate', !!candidate.id);

    // ── 2. Transition: pending → assigned ──
    await sr.entities.Candidate.update(candidateId, { status: 'assigned', managerId: 'test_manager' });
    await sr.entities.CandidateLog.create({ candidateId, action: 'transition', from: 'pending', to: 'assigned', actor: 'e2e_test' });
    const c2 = await sr.entities.Candidate.get(candidateId);
    check('2. Transition pending → assigned', c2.status === 'assigned');

    // ── 3. Generate anketa token ──
    const anketaJwt = await generateJWT(
      { candidateId, type: 'anketa', exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 },
      Deno.env.get('JWT_SECRET')
    );
    const anketaToken = await sr.entities.AnketaToken.create({
      candidateId, token: anketaJwt, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
    anketaTokenId = anketaToken.id;
    check('3. Generate anketa token', !!anketaToken.id);

    // ── 4. Transition: assigned → anketa_pending ──
    await sr.entities.Candidate.update(candidateId, { status: 'anketa_pending' });
    await sr.entities.CandidateLog.create({ candidateId, action: 'transition', from: 'assigned', to: 'anketa_pending', actor: 'e2e_test' });
    const c4 = await sr.entities.Candidate.get(candidateId);
    check('4. Transition assigned → anketa_pending', c4.status === 'anketa_pending');

    // ── 5. Submit anketa ──
    const anketa = await sr.entities.Anketa.create({
      candidateId,
      fullName: `E2E Test ${testId}`,
      birthDate: '1990-01-01',
      passportSeries: '1234',
      passportNumber: '567890',
      passportIssuedBy: 'Test OVVD',
      passportIssueDate: '2015-06-15',
      desiredPosition: 'Разнорабочий',
      passportPhotoUrl: 'https://test.com/passport.jpg',
      passportRegistrationUrl: 'https://test.com/registration.jpg',
      snilsUrl: 'https://test.com/snils.jpg',
      consentToDataProcessing: true,
      consentToWorkConditions: true,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    });
    check('5. Submit anketa', !!anketa.id);

    // ── 6. Transition: anketa_pending → anketa_filled ──
    await sr.entities.Candidate.update(candidateId, { status: 'anketa_filled' });
    await sr.entities.CandidateLog.create({ candidateId, action: 'transition', from: 'anketa_pending', to: 'anketa_filled', actor: 'candidate' });
    const c6 = await sr.entities.Candidate.get(candidateId);
    check('6. Transition anketa_pending → anketa_filled', c6.status === 'anketa_filled');

    // ── 7. Transition: anketa_filled → sb_check ──
    await sr.entities.Candidate.update(candidateId, { status: 'sb_check' });
    const c7 = await sr.entities.Candidate.get(candidateId);
    check('7. Transition anketa_filled → sb_check', c7.status === 'sb_check');

    // ── 8. Generate SB token ──
    const sbJwt = await generateJWT(
      { candidateId, type: 'sb_review', exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 },
      Deno.env.get('JWT_SECRET')
    );
    const sbToken = await sr.entities.SbReviewToken.create({
      candidateId, token: sbJwt, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
    sbTokenId = sbToken.id;
    check('8. Generate SB token', !!sbToken.id);

    // ── 9. SB approve: sb_check → ready_for_medical ──
    await sr.entities.Candidate.update(candidateId, { status: 'ready_for_medical' });
    await sr.entities.SbReviewToken.update(sbTokenId, { usedAt: new Date().toISOString(), decision: 'approved' });
    const c9 = await sr.entities.Candidate.get(candidateId);
    check('9. SB approve → ready_for_medical', c9.status === 'ready_for_medical');

    // ── 10. Medical → contract ──
    await sr.entities.Candidate.update(candidateId, { status: 'medical_passed' });
    await sr.entities.Candidate.update(candidateId, { status: 'contract_signed' });
    const c10 = await sr.entities.Candidate.get(candidateId);
    check('10. Medical → contract_signed', c10.status === 'contract_signed');

    // ── 11. Create reward transaction ──
    const reward = await sr.entities.RewardTransaction.create({
      candidateId,
      managerId: 'test_manager',
      rewardBase: 1000000,
      rewardMultiplier: 100,
      rewardFinal: 1000000,
      status: 'pending_payment',
    });
    rewardId = reward.id;
    check('11. Create reward transaction', !!reward.id);

    // ── 12. Transition: contract_signed → completed ──
    await sr.entities.Candidate.update(candidateId, { status: 'completed' });
    const c12 = await sr.entities.Candidate.get(candidateId);
    check('12. Contract → completed', c12.status === 'completed');

    // ── 13. Verify CandidateLog entries ──
    const logs = await sr.entities.CandidateLog.filter({ candidateId });
    check('13. CandidateLog entries created', logs.length > 0);

  } catch (error) {
    check('E2E execution', false, error.message);
  } finally {
    // ── Cleanup ──
    try {
      if (rewardId) await sr.entities.RewardTransaction.delete(rewardId);
      if (sbTokenId) await sr.entities.SbReviewToken.delete(sbTokenId);
      if (anketaTokenId) await sr.entities.AnketaToken.delete(anketaTokenId);
      if (candidateId) {
        await sr.entities.Anketa.deleteMany({ candidateId });
        await sr.entities.CandidateLog.deleteMany({ candidateId });
        await sr.entities.Candidate.delete(candidateId);
      }
    } catch {}
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;

  return Response.json({
    results,
    summary: { total: results.length, passed, failed },
  });
});
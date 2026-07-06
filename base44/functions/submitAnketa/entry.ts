import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// submitAnketa — Public endpoint: verify anketa JWT, validate, save, transition
//
// Body: { token: string (anketa JWT), form: {...anketa fields}, files: {...urls} }
// Returns: { success, candidateId, status: 'anketa_filled' }
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

    const { token, form, files } = body;
    if (!token) {
      return Response.json({ error: 'token is required' }, { status: 400 });
    }

    // ── 1. Verify anketa JWT ──
    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload || payload.type !== 'anketa') {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const candidateId = payload.candidateId;

    // ── 2. Check token not already used ──
    const tokenRecords = await base44.asServiceRole.entities.AnketaToken.filter({ candidateId, token });
    if (tokenRecords.length > 0 && tokenRecords[0].usedAt) {
      return Response.json({ error: 'This anketa link has already been used' }, { status: 409 });
    }

    // ── 3. Fetch candidate ──
    const candidate = await base44.asServiceRole.entities.Candidate.get(candidateId);
    if (!candidate) {
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // ── 4. Validate required fields ──
    const errors = [];
    if (!form?.fullName) errors.push('ФИО обязательно');
    if (!form?.birthDate) errors.push('Дата рождения обязательна');
    if (!form?.passportSeries) errors.push('Серия паспорта обязательна');
    if (!form?.passportNumber) errors.push('Номер паспорта обязателен');
    if (!form?.passportIssuedBy) errors.push('Кем выдан паспорт обязательно');
    if (!form?.passportIssueDate) errors.push('Дата выдачи паспорта обязательна');
    if (!form?.desiredPosition) errors.push('Желаемая должность обязательна');
    if (!files?.passportPhotoUrl) errors.push('Загрузите разворот паспорта с фото');
    if (!files?.passportRegistrationUrl) errors.push('Загрузите страницу паспорта с пропиской');
    if (!files?.snilsUrl) errors.push('Загрузите СНИЛС');
    if (!form?.consentToDataProcessing) errors.push('Необходимо согласие на обработку ПД');
    if (!form?.consentToWorkConditions) errors.push('Необходимо согласие с условиями работы');
    if (errors.length > 0) {
      return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    // ── 5. Build anketa data ──
    const anketaData = {
      candidateId,
      fullName: form.fullName,
      birthDate: form.birthDate,
      citizenship: form.citizenship || null,
      cityOfResidence: form.cityOfResidence || candidate.city || null,
      placeOfBirth: form.placeOfBirth || null,
      registrationAddress: form.registrationAddress || null,
      actualAddress: form.actualAddress || null,
      assemblyPointId: form.assemblyPointId || candidate.assemblyPointId || null,
      plannedArrivalDate: form.plannedArrivalDate || null,
      passportSeries: form.passportSeries,
      passportNumber: form.passportNumber,
      passportIssuedBy: form.passportIssuedBy,
      passportIssueDate: form.passportIssueDate,
      passportDepartmentCode: form.passportDepartmentCode || null,
      email: form.email || candidate.email || null,
      backupPhone: form.backupPhone || null,
      desiredPosition: form.desiredPosition,
      educationLevel: form.educationLevel || null,
      graduationYear: form.graduationYear || null,
      institution: form.institution || null,
      speciality: form.speciality || null,
      professionalSkills: form.professionalSkills || [],
      totalWorkExperience: form.totalWorkExperience || null,
      shiftWorkExperience: form.shiftWorkExperience || null,
      lastEmployer: form.lastEmployer || null,
      lastPosition: form.lastPosition || null,
      workStartDate: form.workStartDate || null,
      workEndDate: form.workEndDate || null,
      reasonForDismissal: form.reasonForDismissal || null,
      chronicDiseases: form.chronicDiseases || null,
      bloodType: form.bloodType || null,
      hasConvictions: form.hasConvictions || null,
      height: form.height || null,
      weight: form.weight || null,
      passportPhotoUrl: files.passportPhotoUrl,
      passportRegistrationUrl: files.passportRegistrationUrl,
      snilsUrl: files.snilsUrl,
      photoUrl: files.photoUrl || null,
      diplomaUrl: files.diplomaUrl || null,
      medicalReportUrl: files.medicalReportUrl || null,
      consentToDataProcessing: true,
      consentToWorkConditions: true,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };

    // ── 6. Create or update Anketa ──
    const existing = await base44.asServiceRole.entities.Anketa.filter({ candidateId });
    let anketa;
    if (existing.length > 0) {
      anketa = await base44.asServiceRole.entities.Anketa.update(existing[0].id, anketaData);
    } else {
      anketa = await base44.asServiceRole.entities.Anketa.create(anketaData);
    }

    // ── 7. Transition candidate status → anketa_filled ──
    const currentStatus = candidate.status;
    if (currentStatus === 'anketa_pending' || currentStatus === 'assigned') {
      await base44.asServiceRole.entities.Candidate.update(candidateId, {
        status: 'anketa_filled',
        email: form.email || candidate.email,
        desiredPosition: form.desiredPosition,
        city: form.cityOfResidence || candidate.city,
        assemblyPointId: form.assemblyPointId || candidate.assemblyPointId,
      });

      await base44.asServiceRole.entities.CandidateLog.create({
        candidateId,
        action: 'transition',
        from: currentStatus,
        to: 'anketa_filled',
        actor: 'candidate',
        reason: 'anketa_submitted',
      });
    }

    // ── 8. Mark token as used ──
    if (tokenRecords.length > 0) {
      await base44.asServiceRole.entities.AnketaToken.update(tokenRecords[0].id, {
        usedAt: new Date().toISOString(),
      });
    }

    // ── 9. Log document uploads ──
    await base44.asServiceRole.entities.CandidateLog.create({
      candidateId,
      action: 'document_upload',
      actor: 'candidate',
      reason: JSON.stringify(Object.keys(files)),
    });

    // ── 10. Audit log ──
    await base44.asServiceRole.entities.AuditLog.create({
      actor: `candidate:${candidateId}`,
      action: 'anketa_submitted',
      resource: `candidate:${candidateId}`,
      statusCode: 200,
      details: { anketaId: anketa.id },
    });

    // ── 11. Send email to manager (non-blocking) ──
    if (candidate.managerId) {
      try {
        const manager = await base44.asServiceRole.entities.Manager.get(candidate.managerId);
        if (manager && manager.email) {
          await base44.integrations.Core.SendEmail({
            to: manager.email,
            subject: `Анкета готова к проверке: ${form.fullName}`,
            body: [
              `Кандидат ${form.fullName} заполнил анкету.`,
              `Телефон: ${candidate.phone}`,
              `Должность: ${form.desiredPosition}`,
              '',
              `Проверьте анкету в CRM и отправьте на проверку СБ.`,
            ].join('\n'),
            from_name: 'CRM Система',
          });
        }
      } catch {}
    }

    return Response.json({
      success: true,
      candidateId,
      status: 'anketa_filled',
      anketaId: anketa.id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
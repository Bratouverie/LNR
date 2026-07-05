import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// processIntegrationQueue — Scheduled processor for IntegrationQueue
//
// Fetches pending items, creates Candidate records, marks queue items
// processed/error. Runs every 5 minutes via scheduled automation.
//
// No auth required (service-role, triggered by cron).
// Returns: { processed, created, errors, duplicates }
// ═══════════════════════════════════════════════════════════════

const MAX_ATTEMPTS = 3;
const BATCH_SIZE = 20;

function extractCandidateData(payload, source) {
  // Normalize different payload formats from different sources
  const fullName =
    payload.fullName || payload.full_name || payload.name ||
    payload.fio || `${payload.lastName || ''} ${payload.firstName || ''} ${payload.middleName || ''}`.trim();
  const phone =
    payload.phone || payload.phoneNumber || payload.phone_number ||
    payload.tel || null;
  const email = payload.email || null;
  const city = payload.city || null;
  const birthDate = payload.birthDate || payload.birth_date || null;
  const desiredPosition = payload.desiredPosition || payload.position || payload.vacancy || null;

  return { fullName, phone, email, city, birthDate, desiredPosition };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Fetch pending queue items
    const queueItems = await base44.asServiceRole.entities.IntegrationQueue.filter({
      status: 'pending',
    }, '-created_date', BATCH_SIZE);

    if (queueItems.length === 0) {
      return Response.json({ processed: 0, created: 0, errors: 0, duplicates: 0 });
    }

    let created = 0;
    let errors = 0;
    let duplicates = 0;

    for (const item of queueItems) {
      try {
        const payload = item.payload || {};
        const candidateData = extractCandidateData(payload, item.source);

        // Validate minimum required fields
        if (!candidateData.fullName || !candidateData.phone) {
          throw new Error('Missing required fields: fullName, phone');
        }

        // Deduplication: check if candidate with same source + externalId exists
        const existingCandidates = await base44.asServiceRole.entities.Candidate.filter({
          source: item.source,
          externalId: item.externalId,
        });

        if (existingCandidates.length > 0) {
          // Mark as duplicate
          await base44.asServiceRole.entities.IntegrationQueue.update(item.id, {
            status: 'duplicate',
            candidateId: existingCandidates[0].id,
            processedAt: new Date().toISOString(),
          });
          duplicates++;
          continue;
        }

        // Create Candidate
        const candidate = await base44.asServiceRole.entities.Candidate.create({
          fullName: candidateData.fullName,
          phone: candidateData.phone,
          email: candidateData.email,
          city: candidateData.city,
          birthDate: candidateData.birthDate,
          desiredPosition: candidateData.desiredPosition,
          status: 'pending',
          source: item.source,
          externalId: item.externalId,
        });

        // Log candidate creation
        await base44.asServiceRole.entities.CandidateLog.create({
          candidateId: candidate.id,
          action: 'created',
          actor: `integration:${item.source}`,
          reason: `queue:${item.id}`,
        });

        // Mark queue item as processed
        await base44.asServiceRole.entities.IntegrationQueue.update(item.id, {
          status: 'processed',
          candidateId: candidate.id,
          processedAt: new Date().toISOString(),
          attemptCount: (item.attemptCount || 0) + 1,
        });

        created++;
      } catch (itemError) {
        const newAttemptCount = (item.attemptCount || 0) + 1;
        const isPermanent = newAttemptCount >= MAX_ATTEMPTS;

        await base44.asServiceRole.entities.IntegrationQueue.update(item.id, {
          status: isPermanent ? 'error' : 'pending',
          errorMessage: itemError.message,
          attemptCount: newAttemptCount,
          processedAt: isPermanent ? new Date().toISOString() : null,
        });

        await base44.asServiceRole.entities.AuditLog.create({
          actor: `integration:${item.source}`,
          action: 'queue_error',
          resource: `queue:${item.id}`,
          statusCode: 500,
          details: { error: itemError.message, attempt: newAttemptCount },
        });

        errors++;
      }
    }

    // Summary audit log
    await base44.asServiceRole.entities.AuditLog.create({
      actor: 'system:cron',
      action: 'queue_processed',
      resource: 'integration_queue',
      statusCode: 200,
      details: { total: queueItems.length, created, errors, duplicates },
    });

    return Response.json({
      processed: queueItems.length,
      created,
      errors,
      duplicates,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
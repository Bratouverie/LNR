import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// gatekeeperInbound — Entry point for all external integrations
// Validates X-API-KEY against IntegrationKey entity, enqueues to IntegrationQueue
//
// Called by: External services (Genspark, VoIP, Telegram, web forms)
// Headers: X-API-KEY: <plaintext-api-key>
// Body: { source: string, externalId: string, payload: object }
// Returns: { status: "queued", queueId: string } or { status: "duplicate" }
// ═══════════════════════════════════════════════════════════════

const encoder = new TextEncoder();

async function sha256Hex(text) {
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // ── 1. Parse body first (needed for apiKey fallback) ──
    let body = {};
    try {
      body = await req.json();
    } catch {
      // Body might be empty for header-only auth — continue
    }

    // ── 2. Validate API key (header OR body fallback) ──
    const apiKey = req.headers.get('x-api-key') || body.apiKey;
    if (!apiKey) {
      return Response.json({ error: 'X-API-KEY header (or apiKey in body) is required' }, { status: 401 });
    }

    // Hash the provided key (we store hashes, never plaintext)
    const hashedKey = await sha256Hex(apiKey);

    // Find matching IntegrationKey
    const keys = await base44.asServiceRole.entities.IntegrationKey.filter({
      key: hashedKey,
      isActive: true,
    });

    if (keys.length === 0) {
      return Response.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const integrationKey = keys[0];

    // ── 3. Extract fields from body ──
    const { source, externalId, payload: incomingPayload } = body;

    // Validate required fields
    if (!source || !externalId || !incomingPayload) {
      return Response.json(
        { error: 'source, externalId, and payload are required' },
        { status: 400 },
      );
    }

    // Validate source matches the integration key's service
    if (integrationKey.service !== source && integrationKey.service !== 'web_form') {
      // Allow web_form to submit any source, but other keys must match
      return Response.json(
        {
          error: `Source mismatch: key is for "${integrationKey.service}" but received "${source}"`,
        },
        { status: 403 },
      );
    }

    // ── 3. Deduplication check (source + externalId) ──
    const duplicates = await base44.asServiceRole.entities.IntegrationQueue.filter({
      source,
      externalId,
    });

    if (duplicates.length > 0) {
      return Response.json(
        {
          status: 'duplicate',
          queueId: duplicates[0].id,
          message: 'This record has already been queued',
        },
        { status: 409 },
      );
    }

    // ── 4. Enqueue ──
    const queueRecord = await base44.asServiceRole.entities.IntegrationQueue.create({
      source,
      externalId,
      payload: incomingPayload,
      status: 'pending',
      attemptCount: 0,
    });

    // ── 5. Update lastUsed on IntegrationKey ──
    await base44.asServiceRole.entities.IntegrationKey.update(integrationKey.id, {
      lastUsed: new Date().toISOString(),
    });

    // ── 6. Audit log ──
    await base44.asServiceRole.entities.AuditLog.create({
      actor: `integration:${integrationKey.service}`,
      action: 'queue_enqueue',
      resource: `queue:${queueRecord.id}`,
      statusCode: 201,
      details: { source, externalId },
    });

    return Response.json(
      {
        status: 'queued',
        queueId: queueRecord.id,
      },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
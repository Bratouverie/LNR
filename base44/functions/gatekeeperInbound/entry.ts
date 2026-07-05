import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// gatekeeperInbound — Entry point for all external integrations
// Validates X-API-KEY against IntegrationKey entity, enqueues to IntegrationQueue
//
// Called by: External services (Genspark, VoIP, Telegram, web forms on vosstanovim-dnr.ru)
// Headers: X-API-KEY: <plaintext-api-key>
// Body: { source: string, externalId: string, payload: object }
// Returns: { status: "queued", queueId: string } or { status: "duplicate" }
// ═══════════════════════════════════════════════════════════════

const encoder = new TextEncoder();

const ALLOWED_ORIGINS = [
  'https://vosstanovim-dnr.ru',
  'https://www.vosstanovim-dnr.ru',
];

async function sha256Hex(text) {
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function corsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'X-API-KEY, Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data, status, origin) {
  return Response.json(data, { status, headers: corsHeaders(origin) });
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin') || '';

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

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
      return json({ error: 'X-API-KEY header (or apiKey in body) is required' }, 401, origin);
    }

    // Hash the provided key (we store hashes, never plaintext)
    const hashedKey = await sha256Hex(apiKey);

    // Find matching IntegrationKey
    const keys = await base44.asServiceRole.entities.IntegrationKey.filter({
      key: hashedKey,
      isActive: true,
    });

    if (keys.length === 0) {
      return json({ error: 'Invalid API key' }, 401, origin);
    }

    const integrationKey = keys[0];

    // ── 3. Extract fields from body ──
    const { source, externalId, payload: incomingPayload } = body;

    // Validate required fields
    if (!source || !externalId || !incomingPayload) {
      return json(
        { error: 'source, externalId, and payload are required' },
        400,
        origin,
      );
    }

    // Validate source matches the integration key's service
    if (integrationKey.service !== source && integrationKey.service !== 'web_form') {
      return json(
        {
          error: `Source mismatch: key is for "${integrationKey.service}" but received "${source}"`,
        },
        403,
        origin,
      );
    }

    // ── 4. Deduplication check (source + externalId) ──
    const duplicates = await base44.asServiceRole.entities.IntegrationQueue.filter({
      source,
      externalId,
    });

    if (duplicates.length > 0) {
      return json(
        {
          status: 'duplicate',
          queueId: duplicates[0].id,
          message: 'This record has already been queued',
        },
        409,
        origin,
      );
    }

    // ── 5. Enqueue ──
    const queueRecord = await base44.asServiceRole.entities.IntegrationQueue.create({
      source,
      externalId,
      payload: incomingPayload,
      status: 'pending',
      attemptCount: 0,
    });

    // ── 6. Update lastUsed on IntegrationKey ──
    await base44.asServiceRole.entities.IntegrationKey.update(integrationKey.id, {
      lastUsed: new Date().toISOString(),
    });

    // ── 7. Audit log ──
    await base44.asServiceRole.entities.AuditLog.create({
      actor: `integration:${integrationKey.service}`,
      action: 'queue_enqueue',
      resource: `queue:${queueRecord.id}`,
      statusCode: 201,
      details: { source, externalId },
    });

    return json(
      {
        status: 'queued',
        queueId: queueRecord.id,
      },
      201,
      origin,
    );
  } catch (error) {
    return json({ error: error.message }, 500, origin);
  }
});
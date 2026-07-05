import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// JWT + Crypto Utilities (inlined — Base44 functions deploy independently)
// ═══════════════════════════════════════════════════════════════

const encoder = new TextEncoder();

function base64urlFromString(str) {
  const bytes = encoder.encode(str);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sha256Hex(text) {
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function signHMACSHA256(data, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function generateJWT(payload, secret) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64urlFromString(JSON.stringify(header));
  const payloadB64 = base64urlFromString(JSON.stringify(payload));
  const data = `${headerB64}.${payloadB64}`;
  const sig = await signHMACSHA256(data, secret);
  return `${data}.${sig}`;
}

// ═══════════════════════════════════════════════════════════════
// Rate Limiting (middleware/rateLimit.ts equivalent — inlined)
// ═══════════════════════════════════════════════════════════════

const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour
const RECORD_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const LOGIN_ENDPOINT = '/api/auth/secret-login';

function getClientIp(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

async function checkRateLimit(base44, ip, endpoint) {
  const logs = await base44.asServiceRole.entities.RateLimitLog.filter({
    ipAddress: ip,
    endpoint,
  });
  if (logs.length === 0) return { blocked: false, attempts: 0 };
  const log = logs[0];
  if (log.blockedUntil && new Date(log.blockedUntil) > new Date()) {
    return { blocked: true, attempts: log.attemptCount, blockedUntil: log.blockedUntil };
  }
  return { blocked: false, attempts: log.attemptCount, logId: log.id };
}

async function recordFailedAttempt(base44, ip, endpoint) {
  const existing = await base44.asServiceRole.entities.RateLimitLog.filter({
    ipAddress: ip,
    endpoint,
  });
  const now = new Date();
  const expiresAt = new Date(now.getTime() + RECORD_TTL_MS);

  if (existing.length > 0) {
    const log = existing[0];
    const newCount = (log.attemptCount || 0) + 1;
    const shouldBlock = newCount >= MAX_ATTEMPTS;
    await base44.asServiceRole.entities.RateLimitLog.update(log.id, {
      attemptCount: newCount,
      blockedUntil: shouldBlock
        ? new Date(now.getTime() + BLOCK_DURATION_MS).toISOString()
        : log.blockedUntil,
      expiresAt: expiresAt.toISOString(),
    });
    return { attempts: newCount, blocked: shouldBlock };
  }

  await base44.asServiceRole.entities.RateLimitLog.create({
    ipAddress: ip,
    endpoint,
    attemptCount: 1,
    blockedUntil: null,
    expiresAt: expiresAt.toISOString(),
  });
  return { attempts: 1, blocked: false };
}

async function clearRateLimit(base44, ip, endpoint) {
  const existing = await base44.asServiceRole.entities.RateLimitLog.filter({
    ipAddress: ip,
    endpoint,
  });
  for (const log of existing) {
    await base44.asServiceRole.entities.RateLimitLog.delete(log.id);
  }
}

// ═══════════════════════════════════════════════════════════════
// Main Handler — POST /api/auth/secret-login
// Body: { secretCode: string }
// Returns: { token, manager: { id, fullName, role, agencyId, email } }
// ═══════════════════════════════════════════════════════════════

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const ip = getClientIp(req);

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { secretCode } = body;
    if (!secretCode || typeof secretCode !== 'string') {
      return Response.json({ error: 'secretCode is required' }, { status: 400 });
    }

    // ── Rate limit check ──
    const rateLimit = await checkRateLimit(base44, ip, LOGIN_ENDPOINT);
    if (rateLimit.blocked) {
      return Response.json(
        {
          error: 'Too many login attempts. Please try again later.',
          blockedUntil: rateLimit.blockedUntil,
        },
        { status: 429 },
      );
    }

    // ── Hash the provided secretCode (SHA-256) ──
    const hashedCode = await sha256Hex(secretCode);

    // ── Find manager by secretCode hash ──
    const managers = await base44.asServiceRole.entities.Manager.filter({
      secretCode: hashedCode,
      isActive: true,
    });

    if (managers.length === 0) {
      // Record failed attempt
      const result = await recordFailedAttempt(base44, ip, LOGIN_ENDPOINT);

      // Audit log
      await base44.asServiceRole.entities.AuditLog.create({
        actor: `ip:${ip}`,
        action: 'login_failed',
        statusCode: 401,
        ipAddress: ip,
        details: {
          reason: 'invalid_secret_code',
          attempts: result.attempts,
          blocked: result.blocked,
        },
      });

      return Response.json(
        {
          error: 'Invalid secret code',
          attemptsRemaining: Math.max(0, MAX_ATTEMPTS - result.attempts),
          blocked: result.blocked,
        },
        { status: 401 },
      );
    }

    const manager = managers[0];

    // ── Check if blocked ──
    if (manager.isBlocked) {
      await base44.asServiceRole.entities.AuditLog.create({
        actor: `manager:${manager.id}`,
        action: 'login_blocked',
        statusCode: 403,
        ipAddress: ip,
        details: { reason: 'manager_is_blocked' },
      });
      return Response.json({ error: 'Account is blocked. Contact administrator.' }, { status: 403 });
    }

    // ── Clear rate limit on successful login ──
    await clearRateLimit(base44, ip, LOGIN_ENDPOINT);

    // ── Update lastLogin ──
    await base44.asServiceRole.entities.Manager.update(manager.id, {
      lastLogin: new Date().toISOString(),
      loginAttempts: 0,
    });

    // ── Generate JWT (HS256, 24h expiry) ──
    const jwtPayload = {
      managerId: manager.id,
      agencyId: manager.agencyId || null,
      role: manager.role,
      email: manager.email || null,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
    };
    const token = await generateJWT(jwtPayload, Deno.env.get('JWT_SECRET'));

    // ── Audit log (success) ──
    await base44.asServiceRole.entities.AuditLog.create({
      actor: `manager:${manager.id}`,
      action: 'login_success',
      statusCode: 200,
      ipAddress: ip,
      details: { role: manager.role, fullName: manager.fullName },
    });

    return Response.json({
      token,
      manager: {
        id: manager.id,
        fullName: manager.fullName,
        role: manager.role,
        agencyId: manager.agencyId || null,
        email: manager.email || null,
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// getCandidateDetail — Returns candidate + transition history + reward
//
// Body: { token: string, candidateId: string }
// Returns: { candidate, logs, reward }
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

    const { token, candidateId } = body;
    if (!token) return Response.json({ error: 'token is required' }, { status: 401 });
    if (!candidateId) return Response.json({ error: 'candidateId is required' }, { status: 400 });

    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) return Response.json({ error: 'Invalid or expired token' }, { status: 401 });

    const caller = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!caller || !caller.isActive || caller.isBlocked) {
      return Response.json({ error: 'Account inactive or blocked' }, { status: 403 });
    }

    let candidate;
    try {
      candidate = await base44.asServiceRole.entities.Candidate.get(candidateId);
    } catch {
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }
    if (!candidate) return Response.json({ error: 'Candidate not found' }, { status: 404 });

    // RBAC: managers can only see their own candidates; super_admin & security_officer see all
    if (caller.role === 'manager' && candidate.managerId !== payload.managerId) {
      return Response.json({ error: 'Access denied: candidate not assigned to you' }, { status: 403 });
    }

    // Fetch transition history
    const logs = await base44.asServiceRole.entities.CandidateLog.filter({
      candidateId,
    }, '-created_date', 100);

    // Fetch reward transaction (if any)
    const rewards = await base44.asServiceRole.entities.RewardTransaction.filter({
      candidateId,
    }, '-created_date', 5);

    return Response.json({
      candidate,
      logs,
      reward: rewards.length > 0 ? rewards[0] : null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
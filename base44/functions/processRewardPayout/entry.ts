import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import Stripe from 'npm:stripe@17.7.0';

// ═══════════════════════════════════════════════════════════════
// processRewardPayout — Processes a pending RewardTransaction
//                        via Stripe Payouts API.
//
// Body: {
//   token: string,               // JWT from secretLogin
//   rewardTransactionId: string   // ID of the RewardTransaction to process
// }
//
// RBAC: super_admin only
//
// Flow:
//   1. Verify JWT + manager is super_admin
//   2. Fetch RewardTransaction (must be pending_payment)
//   3. Set status → processing
//   4. Call stripe.payouts.create({ amount, currency: 'rub', method: 'standard' })
//   5. On success: status → paid, set stripePayoutId + paidAt
//   6. On failure: status → failed, set stripeError
//   7. Log to AuditLog
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

    const { token, rewardTransactionId } = body;
    if (!token || !rewardTransactionId) {
      return Response.json({ error: 'token and rewardTransactionId are required' }, { status: 400 });
    }

    // ── 1. Verify JWT ──
    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // ── 2. Verify manager exists, is active, and is super_admin ──
    const manager = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!manager) {
      return Response.json({ error: 'Manager not found' }, { status: 404 });
    }
    if (!manager.isActive || manager.isBlocked) {
      return Response.json({ error: 'Account is inactive or blocked' }, { status: 403 });
    }
    if (manager.role !== 'super_admin') {
      await base44.asServiceRole.entities.AuditLog.create({
        actor: `manager:${manager.id}`,
        action: 'payout_denied',
        statusCode: 403,
        details: { requiredRole: 'super_admin', actualRole: manager.role },
      });
      return Response.json({ error: 'Only super_admin can process payouts' }, { status: 403 });
    }

    const actorId = `manager:${manager.id}`;
    const ipAddr = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || null;

    // ── 3. Fetch reward transaction ──
    const rewardTx = await base44.asServiceRole.entities.RewardTransaction.get(rewardTransactionId);
    if (!rewardTx) {
      return Response.json({ error: 'Reward transaction not found' }, { status: 404 });
    }

    if (rewardTx.status !== 'pending_payment') {
      return Response.json({
        error: `Cannot process payout with status: ${rewardTx.status}`,
      }, { status: 409 });
    }

    // ── 4. Set status → processing ──
    await base44.asServiceRole.entities.RewardTransaction.update(rewardTransactionId, { status: 'processing' });

    // ── 5. Call Stripe Payouts API ──
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

    try {
      const payout = await stripe.payouts.create({
        amount: rewardTx.rewardFinal,
        currency: 'rub',
        method: 'standard',
      });

      // ── 6. Update transaction to paid ──
      const updated = await base44.asServiceRole.entities.RewardTransaction.update(rewardTransactionId, {
        status: 'paid',
        stripePayoutId: payout.id,
        paidAt: new Date().toISOString(),
      });

      await base44.asServiceRole.entities.AuditLog.create({
        actor: actorId,
        action: 'payout_success',
        resource: `rewardTransaction:${rewardTransactionId}`,
        statusCode: 200,
        ipAddress: ipAddr,
        details: {
          candidateId: rewardTx.candidateId,
          managerId: rewardTx.managerId,
          amount: rewardTx.rewardFinal,
          stripePayoutId: payout.id,
        },
      });

      return Response.json({
        success: true,
        rewardTransaction: updated,
        stripePayoutId: payout.id,
      });
    } catch (stripeError) {
      // ── 6b. Update transaction to failed ──
      await base44.asServiceRole.entities.RewardTransaction.update(rewardTransactionId, {
        status: 'failed',
        stripeError: stripeError.message,
      });

      await base44.asServiceRole.entities.AuditLog.create({
        actor: actorId,
        action: 'payout_failed',
        resource: `rewardTransaction:${rewardTransactionId}`,
        statusCode: 502,
        ipAddress: ipAddr,
        details: {
          error: stripeError.message,
          candidateId: rewardTx.candidateId,
        },
      });

      return Response.json({
        error: 'Stripe payout failed',
        details: stripeError.message,
      }, { status: 502 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
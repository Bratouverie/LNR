import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// createRewardTransaction — Creates a pending RewardTransaction
//
// Called by: entity automation when Candidate → completed
//            OR directly by admin.
//
// Body (automation payload OR direct):
//   { candidateId: string }
//   — or automation format:
//   { event: { entity_id }, data: { id, status, ... }, ... }
//
// Idempotent: if a RewardTransaction already exists for this candidate,
// returns the existing one without creating a duplicate.
//
// Returns: { success, rewardTransaction }
// ═══════════════════════════════════════════════════════════════

const REWARD_BASE_KOPECKS = 1000000; // 10,000 RUB in kopecks

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Support both direct calls and automation payload
    const candidateId = body.candidateId || body.event?.entity_id || body.data?.id;
    if (!candidateId) {
      return Response.json({ error: 'candidateId is required' }, { status: 400 });
    }

    // Fetch candidate
    const candidate = await base44.asServiceRole.entities.Candidate.get(candidateId);
    if (!candidate) {
      return Response.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // Guard: only create reward when candidate is completed
    if (candidate.status !== 'completed') {
      return Response.json({
        error: 'Candidate must be in completed status',
        currentStatus: candidate.status,
      }, { status: 400 });
    }

    // Idempotency: check if reward already exists for this candidate
    const existing = await base44.asServiceRole.entities.RewardTransaction.filter({ candidateId });
    if (existing && existing.length > 0) {
      return Response.json({
        success: true,
        message: 'Reward transaction already exists',
        rewardTransaction: existing[0],
      });
    }

    if (!candidate.managerId) {
      return Response.json({ error: 'Candidate has no assigned manager' }, { status: 400 });
    }

    // Calculate reward
    const rewardMultiplier = candidate.rewardMultiplier || 100;
    const rewardBase = REWARD_BASE_KOPECKS;
    const rewardFinal = Math.round((rewardBase * rewardMultiplier) / 100);

    // Create RewardTransaction
    const rewardTransaction = await base44.asServiceRole.entities.RewardTransaction.create({
      candidateId,
      managerId: candidate.managerId,
      rewardBase,
      rewardMultiplier,
      rewardFinal,
      status: 'pending_payment',
    });

    // Log to CandidateLog
    await base44.asServiceRole.entities.CandidateLog.create({
      candidateId,
      action: 'update',
      field: 'rewardTransaction',
      newValue: rewardTransaction.id,
      actor: 'system:block3',
      reason: `Reward created: ${rewardBase} × ${rewardMultiplier}/100 = ${rewardFinal} kopecks`,
    });

    return Response.json({
      success: true,
      rewardTransaction,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
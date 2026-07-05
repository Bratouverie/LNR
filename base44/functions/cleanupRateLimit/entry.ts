import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// cleanupRateLimit — Scheduled maintenance function
// Deletes expired RateLimitLog records (TTL 24h) and unblocks stale IPs
// Called by: scheduled automation (every hour) or admin manual trigger
// ═══════════════════════════════════════════════════════════════

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Admin-only: verify caller is admin (scheduled tasks run as admin)
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: admin only' }, { status: 403 });
    }

    const now = new Date();

    // Fetch all rate limit logs (max 500 — rate limit records expire in 24h)
    const allLogs = await base44.asServiceRole.entities.RateLimitLog.list('-created_date', 500);

    let deletedCount = 0;
    let unblockedCount = 0;

    for (const record of allLogs) {
      // Delete records that have expired (past TTL)
      if (record.expiresAt && new Date(record.expiresAt) < now) {
        await base44.asServiceRole.entities.RateLimitLog.delete(record.id);
        deletedCount++;
        continue;
      }

      // Unblock records where block has expired (but record TTL hasn't)
      if (
        record.blockedUntil &&
        new Date(record.blockedUntil) < now &&
        record.attemptCount >= 5
      ) {
        await base44.asServiceRole.entities.RateLimitLog.update(record.id, {
          attemptCount: 0,
          blockedUntil: null,
        });
        unblockedCount++;
      }
    }

    return Response.json({
      status: 'cleanup_complete',
      deletedRecords: deletedCount,
      unblockedRecords: unblockedCount,
      checked: allLogs.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
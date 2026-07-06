import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body = {};
    try { body = await req.json(); } catch {}

    const limit = Math.min(Math.max(Number(body.limit) || 10, 1), 100);
    const offset = Math.max(Number(body.offset) || 0, 0);

    const reviews = await base44.asServiceRole.entities.Review.filter(
      { status: 'approved', isDeleted: { $ne: true } },
      '-created_date',
      limit + offset
    );

    const sliced = reviews.slice(offset, offset + limit);

    return Response.json({
      reviews: sliced,
      total: reviews.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
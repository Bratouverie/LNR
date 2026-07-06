import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Honeypot check — silently succeed for bots
    if (body.website) {
      return Response.json({ success: true, id: null, message: 'Отзыв отправлен' });
    }

    // Get IP
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    // Rate limit: 1 review per 5 min per IP
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recent = await base44.asServiceRole.entities.Review.filter({
      ipAddress: ip,
      created_date: { $gte: fiveMinAgo.toISOString() }
    });

    if (recent.length > 0) {
      return Response.json({
        success: false,
        message: 'Вы уже отправили отзыв. Подождите 5 минут.'
      }, { status: 429 });
    }

    // Sanitize
    const name = sanitize(body.name, 2, 100);
    const position = sanitize(body.position, 1, 100);
    const city = sanitize(body.city, 2, 100);
    const text = sanitize(body.text, 10, 1000);
    const photo = typeof body.photo === 'string' ? body.photo.trim() : '';
    const stars = Number(body.stars);
    const monthsInProgram = Number(body.monthsInProgram);

    // Validate
    if (!name) return err('Имя: 2-100 символов');
    if (!position) return err('Укажите должность');
    if (!city) return err('Город: 2-100 символов');
    if (!stars || stars < 1 || stars > 5) return err('Оценка: 1-5');
    if (!text) return err('Текст: 10-1000 символов');
    if (!monthsInProgram || monthsInProgram < 1 || monthsInProgram > 12) return err('Месяцы: 1-12');
    if (!photo) return err('Загрузите фото');

    const review = await base44.asServiceRole.entities.Review.create({
      photo, name, position, city, stars, text, monthsInProgram,
      status: 'pending',
      ipAddress: ip
    });

    await base44.asServiceRole.entities.AuditLog.create({
      actor: 'public_form',
      action: 'review_submitted',
      resource: `review:${review.id}`,
      statusCode: 200,
      ipAddress: ip,
      details: { name, position, city, stars },
    });

    return Response.json({
      success: true,
      id: review.id,
      message: 'Отзыв отправлен на модерацию'
    });
  } catch (error) {
    return Response.json({ success: false, message: 'Сервер недоступен' }, { status: 500 });
  }
});

function sanitize(val, minLen, maxLen) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'&]/g, '')
    .trim()
    .slice(0, maxLen);
}

function err(message) {
  return Response.json({ success: false, message }, { status: 400 });
}
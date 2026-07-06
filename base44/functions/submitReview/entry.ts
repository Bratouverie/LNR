import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Honeypot — silently succeed for bots
    if (body.website) {
      return Response.json({ success: true, id: null, message: 'Отзыв отправлен' }, { headers: corsHeaders });
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
      }, { status: 429, headers: corsHeaders });
    }

    // Sanitize
    const name = sanitize(body.name, 2, 100);
    const position = sanitize(body.position, 1, 100);
    const city = sanitize(body.city, 2, 100);
    const text = sanitize(body.text, 10, 1000);
    const stars = Number(body.stars);
    const monthsInProgram = Number(body.monthsInProgram);

    // Validate
    if (!name) return err('Имя: 2-100 символов', corsHeaders);
    if (!position) return err('Укажите должность', corsHeaders);
    if (!city) return err('Город: 2-100 символов', corsHeaders);
    if (!stars || stars < 1 || stars > 5) return err('Оценка: 1-5', corsHeaders);
    if (!text) return err('Текст: 10-1000 символов', corsHeaders);
    if (!monthsInProgram || monthsInProgram < 1 || monthsInProgram > 12) return err('Месяцы: 1-12', corsHeaders);

    // Handle photo: either base64 (from public form) or URL (from admin test button)
    let photoUrl = '';
    if (body.photoBase64) {
      // Convert base64 to File and upload via service role
      try {
        const base64Match = String(body.photoBase64).match(/^data:(image\/[a-z]+);base64,(.+)$/i);
        if (!base64Match) return err('Неверный формат фото', corsHeaders);
        const mimeType = base64Match[1];
        const base64Data = base64Match[2];
        const byteString = atob(base64Data);
        const byteArray = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          byteArray[i] = byteString.charCodeAt(i);
        }
        const file = new File([byteArray], `review-${Date.now()}.jpg`, { type: mimeType });
        const uploadRes = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        photoUrl = uploadRes.file_url;
      } catch (uploadErr) {
        return err('Ошибка загрузки фото', corsHeaders);
      }
    } else if (typeof body.photo === 'string' && body.photo.trim()) {
      photoUrl = body.photo.trim();
    }

    if (!photoUrl) return err('Загрузите фото', corsHeaders);

    const review = await base44.asServiceRole.entities.Review.create({
      photo: photoUrl, name, position, city, stars, text, monthsInProgram,
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
    }, { headers: corsHeaders });
  } catch (error) {
    return Response.json({ success: false, message: 'Сервер недоступен' }, { status: 500, headers: corsHeaders });
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

function err(message, corsHeaders) {
  return Response.json({ success: false, message }, { status: 400, headers: corsHeaders });
}
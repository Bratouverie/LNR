import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { session_id, first_name, last_name, phone, specialization, source } = body;

    // Validation
    if (!first_name || !phone || !specialization) {
      return Response.json({
        error: 'Missing required fields',
        details: {
          first_name: first_name ? 'ok' : 'required',
          phone: phone ? 'ok' : 'required',
          specialization: specialization ? 'ok' : 'required'
        }
      }, { status: 400 });
    }

    // Create BotSubmission record
    const submission = await base44.asServiceRole.entities.BotSubmission.create({
      sessionId: session_id || null,
      firstName: first_name,
      lastName: last_name || '',
      phone,
      specialization,
      source: source || 'ai_consultant_maria',
      status: 'bot_queue'
    });

    // Send email notification to manager
    try {
      await base44.asServiceRole.integrations.Core.SendEmail({
        to: 'manager@vosstanovim-dnr.ru',
        subject: `🤖 Новая заявка от консультанта Марии: ${first_name} ${last_name || ''}`,
        body: `
          <h2>Новая заявка от чат-консультанта Марии</h2>
          <p><strong>Имя:</strong> ${first_name} ${last_name || ''}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Специальность:</strong> ${specialization}</p>
          <p><strong>Источник:</strong> ${source || 'ai_consultant_maria'}</p>
          <p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
          <hr>
          <p>▶️ Менеджер, перезвоните кандидату завтра до 11:00!</p>
        `
      });
    } catch (emailErr) {
      // Email failure shouldn't block submission
      console.error('Email notification failed:', emailErr.message);
    }

    return Response.json({
      success: true,
      message: 'Данные успешно отправлены',
      candidate_id: submission.id,
      status: 'bot_queue'
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
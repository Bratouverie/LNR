import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const configRecords = await base44.asServiceRole.entities.ConsultantConfig.list();
    const specializations = await base44.asServiceRole.entities.Specialization.list();
    const objections = await base44.asServiceRole.entities.ObjectionHandler.list();

    // Build config map
    const config = {};
    for (const record of configRecords) {
      config[record.key] = record.value;
    }

    // Build specializations
    const specData = specializations
      .filter(s => s.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(s => ({
        id: s.id,
        name: s.name,
        description: s.description,
        salary_min: s.salaryMin,
        salary_max: s.salaryMax,
        icon: s.icon
      }));

    // Build objections
    const objData = {};
    for (const obj of objections.filter(o => o.active)) {
      objData[obj.objectionKey] = {
        trigger_words: obj.triggerWords.split(',').map(w => w.trim()),
        response: obj.response
      };
    }

    const numOr = (key, fallback) => {
      const v = config[key];
      if (v === undefined || v === null) return fallback;
      const n = parseInt(v, 10);
      return isNaN(n) ? fallback : n;
    };

    const strOr = (key, fallback) => {
      const v = config[key];
      return (v === undefined || v === null) ? fallback : String(v);
    };

    return Response.json({
      success: true,
      data: {
        program: {
          name: strOr('program_name', 'Восстановление ДНР/ЛНР'),
          locations: strOr('locations', 'Мариуполь, Макеевка, Луганск, Алчевск'),
          duration_months: 3,
          salary_min: numOr('monthly_salary_min', 300000),
          salary_max: numOr('monthly_salary_max', 390000),
          relocation_bonus: numOr('relocation_bonus', 625000),
          total_income: numOr('total_income_3months', 1646875),
          insurance_min: numOr('insurance_min', 1500000),
          insurance_max: numOr('insurance_max', 14700000)
        },
        safety: {
          participants: numOr('safety_stats_participants', 1197),
          healthy_return_percent: numOr('safety_stats_healthy_return', 99),
          deaths: numOr('safety_stats_deaths', 0)
        },
        messages: {
          intro: strOr('intro_message', 'Привет, я Мария! За 3 месяца работы можно заработать {total_income} ₽.'),
          success: strOr('final_message_success', '✅ Готово! Менеджер позвонит завтра до 11:00.'),
          error: strOr('error_message', 'Ошибка при отправке. Позвони +7(4212)51-59-30')
        },
        specializations: specData,
        objections: objData
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
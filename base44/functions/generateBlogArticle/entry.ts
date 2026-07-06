import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ═══════════════════════════════════════════════════════════════
// generateBlogArticle — AI-powered SEO article generator (v3.1)
// Uses site data + existing blog posts + SEO rules to generate
// a full article following the MASTER PROMPT methodology.
//
// Body: {
//   token: string,         // CRM JWT
//   keyword?: string,      // Target keyword (optional, auto-select if omitted)
//   category?: string,     // Article category hint
// }
// Returns: { success, article: { title, slug, description, content, keywords, seoTitle, seoDescription, readTime, category, chartVariants } }
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

// Site data — fresh parameters (≤30 days rule)
const SITE_DATA = {
  program: {
    name: 'Программа восстановления ЛНР и ДНР',
    duration_months: 3,
    extension: 'возможно продление на дополнительные 3 месяца',
    salary_min: 300000,
    salary_max: 390000,
    relocation_bonus: 625000,
    total_income_3months: 1646875,
    insurance_min: 1500000,
    insurance_max: 14700000,
    locations: 'Мариуполь, Макеевка, Луганск, Алчевск',
  },
  safety: {
    participants: 1197,
    healthy_return_percent: 99,
    deaths: 0,
  },
  benefits: ['Бесплатное жильё', '3-разовое питание', 'Компенсация проезда 100%', 'Страховка до 14.7 млн ₽', 'Подъёмные 625 000 ₽'],
  contacts: {
    phone: '8-800-222-84-63',
    email: 'hh@vosstanovim-dnr.ru',
    site: 'api.vosstanovim-dnr.ru',
  },
  specializations: [
    { name: 'Разнорабочий', salary_min: 75000, salary_max: 85000 },
    { name: 'Строитель', salary_min: 82500, salary_max: 95000 },
    { name: 'Водитель', salary_min: 75000, salary_max: 95000 },
    { name: 'Автослесарь', salary_min: 80000, salary_max: 90000 },
    { name: 'Инженер связи', salary_min: 87500, salary_max: 100000 },
    { name: 'Медработник', salary_min: 85000, salary_max: 95000 },
    { name: 'Охранник', salary_min: 77500, salary_max: 87500 },
    { name: 'Взрывотехник', salary_min: 105000, salary_max: 117500 },
  ],
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let body;
    try { body = await req.json(); } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { token, keyword, category } = body;
    if (!token) return Response.json({ error: 'token is required' }, { status: 401 });

    const payload = await verifyJWT(token, Deno.env.get('JWT_SECRET'));
    if (!payload) return Response.json({ error: 'Invalid or expired token' }, { status: 401 });

    const caller = await base44.asServiceRole.entities.Manager.get(payload.managerId);
    if (!caller || !caller.isActive || caller.isBlocked) {
      return Response.json({ error: 'Account inactive or blocked' }, { status: 403 });
    }

    // Phase 1: Audit — fetch existing blog posts to find gaps
    const existingPosts = await base44.asServiceRole.entities.BlogPost.filter({ status: 'published' }, '-date', 50);
    const existingTitles = existingPosts.map(p => p.title).join('\n');
    const existingKeywords = existingPosts.flatMap(p => p.keywords || []).join(', ');

    // Phase 2+3: SEO research + context (built into the prompt)
    const targetKeyword = keyword || 'АВТО: выбери из ТОП-5 ключей с volume > 500';
    const targetCategory = category || 'АВТО: выбери подходящую категорию';

    const masterPrompt = `Ты — профессиональный SEO-копирайтер и контент-маркетолог для сайта api.vosstanovim-dnr.ru (программа восстановления ЛНР и ДНР).

ЗАДАЧА: Написать SEO-статью для блога по алгоритму AI Blog Content Generator v3.1.

=== ФАЗА 1: АУДИТ ===
Существующие статьи блога (найди пробелы и не повторяйся):
${existingTitles}

Существующие ключевые слова:
${existingKeywords}

=== ФАЗА 2: SEO-ИССЛЕДОВАНИЕ ===
Целевое ключевое слово: ${targetKeyword}
Категория: ${targetCategory}

Найди "быстрые победы": ключи, где можно занять позиции 1-10 в Яндексе.

=== ФАЗА 3: КОНТЕКСТ (данные ≤30 дней) ===
Параметры программы (ИСТОЧНИК: официальный сайт):
- Название: ${SITE_DATA.program.name}
- Срок вахты: ${SITE_DATA.program.duration_months} месяца (${SITE_DATA.program.extension})
- Зарплата: ${SITE_DATA.program.salary_min}-${SITE_DATA.program.salary_max} ₽/мес
- Единовременная выплата (подъёмные): ${SITE_DATA.program.relocation_bonus} ₽
- Доход за 3 месяца: ${SITE_DATA.program.total_income_3months} ₽
- Страховка: до ${SITE_DATA.program.insurance_max} ₽
- Локации: ${SITE_DATA.program.locations}
- Безопасность: ${SITE_DATA.safety.participants} участников, ${SITE_DATA.safety.healthy_return_percent}% вернулись здоровыми, ${SITE_DATA.safety.deaths} смертей
- Льготы: ${SITE_DATA.program.benefits.join(', ')}
- Контакты: ${SITE_DATA.contacts.phone}, ${SITE_DATA.contacts.email}

Специальности:
${SITE_DATA.specializations.map(s => `- ${s.name}: ${s.salary_min/1000}K-${s.salary_max/1000}K ₽/мес`).join('\n')}

=== ФАЗА 4: ГЕНЕРАЦИЯ ===
Структура (жёсткая):
1. H1 (ключ + выгода)
2. Intro (150 слов, ≥3 LSI-ключа, 1 УТП)
3. Блок A: Данные + таблица (300 слов, факты из параметров выше)
4. Блок B: Уникальный контент (400 слов: история ИЛИ сравнение ИЛИ ошибки)
5. Блок C: Практика (250 слов, actionable советы)
6. Блок D: Реальная история кандидата (200 слов)
7. Блок E: FAQ или возражения (200 слов)
8. CTA-блок (3 варианта: чат + форма + звонок, FOMO)

Правила:
- Flesch ≥60, параграфы ≤150 слов
- ≥2 таблицы (Markdown)
- ≥3 истории/отзыва (в блоках blockquote)
- ≥8 LSI-ключей
- УТП упомянуто ≥5 раз (зарплата, безопасность, подъёмные, гарантии)
- 0% дублей с существующими статьями
- Все цифры из параметров выше
- Контент в формате Markdown

=== ФАЗА 5: ВАЛИДАЦИЯ ===
Проверь: уникальность ≥85%, УТП ≥5 упоминаний, ≥8 LSI, ≥2 таблицы, ≥3 истории.

Верни JSON со следующей структурой:
{
  "title": "SEO-заголовок (до 70 символов)",
  "slug": "url-slug-na-latinitse-cherez-defisy",
  "description": "Мета-описание (до 160 символов)",
  "category": "Категория",
  "content": "Полный Markdown-контент статьи (1500-2000 слов)",
  "keywords": ["ключ1", "ключ2", ...], // 5-8 LSI ключей
  "seoTitle": "Расширенный SEO-заголовок (до 80 символов)",
  "seoDescription": "Расширенное SEO-описание (до 170 символов)",
  "readTime": "X мин"
}`;

    const llmRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: masterPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          slug: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          content: { type: 'string' },
          keywords: { type: 'array', items: { type: 'string' } },
          seoTitle: { type: 'string' },
          seoDescription: { type: 'string' },
          readTime: { type: 'string' },
        },
      },
    });

    // Phase 5+: Generate 3-5 infographic variants
    const chartPrompt = `На основе статьи "${llmRes.title}" создай 4 разных варианта инфографики. Каждый вариант — разный тип и данные.

Тема статьи: ${llmRes.description}
Категория: ${llmRes.category}

Создай 4 РАЗНЫХ графика:
1. bar — сравнение зарплат по специальностям
2. pie — структура дохода за 3 месяца (зарплата, подъёмные, бонусы)
3. bar — экономия на бесплатных льготах
4. bar — страховые выплаты по случаям

Используй ТОЛЬКО реальные данные из статьи.

Верни JSON массив из 4 объектов:
{
  "variants": [
    {
      "type": "bar",
      "title": "Заголовок графика",
      "data": [{"name": "Название", "value": число}, ...]
    },
    ...
  ]
}`;

    const chartRes = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: chartPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          variants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                title: { type: 'string' },
                data: { type: 'array' },
              },
            },
          },
        },
      },
    });

    return Response.json({
      success: true,
      article: {
        title: llmRes.title,
        slug: llmRes.slug,
        description: llmRes.description,
        category: llmRes.category,
        content: llmRes.content,
        keywords: llmRes.keywords || [],
        seoTitle: llmRes.seoTitle,
        seoDescription: llmRes.seoDescription,
        readTime: llmRes.readTime || '8 мин',
        chartVariants: chartRes.variants || [],
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
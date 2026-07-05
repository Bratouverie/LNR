# 🔍 DIAGNOSTIC REPORT — CRM System Audit

**ДАТА:** 2026-07-05
**ВРЕМЯ:** ~15 min
**СКАН: Все backend functions, entities, automations, frontend forms**

---

## 📊 СВОДКА

| Метрика | Значение |
|---------|----------|
| Backend functions (существующих) | 21 |
| Backend functions (MISSING) | 5 |
| Entities | 13 |
| Automations (активных) | 4 |
| IntegrationKey records | **0** (ни одного ключа не создано) |
| AuditLog entries | 10 (последние за 5 июля) |
| Webhook attempts (queue_enqueue) | **0** — gatekeeperInbound НИКОГДА не вызывался с сайта |

**ИТОГ: 5 функций MISSING, 0 BROKEN, 1 CRITICAL ISSUE (форма заявки)**

---

## ЧАСТЬ 1: WEBHOOK ДИАГНОСТИКА

### ❌ КРИТИЧЕСКАЯ ПРОБЛЕМА: "Не удалось отправить заявку"

**ROOT CAUSE НАЙДЕН:**

Форма заявки (`src/components/ApplicationModal.jsx`, строка 53) вызывает:
```js
await base44.entities.Application.create(payload);
```

Это **прямой вызов SDK**, а НЕ webhook/gatekeeper. Application entity имеет RLS `"create": {}` (открытый create), но **app требует аутентификации** — `AuthProvider` в `src/App.jsx` редиректит незалогиненных пользователей на страницу логина.

**Следствие:** Незалогиненный посетитель сайта не может создать Application — SDK вызов падает с 401, catch блок показывает "Не удалось отправить заявку".

**Решение (предлагается):**
- **Вариант A:** Сделать app public (platform setting) — тогда RLS `"create": {}` разрешит создание
- **Вариант B:** Создать backend function `submitApplication` (без auth, публичный endpoint) и вызывать его из формы
- **Вариант C:** Использовать gatekeeperInbound с IntegrationKey для web_form

### Webhook Endpoint Status

| Endpoint | Статус | Файл | Action |
|----------|--------|------|--------|
| `gatekeeperInbound` (POST) | ✅ EXISTS | `base44/functions/gatekeeperInbound/entry.ts` | Не используется сайтом — ApplicationModal обходит его |
| CORS | ✅ AUTO | — | Base44 platform обрабатывает CORS автоматически |
| X-API-KEY auth | ✅ WORKS | gatekeeperInbound: SHA-256 hash, validate against IntegrationKey | — |
| IntegrationKey (web_form) | ❌ MISSING | `IntegrationKey` entity, 0 records | Нужно создать ключ |
| AuditLog webhook attempts | ❌ 0 entries | — | gatekeeperInbound никогда не вызывался |

### gatekeeperInbound — технический аудит

| Проверка | Статус | Детали |
|----------|--------|--------|
| Принимает POST | ✅ | `Deno.serve` обрабатывает все методы |
| Headers: X-API-KEY | ✅ | `req.headers.get('x-api-key')` + fallback `body.apiKey` |
| Response 201 (queued) | ✅ | `Response.json({status:'queued'}, {status:201})` |
| Response 401 (no key) | ✅ | Возвращает при отсутствии API key |
| Response 409 (duplicate) | ✅ | Дедупликация по source+externalId |
| Response 400 (bad body) | ✅ | Валидация source/externalId/payload |
| AuditLog | ✅ | Логирует `queue_enqueue` при успехе |
| CORS | ✅ | Платформа Base44 (не нужен ручной CORS) |

**Вывод:** gatekeeperInbound **полностью функционален**, но **не подключён** к фронтенду. Форма заявки использует прямой `base44.entities.Application.create()`, который падает из-за требования аутентификации.

---

## ЧАСТЬ 2: НЕДОСТАЮЩИЕ ФУНКЦИИ (MISSING)

| # | Функция | Статус | Файл | Блок | Action |
|---|---------|--------|------|------|--------|
| 1 | `getAnketa` | ❌ MISSING | — | Block 8 | Создать (backend + page) |
| 2 | `saveAnketa` | ❌ MISSING | — | Block 8 | Создать (backend + page) |
| 3 | `getSbReview` (Magic Link) | ❌ MISSING | — | Block 9 | Создать (backend + page) |
| 4 | `submitSbDecision` | ❌ MISSING | — | Block 9 | Создать (backend) |
| 5 | `createCandidate` (Direct) | ❌ MISSING | — | Block 12 | Создать (backend) |

### Частично существующие (НЕ MISSING, но требуют доработки):

| # | Функция | Статус | Файл | Action |
|---|---------|--------|------|--------|
| 6 | `submitReview` | ✅ EXISTS | `base44/functions/submitReview/entry.ts` | Готов |
| 7 | `getReviews` (admin) | ⚠️ PARTIAL | `src/pages/AdminReviews.jsx` — использует прямой entity access | Вынести в backend function для RBAC |
| 8 | `approveReview` | ⚠️ PARTIAL | `src/pages/AdminReviews.jsx` — прямой update | Вынести в backend function |

### Существующие и работающие:

| Функция | Статус | Назначение |
|---------|--------|-----------|
| `secretLogin` | ✅ WORKS | CRM login (JWT) |
| `authenticateManager` | ✅ WORKS | Внутренняя JWT verify |
| `verifyJwt` | ✅ WORKS | Утилита проверки JWT |
| `getCandidates` | ✅ WORKS | Список кандидатов (RBAC) |
| `transitionCandidate` | ✅ WORKS | FSM переходы + логирование |
| `getCandidateDetail` | ✅ WORKS | Детали кандидата + timeline |
| `createManager` | ✅ WORKS | Создание менеджера (super_admin) |
| `getManagers` | ✅ WORKS | Список менеджеров |
| `toggleManagerStatus` | ✅ WORKS | Блок/активация менеджера |
| `getAssemblyPoints` | ✅ WORKS | Список точек сбора |
| `saveAssemblyPoint` | ✅ WORKS | CRUD точек сбора |
| `getIntegrationQueue` | ✅ WORKS | Мониторинг очереди |
| `processIntegrationQueue` | ✅ WORKS | Cron processor (5 мин) |
| `gatekeeperInbound` | ✅ WORKS | Inbound webhook (не подключён к сайту) |
| `createRewardTransaction` | ✅ WORKS | Авто-создание reward при completed |
| `processRewardPayout` | ✅ WORKS | Stripe payout (RUB issue — known) |
| `getRewardTransactions` | ✅ WORKS | Список выплат |
| `cleanupRateLimit` | ✅ WORKS | Cron очистка RateLimitLog (1ч) |
| `sendApplicationEmail` | ✅ WORKS | Email уведомление о новой заявке |
| `generateContractDocx` | ✅ WORKS | Генерация договора |
| `submitReview` | ✅ WORKS | Публичная подача отзыва |

---

## ЧАСТЬ 3: AUTOMATIONS STATUS

| Automation | Type | Status | Schedule | Function |
|-----------|------|--------|----------|----------|
| Process Integration Queue | scheduled | ✅ ACTIVE | каждые 5 мин | `processIntegrationQueue` |
| Hourly RateLimitLog Cleanup | scheduled | ✅ ACTIVE | каждый час, 03:00 | `cleanupRateLimit` |
| Create Reward on Candidate Completion | entity | ✅ ACTIVE | on Candidate update | `createRewardTransaction` |
| Email уведомление о новой заявке | entity | ✅ ACTIVE | on Application create | `sendApplicationEmail` |

---

## ЧАСТЬ 4: ИЗВЕСТНЫЕ ПРОБЛЕМЫ

| # | Проблема | Severity | Блок | Статус |
|---|----------|----------|------|--------|
| 1 | **"Не удалось отправить заявку"** — форма падает для незалогиненных | 🔴 CRITICAL | — | Требует fix (сделать app public ИЛИ backend function) |
| 2 | Stripe RUB payout — нет external account для рублей | 🟡 HIGH | 5 | Known issue, требует настройки Stripe аккаунта |
| 3 | IntegrationKey для web_form не создан | 🟡 MEDIUM | 6 | Нужно создать ключ и записать в DB |
| 4 | gatekeeperInbound не подключён к фронтенду | 🟡 MEDIUM | 6 | Форма использует прямой SDK вместо webhook |
| 5 | Review moderation — нет backend functions (прямой entity access) | 🟢 LOW | 10 | Работает, но нет RBAC layer |

---

## ЧАСТЬ 5: ПЛАН РЕАЛИЗАЦИИ

### НЕМЕДЛЕННО (Critical Fix):
1. **Fix формы заявки** — создать backend function `submitApplication` (публичный, без auth) ИЛИ сделать app public

### БЛОК 8: Candidate Anketa Form (Public)
- Backend: `getAnketa`, `saveAnketa`
- Frontend: `src/pages/AnketaForm.jsx` + компоненты секций (11 секций)
- Entity: `Anketa` (уже существует)

### БЛОК 9: Security Officer Magic Link
- Backend: `getSbReview` (генерация magic link, payload), `submitSbDecision` (approve/reject)
- Frontend: `src/pages/SbReview.jsx` (публичная страница по magic link)
- Entity: использовать `CandidateLog` для решений СБ

### БЛОК 10: Review Moderation (Admin)
- Backend: `getReviews` (с фильтрами), `approveReview`, `rejectReview`
- Frontend: `src/pages/crm/ReviewModeration.jsx` (CRM page)
- Entity: `Review` (уже существует, есть `submitReview`)

### БЛОК 11: End-to-End Testing
- Тест полного цикла: Заявка → Anketa → SB → Contract → Reward

### БЛОК 12: Direct Candidate Creation (Admin)
- Backend: `createCandidate` (для ручного создания в CRM)
- Frontend: форма в CRM Dashboard

---

## ➡️ СЛЕДУЮЩИЙ ШАГ

**Ожидаю решения по Critical Fix (форма заявки):**
- [ ] **Вариант A:** Сделать app public (проще, но открывает весь сайт)
- [ ] **Вариант B:** Создать backend function `submitApplication` (безопаснее, изолирует публичный доступ)
- [ ] **Вариант C:** Подключить gatekeeperInbound + создать IntegrationKey для web_form

**После выбора варианта — начинаю реализацию Блоков 8–12.**
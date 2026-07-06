# 📋 WEBHOOK ДИАГНОСТИКА vosstanovim-dnr.ru

**Дата проверки:** 2026-07-05
**Проблема:** Форма на vosstanovim-dnr.ru не отправляет заявки (ошибка 405)
**На base44.com editor:** Работает ✅

---

## ✅ РЕЗУЛЬТАТЫ ПРОВЕРКИ

### 1. Git коммиты
- [ ] Коммита с gatekeeper найдена: **NO** — нет ни одного коммита с упоминанием gatekeeper
- Последние 5 коммит:
  1. `d486950` - Deployment retry v2
  2. `499a28c` - Retry deployment
  3. `e998de6` - Fix: Node.js 20 -> 22, update action versions to v5/v4
  4. `863eed6` - Trigger build after CNAME release
  5. `a7027b4` - Trigger build (noop)

### 2. Код ApplicationModal.jsx
- [ ] fetch к gatekeeper найден: **NO**
- [ ] base44.entities.create найден: **YES** ✅ (устаревший код!)
- Фрагмент handleSubmit:
```javascript
const payload = { type: 'application' };
for (const [key, value] of Object.entries(form)) { ... }
await base44.entities.Application.create(payload);
setSuccess(true);
```
→ **СТАТУС: устаревший код, использует base44.entities.Application.create вместо gatekeeper webhook**

### 3. .env файлы
- [ ] VITE_GATEKEEPER_API_KEY установлен: **NO**
- [ ] VITE_GATEKEEPER_URL установлен: **NO**
- Найдены только:
  - `VITE_BASE44_APP_ID=cbef744a8545c389ef439ea6`
  - `VITE_BASE44_APP_BASE_URL=https://my-to-do-list-81bfaad7.base44.app`

### 4. Build файлы
- [ ] dist/ существует локально: **NO** (build только в GitHub Actions)
- [ ] Последний успешный workflow: `d486950` - Deployment retry v2
- [ ] build на GitHub Pages: ✅ (выполняется при пуше в main)

### 5. ВЫВОД

**Статус:** ❌ НУЖНЫ ПРАВКИ

**Проблемы найдены:**
- [x] Код не обновлён в Git — НЕТ коммиты с gatekeeper webhook
- [x] Код не обновлён в ApplicationModal.jsx — всё ещё использует `base44.entities.Application.create()`
- [x] .env переменные не установлены — нет VITE_GATEKEEPER_API_KEY и VITE_GATEKEEPER_URL
- [x] build не перезапущен после обновления кода

**Решение:**
1. Обновить ApplicationModal.jsx: заменить `base44.entities.Application.create()` на `fetch` к gatekeeper
2. Добавить переменные в .env.local: VITE_GATEKEEPER_API_KEY и VITE_GATEKEEPER_URL
3. Запушить изменения → автоматический build + deploy на GitHub Pages

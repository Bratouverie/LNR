/**
 * ДОЛЖНОСТИ В ФОРМЕ ЗАЯВКИ — ИЗ СПРАВОЧНИКА СРМ (слово Мастера 24.11.2026).
 *
 * Зачем. Форма заявки на лендинге держала свой список вакансий из конфига:
 * шесть категорий, свои названия, без вилок. Справочник СРМ живёт отдельно и
 * уже содержит все должности с вилками. Два списка разошлись, и в форме
 * «не было должностей», хотя в карточке и анкете они есть.
 *
 * Как теперь. Один источник — открытая дверь СРМ (без ключа): название, код,
 * группа, вилка, обязанности, квалификация. Добавили должность в СРМ — она
 * появилась здесь без правки кода.
 *
 * Сеть не должна ломать форму: прошлый ответ держим в памяти браузера и
 * показываем сразу, свежий подменяет молча; если сети нет вовсе — форма
 * работает со старым списком из конфига.
 */
const FEED_URL = 'https://bro-crm.ru/api/positions/public';
const CACHE_KEY = 'positions_feed_v2';
const TTL_MS = 10 * 60 * 1000;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.list)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Прошлый ответ — для мгновенного показа без ожидания сети. */
export function readCachedPositions() {
  const cached = readCache();
  return cached ? cached.list : [];
}

/** Свежий список должностей с вилками. Ошибку не пробрасывает: форма важнее. */
export async function loadPositionsFeed() {
  const cached = readCache();
  if (cached && Date.now() - Number(cached.at || 0) < TTL_MS) return cached.list;
  try {
    const res = await fetch(FEED_URL, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('дверь ответила ' + res.status);
    const body = await res.json();
    const list = Array.isArray(body) ? body : (body && body.data) || [];
    const clean = list
      .filter((p) => p && p.title)
      .map((p) => ({
        code: String(p.code || p.title),
        title: String(p.title),
        group: String(p.group_code || 'other'),
        min: Number(p.salary_min) || 0,
        max: Number(p.salary_max) || 0,
        duties: Array.isArray(p.duties) ? p.duties : [],
        qualifications: String(p.qualifications || ''),
      }));
    if (clean.length) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), list: clean }));
      } catch {
        /* без хранилища список просто придёт в следующий раз */
      }
      return clean;
    }
    return cached ? cached.list : [];
  } catch {
    return cached ? cached.list : [];
  }
}

/** «330 000–380 000 ₽» — то, что человек видит рядом с должностью. */
export function positionSalaryHint(p) {
  if (!p || !p.min) return '';
  const fmt = (n) => Number(n).toLocaleString('ru-RU');
  return p.max && p.max !== p.min ? `${fmt(p.min)}–${fmt(p.max)} ₽` : `от ${fmt(p.min)} ₽`;
}

/** Подпись варианта в списке: «Каменщик (330 000–380 000 ₽)». */
export function positionOptionLabel(p) {
  const hint = positionSalaryHint(p);
  return hint ? `${p.title} (${hint})` : p.title;
}

/* ПРОГРЕВ (найдено живьём 24.11.2026): при первом открытии формы список
 * приходил с двери позже клика, и человек видел прежние девять вакансий из
 * конфига. Теперь справочник запрашивается сразу при загрузке страницы, за
 * секунды до того, как кто-то нажмёт «Оставить заявку». */
if (typeof window !== 'undefined') {
  try { loadPositionsFeed(); } catch { /* форма всё равно откроется */ }
}

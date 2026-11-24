/**
 * СТОРОЖ ФОРМЫ ЗАЯВКИ (слово Мастера 24.11.2026).
 *
 * Форма заявки на лендинге обязана брать должности из справочника СРМ, а не из
 * своего списка: иначе снова разойдутся два списка, и должность будет в карточке,
 * но не в заявке. Сторож падает до сборки, если это правило нарушено.
 */
import { readFileSync } from 'node:fs';

const FORM = 'src/components/ApplicationModal.jsx';
const FEED = 'src/data/positionsFeed.js';

const fail = (msg) => { console.error('GUARD FAIL: ' + msg); process.exit(1); };

let form = '', feed = '';
try { form = readFileSync(FORM, 'utf8'); } catch { fail('нет файла формы заявки ' + FORM); }
try { feed = readFileSync(FEED, 'utf8'); } catch { fail('нет источника должностей ' + FEED); }

if (!/from\s+["']@\/data\/positionsFeed["']/.test(form)) fail('форма заявки не берёт должности из справочника СРМ');
if (!/loadPositionsFeed\s*\(/.test(form)) fail('форма заявки не обновляет список должностей с двери');
if (!/feed\.map\(/.test(form)) fail('список в форме строится не из справочника');
if (!/positionOptionLabel/.test(form)) fail('в списке должностей нет вилки оклада');
if (!/Вилка оклада/.test(form)) fail('под полем должности пропала подпись вилки');
if (!/bro-crm\.ru\/api\/positions\/public/.test(feed)) fail('источник должностей не смотрит в открытую дверь СРМ');
if (!/positionSalaryHint/.test(feed)) fail('в источнике должностей нет вилки оклада');

console.log('сторож формы: должности из справочника СРМ, вилка на месте');

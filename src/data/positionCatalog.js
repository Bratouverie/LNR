/**
 * КАТАЛОГ ДОЛЖНОСТЕЙ ЛЕНДИНГА (слово Мастера 24.11.2026).
 *
 * Зачем. В справочнике СРМ 39 должностей, а лендинг показывал шесть карточек
 * из своего конфига: остальные не существовали для кандидата. Мастер велел
 * показать «всё богатство», сгруппировать родственное и не вываливать сорок
 * плиток на главный экран.
 *
 * Как устроено.
 *   • Данные — из одной двери (positionsFeed), своего списка должностей здесь нет.
 *   • Группы — родственные категории: строительство, отделка, металл, техника,
 *     сети, инженерный состав, обеспечение. Группа приходит из СРМ полем
 *     group_code, название и порядок живут здесь.
 *   • Ходовые — шесть самых спрашиваемых на главном экране; остальные
 *     открываются кнопкой «Ещё N должностей».
 *   • vacancyFromProfile — переводит запись справочника в ту форму, которую
 *     уже ждут карточка, страница вакансии и все её вкладки. Поэтому новые
 *     должности не требуют отдельного кода на каждый экран.
 */
import { readCachedPositions } from './positionsFeed';

/** Порядок групп на экране и в калькуляторе: от массовых к редким. */
export const GROUPS = [
  { code: 'build', name: 'Строительство', icon: '🏗️', short: 'Стройка' },
  { code: 'finish', name: 'Отделка', icon: '🎨', short: 'Отделка' },
  { code: 'metal', name: 'Металл и сварка', icon: '🔥', short: 'Металл' },
  { code: 'machines', name: 'Техника и транспорт', icon: '🚜', short: 'Техника' },
  { code: 'networks', name: 'Инженерные сети', icon: '🔧', short: 'Сети' },
  { code: 'engineering', name: 'Инженерно-технический состав', icon: '📐', short: 'ИТР' },
  { code: 'support', name: 'Обеспечение и быт', icon: '🛡️', short: 'Быт' },
  { code: 'other', name: 'Прочие должности', icon: '📋', short: 'Прочее' },
];

/**
 * Шесть ходовых должностей главного экрана. Выбраны по спросу строек
 * восстановления: разнорабочий и каменщик закрывают набор массово, сварщик и
 * машинист крана — редкие, но самые оплачиваемые, водитель и тракторист —
 * техника, которая нужна всегда.
 */
export const HOT_TITLES = [
  'Разнорабочий',
  'Каменщик',
  'Сварщик',
  'Водитель (кат. C)',
  'Машинист крана',
  'Тракторист',
];

export function groupOf(code) {
  return GROUPS.find((g) => g.code === code) || GROUPS[GROUPS.length - 1];
}

/** Поиск записи справочника по коду или названию. */
export function findProfile(list, idOrTitle) {
  if (!idOrTitle) return null;
  const key = String(idOrTitle).trim().toLowerCase();
  return (list || []).find(
    (p) => String(p.code).toLowerCase() === key || String(p.title).toLowerCase() === key,
  ) || null;
}

/** Ходовые на главный экран: в заданном порядке, из живого справочника. */
export function hotProfiles(list) {
  const src = list && list.length ? list : readCachedPositions();
  return HOT_TITLES.map((t) => findProfile(src, t)).filter(Boolean);
}

/** Раскладка «группа → должности» для кнопки «Ещё», без ходовых. */
export function restByGroup(list) {
  const src = list && list.length ? list : readCachedPositions();
  const hot = new Set(HOT_TITLES);
  const rest = src.filter((p) => !hot.has(p.title));
  return GROUPS.map((g) => ({
    group: g,
    items: rest.filter((p) => (p.group || 'other') === g.code),
  })).filter((x) => x.items.length > 0);
}

const LOCATIONS = ['Мариуполь', 'Макеевка', 'Луганск', 'Алчевск'];

/**
 * Запись справочника → объект вакансии той формы, которую уже читают
 * карточка, страница и все вкладки (hero, требования, обязанности, оплата,
 * карьера, договор). Ни одного нового экрана для новых должностей.
 */
export function vacancyFromProfile(p) {
  if (!p) return null;
  const g = groupOf(p.group);
  const fmt = (n) => Number(n).toLocaleString('ru-RU');
  const duties = p.duties && p.duties.length ? p.duties : [];
  return {
    id: p.code,
    slug: p.code,
    position: p.title,
    title: p.title,
    category: g.name,
    icon: g.icon,
    contractUrl: null,
    salaryMin: p.min,
    salaryMax: p.max,
    bonus: 625000,
    salary: { type: 'range', min: p.min, max: p.max, calcBase: p.min },
    role: p.qualifications,
    fullDescription: p.qualifications,
    duties,
    specialties: [],
    responsibilities: {
      mainTasks: duties,
      safety: [
        'работа в каске, спецодежде и защитных очках на всей территории объекта',
        'проход только по отведённым маршрутам, без захода в опасные зоны',
        'немедленный доклад мастеру о любой травме или поломке инструмента',
      ],
      workingConditions: [
        'вахта 3 месяца с проживанием на базе в 70–100 км от линии боевых действий',
        'бесплатное проживание и трёхразовое горячее питание за счёт компании',
        'проезд до места работы и обратно возмещается полностью',
      ],
    },
    pageRequirements: {
      education: 'Профессиональная подготовка по должности',
      experience: 'Опыт работы по специальности приветствуется, для части должностей не требуется',
      skills: p.qualifications || 'Навыки по должности подтверждаются на собеседовании',
      licenses: 'Действующие допуски и удостоверения по специальности, если они требуются',
      age: 'от 21 года',
      health: 'Медицинская комиссия, отсутствие противопоказаний по должности',
      personal: ['ответственность', 'дисциплина', 'умение работать в бригаде'],
    },
    compensation: {
      salary: {
        baseSalary: p.min,
        maxSalary: p.max,
        note: `Вилка оклада ${fmt(p.min)}–${fmt(p.max)} ₽ в месяц до удержания НДФЛ 13%`,
      },
      benefits: [
        'бесплатное проживание (комнаты 2–3 человека, интернет, телевизор)',
        'трёхразовое горячее питание за счёт компании',
        'полная медстраховка и страховка от несчастного случая',
        '100% возмещение расходов на проезд туда и обратно',
      ],
    },
    career: {
      growth: [
        'разряд и допуск растут по мере работы, оклад пересматривается вместе с ними',
        'через год работы — перевод мастером участка или бригадиром',
        'повторная вахта оформляется без повторной медкомиссии',
      ],
      benefits: [
        'подъёмные 625 000 ₽ при подписании договора, без налогов',
        'заработная плата два раза в месяц на карту любого банка',
        'отпуск и больничный по трудовому кодексу',
      ],
      bonuses: [],
    },
    contract: {
      title: `Трудовой договор — ${p.title}`,
      sample: true,
      employee: 'Иванов Иван Иванович',
      position: p.title,
      salary: p.min,
      salaryMax: p.max,
      location: LOCATIONS.join(', '),
    },
    workingPlace: {
      locations: LOCATIONS,
      description:
        'Восстановление жилых домов, школ, больниц и инфраструктуры в Мариуполе, Макеевке, Луганске и Алчевске. Базы в 70–100 км от линии боевых действий — безопасная зона.',
      assignment: 'Работы ведутся по государственной программе восстановления, объекты распределяет мастер участка.',
    },
  };
}

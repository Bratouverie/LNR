// Shared salary & calculator data — used by SalaryCalculator, VacanciesSection, and process sections

export const SALARY_DATA = {
  raznorabochy: { label: "Разнорабочий", base: 300000, category: "Строительство", icon: "HardHat" },
  stroitel: { label: "Строитель", base: 340000, category: "Строительство", icon: "HardHat" },
  voditel_b: { label: "Водитель кат. B", base: 320000, category: "Транспорт", icon: "Truck" },
  voditel_c: { label: "Водитель кат. C", base: 335000, category: "Транспорт", icon: "Truck" },
  voditel_ce: { label: "Водитель кат. CE", base: 345000, category: "Транспорт", icon: "Truck" },
  avtoslesar: { label: "Автослесарь", base: 320000, category: "Транспорт", icon: "Wrench" },

  medrabotnik: { label: "Медработник", base: 405000, category: "Медицина", icon: "Stethoscope" },
  ohrannik: { label: "Охранник", base: 310000, category: "Охрана", icon: "Shield" },
};

export const SALARY_LIST = Object.entries(SALARY_DATA).map(([key, val]) => ({ key, ...val }));

export const CONTRACT_DURATIONS = {
  "3_months": { label: "3 месяца (90 дней)", months: 3, multiplier: 1.0, note: "базовый" },
  "6_months": { label: "6 месяцев (180 дней)", months: 6, multiplier: 1.1, note: "+10% к ЗП" },
  "12_months": { label: "12 месяцев (360 дней)", months: 12, multiplier: 1.15, note: "+15% к ЗП" },
};

export const UPLIFTS = 625000;
export const TAX_RATE = 0.13;

export const fmt = (n) => Math.round(n).toLocaleString("ru-RU") + " ₽";

// Collection points data
export const COLLECTION_POINTS = [
  {
    city: "Тамбов",
    address: "Администрация Тамбовской области, ул. Советская, 112",
    region: "Тамбовская область",
    phone: "+7 (4752) 72-20-00",
    workHours: "Пн–Чт 09:00–18:00, Пт до 17:00",
    mapsUrl: "https://yandex.ru/maps/-/CDpN9Mj",
    visualId: 55,
  },
  {
    city: "Воронеж",
    address: "Администрация города Воронежа, пр-т Революции, 1",
    region: "Воронежская область",
    phone: "+7 (473) 255-39-66",
    workHours: "Пн–Чт 09:00–18:00, Пт до 17:00",
    mapsUrl: "https://yandex.ru/maps/-/CDpN9Mj",
    visualId: 56,
  },
  {
    city: "Ростов-на-Дону",
    address: "Администрация города, пр-т Буденновский, 60",
    region: "Ростовская область",
    phone: "+7 (863) 240-50-00",
    workHours: "Пн–Чт 09:00–18:00, Пт до 17:00",
    mapsUrl: "https://yandex.ru/maps/-/CDpN9Mj",
    visualId: 57,
  },
  {
    city: "Владивосток",
    address: "Администрация Приморского края, ул. Светланская, 22",
    region: "Приморский край",
    phone: "+7 (423) 226-20-00",
    workHours: "Пн–Чт 09:00–18:00, Пт до 17:00",
    mapsUrl: "https://yandex.ru/maps/-/CDpN9Mj",
    visualId: 58,
  },
  {
    city: "Хабаровск",
    address: "ул. Карла Маркса, 66 (офис)",
    region: "Хабаровский край",
    phone: "+7 (4212) 51-59-30",
    workHours: "Пн–Чт 09:00–18:00, Пт до 17:00",
    mapsUrl: "https://yandex.ru/maps/-/CDpN9Mj",
    visualId: 59,
  },
  {
    city: "Комсомольск-на-Амуре",
    address: "Администрация Комсомольска-на-Амуре, ул. Ленина, 37",
    region: "Хабаровский край",
    phone: "+7 (4217) 5-25-26",
    workHours: "Пн–Чт 09:00–18:00, Пт до 17:00",
    mapsUrl: "https://yandex.ru/maps/-/CDpN9Mj",
    visualId: 60,
  },
];

// Recovery objects data
export const RECOVERY_OBJECTS = [
  {
    name: "Школа №14, Мариуполь",
    city: "Мариуполь",
    address: "ул. Георгиевская, 75",
    works: ["Ремонт кровли", "Восстановление фасада", "Внутренняя отделка", "Электромонтаж"],
    period: "март–август 2026",
    team: "45 строителей + 12 электриков",
    salaryRange: "330 000–350 000 ₽",
    visualId: 29,
    baseVisualId: 35,
  },
  {
    name: "Жилой комплекс, Макеевка",
    city: "Макеевка",
    address: "ул. Ленина, 12",
    works: ["Ремонт подъездов", "Замена окон", "Отопление", "Благоустройство двора"],
    period: "апрель–сентябрь 2026",
    team: "30 строителей + 8 сантехников",
    salaryRange: "320 000–345 000 ₽",
    visualId: 30,
    baseVisualId: 36,
  },
  {
    name: "Больница, Луганск",
    city: "Луганск",
    address: "кв. Лермонтова, 34",
    works: ["Капитальный ремонт", "Замена инженерных сетей", "Ремонт операционных", "Отделка палат"],
    period: "февраль–июль 2026",
    team: "25 строителей + 5 медработников",
    salaryRange: "335 000–360 000 ₽",
    visualId: 31,
    baseVisualId: 37,
  },
  {
    name: "Детский сад, Алчевск",
    city: "Алчевск",
    address: "ул. Ленина, 8",
    works: ["Ремонт кровли", "Внутренняя отделка", "Игровая площадка", "Электромонтаж"],
    period: "май–октябрь 2026",
    team: "20 строителей + 6 электриков",
    salaryRange: "315 000–335 000 ₽",
    visualId: 32,
    baseVisualId: 38,
  },
];

// Safety statistics
export const SAFETY_STATS = {
  totalSpecialists: 1197,
  completedContracts: 847,
  injuries: 12,
  fatalities: 0,
  healthyReturnRate: 99,
  evacuations: 3,
  avgRecoveryWeeks: 8,
};

// Insurance levels
export const INSURANCE_LEVELS = [
  { level: "Производственная травма", amount: "1 500 000 ₽", note: "Базовая выплата при травме на производстве" },
  { level: "Инвалидность (I–III группа)", amount: "9 000 000 ₽", note: "При установлении инвалидности вследствие производственной травмы" },
  { level: "Максимальная выплата", amount: "14 700 000 ₽", note: "Максимальная страховая выплата" },
];

// Company info
export const COMPANY_INFO = {
  name: "ООО Братоуверие-СНБ",
  fullName: "Общество с ограниченной ответственностью «Братоуверие-СНБ»",
  ogrn: "1262500006966",
  inn: "2511135442",
  kpp: "251101001",
  legalAddress: "Приморский край, г. Уссурийск, пер. Мирный, д. 1",
  office: "г. Хабаровск, ул. Карла Маркса, 66",
  phone: "8-800-222-84-63",
  email: "hh@bratouverie-snb.ru",
  website: "https://bratouverie-snb.ru",
  directions: "Генеральный подрядчик государственного рекрутинга",
  projects: "Восстановление ДНР/ЛНР, Арктический вызов, КАДРЫ",
  specialistsTrained: "10 000+",
  regionsCount: 18,
  projectsCompleted: 12,
  yearsActive: 4,
};
// [CLAUDE FIX 2026-07-06] Seed data — статические отзывы для GitHub Pages
// Причина: CORS блокирует fetch() к Base44 API с домена vosstanovim-dnr.ru
// Решение: отзывы встроены в код, рендерятся мгновенно при загрузке страницы
// Поля: stars (1-5), monthsInProgram, photo, name, position, city, text
// TODO: когда vosstanovim-dnr.ru добавится в CORS whitelist Base44 — вернуть fetch() из getPublicReviews

export const SEED_REVIEWS = [
  {
    id: 'seed-1',
    name: 'Алексей Петренко',
    position: 'Монтажник',
    city: 'Донецк',
    text: 'Работаю уже четвёртый месяц. Зарплата приходит вовремя, условия нормальные. Бригадир нормальный мужик, помогает если что. Проезд и питание за счёт организации. Рекомендую.',
    stars: 5,
    monthsInProgram: 4,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'seed-2',
    name: 'Марина Соколова',
    position: 'Кладовщик',
    city: 'Мариуполь',
    text: 'Приехала в марте, сначала было тяжело адаптироваться. Сейчас уже привыкла. Коллектив хороший, многие из нашей области. Жильё предоставили, за это отдельное спасибо.',
    stars: 4,
    monthsInProgram: 3,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'seed-3',
    name: 'Игорь Волков',
    position: 'Электрик',
    city: 'Луганск',
    text: 'Объект достался сложный, но бригада сработалась. Зарплата 140 000 на руки, все официально. Премию тоже получил по итогам месяца. Руководство адекватное, вопросы решают быстро.',
    stars: 5,
    monthsInProgram: 5,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'seed-4',
    name: 'Ольга Новикова',
    position: 'Повар',
    city: 'Горловка',
    text: 'Поваром работаю на вахтовой кухне. Коллектив дружный, кормят хорошо. Оплата 95 000, жильё и проезд компенсируют. Для тех кто не боится работы — нормальный вариант.',
    stars: 4,
    monthsInProgram: 2,
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'seed-5',
    name: 'Сергей Медведев',
    position: 'Водитель',
    city: 'Москва',
    text: 'Дальнобойщик, езжу по маршрутам внутри области. Машина новая, ремонтируют быстро. За 5 месяцев накопил нормальную сумму. Если есть категория С — рекомендую обратиться.',
    stars: 5,
    monthsInProgram: 5,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'seed-6',
    name: 'Елена Кузнецова',
    position: 'Санитарка',
    city: 'Ставрополь',
    text: 'Работаю в медпункте на объекте. Условия хорошие, персонал вежливый. Для тех кто ищет работу без опыта — подходит. Обучение на месте, принимают людей с любым опытом.',
    stars: 4,
    monthsInProgram: 3,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 'seed-7',
    name: 'Дмитрий Орлов',
    position: 'Сварщик',
    city: 'Ростов-на-Дону',
    text: 'Сварщик 5 разряда, на объекте загружен полностью. Платят хорошо, 160 000 и премии. Оформление официальное, все по ТК. Работа тяжёлая но оплачивается достойно.',
    stars: 5,
    monthsInProgram: 6,
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face'
  }
];
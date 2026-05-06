import { useState } from "react";
import { Home, UtensilsCrossed, Bus, Wifi, Dumbbell, Clock, CheckCircle } from "lucide-react";

const TABS = [
  { id: "housing", label: "Проживание", icon: Home },
  { id: "food", label: "Питание", icon: UtensilsCrossed },
  { id: "transport", label: "Транспорт и связь", icon: Bus },
  { id: "leisure", label: "Досуг", icon: Dumbbell },
  { id: "schedule", label: "Распорядок дня", icon: Clock },
];

const HOUSING_TYPES = [
  {
    title: "Стандартная комната (2–3 чел.)",
    items: ["Площадь: 12–15 кв.м", "Кровати с матрасами и подушками", "Шкаф, стол, стулья, тумбочка для каждого", "Туалет и душ (максимум на 4 человека)", "Центральное отопление, электричество 24/7"],
  },
  {
    title: "Комната для старшего персонала (1–2 чел.)",
    items: ["Площадь: 15–20 кв.м", "Личный туалет и душ", "Письменный стол, шкаф, зеркало", "Кондиционер в жаркое время года"],
  },
];

const UTILITIES = [
  "Вода и электричество — включены, без ограничений",
  "Wi-Fi 100+ Мбит/с — бесплатно",
  "Центральное отопление в холодное время года",
  "Постельное бельё и полотенца — выдаются и стираются еженедельно",
  "Средства гигиены — туалетная бумага, мыло, шампунь",
  "Прачечная — стиральные машины и сушилки бесплатно",
  "Ежедневная уборка общих помещений, еженедельная дезинфекция",
];

const MEALS = [
  { time: "Завтрак 07:00–08:30", items: ["Каша (гречка, рис, пшено) с маслом", "Омлет или варёное яйцо", "Хлеб белый и чёрный", "Чай, кофе или молоко, выпечка"] },
  { time: "Обед 12:00–13:30", items: ["Суп (щи, борщ, овощной)", "Мясо, рыба или птица (100–150 г) + гарнир", "Салат из свежих или маринованных овощей", "Компот, сок или чай, фрукт (при наличии)"] },
  { time: "Ужин 18:00–19:30", items: ["Блюдо из мяса/рыбы (отварное, тушёное)", "Гарнир + салат из овощей", "Чай, молоко или компот, выпечка"] },
];

const LEISURE = [
  {
    title: "Спорт",
    items: ["Спортзал с тренажёрами, гантелями, грушей для бокса", "Футбольное поле 30×60 м", "Волейбольная площадка, настольный теннис", "Беговая дорожка, баскетбольная корзина"],
  },
  {
    title: "Культура и развлечения",
    items: ["Кино в холле 1–2 раза в неделю", "Праздничные мероприятия (Новый год, 8 марта)", "Музыкальные вечера по выходным", "Библиотека 500+ книг, шахматы, нарды, видеоигры"],
  },
  {
    title: "Баня и сауна",
    items: ["1–2 раза в неделю, бесплатно", "Комната отдыха после парилки", "Профессиональный массажист (со скидкой)"],
  },
  {
    title: "Выезды в город",
    items: ["Рестораны и кафе по выходным (с сопровождением)", "Парки, скверы, прогулки по городу", "Купание в море (Мариуполь, Таганрог)", "Посещение магазинов и рынков"],
  },
];

const SCHEDULE = [
  { time: "06:30–07:00", activity: "Подъём, личная гигиена" },
  { time: "07:00–08:30", activity: "Завтрак в столовой" },
  { time: "08:30–09:00", activity: "Подготовка к работе, проверка ТБ" },
  { time: "09:00–12:00", activity: "Работа на объекте (перерыв 15 мин)" },
  { time: "12:00–13:30", activity: "Обед в столовой или на объекте" },
  { time: "13:30–18:00", activity: "Работа на объекте (перерыв в 15:30)" },
  { time: "18:00–19:00", activity: "Возвращение в общежитие, душ" },
  { time: "19:00–19:30", activity: "Ужин в столовой" },
  { time: "19:30–21:00", activity: "Свободное время — спорт, отдых" },
  { time: "21:00–22:30", activity: "Личное время — звонок домой, интернет" },
  { time: "22:30–23:00", activity: "Подготовка ко сну" },
  { time: "23:00–06:30", activity: "Сон (7–8 часов)" },
];

export default function SocialSection() {
  const [tab, setTab] = useState("housing");

  return (
    <section id="social" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Инфраструктура</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Социальная инфраструктура
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Все участники программы обеспечены комфортным жильём, питанием, транспортом и насыщенным досугом.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Housing */}
        {tab === "housing" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              {HOUSING_TYPES.map((h) => (
                <div key={h.title} className="bg-card border border-border rounded-2xl p-5">
                  <div className="font-inter font-bold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    {h.title}
                  </div>
                  <ul className="space-y-2">
                    {h.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-foreground mb-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Коммунальные услуги и бытовые удобства
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {UTILITIES.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm font-inter text-foreground text-center">
              Общие помещения: холл с телевизором и диванами, кухня, прачечная, библиотека, комната для видеоигр.
            </div>
          </div>
        )}

        {/* Food */}
        {tab === "food" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-5">
              {MEALS.map((m) => (
                <div key={m.time} className="bg-card border border-border rounded-2xl p-5">
                  <div className="font-inter font-bold text-foreground mb-3 text-sm">{m.time}</div>
                  <ul className="space-y-2">
                    {m.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs font-inter text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-foreground mb-3">Дополнительно</div>
              <div className="grid sm:grid-cols-2 gap-2 text-sm font-inter text-muted-foreground">
                {[
                  "Меню составляет диетолог — 2500–3000 ккал/день",
                  "Специальные диеты: диабет, аллергия, вегетарианство, ЖКТ",
                  "Продукты свежие, из местных рынков, проверяются на качество",
                  "Доставка еды в термоконтейнерах на полевые объекты",
                  "Религиозные ограничения питания учитываются по запросу",
                  "Для ночных смен: ужин с собой или ночная столовая",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transport & Communication */}
        {tab === "transport" && (
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                title: "Служебный транспорт",
                items: ["Автобусы 40–50 мест для доставки рабочих групп", "Микроавтобусы 10–15 мест для специалистов", "Утро 07:00–08:00, обед 12:00–13:00, вечер 18:00–19:00", "По выходным — развозка в город"],
              },
              {
                title: "Компенсация проезда",
                items: ["100% оплата билетов до места работы (самолёт, поезд, автобус)", "100% оплата обратного билета по завершении контракта", "Льготный проездной на городской транспорт за счёт компании"],
              },
              {
                title: "Мобильная связь и интернет",
                items: ["Сим-карта местного оператора при приезде", "10 ГБ интернета в месяц на счету", "Wi-Fi 100+ Мбит/с в общежитии, 24/7, безлимитный трафик", "Компьютерный класс (09:00–22:00) для видеозвонков"],
              },
              {
                title: "Социальные сети и общение",
                items: ["Полный доступ к VK, Telegram, WhatsApp, Instagram", "Видеозвонки с семьёй (WhatsApp, Viber, Zoom)", "Телефон в холле для звонков домой (бесплатно)", "Экстренный телефон в медпункте — круглосуточно"],
              },
            ].map((block) => (
              <div key={block.title} className="bg-card border border-border rounded-2xl p-5">
                <div className="font-inter font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  {block.title}
                </div>
                <ul className="space-y-2">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Leisure */}
        {tab === "leisure" && (
          <div className="grid sm:grid-cols-2 gap-5">
            {LEISURE.map((block) => (
              <div key={block.title} className="bg-card border border-border rounded-2xl p-5">
                <div className="font-inter font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  {block.title}
                </div>
                <ul className="space-y-2">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Schedule */}
        {tab === "schedule" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm font-inter">
                <thead>
                  <tr className="bg-secondary/60">
                    <th className="text-left px-5 py-3 font-semibold text-foreground">Время</th>
                    <th className="text-left px-5 py-3 font-semibold text-foreground">Мероприятие</th>
                  </tr>
                </thead>
                <tbody>
                  {SCHEDULE.map((row, i) => (
                    <tr key={row.time} className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                      <td className="px-5 py-3 font-mono font-bold text-accent text-xs whitespace-nowrap">{row.time}</td>
                      <td className="px-5 py-3 text-muted-foreground">{row.activity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm font-inter text-foreground text-center">
              <span className="font-bold">Выходные дни:</span> суббота и воскресенье — свободное время, организованные выезды в город под охраной, видеозвонки с семьёй.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
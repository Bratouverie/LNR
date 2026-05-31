import { useState } from "react";
import { Award, MapPin, GraduationCap, Home, Users, CheckCircle, ShieldCheck } from "lucide-react";

const TABS = [
  { id: "veteran", label: "Программа ветеранов", icon: Award },
  { id: "land", label: "Земельные участки", icon: MapPin },
  { id: "education", label: "Обучение", icon: GraduationCap },
  { id: "mortgage", label: "Жилищные кредиты", icon: Home },
  { id: "family", label: "Помощь семьям", icon: Users },
];

const VETERAN_FEDERAL = [
  "Налоговый вычет при покупке недвижимости (до 13%, макс. 2 млн руб.)",
  "Налоговые вычеты при дарении (0% налога на прибыль)",
  "Льготное кредитование в государственных банках",
  "Приоритет при выделении земельных участков",
  "Льготы на ЖКХ (снижение платежей на 25–50%)",
  "Льготное лечение в государственных больницах",
  "Приоритетный доступ к санаторно-курортному лечению",
  "Пенсионные доплаты (дополнительная пенсия ветерана)",
];

const VETERAN_REGIONAL = [
  "Проезд на общественном транспорте со скидкой 50%",
  "Льготы на лекарства (скидка на рецептурные препараты)",
  "Доступ к региональным программам поддержки",
  "Приоритет при трудоустройстве в государственных учреждениях",
  "Выдача грантов на развитие собственного бизнеса (300 000 руб.)",
];

const LAND_INFO = [
  { label: "Размер участка", value: "0,25–0,5 га (зависит от должности и стажа)" },
  { label: "Место выделения", value: "На территории ЛНР или ДНР (по выбору)" },
  { label: "Рассмотрение заявки", value: "1–3 месяца" },
  { label: "Оформление права собственности", value: "1–2 месяца (бесплатно)" },
  { label: "Документ", value: "Свидетельство о праве собственности" },
];

const LAND_USE = [
  "Строительство дома (жилья для семьи)",
  "Ведение сельского хозяйства (огород, животноводство)",
  "Бизнес (мастерская, лавка и т.д.)",
];

const LAND_HELP = [
  "Микрокредиты для строительства дома (ставка 0–3% в год)",
  "Субсидии на строительные материалы (до 500 000 рублей)",
  "Помощь в организации фермерского хозяйства (консультации, семена, инструмент)",
];

const EDU_DURING = [
  "Повышение квалификации по специальности (сертификация)",
  "Обучение смежным профессиям (например, разнорабочий → строитель)",
  "Обучение управленческим навыкам (для потенциальных руководителей)",
  "Обучение иностранным языкам (английский для инженеров-связистов)",
];

const EDU_AFTER = [
  "Направление в образовательные учреждения (ПТУ, колледжи, вузы)",
  "Компенсация расходов на обучение (до 100 000 рублей)",
  "Помощь в трудоустройстве после окончания учёбы",
];

const MORTGAGE = [
  { label: "Процентная ставка", value: "3–5% в год (ниже рыночной)" },
  { label: "Размер кредита", value: "До 3 млн рублей" },
  { label: "Срок", value: "До 20 лет" },
  { label: "Первый взнос", value: "10–20% (вместо обычного 20–30%)" },
];

const MORTGAGE_BANKS = ["Сбербанк России", "ВТБ", "Альфа-банк", "Другие государственные банки"];

const FAMILY_CHILDREN = [
  "Ежемесячная выплата на каждого малолетнего ребёнка в семье — 20 000 руб./мес.",
  "Покрытие ипотеки государством на период вахты — до 400 000 руб.",
  "Сохранение рабочего места по основному месту работы (не нужно увольняться)",
  "Единовременное пособие при рождении ребёнка — 25 000 рублей",
];

const FAMILY_DEATH = [
  "Единовременное пособие семье — 500 000–1 000 000 рублей",
  "Ежемесячная пенсия по потере кормильца (дети и жена)",
  "Помощь в организации похорон (полная оплата расходов)",
];

const INSURANCE_INFO = [
  "Страховка от НС при производственной травме — не менее 1 500 000 ₽",
  "Страховка при установлении группы инвалидности вследствие производственной травмы или профзаболевания — не менее 9 000 000 ₽",
  "Максимальная страховая выплата — 14 700 000 ₽",
];

export default function BenefitsSection() {
  const [active, setActive] = useState("veteran");

  return (
    <section id="benefits" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Льготы и программы</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Специальные программы поддержки
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Участники программы получают расширенный пакет государственных льгот и поддержки после завершения контракта.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                active === t.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"
              }`}
            >
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Veteran */}
        {active === "veteran" && (
          <div className="space-y-6">
            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 flex items-start gap-3">
              <Award className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="font-inter font-bold text-foreground">Получение статуса: после 1 года участия в программе</div>
                <div className="text-sm text-muted-foreground mt-1">Документ: удостоверение ветерана восстановления ЛНР и ДНР (на основании Указа Президента)</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="font-inter font-bold text-sm text-foreground mb-4">Федеральные льготы</div>
                <ul className="space-y-2">
                  {VETERAN_FEDERAL.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <div className="font-inter font-bold text-sm text-foreground mb-4">Региональные льготы</div>
                <ul className="space-y-2">
                  {VETERAN_REGIONAL.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Land */}
        {active === "land" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Параметры участка</div>
              <div className="space-y-3">
                {LAND_INFO.map((r) => (
                  <div key={r.label}>
                    <div className="text-xs text-muted-foreground font-inter">{r.label}</div>
                    <div className="text-sm font-inter font-medium text-foreground mt-0.5">{r.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Цели использования</div>
              <ul className="space-y-2">
                {LAND_USE.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Помощь в развитии</div>
              <ul className="space-y-2">
                {LAND_HELP.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Education */}
        {active === "education" && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Бесплатные курсы во время работы</div>
              <ul className="space-y-2">
                {EDU_DURING.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Помощь после завершения контракта</div>
              <ul className="space-y-2">
                {EDU_AFTER.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Mortgage */}
        {active === "mortgage" && (
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Льготное кредитование</div>
              <div className="space-y-3">
                {MORTGAGE.map((r) => (
                  <div key={r.label} className="flex justify-between gap-3">
                    <span className="text-sm text-muted-foreground font-inter">{r.label}</span>
                    <span className="text-sm font-inter font-bold text-accent text-right">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Банки-партнёры</div>
              <ul className="space-y-2">
                {MORTGAGE_BANKS.map((bank, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-inter text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-accent shrink-0" />{bank}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Family */}
        {active === "family" && (
          <div className="space-y-5 max-w-3xl mx-auto">
            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <div className="font-inter font-bold text-sm text-foreground">Страховка от несчастных случаев на производстве</div>
              </div>
              <ul className="space-y-2">
                {INSURANCE_INFO.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Пособия на детей</div>
              <ul className="space-y-2">
                {FAMILY_CHILDREN.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="font-inter font-bold text-sm text-foreground mb-4">Помощь при гибели сотрудника</div>
              <ul className="space-y-2">
                {FAMILY_DEATH.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
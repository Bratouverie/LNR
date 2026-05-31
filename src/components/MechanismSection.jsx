import { Banknote, ClipboardList, Users, FileCheck, Hammer, Star, CheckCircle } from "lucide-react";

const MECHANISM = [
  {
    num: "1",
    icon: Banknote,
    title: "Федеральное финансирование",
    steps: [
      "Администрация РФ выделяет бюджет",
      "Администрация Хабаровска получает средства",
    ],
  },
  {
    num: "2",
    icon: ClipboardList,
    title: "Заказ на восстановление",
    steps: [
      "ЛНР и ДНР определяют объекты для восстановления",
      "Администрация Хабаровска согласует объёмы",
      "ООО «Братоуверие-СНБ» получает техническое задание",
    ],
  },
  {
    num: "3",
    icon: Users,
    title: "Подбор персонала",
    steps: [
      "ООО «Братоуверие-СНБ» объявляет вакансии",
      "Кадровые агентства ищут кандидатов",
      "Проводятся собеседования",
      "Лучшие кандидаты приглашаются в программу",
    ],
  },
  {
    num: "4",
    icon: FileCheck,
    title: "Оформление и выплаты",
    steps: [
      "Заключение трудовых контрактов",
      "Выплата единовременных бонусов (2 500 000 руб.)",
      "Ежемесячные выплаты зарплаты",
    ],
  },
  {
    num: "5",
    icon: Hammer,
    title: "Выполнение работ",
    steps: [
      "Разворачивание на объектах",
      "Выполнение восстановительных работ",
      "Контроль качества",
      "Еженедельный мониторинг",
    ],
  },
  {
    num: "6",
    icon: Star,
    title: "Итоги и льготы",
    steps: [
      "Получение статуса ветерана",
      "Получение земельного участка",
      "Федеральные и региональные льготы",
      "Завершение программы или продление",
    ],
  },
];

const STAGES = [
  {
    num: "1",
    title: "Подача заявки и первичная обработка",
    duration: "2–3 рабочих дня",
    items: [
      "Наличие всех необходимых документов",
      "Соответствие базовым требованиям (гражданство РФ, возраст 18–60 лет)",
      "Соответствие образования и опыта требуемой должности",
    ],
  },
  {
    num: "2",
    title: "Предварительное собеседование",
    duration: "3–5 рабочих дней",
    items: [
      "Звонок или видеоконференция через приложение MAX (20–40 минут)",
      "Обсуждение мотивации, опыта, готовности к работе в сложных условиях",
      "Рассказ об условиях работы, зарплате, льготах и гарантиях",
    ],
  },
  {
    num: "3",
    title: "Проверка безопасности",
    duration: "1–2 рабочих дня",
    items: [
      "Проверка в базах данных МВД (уголовная история, розыск)",
      "Проверка на причастность к экстремизму или терроризму",
      "Проверка судебных решений и ограничений",
    ],
  },
  {
    num: "4",
    title: "Направление на медицинскую комиссию",
    duration: "Координация за 1–2 недели",
    items: [
      "Дата согласуется с кандидатом заранее",
      "Адрес: г. Хабаровск, ул. Карла Маркса, д. 66 или г. Тамбов, ул. Коммунальная, 6",
      "Расходы на дорогу компенсируются в течение 5 дней после прибытия на медкомиссию и оформление",
    ],
  },
  {
    num: "5",
    title: "Прохождение медицинской комиссии",
    duration: "1 день",
    items: [
      "Общие анализы крови и мочи, биохимия, ВИЧ/гепатит/сифилис",
      "ЭКГ, флюорография, УЗИ при необходимости",
      "Осмотры: терапевт, невролог, офтальмолог, психолог и другие специалисты",
    ],
  },
  {
    num: "6",
    title: "Согласование результатов и финальное решение",
    duration: "1 день",
    items: [
      "Финальный анализ медицинских показателей и психологического профиля",
      "Проверка соответствия опыта и квалификации требованиям",
      "Уведомление кандидата о решении",
    ],
  },
  {
    num: "7",
    title: "Оформление документов",
    duration: "1–3 рабочих дня",
    items: [
      "Подготовка трудового договора (вахта, срок 1 год)",
      "Оформление страховки, пропуска на объект",
      "Согласование даты вылета на место работы",
    ],
  },
  {
    num: "8",
    title: "Получение выплаты и отправка на объект",
    duration: "1–2 дня",
    items: [
      "Единовременная выплата 2 500 000 рублей в течение 5–14 дней после прохождения медкомиссии и завершения оформления",
      "Организация транспортировки к месту несения вахты",
      "Вводный инструктаж, распределение по бригадам, начало работы",
    ],
  },
];

const WHY_US = [
  { label: "Высокие заработки", desc: "от 300 000 до 470 000 рублей в месяц" },
  { label: "Единовременный бонус", desc: "2 500 000 рублей при подписании трудового договора (контракта)" },
  { label: "Полная социальная защита", desc: "медстраховка, страховка от несчастных случаев, земельный участок" },
  { label: "Безопасность", desc: "работа проводится под контролем военных и правоохранителей" },
  { label: "Комфорт", desc: "бесплатное жильё, питание, досуг" },
  { label: "Мировая значимость", desc: "помощь мирному населению, восстановление инфраструктуры" },
  { label: "Профессиональный рост", desc: "обучение, развитие навыков, карьерный рост" },
];

export default function MechanismSection() {
  return (
    <section id="mechanism" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

        {/* Mechanism */}
        <div>
          <div className="text-center mb-12">
            <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Механизм</span>
            <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
              Как работает программа
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {MECHANISM.map((m) => (
              <div key={m.num} className="bg-card border border-border rounded-2xl p-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <m.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-mono text-xs text-accent font-bold">Шаг {m.num}</div>
                    <div className="font-inter font-bold text-sm text-foreground">{m.title}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {m.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-inter text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* How to start */}
        <div>
          <div className="text-center mb-12">
            <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Вступление</span>
            <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
              Как начать работу
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border hidden sm:block" />
            <div className="space-y-4">
              {STAGES.map((stage, idx) => (
                <div key={stage.num} className="relative sm:pl-16">
                  {/* Circle */}
                  <div className="absolute left-0 top-4 w-10 h-10 rounded-full bg-accent flex items-center justify-center font-mono font-black text-white text-sm hidden sm:flex z-10">
                    {stage.num}
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3 sm:hidden">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-mono font-bold text-white text-xs shrink-0">
                        {stage.num}
                      </div>
                      <div className="font-inter font-bold text-foreground">{stage.title}</div>
                    </div>
                    <div className="flex items-center justify-between mb-3 hidden sm:flex">
                      <div className="font-inter font-bold text-foreground">{stage.title}</div>
                      <span className="font-mono text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0 ml-2">{stage.duration}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {stage.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 text-center font-inter text-sm text-foreground">
            <span className="font-bold">Общий срок:</span> 2–3 недели с момента подачи заявки до выезда на место работы.
          </div>
        </div>

        {/* Why us */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-inter font-black text-foreground tracking-tight">Почему выбрать нас</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {WHY_US.map((w) => (
              <div key={w.label} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="font-inter font-bold text-sm text-foreground">{w.label}</div>
                  <div className="font-inter text-xs text-muted-foreground mt-0.5">{w.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-accent rounded-2xl p-8 text-center">
            <h3 className="font-inter font-black text-2xl text-white mb-2">
              Присоединяйтесь к программе восстановления ЛНР и ДНР!
            </h3>
            <p className="font-inter text-white/80">
              Ваша работа — это вклад в будущее, помощь людям и заработок для вашей семьи.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
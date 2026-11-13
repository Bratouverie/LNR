import { CheckCircle, Clock, Calendar } from "lucide-react";

const PHASES = [
  {
    phase: "Фаза 1",
    title: "Подготовка и набор персонала",
    period: "Вахта уже идёт — оформление в живом порядке",
    result: "Отправка специалистов на объекты",
    color: "bg-accent",
    steps: [
      { date: "Сейчас", event: "Набор открыт — заявки принимаются ежедневно", note: "Публикация вакансий" },
      { date: "Идёт сейчас", event: "Приём заявок и анкет идёт постоянно", note: "1 месяц набора" },
      { date: "По мере оформления", event: "Медобследование и оформление допуска на объект", note: "Хабаровск, Владивосток, Москва и др. (уточняется)" },
      { date: "Перед выездом", event: "Подготовка к отправке на объект", note: "Группы от 10 чел., доставка военным бортом в Макеевку" },
      { date: "Группами", event: "Доставка работников к месту работы (на вахту)", note: "Диапазон прибытия 6–22 июля" },
      { date: "Идёт сейчас", event: "Работы на объектах уже ведутся", note: "6 месяцев" },
    ],
  },
  {
    phase: "Фаза 2",
    title: "Первая волна восстановления",
    period: "Текущий период работ",
    result: "30–40% объектов восстановлено",
    color: "bg-primary",
    steps: [
      { date: "Идёт сейчас", event: "Первый год работ", note: "" },
      { date: "", event: "Объекты: Мариуполь, Макеевка, Луганск, Алчевск", note: "Приоритетные" },
    ],
  },
  {
    phase: "Фаза 3",
    title: "Вторая волна восстановления",
    period: "Июнь 2027 – май 2028",
    result: "70–80% объектов восстановлено",
    color: "bg-blue-600",
    steps: [
      { date: "Февраль – март 2027", event: "Объявление второй волны", note: "Пополнение кадров" },
      { date: "Апрель – май 2027", event: "Набор и оформление", note: "Параллельно с первой волной" },
      { date: "Июнь 2027", event: "Отправка второй волны на объекты", note: "Расширение масштаба" },
      { date: "Июнь 2027 – май 2028", event: "Второй год работы", note: "Средне-приоритетные объекты" },
    ],
  },
  {
    phase: "Фаза 4",
    title: "Завершение и мониторинг",
    period: "Июнь – декабрь 2028",
    result: "95–100% объектов восстановлено",
    color: "bg-green-600",
    steps: [
      { date: "Июнь – декабрь 2028", event: "Третий год (опционально)", note: "Низко-приоритетные и доделки" },
    ],
  },
];

export default function TimelineSection() {
  return (
    <section id="timeline" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Хронология</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Сроки реализации проекта
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Программа восстановления 2026–2028
          </p>
        </div>

        <div className="space-y-8">
          {PHASES.map((phase, idx) => (
            <div key={phase.phase} className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Phase header */}
              <div className="flex items-center gap-4 p-5 border-b border-border">
                <div className={`w-10 h-10 rounded-xl ${phase.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-mono font-bold text-xs">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-inter font-black text-foreground">{phase.title}</span>
                    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {phase.period}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 text-xs font-inter font-semibold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <CheckCircle className="h-3.5 w-3.5" />
                  {phase.result}
                </div>
              </div>

              {/* Steps */}
              <div className="p-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {phase.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/30 rounded-xl p-3">
                    <Calendar className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      {step.date && (
                        <div className="font-mono text-xs text-accent font-semibold mb-0.5">{step.date}</div>
                      )}
                      <div className="font-inter text-xs text-foreground font-medium">{step.event}</div>
                      {step.note && (
                        <div className="font-inter text-xs text-muted-foreground mt-0.5">{step.note}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
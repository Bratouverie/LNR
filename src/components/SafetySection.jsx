import { useState } from "react";
import { Shield, Truck, HardHat, Bell, HeartPulse, Brain, Scale, CheckCircle } from "lucide-react";

const PHYSICAL = [
  {
    title: "Охрана и контроль периметра",
    items: ["Круглосуточная вооружённая охрана входов", "Пропускная система (пропуска, идентификация персонала)", "Видеонаблюдение в критических зонах", "Связь с диспетчерской при подозрительной деятельности"],
  },
  {
    title: "Сопровождение и транспорт",
    items: ["Сопровождение военными при перемещении в сложных районах", "Организация безопасных маршрутов", "Служебный транспорт с подготовленными водителями", "Система оповещения при ЧС (тревожные кнопки, сирены)"],
  },
  {
    title: "Защитное снаряжение",
    items: ["Личное снаряжение (каска, жилет, очки) для каждого", "Спецкостюмы для взрывотехников, страховка для высотных работ", "Противогазы и респираторы при необходимости", "Укрытия и убежища на каждом объекте"],
  },
  {
    title: "Информирование и эвакуация",
    items: ["Ежедневный брифинг о ситуации в регионе", "Оперативное информирование о воздушных тревогах", "Система эвакуации — все специалисты проходят инструктаж", "Взаимодействие с МВД, ФСБ и МЧС"],
  },
];

const MEDICAL = [
  {
    title: "Медицинские пункты",
    items: ["Мобильный медпункт на каждом объекте (24/7)", "Стационарный медпункт в главном лагере (4 кровати)", "Оборудование: дефибриллятор, кислород, перевязочные материалы"],
  },
  {
    title: "Медицинский персонал",
    items: ["Главный врач программы", "Фельдшеры на каждом объекте", "Медсёстры в общежитии и медпункте", "Консультация специалиста по видеосвязи"],
  },
  {
    title: "Неотложная помощь",
    items: ["Срочная доставка в больницу (скорая, вертолёт)", "Соглашение с ближайшей больницей о приоритетном приёме", "Страховка покрывает все расходы на лечение"],
  },
  {
    title: "Психологическая поддержка",
    items: ["Постоянный психолог в главном лагере", "Групповые занятия по управлению стрессом (еженедельно)", "Горячая линия психологической помощи (24/7)", "Видеозвонки с семьёй, интернет в жилых помещениях"],
  },
];

const LEGAL = [
  "Бесплатные консультации по вопросам трудовых отношений",
  "Проверка правильности оформления трудовых договоров",
  "Помощь при нарушениях работодателем условий трудового договора",
  "Ознакомление со своими правами при приёме на работу",
  "Получение копий всех документов",
  "Консультация по отпускам, выплатам, льготам",
];

const TABS = [
  { id: "physical", label: "Физическая безопасность", icon: Shield },
  { id: "medical", label: "Медицина и психология", icon: HeartPulse },
  { id: "legal", label: "Правовая поддержка", icon: Scale },
];

export default function SafetySection() {
  const [tab, setTab] = useState("physical");

  return (
    <section id="safety" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Безопасность</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Безопасность и поддержка
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Работа осуществляется на восстанавливаемых территориях ЛНР и ДНР под охраной и обеспечением безопасности силовых структур Российской Федерации. Каждый специалист обеспечен медицинской, психологической и правовой поддержкой.
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

        {/* Physical */}
        {tab === "physical" && (
          <div className="grid sm:grid-cols-2 gap-5">
            {PHYSICAL.map((block) => (
              <div key={block.title} className="bg-card border border-border rounded-2xl p-5 hover:border-accent/30 transition-colors">
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
            <div className="sm:col-span-2 bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm font-inter text-foreground text-center">
              <span className="font-bold">Техника безопасности:</span> Вводный инструктаж при прибытии (2–4 ч), первичный на рабочем месте (1–2 ч), повторный ежемесячно. Сотрудник по охране труда на каждом объекте.
            </div>
          </div>
        )}

        {/* Medical */}
        {tab === "medical" && (
          <div className="grid sm:grid-cols-2 gap-5">
            {MEDICAL.map((block) => (
              <div key={block.title} className="bg-card border border-border rounded-2xl p-5 hover:border-accent/30 transition-colors">
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

        {/* Legal */}
        {tab === "legal" && (
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Scale className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-inter font-bold text-foreground">Юридическое сопровождение</div>
                <div className="font-inter text-xs text-muted-foreground">Бесплатно для всех участников программы</div>
              </div>
            </div>
            <ul className="space-y-3">
              {LEGAL.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-inter text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4 text-xs font-inter text-muted-foreground">
              Форма обращения: по телефону, email или личный приём. Помощь в урегулировании споров, представительство при разрешении конфликтов, консультация юриста программы при подписании трудового договора.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
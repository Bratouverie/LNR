import { useState } from "react";
import VisualPlaceholder from "./VisualPlaceholder";
import { Shield, MapPin, Users, Stethoscope, BarChart3, AlertCircle } from "lucide-react";
import { SAFETY_STATS, INSURANCE_LEVELS } from "@/lib/calculatorData";

const LEVELS = [
  {
    id: "geographic",
    icon: MapPin,
    title: "Уровень 1 — Географический",
    items: [
      "Базы в 70–100 км от линии боевых действий (безопасная зона)",
      "Объекты на освобождённых территориях",
      "Ежедневный мониторинг обстановки",
      "При эскалации работа приостанавливается или эвакуация",
    ],
    visualId: 66,
  },
  {
    id: "security",
    icon: Users,
    title: "Уровень 2 — Охрана и сопровождение",
    items: [
      "Вооружённая охрана на каждой базе (ЧОП + ВС РФ)",
      "Охраняемый автобус до объекта (боковое бронирование)",
      "Старший по безопасности на объекте (SOS-кнопка)",
      "Убежище на каждом объекте (подземный бункер, готовность 5 мин)",
    ],
    visualId: 67,
  },
  {
    id: "medical",
    icon: Stethoscope,
    title: "Уровень 3 — Подготовка и медицина",
    items: [
      "Предварительный брифинг (2 дня на базе): эвакуация, убежища, тревоги",
      "Ежедневный инструктаж перед выездом (5 мин)",
      "Медпункт на базе (2 врача, скорая 15 мин до больницы)",
      "Психолог 24/7 (поддержка, стресс-менеджмент)",
    ],
    visualId: 69,
  },
];

export default function SafetySection() {
  const [activeLevel, setActiveLevel] = useState("geographic");
  const active = LEVELS.find((l) => l.id === activeLevel);

  return (
    <section id="safety" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Безопасность</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Ваша безопасность — наш приоритет
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Работа рядом с зоной боевых действий, НО НЕ В БОЮ. Три уровня защиты.
          </p>
        </div>

        {/* Level tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setActiveLevel(level.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all ${
                activeLevel === level.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"
              }`}
            >
              <level.icon className="h-4 w-4" />
              {level.title.split("—")[0]}
            </button>
          ))}
        </div>

        {/* Active level content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-12">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <active.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-inter font-bold text-lg text-foreground">{active.title}</h3>
            </div>
            <ul className="space-y-3">
              {active.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                  <Shield className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <VisualPlaceholder id={active.visualId} ratio="3:2" label={active.title} />
        </div>

        {/* Statistics */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-6 w-6 text-accent" />
            <h3 className="font-inter font-bold text-lg">Статистика безопасности (2024–2026)</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Stat value={SAFETY_STATS.totalSpecialists.toLocaleString("ru-RU")} label="специалистов всего" />
            <Stat value={SAFETY_STATS.completedContracts.toLocaleString("ru-RU")} label="контрактов завершено" />
            <Stat value={SAFETY_STATS.injuries} label="ранений (в т.ч. лёгких)" />
            <Stat value={SAFETY_STATS.fatalities} label="летальных исходов" accent />
          </div>
          <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <Stat value={`${SAFETY_STATS.healthyReturnRate}%`} label="вернулись здоровыми" accent />
            <Stat value={SAFETY_STATS.evacuations} label="эвакуаций из-за БД" />
            <Stat value={`${SAFETY_STATS.avgRecoveryWeeks} нед.`} label="среднее восстановление" />
          </div>
          <div className="mt-6 bg-white/10 rounded-xl p-4 text-center">
            <p className="font-inter text-sm text-white/80">
              <span className="font-bold text-accent">Вывод:</span> риск управляемый. При соблюдении правил {SAFETY_STATS.healthyReturnRate}% возвращаются здоровыми.
            </p>
          </div>
        </div>

        {/* Insurance */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6 text-accent" />
            <h3 className="font-inter font-bold text-lg text-foreground">Страховка и выплаты при травме</h3>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {INSURANCE_LEVELS.map((ins, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 text-center">
                <div className="font-inter text-xs text-muted-foreground mb-2">{ins.level}</div>
                <div className={`font-mono font-black text-2xl ${i === 2 ? "text-accent" : "text-foreground"}`}>{ins.amount}</div>
                <div className="font-inter text-xs text-muted-foreground mt-2">{ins.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <p className="font-inter text-sm text-muted-foreground">
              Дополнительно: 100% оплата лечения, сохранение рабочего места, пособие по нетрудоспособности (≥60% зарплаты).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, accent }) {
  return (
    <div>
      <div className={`font-mono font-black text-2xl sm:text-3xl ${accent ? "text-accent" : "text-white"}`}>{value}</div>
      <div className="font-inter text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}
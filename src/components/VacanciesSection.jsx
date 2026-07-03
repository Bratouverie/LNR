import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator as CalcIcon } from "lucide-react";
import { VACANCIES_DATA } from "@/data/vacanciesConfig";

export default function VacanciesSection({ onApply, onCalculate }) {
  const [filter, setFilter] = useState("Все");

  const categories = ["Все", ...new Set(VACANCIES_DATA.map((v) => v.category))];
  const filtered = filter === "Все" ? VACANCIES_DATA : VACANCIES_DATA.filter((v) => v.category === filter);

  return (
    <section id="vacancies" className="py-24 sm:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Вакансии</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Выберите специальность
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Подберите направление, соответствующее вашим навыкам и опыту
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <VacancyCard key={v.id} vacancy={v} onApply={onApply} onCalculate={onCalculate} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VacancyCard({ vacancy, onApply, onCalculate }) {
  const [expanded, setExpanded] = useState(false);
  const calcKey = vacancy.salary?.type === "by-category"
    ? Object.values(vacancy.salary.categories)[0]?.calcKey || vacancy.id
    : vacancy.id;

  return (
    <div className="group bg-card border-2 border-border rounded-xl p-6 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
          {vacancy.category}
        </span>
        <div className="font-mono text-xs text-muted-foreground">{vacancy.conditions?.format || "Вахта 3 мес"}</div>
      </div>

      <h3 className="font-inter font-bold text-lg text-foreground mb-2">{vacancy.title}</h3>

      <div className="mb-4">
        <div className="font-mono text-sm font-bold text-foreground">
          {vacancy.salary?.total || `${vacancy.salaryMin?.toLocaleString("ru-RU")} ₽/мес`}
        </div>
        <div className="text-xs text-muted-foreground font-inter mt-0.5">
          + 625 000 ₽ подъёмные
        </div>
      </div>

      <p className="font-inter text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
        {vacancy.role}
      </p>

      {expanded && (
        <div className="mb-4 space-y-3 border-t border-border pt-4">
          <div>
            <div className="font-inter text-xs font-bold text-foreground mb-1">Обязанности:</div>
            <ul className="space-y-1">
              {vacancy.duties.slice(0, 4).map((d, i) => (
                <li key={i} className="flex gap-2 text-xs text-muted-foreground font-inter">
                  <span className="text-accent shrink-0">•</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-inter text-xs font-bold text-foreground mb-1">Требования:</div>
            <div className="font-inter text-xs text-muted-foreground">{vacancy.requirements?.experience}</div>
            <div className="font-inter text-xs text-muted-foreground mt-0.5">{vacancy.requirements?.age}</div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-inter text-muted-foreground hover:text-accent transition-colors text-center"
        >
          {expanded ? "Свернуть ↑" : "Подробнее ↓"}
        </button>
        <div className="flex gap-2">
          <Button
            onClick={() => onApply(vacancy.title)}
            className="flex-1 bg-primary hover:bg-accent text-primary-foreground font-inter font-semibold transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground text-sm"
          >
            Откликнуться
          </Button>
          <button
            onClick={() => onCalculate && onCalculate(calcKey)}
            className="shrink-0 flex items-center gap-1.5 border border-border hover:border-accent hover:text-accent rounded-lg px-3 text-xs font-inter font-medium transition-colors"
            title="Рассчитать доход"
          >
            <CalcIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Доход</span>
          </button>
        </div>
      </div>
    </div>
  );
}
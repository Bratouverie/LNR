import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wrench, Truck, Radio, Bomb, Stethoscope, Plane, ShieldCheck, HardHat, HardHatIcon, Building2, ArrowRight } from "lucide-react";

const ICONS = {
  "raznorabochiy": HardHat,
  "stroitel": Building2,
  "avtoslesarj": Wrench,
  "voditel": Truck,
  "inzhener-svyazist": Radio,
  "vzryvotekhnik": Bomb,
  "medik": Stethoscope,
  "operator-bpla": Plane,
  "okhrannik": ShieldCheck,
};

export default function VacancyCard({ vacancy, onApply }) {
  const Icon = ICONS[vacancy.id] || HardHat;

  return (
    <div className="group bg-card border-2 border-border rounded-xl p-6 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
          {vacancy.category}
        </span>
      </div>

      <h3 className="font-inter font-bold text-lg text-foreground mb-2">{vacancy.title}</h3>

      <div className="mb-4 flex-1">
        <div className="font-mono text-sm font-bold text-foreground">
          от {vacancy.salaryMin.toLocaleString("ru-RU")} ₽/мес
        </div>
        <div className="text-xs text-muted-foreground font-inter mt-0.5">
          + {vacancy.bonus.toLocaleString("ru-RU")} ₽ подъёмные
        </div>
      </div>

      <ul className="space-y-1.5 mb-6">
        {vacancy.duties.slice(0, 3).map((d, i) => (
          <li key={i} className="flex gap-2 text-xs text-muted-foreground font-inter">
            <span className="text-accent mt-0.5 shrink-0">•</span>
            <span className="line-clamp-1">{d}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <Button
          onClick={() => onApply(vacancy.title)}
          className="flex-1 bg-primary hover:bg-accent text-primary-foreground font-inter font-semibold transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground text-sm"
        >
          Откликнуться
        </Button>
        <Link to={`/vacancy/${vacancy.id}`} className="shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="border-border hover:border-accent hover:text-accent"
            title="Подробнее"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
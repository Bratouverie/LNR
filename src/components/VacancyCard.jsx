import { Button } from "@/components/ui/button";
import { Wrench, Truck, Radio, Bomb, Stethoscope, Plane, ShieldCheck, Crosshair, HardHat } from "lucide-react";

const ICONS = {
  "Разнорабочий": HardHat,
  "Автослесарь, механик": Wrench,
  "Водитель (кат. В, ВС, СЕ, CD)": Truck,
  "Инженер-связист": Radio,
  "Взрывотехник": Bomb,
  "Медик": Stethoscope,
  "Оператор БПЛА": Plane,
  "Охранник": ShieldCheck,
  "Специалист по системам наведения": Crosshair,
};

const CATEGORIES = {
  "Разнорабочий": "Строительство",
  "Автослесарь, механик": "Транспорт",
  "Водитель (кат. В, ВС, СЕ, CD)": "Транспорт",
  "Инженер-связист": "Связь",
  "Взрывотехник": "Инженерия",
  "Медик": "Медицина",
  "Оператор БПЛА": "Технологии",
  "Охранник": "Безопасность",
  "Специалист по системам наведения": "Технологии",
};

export default function VacancyCard({ title, points, onApply }) {
  const Icon = ICONS[title] || HardHat;
  const category = CATEGORIES[title] || "Прочее";

  return (
    <div className="group bg-card border-2 border-border rounded-xl p-6 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
          {category}
        </span>
      </div>

      <h3 className="font-inter font-bold text-lg text-foreground mb-3">{title}</h3>

      <ul className="space-y-2 mb-6 flex-1">
        {points.slice(0, 3).map((p, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted-foreground font-inter">
            <span className="text-accent mt-1 shrink-0">•</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onApply(title)}
        className="w-full bg-primary hover:bg-accent text-primary-foreground font-inter font-semibold transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground"
      >
        Откликнуться
      </Button>
    </div>
  );
}
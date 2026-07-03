import { useState } from "react";
import { MapPin, Users, Calendar, Banknote } from "lucide-react";
import { RECOVERY_OBJECTS } from "@/lib/calculatorData";

const IMAGES = {
  29: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/1ccee32a9_29.png",
  30: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/b862a3b75_30.png",
  31: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/a596d7132_31.png",
  32: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/10ee55882_32.png",
  35: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/4c64438f8_35.png",
  "36base": "https://media.base44.com/images/public/69f4a665db2c72a42818d397/e2dfda354_36base.png",
  36: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/3f57d16c7_36.png",
  "37base": "https://media.base44.com/images/public/69f4a665db2c72a42818d397/d135135e6_37base.png",
  37: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/458cd53c9_37.png",
  "38base": "https://media.base44.com/images/public/69f4a665db2c72a42818d397/745980975_38base.png",
  38: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/a1dfe3530_38.png",
  39: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/a438493ab_39.png",
  41: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/d36c07858_41.png",
};

export default function RecoveryObjects() {
  const [activeIdx, setActiveIdx] = useState(0);
  const obj = RECOVERY_OBJECTS[activeIdx];

  return (
    <section id="objects" className="py-24 sm:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Объекты</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Где вы будете работать: реальные объекты
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Конкретные объекты восстановления с адресами, командами и зарплатами
          </p>
        </div>

        {/* Object selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {RECOVERY_OBJECTS.map((o, i) => (
            <button
              key={o.city}
              onClick={() => setActiveIdx(i)}
              className={`px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all ${
                activeIdx === i
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"
              }`}
            >
              {o.city}
            </button>
          ))}
        </div>

        {/* Object details */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: images */}
          <div className="space-y-4">
            <div className="relative w-full overflow-hidden rounded-xl bg-secondary">
              <img src={IMAGES[obj.visualId]} alt={obj.name} loading="lazy" className="w-full h-auto object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="relative w-full overflow-hidden rounded-xl bg-secondary aspect-[4/3]">
                  <img src={IMAGES[obj.baseVisualId + "base"]} alt="База размещения" loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="font-inter text-xs text-muted-foreground mt-1.5 text-center">База размещения</p>
              </div>
              <div>
                <div className="relative w-full overflow-hidden rounded-xl bg-secondary aspect-[4/3]">
                  <img src={IMAGES[obj.baseVisualId + 1]} alt="Условия проживания" loading="lazy" className="w-full h-full object-cover" />
                </div>
                <p className="font-inter text-xs text-muted-foreground mt-1.5 text-center">Условия проживания</p>
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="space-y-5">
            <div>
              <h3 className="font-inter font-black text-2xl text-foreground">{obj.name}</h3>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span className="font-inter text-sm">{obj.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="font-inter text-xs text-muted-foreground">Сроки</span>
                </div>
                <div className="font-inter font-bold text-sm text-foreground">{obj.period}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Banknote className="h-4 w-4 text-accent" />
                  <span className="font-inter text-xs text-muted-foreground">Зарплата</span>
                </div>
                <div className="font-inter font-bold text-sm text-foreground">{obj.salaryRange}</div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-accent" />
                <span className="font-inter text-xs text-muted-foreground">Команда</span>
              </div>
              <div className="font-inter text-sm text-foreground">{obj.team}</div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <div className="font-inter font-bold text-sm text-foreground mb-3">Виды работ:</div>
              <ul className="grid grid-cols-2 gap-2">
                {obj.works.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs font-inter text-muted-foreground">
                    <span className="text-accent shrink-0 mt-0.5">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            {/* Map placeholder */}
            <div className="relative w-full overflow-hidden rounded-xl bg-secondary">
              <img src={IMAGES[41]} alt="Карта объектов ЛНР/ДНР" loading="lazy" className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
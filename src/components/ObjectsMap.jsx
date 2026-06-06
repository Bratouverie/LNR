import { MapPin, Building2, Truck, Wifi, Shield } from "lucide-react";

const OBJECTS = [
  { id: 1, city: "Мариуполь", lat: 47.0965, lng: 37.5426, type: "build", label: "Жилой квартал №3", status: "active", workers: 420 },
  { id: 2, city: "Мариуполь", lat: 47.107, lng: 37.555, type: "infra", label: "Завод «Азовсталь»", status: "active", workers: 180 },
  { id: 3, city: "Луганск", lat: 48.574, lng: 39.307, type: "build", label: "Школа №14", status: "active", workers: 95 },
  { id: 4, city: "Луганск", lat: 48.560, lng: 39.290, type: "telecom", label: "Сеть связи LTE", status: "active", workers: 42 },
  { id: 5, city: "Макеевка", lat: 48.002, lng: 37.962, type: "build", label: "Больница №2", status: "active", workers: 130 },
  { id: 6, city: "Алчевск", lat: 48.469, lng: 38.807, type: "infra", label: "ТЭЦ-1 (реконструкция)", status: "active", workers: 210 },
  { id: 7, city: "Донецк", lat: 48.015, lng: 37.802, type: "build", label: "Детский сад №7", status: "active", workers: 65 },
  { id: 8, city: "Енакиево", lat: 48.232, lng: 38.213, type: "security", label: "Объект охраны А-11", status: "active", workers: 55 },
];

const TYPE_CONFIG = {
  build: { icon: Building2, color: "bg-blue-500", label: "Строительство" },
  infra: { icon: Truck, color: "bg-orange-500", label: "Инфраструктура" },
  telecom: { icon: Wifi, color: "bg-green-500", label: "Связь" },
  security: { icon: Shield, color: "bg-purple-500", label: "Охрана" },
};

// Map coords to percentage positions within our bounding box
// Bounding: lat 47.0–48.6, lng 37.5–39.4
const toPos = (lat, lng) => {
  const latMin = 47.0, latMax = 48.65;
  const lngMin = 37.4, lngMax = 39.45;
  const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
  const y = ((latMax - lat) / (latMax - latMin)) * 100;
  return { x: Math.min(95, Math.max(2, x)), y: Math.min(95, Math.max(2, y)) };
};

export default function ObjectsMap() {
  const [active, setActive] = useState(null);

  const totalWorkers = OBJECTS.reduce((s, o) => s + o.workers, 0);

  return (
    <section id="objects-map" className="py-20 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Объекты</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-white mt-3 tracking-tight">
            Карта восстановления
          </h2>
          <p className="text-white/60 font-inter mt-3 max-w-xl mx-auto text-sm">
            Активные строительные объекты в ЛНР и ДНР в режиме реального времени
          </p>
        </div>

        {/* Summary stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {[
            { label: "Активных объектов", value: OBJECTS.length },
            { label: "Специалистов на площадках", value: totalWorkers.toLocaleString("ru-RU") },
            { label: "Городов охвачено", value: [...new Set(OBJECTS.map(o => o.city))].length },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl px-5 py-3 text-center">
              <div className="font-mono font-bold text-xl text-accent">{s.value}</div>
              <div className="font-inter text-xs text-white/60 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-white/10" style={{ paddingBottom: "60%" }}>
              {/* Grid overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              {/* Region shape decorative */}
              <div className="absolute inset-4 rounded-xl border border-white/5 bg-white/2" />

              {/* Map label */}
              <div className="absolute top-3 left-4 font-inter text-xs text-white/30 font-semibold uppercase tracking-widest">
                ЛНР · ДНР · Регион восстановления
              </div>

              {/* Pins */}
              {OBJECTS.map((obj) => {
                const { x, y } = toPos(obj.lat, obj.lng);
                const cfg = TYPE_CONFIG[obj.type];
                const IconComp = cfg.icon;
                const isActive = active?.id === obj.id;

                return (
                  <button
                    key={obj.id}
                    onClick={() => setActive(isActive ? null : obj)}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                  >
                    {/* Pulse ring */}
                    <span className="absolute inset-0 rounded-full animate-ping opacity-30 scale-150" style={{ backgroundColor: cfg.color.replace("bg-", "").replace("-500", "") }} />

                    <div className={`w-8 h-8 ${cfg.color} rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 transition-transform ${isActive ? "scale-125" : "group-hover:scale-110"}`}>
                      <IconComp className="h-4 w-4 text-white" />
                    </div>

                    {/* Tooltip */}
                    {isActive && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-foreground rounded-xl shadow-xl px-3 py-2 min-w-[160px] z-20">
                        <div className="font-inter font-bold text-xs text-foreground">{obj.label}</div>
                        <div className="font-inter text-xs text-muted-foreground">{obj.city}</div>
                        <div className="font-inter text-xs font-semibold text-accent mt-1">👷 {obj.workers} чел.</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 -mt-1" />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Legend */}
              <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-xl p-2.5 space-y-1">
                {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                  const IconComp = cfg.icon;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`w-5 h-5 ${cfg.color} rounded-full flex items-center justify-center`}>
                        <IconComp className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="font-inter text-xs text-white/70">{cfg.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Object list */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {OBJECTS.map((obj) => {
              const cfg = TYPE_CONFIG[obj.type];
              const IconComp = cfg.icon;
              return (
                <button
                  key={obj.id}
                  onClick={() => setActive(active?.id === obj.id ? null : obj)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border transition-all ${
                    active?.id === obj.id
                      ? "border-accent bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`w-8 h-8 ${cfg.color} rounded-lg flex items-center justify-center shrink-0 mt-0.5`}>
                    <IconComp className="h-4 w-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-inter font-bold text-sm text-white truncate">{obj.label}</div>
                    <div className="font-inter text-xs text-white/50 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />{obj.city} · {obj.workers} чел.
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { useState } from "react";
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

// OpenStreetMap embed URL centered on Donetsk/Lugansk region
const MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=36.5%2C46.5%2C40.0%2C49.2&layer=mapnik&marker=47.0965%2C37.5426";

// Fallback static map image (Yandex static maps of the region)
const FALLBACK_IMAGE =
  "https://static-maps.yandex.ru/1.x/?ll=38.5,47.8&z=7&size=650,400&l=map&pt=37.54,47.09,pm2rdl~39.31,48.57,pm2rdl~37.96,48.00,pm2rdl~38.81,48.47,pm2rdl~37.80,48.01,pm2rdl~38.21,48.23,pm2rdl";

function MapFrame() {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <img
        src={FALLBACK_IMAGE}
        alt="Карта региона ЛНР/ДНР"
        className="absolute inset-0 w-full h-full object-cover"
        onError={() => {}}
      />
    );
  }

  return (
    <iframe
      src={MAP_EMBED_URL}
      title="Карта объектов восстановления"
      className="absolute inset-0 w-full h-full border-0 rounded-2xl"
      loading="lazy"
      onError={() => setUseFallback(true)}
      onLoad={(e) => {
        // If iframe fails to load meaningful content, switch to fallback after timeout
        try {
          const doc = e.target.contentDocument;
          if (!doc || doc.body?.innerHTML === "") setUseFallback(true);
        } catch {
          // cross-origin — iframe loaded ok
        }
      }}
    />
  );
}

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
          {/* Map iframe */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden border border-white/10" style={{ paddingBottom: "62%" }}>
              <MapFrame />

              {/* Overlay pins on top of iframe using pointer-events-none */}
              <div className="absolute inset-0 pointer-events-none">
                {active && (
                  <div
                    className="absolute bg-white text-foreground rounded-xl shadow-xl px-3 py-2 min-w-[160px] z-30 pointer-events-auto"
                    style={{ left: "50%", top: "20px", transform: "translateX(-50%)" }}
                  >
                    <div className="font-inter font-bold text-xs text-foreground">{active.label}</div>
                    <div className="font-inter text-xs text-muted-foreground">{active.city}</div>
                    <div className="font-inter text-xs font-semibold text-accent mt-1">👷 {active.workers} чел.</div>
                    <button
                      className="absolute top-1 right-2 text-muted-foreground text-xs"
                      onClick={() => setActive(null)}
                    >✕</button>
                  </div>
                )}
              </div>

              {/* Legend overlay */}
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-xl p-2.5 space-y-1 z-20">
                {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
                  const IconComp = cfg.icon;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`w-5 h-5 ${cfg.color} rounded-full flex items-center justify-center`}>
                        <IconComp className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="font-inter text-xs text-white/80">{cfg.label}</span>
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
import { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Users, Banknote, Calendar, Clock, Building2, Navigation, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAP_POINTS, TYPE_META, FILTERS } from "@/lib/mapData";

function makeIcon(color) {
  return L.divIcon({
    html: `<div style="width:26px;height:26px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
    className: "custom-map-marker",
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
}

const ICONS = {
  base: makeIcon(TYPE_META.base.color),
  object: makeIcon(TYPE_META.object.color),
  collect: makeIcon(TYPE_META.collect.color),
};

function FlyTo({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 13, { duration: 1.2 });
    }
  }, [target, map]);
  return null;
}

function MarkerPopup({ point, onApply }) {
  const meta = TYPE_META[point.type];

  return (
    <Popup minWidth={220} maxWidth={280}>
      <div className="font-inter">
        <div className="flex items-center gap-2 mb-1">
          <span className={`w-2.5 h-2.5 rounded-full ${meta.dotClass}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{meta.label}</span>
        </div>
        <h4 className="font-bold text-sm text-foreground leading-tight">{point.name}</h4>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {point.city}
        </div>

        {point.address && (
          <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3 mt-0.5 shrink-0" />
            {point.address}
          </div>
        )}

        {point.capacity && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <Users className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-foreground font-medium">{point.capacity}</span>
          </div>
        )}

        {point.team && (
          <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3 mt-0.5 shrink-0" />
            {point.team}
          </div>
        )}

        {point.salary && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <Banknote className="h-3 w-3 text-green-600 shrink-0" />
            <span className="font-bold text-green-600">{point.salary}</span>
          </div>
        )}

        {point.period && (
          <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mt-0.5 shrink-0" />
            {point.period}
          </div>
        )}

        {point.phone && (
          <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground">
            <span className="shrink-0">📞</span>
            {point.phone}
          </div>
        )}
        {point.workHours && (
          <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mt-0.5 shrink-0" />
            {point.workHours}
          </div>
        )}

        {point.info && (
          <div className="flex items-start gap-1.5 mt-2 text-xs text-muted-foreground">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            {point.info}
          </div>
        )}

        {point.works && point.works.length > 0 && (
          <div className="mt-2 pt-2 border-t border-border">
            <div className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Виды работ:</div>
            <div className="flex flex-wrap gap-1">
              {point.works.map((w) => (
                <span key={w} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-foreground">{w}</span>
              ))}
            </div>
          </div>
        )}

        {(point.type === "object" || point.type === "base") && (
          <Button
            onClick={() => onApply(point.name)}
            className="w-full mt-3 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-semibold text-xs h-8"
          >
            Подать заявку
          </Button>
        )}
      </div>
    </Popup>
  );
}

export default function InteractiveMap({ onApply }) {
  const [filter, setFilter] = useState("all");
  const [flyTarget, setFlyTarget] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  const visiblePoints = useMemo(() => {
    if (filter === "all") return MAP_POINTS;
    return MAP_POINTS.filter((p) => p.type === filter);
  }, [filter]);

  const stats = useMemo(() => ({
    bases: MAP_POINTS.filter((p) => p.type === "base").length,
    objects: MAP_POINTS.filter((p) => p.type === "object").length,
    collect: MAP_POINTS.filter((p) => p.type === "collect").length,
  }), []);

  const defaultCenter = [47.8, 38.0];
  const defaultZoom = 6;

  return (
    <section id="objects-map" className="py-24 sm:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Карта</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Интерактивная карта объектов восстановления
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Кликните на маркер, чтобы узнать больше об объекте. Выберите объект и подайте заявку за 2 минуты.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl px-5 py-3 text-center">
            <div className="font-mono font-bold text-2xl text-blue-500">{stats.bases}</div>
            <div className="font-inter text-xs text-muted-foreground">Базовых площадок</div>
          </div>
          <div className="bg-card border border-border rounded-xl px-5 py-3 text-center">
            <div className="font-mono font-bold text-2xl text-green-500">{stats.objects}</div>
            <div className="font-inter text-xs text-muted-foreground">Объектов восстановления</div>
          </div>
          <div className="bg-card border border-border rounded-xl px-5 py-3 text-center">
            <div className="font-mono font-bold text-2xl text-orange-500">{stats.collect}</div>
            <div className="font-inter text-xs text-muted-foreground">Точек сбора в РФ</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full font-inter text-sm font-semibold border-2 transition-all ${
                filter === f.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div
              className="relative rounded-2xl overflow-hidden border border-border shadow-xl"
              style={{ height: "600px" }}
            >
              {!mapReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary z-10">
                  <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" />
                </div>
              )}
              <MapContainer
                center={defaultCenter}
                zoom={defaultZoom}
                scrollWheelZoom={false}
                className="w-full h-full"
                style={{ height: "100%", width: "100%" }}
                whenReady={() => setMapReady(true)}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <FlyTo target={flyTarget} />
                {visiblePoints.map((point) => (
                  <Marker
                    key={point.id}
                    position={point.coords}
                    icon={ICONS[point.type]}
                  >
                    <MarkerPopup point={point} onApply={onApply} />
                  </Marker>
                ))}
              </MapContainer>

              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg z-[400]">
                <div className="font-inter text-xs font-bold text-foreground mb-2">Легенда:</div>
                <div className="space-y-1.5">
                  {Object.entries(TYPE_META).map(([type, meta]) => (
                    <div key={type} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${meta.dotClass}`} />
                      <span className="font-inter text-xs text-foreground">{meta.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-4 max-h-[600px] overflow-y-auto">
              <div className="font-inter font-bold text-sm text-foreground mb-3 sticky top-0 bg-card pb-2 border-b border-border">
                Объекты на карте ({visiblePoints.length})
              </div>
              <div className="space-y-2">
                {visiblePoints.map((point) => {
                  const meta = TYPE_META[point.type];
                  return (
                    <button
                      key={point.id}
                      onClick={() => setFlyTarget(point.coords)}
                      className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-secondary/60 transition-colors group"
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${meta.dotClass} mt-1 shrink-0`} />
                      <div className="min-w-0">
                        <div className="font-inter font-semibold text-xs text-foreground group-hover:text-accent transition-colors truncate">
                          {point.name}
                        </div>
                        <div className="font-inter text-[11px] text-muted-foreground truncate">
                          {point.city}
                        </div>
                        {point.salary && (
                          <div className="font-inter text-[11px] font-semibold text-green-600 mt-0.5">
                            {point.salary}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-accent/5 border-l-4 border-accent rounded-r-xl p-5">
          <h3 className="font-inter font-bold text-sm text-foreground mb-3 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-accent" />
            Как выбрать объект на карте?
          </h3>
          <ol className="space-y-1.5 font-inter text-sm text-muted-foreground list-decimal list-inside">
            <li>Выберите фильтр: «Все» или «Только объекты»</li>
            <li>Кликните на маркер на карте или выберите из списка справа</li>
            <li>В окне маркера увидите информацию и кнопку «Подать заявку»</li>
            <li>Кликните «Подать заявку» — откроется форма с выбранным объектом</li>
          </ol>
          <p className="mt-3 font-inter text-xs text-muted-foreground">
            <strong>ℹ️ Примечание:</strong> На карте — информационные материалы. Вы можете выбрать любую специальность и объект в форме заявки.
          </p>
        </div>
      </div>
    </section>
  );
}
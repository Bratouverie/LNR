import { MapPin, Clock } from "lucide-react";

const IMG_BASE = "https://media.base44.com/images/public/69f4a665db2c72a42818d397";
const REST_PHOTOS = {
  75: `${IMG_BASE}/7b100b8ee_75.png`,
  76: `${IMG_BASE}/c24319689_76.png`,
  77: `${IMG_BASE}/0307b6fd4_77.png`,
  78: `${IMG_BASE}/2f814f7bf_78.png`,
};

const CITIES = [
  {
    name: "Макеевка",
    role: "Главная база — выходные на базе",
    distance: "Ежедневный радиус работы: 10–40 км",
    amenities: ["Спортзал", "Интернет 24/7", "Телевизор", "Психолог", "Прачечная"],
    weekends: "Суббота – воскресенье (4–5 дней/мес на базе)",
    note: "База в 70–100 км от линии боевых действий — безопасная зона",
    visualId: 75,
  },
  {
    name: "Мариуполь",
    role: "Редкие выезды (1–2 раза/мес)",
    distance: "60–80 км от базы",
    amenities: ["Набережная", "Рестораны", "Музеи", "Парки"],
    weekends: "По согласованию, в выходные",
    note: "Проезд и питание — бесплатно",
    visualId: 76,
  },
  {
    name: "Луганск",
    role: "Редкие выезды (1–2 раза/мес)",
    distance: "100–120 км от базы",
    amenities: ["Театры", "Центр города", "Рестораны"],
    weekends: "По согласованию, в выходные",
    note: "Проезд и питание — бесплатно",
    visualId: 77,
  },
  {
    name: "Алчевск",
    role: "Редкие выезды (1–2 раза/мес)",
    distance: "45–60 км от базы",
    amenities: ["Парки", "Кафе", "Культурные центры"],
    weekends: "По согласованию, в выходные",
    note: "Проезд и питание — бесплатно",
    visualId: 78,
  },
];

export default function RestCities() {
  return (
    <section id="rest-cities" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Отдых</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Отдыхайте в ближайших городах во время вахты
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Выходные в городах ЛНР/ДНР — питание, жильё и проезд оплачены
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CITIES.map((city) => (
            <div key={city.name} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-colors">
              <img src={REST_PHOTOS[city.visualId]} alt={city.name} loading="lazy" className="w-full aspect-[3/2] object-cover" />

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-inter font-bold text-lg text-foreground">{city.name}</h3>
                  <div className="font-inter text-xs text-accent font-medium">{city.role}</div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span className="font-inter text-xs text-muted-foreground">{city.distance}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <span className="font-inter text-xs text-muted-foreground">{city.weekends}</span>
                </div>

                {city.note && (
                  <div className="bg-accent/5 border border-accent/20 rounded-lg px-3 py-2">
                    <span className="font-inter text-xs text-accent font-medium">{city.note}</span>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <div className="font-inter text-xs font-bold text-foreground mb-2">Инфраструктура:</div>
                  <div className="flex flex-wrap gap-1">
                    {city.amenities.map((a) => (
                      <span key={a} className="text-xs font-inter bg-secondary/60 text-muted-foreground px-2 py-0.5 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
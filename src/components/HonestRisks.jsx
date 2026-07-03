import { Shield, HeartPulse, Brain, Phone } from "lucide-react";

const IMG_BASE = "https://media.base44.com/images/public/69f4a665db2c72a42818d397";
const RISK_PHOTOS = {
  72: `${IMG_BASE}/3fe5e0f7d_72.png`,
  73: `${IMG_BASE}/6c49fa8a5_73.png`,
  74: `${IMG_BASE}/539f985d0_74.png`,
};

const RISKS = [
  {
    icon: Shield,
    title: "Риск 1: Боевые действия рядом",
    mitigation: "Географический выбор объектов, ежедневный мониторинг, эвакуация при эскалации",
    stat: "За 2 года — 0 смертей на 1 197 участников",
    visualId: 72,
  },
  {
    icon: HeartPulse,
    title: "Риск 2: Производственные травмы",
    mitigation: "ТБ инструктажи, экипировка, медпункт на базе, психолог",
    stat: "12 травм за 2 года, все вылечены и получили выплаты",
    visualId: 73,
  },
  {
    icon: Brain,
    title: "Риск 3: Психологический стресс",
    mitigation: "Психолог 24/7, контакт с семьёй (интернет), выходные в городах",
    stat: "Телефон доверия: +7 (4212) 51-59-30 доб. 704",
    visualId: 74,
  },
];

export default function HonestRisks() {
  return (
    <section id="risks" className="py-24 sm:py-32 bg-secondary/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Честно о рисках</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Да, есть риск. Вот как мы его снижаем.
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Мы не скрываем риски — мы управляем ими. Прозрачность — основа доверия.
          </p>
        </div>

        <div className="space-y-6">
          {RISKS.map((risk, i) => (
            <div key={i} className="grid md:grid-cols-3 gap-6 items-center bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition-colors">
              {/* Visual */}
              <div className="md:col-span-1">
                <img src={RISK_PHOTOS[risk.visualId]} alt={risk.title} loading="lazy" className="w-full aspect-[4/3] object-cover rounded-xl" />
              </div>

              {/* Content */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <risk.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-inter font-bold text-lg text-foreground">{risk.title}</h3>
                </div>

                <div>
                  <div className="font-inter text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Как снижаем:</div>
                  <p className="font-inter text-sm text-foreground">{risk.mitigation}</p>
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-lg px-4 py-2">
                  <div className="font-inter text-xs font-bold text-accent uppercase tracking-wider mb-0.5">Статистика:</div>
                  <p className="font-inter text-sm text-foreground">{risk.stat}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Family emergency contact */}
        <div className="mt-8 bg-primary text-primary-foreground rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6 text-accent" />
            <div>
              <div className="font-inter font-bold text-sm">Возможен выезд домой в исключительных обстоятельствах</div>
              <div className="font-inter text-xs text-white/60">За счёт работодателя, по семейным обстоятельствам</div>
            </div>
          </div>
          <a
            href="tel:+74212515930"
            className="shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            +7 (4212) 51-59-30
          </a>
        </div>
      </div>
    </section>
  );
}
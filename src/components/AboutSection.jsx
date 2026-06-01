import { Shield, Banknote, Heart, TrendingUp } from "lucide-react";

const FEATURES = [
{ icon: Shield, title: "Безопасность", desc: "Работа на освобождённых территориях ЛНР/ДНР под защитой спецподразделений ВС РФ" },
{ icon: Banknote, title: "Стабильный доход", desc: "300 000–470 000 ₽/мес + 2.5 млн подъёмных" },
{ icon: Heart, title: "Соцподдержка", desc: "Жильё, питание, медицина, соцпакет" },
{ icon: TrendingUp, title: "Карьерный рост", desc: "Обучение, сертификация, перспективы" }];


export default function AboutSection({ teamImg }) {
  return (
    <section id="about" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">О программе</span>
            <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 mb-6 tracking-tight">
              Восстанавливаем будущее — вместе
            </h2>
            <p className="text-muted-foreground font-inter leading-relaxed mb-4">
              Программа восстановления Луганской и Донецкой народных республик объединяет тысячи
              специалистов со всей России. Каждый участник вносит вклад в возвращение мирной жизни
              и комфорта жителям регионов.
            </p>
            <p className="text-muted-foreground font-inter leading-relaxed mb-4">
              Вы не просто выполняете работу — вы помогаете вернуть мирную жизнь тысячам людей.
              Все объекты расположены на освобождённых территориях ЛНР и ДНР под защитой и обеспечением безопасности специальных подразделений Вооружённых Сил РФ.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-sm font-inter font-semibold text-foreground">Города работы:</span>
              {["Мариуполь", "Макеевка", "Луганск", "Алчевск"].map((city) => (
                <span key={city} className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-full px-3 py-0.5 text-accent text-sm font-inter font-medium">
                  {city}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {FEATURES.map((f) =>
              <div
                key={f.title}
                className="group bg-card border border-border rounded-xl p-4 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
                
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                    <f.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="font-inter font-bold text-sm text-foreground">{f.title}</div>
                  <div className="font-inter text-xs text-muted-foreground mt-1">{f.desc}</div>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-accent/5 rounded-2xl -rotate-2" />
            <img
              src="https://media.base44.com/images/public/69f4a665db2c72a42818d397/08ba0707a_Professional_dynamic_lifestyle_photograph_of_const-1780315695211.png"
              alt="Команда специалистов"
              className="relative rounded-2xl w-full object-cover shadow-2xl" />
            
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-xl p-4 shadow-xl">
              <div className="font-mono font-bold text-2xl text-accent">1000+</div>
              <div className="font-inter text-xs text-primary-foreground/70">специалистов<br />уже в программе</div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection({ onOpenApplication, heroImg, mapImg }) {
  const scrollToVacancies = () => {
    const el = document.querySelector("#vacancies");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-primary" />
      <img
        src={mapImg}
        alt="Карта маршрута"
        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-lighten" />
      
      <img
        src={heroImg}
        alt="Строительная площадка"
        className="absolute inset-0 w-full h-full object-cover opacity-20" />
      
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary" />

      {/* Animated route line */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="hsl(18, 100%, 54%)" stopOpacity="0" />
              <stop offset="30%" stopColor="hsl(18, 100%, 54%)" stopOpacity="0.6" />
              <stop offset="70%" stopColor="hsl(18, 100%, 54%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(18, 100%, 54%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 1200 350 Q 900 250 600 400 Q 400 500 200 420"
            stroke="url(#routeGrad)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 6"
            className="animate-pulse" />
          
          <circle cx="1200" cy="350" r="6" fill="hsl(18, 100%, 54%)" className="animate-pulse" />
          <circle cx="200" cy="420" r="6" fill="hsl(18, 100%, 54%)" className="animate-pulse" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-white/80 text-sm font-inter">Набор специалистов открыт</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-inter font-black text-white leading-tight tracking-tight mb-6">
          Присоединяйтесь к программе<br />
          <span className="text-accent">восстановления</span>
          <br />ЛНР и ДНР
        </h1>

        <p className="text-lg sm:text-xl text-white/70 font-inter font-light max-w-2xl mx-auto mb-10 leading-relaxed">
          Работа с достойной оплатой, в безопасных условиях и с полной социальной поддержкой
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            onClick={onOpenApplication}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold text-base px-8 py-6 rounded-lg shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105">
            
            Оставить заявку
          </Button>
          <Button
            onClick={scrollToVacancies}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10 font-inter font-medium text-base px-8 py-6 rounded-lg">
            
            Узнать подробности
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-accent">500К</div>
            <div className="text-xs sm:text-sm text-white/50 font-inter mt-1">подъёмные, ₽</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white">260К</div>
            <div className="text-xs sm:text-sm text-white/50 font-inter mt-1">в месяц, до ₽</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-accent">9</div>
            <div className="text-xs sm:text-sm text-white/50 font-inter mt-1">вакансий</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/40" />
      </div>
    </section>);

}
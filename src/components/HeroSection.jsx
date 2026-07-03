import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ShieldCheck, Banknote, Award, Volume2, VolumeX, Loader2 } from "lucide-react";
import { GLOBAL_CONFIG, getAverageTotalIncome, formatCurrency } from "@/data/vacanciesConfig";

const PROMO_VIDEO = "https://media.base44.com/videos/public/69f4a665db2c72a42818d397/6d5cbf847_Promo_new_GL.mp4";

export default function HeroSection({ onOpenApplication }) {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const scrollToVacancies = () => {
    const el = document.querySelector("#vacancies");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCalculator = () => {
    const el = document.querySelector("#calculator");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const columns = [
  {
    icon: Banknote,
    title: "Доход",
    value: formatCurrency(getAverageTotalIncome()),
    desc: `средний доход за ${GLOBAL_CONFIG.compensation.stintDuration} месяца (подъёмные + зарплата)`
  },
  {
    icon: ShieldCheck,
    title: "Гарантии",
    value: formatCurrency(GLOBAL_CONFIG.compensation.oneTimePayment),
    desc: "подъёмные при подписании договора, без налогов"
  },
  {
    icon: Award,
    title: "Значимость",
    value: GLOBAL_CONFIG.program.totalSpecialists.toLocaleString("ru-RU"),
    desc: "специалистов уже восстановили ЛНР и ДНР"
  }];


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setVideoLoaded(true)}
        onWaiting={() => setVideoLoaded(false)}
        onPlaying={() => setVideoLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover">
        
        <source src={`${PROMO_VIDEO}#t=0.1`} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary" />

      {/* Loading indicator */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary z-[5]">
          <Loader2 className="h-10 w-10 text-white/60 animate-spin" />
        </div>
      )}

      {/* Sound toggle */}
      <button
        onClick={toggleSound}
        className="absolute top-20 right-4 sm:right-6 z-20 flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors"
        title={isMuted ? "Включить звук" : "Выключить звук"}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 text-white/80" />
        ) : (
          <Volume2 className="h-5 w-5 text-white/80" />
        )}
      </button>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-white/80 text-sm font-inter">Набор специалистов открыт · Вахта запускается в июле</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-inter font-black text-white leading-tight tracking-tight mb-6">
          Работа на восстановлении<br />
          <span className="text-accent">ЛНР и ДНР</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/70 font-inter font-light max-w-2xl mx-auto mb-6 leading-relaxed">
          Достойная оплата, безопасные условия и полная социальная поддержка
        </p>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-10">
          {GLOBAL_CONFIG.program.locations.map((city) =>
          <span key={city} className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-white/80 text-sm font-inter">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              {city}
            </span>
          )}
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-12">
          {columns.map((col) =>
          <div key={col.title} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <col.icon className="h-6 w-6 text-accent mx-auto mb-3" />
              <div className="text-xs sm:text-sm text-white/60 font-inter font-medium uppercase tracking-wider mb-2">{col.title}</div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-white mb-2">{col.value}</div>
              <div className="text-xs text-white/50 font-inter leading-snug">{col.desc}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Button
            onClick={onOpenApplication}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold text-base px-8 py-6 rounded-lg shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:shadow-accent/30 hover:scale-105 animate-pulse">
            
            Оставить заявку за 2 минуты
          </Button>
          <Button
            onClick={scrollToCalculator}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10 font-inter font-medium text-base px-8 py-6 rounded-lg">
            
            Рассчитать доход
          </Button>
        </div>

        <button
          onClick={scrollToVacancies}
          className="text-white/50 hover:text-white/80 font-inter text-sm transition-colors">
          
          Посмотреть вакансии →
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/40" />
      </div>
    </section>);

}
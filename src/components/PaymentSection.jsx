import { useEffect, useRef, useState } from "react";
import { CheckCircle, TrendingUp, FileText, Award } from "lucide-react";

function AnimatedCounter({ target, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          let start = 0;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-mono font-bold">
      {prefix}{count.toLocaleString("ru-RU")}{suffix}
    </span>
  );
}

export default function PaymentSection() {
  return (
    <section id="payment" className="py-24 sm:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Оплата труда</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black mt-3 tracking-tight">
            Финансовые условия
          </h2>
        </div>

        {/* Split Screen Ledger */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Left - Big Number */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="text-sm text-white/50 font-inter mb-2">Единовременная выплата</div>
            <div className="text-5xl sm:text-6xl lg:text-7xl text-accent">
              <AnimatedCounter target={2500000} prefix="" suffix=" ₽" />
            </div>
            <div className="text-white/50 font-inter text-sm mt-3">
              при подписании контракта
            </div>
          </div>

          {/* Right - Monthly + Annual */}
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="text-sm text-white/50 font-inter mb-2">Ежемесячная зарплата</div>
              <div className="text-3xl sm:text-4xl text-white font-mono font-bold">
                300 000 – 470 000 ₽
              </div>
              <div className="text-white/40 font-inter text-sm mt-2">
                в зависимости от специализации и квалификации
              </div>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 sm:p-8">
              <div className="text-sm text-accent font-inter font-semibold mb-2">Итого за год вахты</div>
              <div className="text-3xl sm:text-4xl text-accent">
                <AnimatedCounter target={6100000} suffix="" prefix="" />
                <span className="text-2xl sm:text-3xl"> – </span>
                <AnimatedCounter target={8140000} suffix=" ₽" prefix="" />
              </div>
              <div className="text-white/40 font-inter text-sm mt-2">
                включая единовременную выплату + 12 ежемесячных
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Example */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 mb-12">
          <h3 className="font-inter font-bold text-lg mb-6 text-white">Пример расчёта (средний уровень)</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-xs text-white/40 font-inter mb-1">1-й месяц</div>
              <div className="font-mono font-bold text-xl text-white">2 885 000 ₽</div>
              <div className="text-xs text-white/40 font-inter mt-1">2 500К + 385К зарплата</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-xs text-white/40 font-inter mb-1">2–12 месяцы</div>
              <div className="font-mono font-bold text-xl text-white">4 235 000 ₽</div>
              <div className="text-xs text-white/40 font-inter mt-1">385К × 11 месяцев</div>
            </div>
            <div className="bg-accent/20 rounded-xl p-4 text-center border border-accent/30">
              <div className="text-xs text-accent font-inter font-semibold mb-1">Итого за год</div>
              <div className="font-mono font-bold text-xl text-accent">7 120 000 ₽</div>
              <div className="text-xs text-white/40 font-inter mt-1">при средних показателях</div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: CheckCircle, text: "Гарантированные выплаты" },
            { icon: FileText, text: "Прозрачные расчёты" },
            { icon: Award, text: "Премии за достижения" },
            { icon: TrendingUp, text: "Выше рынка" },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
              <f.icon className="h-5 w-5 text-accent shrink-0" />
              <span className="text-sm font-inter text-white/80">{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { GLOBAL_CONFIG } from "@/data/vacanciesConfig";

export default function VacancyHero({ vacancy }) {
  const salaryMin = vacancy.salary?.type === "by-category"
    ? vacancy.salary.min
    : vacancy.salary?.min;
  const salaryMax = vacancy.salary?.type === "by-category"
    ? vacancy.salary.max
    : vacancy.salary?.max;

  return (
    <section className="relative py-16 bg-secondary/50 overflow-hidden border-b border-border">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(18,100,54,0.06) 0%, transparent 70%)" }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-6 mb-8"
        >
          <div className="text-5xl">{vacancy.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold text-accent uppercase tracking-widest">
                {vacancy.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                Вахта {GLOBAL_CONFIG.compensation.stintDuration} месяца
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-inter font-black text-foreground tracking-tight mb-3">
              {vacancy.position}
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground font-inter max-w-2xl leading-relaxed">
              {vacancy.fullDescription || vacancy.role}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground font-inter uppercase mb-1">Зарплата в месяц</div>
            <div className="text-lg lg:text-xl font-mono font-black text-accent">
              {salaryMin?.toLocaleString("ru-RU")} – {salaryMax?.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground font-inter uppercase mb-1">Подъёмные</div>
            <div className="text-lg lg:text-xl font-mono font-black text-primary">
              {GLOBAL_CONFIG.compensation.oneTimePayment.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground font-inter uppercase mb-1">Вахта</div>
            <div className="text-lg lg:text-xl font-mono font-black text-foreground">
              {GLOBAL_CONFIG.compensation.stintDuration} месяца
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs text-muted-foreground font-inter uppercase mb-1">Проживание</div>
            <div className="text-base lg:text-lg font-mono font-bold text-foreground">Бесплатно</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
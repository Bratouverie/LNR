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
    <section className="relative py-16 bg-gradient-to-b from-[#0D1B3E] to-[#05070A] overflow-hidden border-b border-[#7B3FBF]/20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(123,63,191,0.08) 0%, transparent 70%)" }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-6 mb-8"
        >
          <div className="text-6xl">{vacancy.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm font-bold text-[#C9A84C] uppercase tracking-widest">
                {vacancy.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#7B3FBF]/20 text-[#7B3FBF]">
                Вахта {GLOBAL_CONFIG.compensation.stintDuration} месяца
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#F8FAFC] tracking-tight mb-3">
              {vacancy.position}
            </h1>
            <p className="text-lg text-[#F8FAFC]/70 max-w-2xl leading-relaxed">
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
          <div className="glass-card rounded-xl p-4">
            <div className="text-xs text-[#C9A84C]/70 uppercase mb-1">Зарплата в месяц</div>
            <div className="text-xl font-black text-[#C9A84C]">
              {salaryMin?.toLocaleString("ru-RU")} – {salaryMax?.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-xs text-[#C9A84C]/70 uppercase mb-1">Подъёмные</div>
            <div className="text-xl font-black text-[#7B3FBF]">
              {GLOBAL_CONFIG.compensation.oneTimePayment.toLocaleString("ru-RU")} ₽
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-xs text-[#C9A84C]/70 uppercase mb-1">Вахта</div>
            <div className="text-xl font-black text-[#F8FAFC]">
              {GLOBAL_CONFIG.compensation.stintDuration} месяца
            </div>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="text-xs text-[#C9A84C]/70 uppercase mb-1">Проживание</div>
            <div className="text-lg font-bold text-[#F8FAFC]">Бесплатно</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
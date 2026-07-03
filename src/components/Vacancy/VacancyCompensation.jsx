import { motion } from "framer-motion";
import { GLOBAL_CONFIG } from "@/data/vacanciesConfig";

export default function VacancyCompensation({ vacancy }) {
  const compensation = vacancy.compensation;
  if (!compensation) return null;

  const totalForStint = (compensation.salary?.baseSalary * GLOBAL_CONFIG.compensation.stintDuration) + GLOBAL_CONFIG.compensation.oneTimePayment;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-secondary/60 border border-accent/20 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-inter font-black text-foreground mb-6">💰 Заработная плата</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground font-inter mb-2">Ежемесячный оклад</p>
            <p className="text-xl lg:text-2xl font-mono font-black text-accent">
              {compensation.salary?.baseSalary?.toLocaleString("ru-RU")} – {compensation.salary?.maxSalary?.toLocaleString("ru-RU")} ₽
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground font-inter mb-2">Единовременно (подъёмные)</p>
            <p className="text-xl lg:text-2xl font-mono font-black text-primary">
              {GLOBAL_CONFIG.compensation.oneTimePayment.toLocaleString("ru-RU")} ₽
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground font-inter mb-2">За всю вахту (3 месяца)</p>
            <p className="text-lg lg:text-xl font-mono font-black text-accent">
              {totalForStint.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
        {compensation.salary?.note && (
          <p className="text-sm text-muted-foreground font-inter italic bg-accent/10 p-3 rounded-lg">
            {compensation.salary.note}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-inter font-black text-foreground mb-6">🎁 Дополнительные выплаты и бонусы</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-accent mb-4 font-inter">✨ Бонусы:</h4>
            <ul className="space-y-3">
              {(vacancy.career?.bonuses || []).map((bonus, idx) => (
                <li key={idx} className="flex gap-3 text-muted-foreground font-inter">
                  <span className="text-accent flex-shrink-0">💵</span>
                  <span>{bonus}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-primary mb-4 font-inter">📦 Включено в пакет:</h4>
            <ul className="space-y-3">
              {(compensation.benefits || []).map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-muted-foreground font-inter">
                  <span className="text-primary flex-shrink-0">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
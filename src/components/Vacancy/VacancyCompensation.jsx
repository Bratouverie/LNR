import { motion } from "framer-motion";
import { GLOBAL_CONFIG } from "@/data/vacanciesConfig";

export default function VacancyCompensation({ vacancy }) {
  const compensation = vacancy.compensation;
  if (!compensation) return null;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-gold rounded-2xl p-8"
      >
        <h3 className="text-2xl font-black text-[#F8FAFC] mb-6">💰 Заработная плата</h3>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#05070A]/50 rounded-xl p-5">
            <p className="text-sm text-[#F8FAFC]/60 mb-2">Ежемесячный оклад</p>
            <p className="text-2xl font-black text-[#C9A84C]">
              {compensation.salary?.baseSalary?.toLocaleString("ru-RU")} – {compensation.salary?.maxSalary?.toLocaleString("ru-RU")} ₽
            </p>
          </div>
          <div className="bg-[#05070A]/50 rounded-xl p-5">
            <p className="text-sm text-[#F8FAFC]/60 mb-2">Единовременно (подъёмные)</p>
            <p className="text-2xl font-black text-[#7B3FBF]">
              {GLOBAL_CONFIG.compensation.oneTimePayment.toLocaleString("ru-RU")} ₽
            </p>
          </div>
          <div className="bg-[#05070A]/50 rounded-xl p-5">
            <p className="text-sm text-[#F8FAFC]/60 mb-2">За всю вахту (3 месяца)</p>
            <p className="text-xl font-black text-[#C9A84C]">
              {((compensation.salary?.baseSalary * GLOBAL_CONFIG.compensation.stintDuration) + GLOBAL_CONFIG.compensation.oneTimePayment).toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>
        {compensation.salary?.note && (
          <p className="text-sm text-[#F8FAFC]/60 italic bg-[#C9A84C]/10 p-3 rounded-lg">
            {compensation.salary.note}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-8"
      >
        <h3 className="text-2xl font-black text-[#F8FAFC] mb-6">🎁 Дополнительные выплаты и бонусы</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-[#C9A84C] mb-4">✨ Бонусы:</h4>
            <ul className="space-y-3">
              {(vacancy.career?.bonuses || []).map((bonus, idx) => (
                <li key={idx} className="flex gap-3 text-[#F8FAFC]/70">
                  <span className="text-[#C9A84C] flex-shrink-0">💵</span>
                  <span>{bonus}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#7B3FBF] mb-4">📦 Включено в пакет:</h4>
            <ul className="space-y-3">
              {(compensation.benefits || []).map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-[#F8FAFC]/70">
                  <span className="text-[#7B3FBF] flex-shrink-0">✓</span>
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
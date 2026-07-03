import { motion } from "framer-motion";

export default function VacancyCareer({ vacancy }) {
  const career = vacancy.career;
  if (!career) return null;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8 border-l-4 border-[#7B3FBF]"
      >
        <h3 className="text-2xl font-black text-[#F8FAFC] mb-6">📈 Карьерный рост</h3>
        <ul className="space-y-3">
          {(career.growth || []).map((item, idx) => (
            <li key={idx} className="flex gap-4 text-[#F8FAFC]/70">
              <span className="text-2xl flex-shrink-0">📊</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-gold rounded-2xl p-8"
      >
        <h3 className="text-2xl font-black text-[#F8FAFC] mb-6">🎁 Социальные льготы и привилегии</h3>
        <ul className="space-y-3">
          {(career.benefits || []).map((benefit, idx) => (
            <li key={idx} className="flex gap-4 text-[#F8FAFC]/70">
              <span className="text-2xl flex-shrink-0">⭐</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 p-4 bg-[#05070A]/50 rounded-lg border border-[#C9A84C]/20">
          <p className="text-sm text-[#F8FAFC]/60">
            <span className="font-bold text-[#C9A84C]">ℹ️ Информация:</span> Все льготы и привилегии предоставляются в соответствии с трудовым законодательством Российской Федерации.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
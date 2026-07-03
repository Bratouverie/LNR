import { motion } from "framer-motion";

export default function VacancyCareer({ vacancy }) {
  const career = vacancy.career;
  if (!career) return null;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 sm:p-8 border-l-4 border-primary"
      >
        <h3 className="text-xl sm:text-2xl font-inter font-black text-foreground mb-6">📈 Карьерный рост</h3>
        <ul className="space-y-3">
          {(career.growth || []).map((item, idx) => (
            <li key={idx} className="flex gap-4 text-muted-foreground font-inter">
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
        className="bg-secondary/60 border border-accent/20 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-inter font-black text-foreground mb-6">🎁 Социальные льготы и привилегии</h3>
        <ul className="space-y-3">
          {(career.benefits || []).map((benefit, idx) => (
            <li key={idx} className="flex gap-4 text-muted-foreground font-inter">
              <span className="text-2xl flex-shrink-0">⭐</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 p-4 bg-card border border-border rounded-lg">
          <p className="text-sm text-muted-foreground font-inter">
            <span className="font-bold text-accent">ℹ️ Информация:</span> Все льготы и привилегии предоставляются в соответствии с трудовым законодательством Российской Федерации.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
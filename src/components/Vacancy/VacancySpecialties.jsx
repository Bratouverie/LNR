import { motion } from "framer-motion";

export default function VacancySpecialties({ vacancy }) {
  const specialties = vacancy.specialties || [];

  if (specialties.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-[#F8FAFC]/60">
        <p>Специальности не указаны</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-8">
        <h2 className="text-2xl font-black text-[#F8FAFC] mb-6">
          {specialties.length} {specialties.length === 1 ? "специальность" : "специальностей"} в этой категории
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {specialties.map((spec, idx) => (
            <motion.div
              key={spec.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card-gold rounded-xl p-5 border border-[#C9A84C]/20"
            >
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">{spec.name}</h3>
              <p className="text-sm text-[#F8FAFC]/70 mb-4">{spec.description}</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#F8FAFC]/60">Минимум опыта:</span>
                  <span className="text-sm font-bold text-[#C9A84C]">{spec.minExperience}</span>
                </div>
                {spec.salary && (
                  <div className="flex justify-between pt-2 border-t border-[#C9A84C]/20">
                    <span className="text-sm text-[#F8FAFC]/60">Зарплата в месяц:</span>
                    <span className="text-sm font-black text-[#7B3FBF]">
                      {spec.salary.min?.toLocaleString("ru-RU")} – {spec.salary.max?.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                )}
                {spec.requirements && (
                  <div className="pt-2 border-t border-[#C9A84C]/20">
                    <div className="text-xs text-[#F8FAFC]/60 mb-1">Требования:</div>
                    <ul className="space-y-1">
                      {spec.requirements.map((req, i) => (
                        <li key={i} className="flex gap-2 text-xs text-[#F8FAFC]/70">
                          <span className="text-[#C9A84C] shrink-0">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
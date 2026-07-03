import { motion } from "framer-motion";

export default function VacancyResponsibilities({ vacancy }) {
  const responsibilities = vacancy.responsibilities;
  if (!responsibilities) return null;

  const sections = [
    { title: "📌 Основные задачи", items: responsibilities.mainTasks, color: "#C9A84C" },
    { title: "🛡️ Требования безопасности", items: responsibilities.safety, color: "#FF6B6B" },
    { title: "🌍 Условия работы", items: responsibilities.workingConditions, color: "#4ECDC4" },
  ].filter((s) => s.items);

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIdx) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIdx * 0.1 }}
          className="glass-card rounded-2xl p-8 border-l-4"
          style={{ borderLeftColor: section.color }}
        >
          <h3 className="text-2xl font-black mb-6" style={{ color: section.color }}>
            {section.title}
          </h3>
          <ul className="space-y-3">
            {section.items.map((item, idx) => (
              <li key={idx} className="flex gap-4 text-[#F8FAFC]/70">
                <span className="text-xl flex-shrink-0" style={{ color: section.color }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}

      {vacancy.workingPlace && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card-gold rounded-2xl p-8"
        >
          <h3 className="text-2xl font-black text-[#F8FAFC] mb-4">📍 Место работы</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-[#F8FAFC]/60 mb-1">Города и населённые пункты:</p>
              <p className="text-lg font-bold text-[#C9A84C]">
                {vacancy.workingPlace.locations?.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#F8FAFC]/60 mb-1">Описание:</p>
              <p className="text-[#F8FAFC]/80">{vacancy.workingPlace.description}</p>
            </div>
            {vacancy.workingPlace.assignment && (
              <div className="pt-3 border-t border-[#C9A84C]/30">
                <p className="text-sm text-[#F8FAFC]/60 mb-1">Назначение:</p>
                <p className="text-[#F8FAFC]/80">{vacancy.workingPlace.assignment}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
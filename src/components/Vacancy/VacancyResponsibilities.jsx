import { motion } from "framer-motion";

const SECTION_COLORS = {
  accent: "var(--accent)",
  destructive: "hsl(var(--destructive))",
  primary: "hsl(var(--primary))",
};

export default function VacancyResponsibilities({ vacancy }) {
  const responsibilities = vacancy.responsibilities;
  if (!responsibilities) return null;

  const sections = [
    { title: "📌 Основные задачи", items: responsibilities.mainTasks, colorKey: "accent" },
    { title: "🛡️ Требования безопасности", items: responsibilities.safety, colorKey: "destructive" },
    { title: "🌍 Условия работы", items: responsibilities.workingConditions, colorKey: "primary" },
  ].filter((s) => s.items);

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIdx) => {
        const color = SECTION_COLORS[section.colorKey];
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIdx * 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 sm:p-8 border-l-4"
            style={{ borderLeftColor: color }}
          >
            <h3 className="text-xl sm:text-2xl font-inter font-black mb-6" style={{ color }}>
              {section.title}
            </h3>
            <ul className="space-y-3">
              {section.items.map((item, idx) => (
                <li key={idx} className="flex gap-4 text-muted-foreground font-inter">
                  <span className="text-xl flex-shrink-0" style={{ color }}>✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        );
      })}

      {vacancy.workingPlace && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/60 border border-accent/20 rounded-2xl p-6 sm:p-8"
        >
          <h3 className="text-xl sm:text-2xl font-inter font-black text-foreground mb-4">📍 Место работы</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground font-inter mb-1">Города и населённые пункты:</p>
              <p className="text-lg font-bold text-accent font-inter">
                {vacancy.workingPlace.locations?.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-inter mb-1">Описание:</p>
              <p className="text-foreground/80 font-inter">{vacancy.workingPlace.description}</p>
            </div>
            {vacancy.workingPlace.assignment && (
              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground font-inter mb-1">Назначение:</p>
                <p className="text-foreground/80 font-inter">{vacancy.workingPlace.assignment}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
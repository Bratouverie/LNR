import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { GROUPS } from "@/data/positionCatalog";
import { readCachedPositions } from "@/data/positionsFeed";

export default function VacancySpecialties({ vacancy }) {
  const specialties = vacancy.specialties || [];

  /* «Строитель» убран, вложенных специальностей у должностей справочника нет.
   * Вместо пустой вкладки показываем родственные должности той же группы —
   * это и есть вложенность, о которой говорил Мастер (24.11.2026). */
  if (specialties.length === 0) {
    const g = GROUPS.find((x) => x.name === vacancy.category);
    const siblings = g
      ? readCachedPositions().filter((p) => p.group === g.code && p.code !== vacancy.id).slice(0, 8)
      : [];
    if (siblings.length === 0) return null;
    return (
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <h3 className="font-inter font-bold text-lg text-foreground mb-1">
          Рядом в группе «{g.name}»
        </h3>
        <p className="text-muted-foreground font-inter text-sm mb-5">
          Родственные должности с окладами. Если не подходит эта — посмотрите соседние.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {siblings.map((p) => (
            <Link
              key={p.code}
              to={`/vacancy/${p.code}`}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-secondary border border-border hover:border-accent/50 transition-all"
            >
              <span className="font-inter text-sm text-foreground">{p.title}</span>
              <span className="font-mono text-xs text-accent shrink-0">
                {Number(p.min).toLocaleString("ru-RU")} ₽
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (specialties.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
        <p>Специальности не указаны</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-inter font-black text-foreground mb-6">
          {specialties.length} {specialties.length === 1 ? "специальность" : "специальностей"} в этой категории
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {specialties.map((spec, idx) => (
            <motion.div
              key={spec.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-secondary/60 border border-accent/20 rounded-xl p-5"
            >
              <h3 className="text-lg font-inter font-bold text-foreground mb-2">{spec.name}</h3>
              <p className="text-sm text-muted-foreground font-inter mb-4">{spec.description}</p>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground font-inter">Минимум опыта:</span>
                  <span className="text-sm font-bold text-accent">{spec.minExperience}</span>
                </div>
                {spec.salary && (
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground font-inter">Зарплата в месяц:</span>
                    <span className="text-sm font-mono font-black text-primary">
                      {spec.salary.min?.toLocaleString("ru-RU")} – {spec.salary.max?.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                )}
                {spec.requirements && (
                  <div className="pt-2 border-t border-border">
                    <div className="text-xs text-muted-foreground font-inter mb-1">Требования:</div>
                    <ul className="space-y-1">
                      {spec.requirements.map((req, i) => (
                        <li key={i} className="flex gap-2 text-xs text-muted-foreground font-inter">
                          <span className="text-accent shrink-0">•</span>
                          <span>{req}</span>
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
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import VacancyCard from "./VacancyCard";
import { loadPositionsFeed, readCachedPositions } from "@/data/positionsFeed";
import { hotProfiles, restByGroup, vacancyFromProfile } from "@/data/positionCatalog";

/**
 * ВАКАНСИИ НА ГЛАВНОМ ЭКРАНЕ (слово Мастера 24.11.2026).
 *
 * Правило экрана: шесть ходовых должностей — плитками, остальные не выброшены,
 * а спрятаны за кнопкой «Ещё N должностей» и разложены по родственным группам.
 * Сорок плиток подряд человек не читает, шесть — читает.
 *
 * Источник — справочник СРМ через одну дверь. Своего списка должностей у
 * экрана нет: добавили должность в СРМ, она появилась здесь сама.
 */
export default function VacanciesSection({ onApply, onCalculate }) {
  const [list, setList] = useState(() => readCachedPositions());
  const [openAll, setOpenAll] = useState(false);

  useEffect(() => {
    let alive = true;
    loadPositionsFeed().then((fresh) => {
      if (alive && fresh && fresh.length) setList(fresh);
    });
    return () => { alive = false; };
  }, []);

  const hot = hotProfiles(list);
  const rest = restByGroup(list);
  const restCount = rest.reduce((n, g) => n + g.items.length, 0);

  return (
    <section id="vacancies" className="py-16 sm:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent font-mono text-xs font-semibold uppercase tracking-wider mb-4">
            Вакансии
          </div>
          <h2 className="font-inter font-black text-3xl sm:text-4xl text-foreground mb-3">
            Выберите специальность
          </h2>
          <p className="text-muted-foreground font-inter max-w-2xl mx-auto">
            {list.length > 0
              ? `${list.length} должностей на восстановлении ЛНР и ДНР. Здесь — шесть самых востребованных, остальные открываются одной кнопкой.`
              : "Подбираем список должностей с окладами…"}
          </p>
        </motion.div>

        {hot.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-card border-2 border-border animate-pulse" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hot.map((p, i) => (
            <motion.div
              key={p.code}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <VacancyCard
                vacancy={vacancyFromProfile(p)}
                onApply={onApply}
                onCalculate={onCalculate}
              />
            </motion.div>
          ))}
        </div>

        {restCount > 0 && (
          <div className="mt-10">
            <div className="text-center">
              <button
                onClick={() => setOpenAll((v) => !v)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border-2 border-border hover:border-accent/50 text-foreground font-inter font-semibold transition-all"
              >
                {openAll ? (
                  <>Свернуть список <ChevronUp className="h-4 w-4 text-accent" /></>
                ) : (
                  <>Ещё {restCount} должностей <ChevronDown className="h-4 w-4 text-accent" /></>
                )}
              </button>
            </div>

            {openAll && (
              <div className="mt-10 space-y-12">
                {rest.map(({ group, items }) => (
                  <div key={group.code}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-2xl">{group.icon}</span>
                      <h3 className="font-inter font-bold text-xl text-foreground">{group.name}</h3>
                      <span className="text-xs font-mono text-muted-foreground">{items.length}</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {items.map((p) => (
                        <VacancyCard
                          key={p.code}
                          vacancy={vacancyFromProfile(p)}
                          onApply={onApply}
                          onCalculate={onCalculate}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

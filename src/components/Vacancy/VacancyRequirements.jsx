import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function VacancyRequirements({ vacancy }) {
  const requirements = vacancy.pageRequirements || {};
  const [expandedSection, setExpandedSection] = useState("education");

  const sections = [
    { id: "education", title: "🎓 Образование", data: requirements.education },
    { id: "experience", title: "⏱️ Опыт работы", data: requirements.experience },
    { id: "skills", title: "🛠️ Профессиональные навыки", data: requirements.skills },
    { id: "licenses", title: "📋 Допуски и сертификаты", data: requirements.licenses },
    { id: "age", title: "👤 Возраст", data: requirements.age },
    { id: "health", title: "🏥 Медицинские требования", data: requirements.health },
    { id: "personal", title: "⭐ Личные качества", data: requirements.personal },
  ].filter((s) => s.data);

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <RequirementSection
          key={section.id}
          section={section}
          isExpanded={expandedSection === section.id}
          onToggle={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
        />
      ))}
    </div>
  );
}

function RequirementSection({ section, isExpanded, onToggle }) {
  const { title, data } = section;

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#7B3FBF]/10 transition-colors"
      >
        <h3 className="text-lg font-bold text-[#F8FAFC]">{title}</h3>
        <ChevronDown
          size={24}
          className={`text-[#C9A84C] transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden border-t border-[#7B3FBF]/20"
      >
        <div className="px-6 py-4 space-y-3">
          {data.items && (
            <ul className="space-y-2">
              {data.items.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-[#F8FAFC]/70">
                  <span className="text-[#C9A84C] flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
          {data.min !== undefined && (
            <div className="space-y-2">
              <p className="text-sm text-[#F8FAFC]/70">
                <span className="font-bold text-[#F8FAFC]">От {data.min} до {data.max} лет</span>
              </p>
              {data.note && <p className="text-sm text-[#F8FAFC]/50 italic">{data.note}</p>}
            </div>
          )}
          {data.mustHave && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#C9A84C] mb-2">✅ Обязательно иметь:</h4>
                <ul className="space-y-2">
                  {data.mustHave.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-[#F8FAFC]/70">
                      <span className="text-[#7B3FBF]">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              {data.prohibited && data.prohibited.length > 0 && (
                <div>
                  <h4 className="font-bold text-red-400 mb-2">⛔ Противопоказания:</h4>
                  <ul className="space-y-2">
                    {data.prohibited.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-[#F8FAFC]/70">
                        <span className="text-red-400">✗</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.note && (
                <p className="text-sm text-[#F8FAFC]/50 italic bg-[#7B3FBF]/10 p-3 rounded-lg">
                  {data.note}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
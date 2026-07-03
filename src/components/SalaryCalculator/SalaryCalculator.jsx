import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useCalculatorState } from "./useCalculatorState";
import { getCommonBenefits, GLOBAL_CONFIG } from "@/data/vacanciesConfig";

export default function SalaryCalculator({ preselectedPosition, initialVacancy, onApply }) {
  const effectiveInitial = preselectedPosition || initialVacancy || "raznorabochiy";
  const {
    selectedVacancyId,
    selectedLevel,
    selectedDriverCategory,
    vacancy,
    isDriver,
    salary,
    allVacancies,
    handleVacancyChange,
    handleLevelChange,
    handleDriverCategoryChange,
  } = useCalculatorState(effectiveInitial);

  const benefits = getCommonBenefits();

  if (!salary || !vacancy) return null;

  const handleApply = () => {
    if (onApply) {
      const label = isDriver && selectedDriverCategory
        ? `${vacancy.position} (кат. ${selectedDriverCategory})`
        : vacancy.position;
      onApply(label);
    } else {
      document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const levelMin = isDriver && selectedDriverCategory
    ? vacancy.salary.categories[selectedDriverCategory]?.min
    : vacancy.salary.min;
  const levelMax = isDriver && selectedDriverCategory
    ? vacancy.salary.categories[selectedDriverCategory]?.max
    : vacancy.salary.max;

  return (
    <section id="calculator" className="relative py-20 bg-[#05070A] overflow-hidden scroll-mt-20">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(123,63,191,0.08) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px flex-1 max-w-[60px] bg-[#C9A84C]/40" />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C]">
              💰 Рассчитайте вашу зарплату
            </span>
            <span className="h-px flex-1 max-w-[60px] bg-[#C9A84C]/40" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-[#F8FAFC] mb-4">
            Калькулятор<br />
            <span className="text-[#C9A84C]">зарплаты и выплат</span>
          </h2>
          <p className="text-[#F8FAFC]/55 max-w-2xl mx-auto">
            Выберите должность и узнайте вашу полную компенсацию за {GLOBAL_CONFIG.compensation.stintDuration} месяца работы на вахте
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24 space-y-6">
              <div>
                <label className="block text-[#C9A84C] font-bold text-sm mb-3 uppercase tracking-wide">
                  1️⃣ Выберите должность
                </label>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allVacancies.map((vac) => (
                    <button
                      key={vac.id}
                      onClick={() => handleVacancyChange(vac.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                        selectedVacancyId === vac.id
                          ? "bg-[#7B3FBF] text-white font-semibold shadow-lg shadow-[#7B3FBF]/30"
                          : "bg-[#0D1B3E] border border-[#7B3FBF]/30 text-[#F8FAFC] hover:border-[#7B3FBF]/60 hover:bg-[#0D1B3E]/80"
                      }`}
                    >
                      <span className="text-xl">{vac.icon}</span>
                      <span>{vac.position}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#C9A84C] font-bold text-sm mb-3 uppercase tracking-wide">
                  2️⃣ Уровень оклада
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["min", "max"].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelChange(level)}
                      className={`py-2.5 rounded-lg font-semibold transition-all text-sm ${
                        selectedLevel === level
                          ? "bg-[#C9A84C] text-[#05070A] shadow-lg shadow-[#C9A84C]/30"
                          : "bg-[#0D1B3E] border border-[#C9A84C]/30 text-[#C9A84C] hover:border-[#C9A84C]/60"
                      }`}
                    >
                      {level === "min"
                        ? `От ${levelMin?.toLocaleString("ru-RU") || "?"} ₽`
                        : `До ${levelMax?.toLocaleString("ru-RU") || "?"} ₽`}
                    </button>
                  ))}
                </div>
              </div>

              {isDriver && (
                <div className="pt-4 border-t border-[#7B3FBF]/20">
                  <label className="block text-[#C9A84C] font-bold text-sm mb-3 uppercase tracking-wide">
                    3️⃣ Категория прав
                  </label>
                  <div className="space-y-2">
                    {Object.keys(vacancy.salary.categories).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleDriverCategoryChange(cat)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                          selectedDriverCategory === cat
                            ? "bg-[#C9A84C] text-[#05070A] font-semibold shadow-lg shadow-[#C9A84C]/30"
                            : "bg-[#0D1B3E] border border-[#C9A84C]/30 text-[#C9A84C] hover:border-[#C9A84C]/60"
                        }`}
                      >
                        <span className="font-bold block mb-0.5">{cat}</span>
                        <span className="text-xs opacity-70">{vacancy.salary.categories[cat].description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card-gold rounded-2xl p-8">
              <div className="mb-8">
                <div className="text-sm text-[#C9A84C]/70 uppercase tracking-wide font-semibold">
                  📋 Выбранная должность
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-[#F8FAFC] mt-2">
                  {vacancy.position}
                  {isDriver && selectedDriverCategory && (
                    <span className="text-[#C9A84C]"> (кат. {selectedDriverCategory})</span>
                  )}
                </h3>
                <p className="text-sm text-[#F8FAFC]/60 mt-3 leading-relaxed">{vacancy.role}</p>
              </div>

              <div className="space-y-4 mt-8 pt-8 border-t border-[#C9A84C]/30">
                <div className="flex items-baseline justify-between pb-4 border-b border-[#C9A84C]/20 hover:bg-[#C9A84C]/5 px-4 py-2 rounded transition-colors">
                  <span className="text-[#F8FAFC]/70 font-medium">📊 Ежемесячный оклад:</span>
                  <span className="text-3xl font-black text-[#F8FAFC]">{salary.monthlySalaryFormatted}</span>
                </div>

                <div className="flex items-baseline justify-between pb-4 border-b border-[#C9A84C]/20 hover:bg-[#C9A84C]/5 px-4 py-2 rounded transition-colors">
                  <span className="text-[#F8FAFC]/70 font-medium">⏱️ За {salary.stintDuration} месяца вахты:</span>
                  <span className="text-2xl font-bold text-[#C9A84C]">{salary.totalMonthsFormatted}</span>
                </div>

                <div className="flex items-baseline justify-between pb-4 border-b border-[#C9A84C]/20 hover:bg-[#7B3FBF]/5 px-4 py-2 rounded transition-colors">
                  <span className="text-[#F8FAFC]/70 font-medium">🎁 Единовременная выплата (подъёмные):</span>
                  <span className="text-2xl font-bold text-[#7B3FBF]">{salary.oneTimePaymentFormatted}</span>
                </div>

                <div className="flex items-baseline justify-between pt-6 bg-gradient-to-r from-[#C9A84C]/15 to-[#7B3FBF]/15 border border-[#C9A84C]/30 rounded-xl p-5 mt-6">
                  <span className="text-lg font-bold text-[#F8FAFC]">💰 ИТОГО за {salary.stintDuration} месяца:</span>
                  <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#7B3FBF]">
                    {salary.totalForStintFormatted}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-[#C9A84C]/30">
                <div className="bg-[#05070A]/50 rounded-xl p-5 space-y-3">
                  <p className="text-sm font-semibold text-[#C9A84C] mb-4">✨ Дополнительные условия:</p>
                  <div className="space-y-2.5">
                    <p className="text-sm text-[#F8FAFC]/70">✅ <span className="text-[#C9A84C] font-semibold">Проживание:</span> {benefits.accommodation}</p>
                    <p className="text-sm text-[#F8FAFC]/70">✅ <span className="text-[#C9A84C] font-semibold">Питание:</span> {benefits.meals}</p>
                    <p className="text-sm text-[#F8FAFC]/70">✅ <span className="text-[#C9A84C] font-semibold">Страховка:</span> {benefits.insurance}</p>
                    <p className="text-sm text-[#F8FAFC]/70">✅ <span className="text-[#C9A84C] font-semibold">Проезд:</span> {benefits.travel}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full mt-8 px-6 py-4 rounded-lg bg-gradient-to-r from-[#7B3FBF] to-[#8B4FCF] hover:from-[#8B4FCF] hover:to-[#9B5FDF] text-white font-bold text-lg transition-all shadow-[0_0_30px_rgba(123,63,191,0.4)] hover:shadow-[0_0_50px_rgba(123,63,191,0.6)]"
              >
                📝 Оставить заявку на эту должность
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <RequirementsAccordion vacancy={vacancy} />
        </div>
      </div>
    </section>
  );
}

function RequirementsAccordion({ vacancy }) {
  const [open, setOpen] = useState(false);
  const req = vacancy.requirements || {};
  const duties = vacancy.duties || [];
  const skills = req.skills || [];

  return (
    <div className="glass-card rounded-2xl p-6">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left">
        <h3 className="text-xl font-black text-[#F8FAFC]">
          📋 Требования для «{vacancy.position.toLowerCase()}»
        </h3>
        <ChevronDown size={24} className={`text-[#C9A84C] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mt-4"
      >
        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-[#7B3FBF]/20">
          <div>
            <h4 className="font-bold text-[#C9A84C] mb-3">Требования:</h4>
            <ul className="space-y-2">
              {req.education && <li className="flex gap-2 text-sm text-[#F8FAFC]/70"><span className="text-[#C9A84C] shrink-0">•</span><span>Образование: {req.education}</span></li>}
              {req.experience && <li className="flex gap-2 text-sm text-[#F8FAFC]/70"><span className="text-[#C9A84C] shrink-0">•</span><span>Опыт: {req.experience}</span></li>}
              {req.age && <li className="flex gap-2 text-sm text-[#F8FAFC]/70"><span className="text-[#C9A84C] shrink-0">•</span><span>{req.age}</span></li>}
              {req.contraindications && <li className="flex gap-2 text-sm text-[#F8FAFC]/70"><span className="text-[#C9A84C] shrink-0">•</span><span>Противопоказания: {req.contraindications}</span></li>}
            </ul>
            {skills.length > 0 && (
              <>
                <h4 className="font-bold text-[#C9A84C] mb-3 mt-4">Навыки:</h4>
                <ul className="space-y-2">
                  {skills.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-[#F8FAFC]/70"><span className="text-[#C9A84C] shrink-0">•</span><span>{s}</span></li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            <h4 className="font-bold text-[#C9A84C] mb-3">Обязанности:</h4>
            <ul className="space-y-2">
              {duties.map((d, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#F8FAFC]/70"><span className="text-[#C9A84C] shrink-0">•</span><span>{d}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
import { useCalculatorState } from "./useCalculatorState";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCommonBenefits } from "@/data/vacanciesConfig";

export default function SalaryCalculatorModal({ isOpen, onClose, initialVacancy = "raznorabochiy", onApply }) {
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
  } = useCalculatorState(initialVacancy);

  const benefits = getCommonBenefits();

  if (!salary || !vacancy) return null;

  const handleApply = () => {
    if (onApply) {
      const label = isDriver && selectedDriverCategory
        ? `${vacancy.position} (кат. ${selectedDriverCategory})`
        : vacancy.position;
      onApply(label);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-[#7B3FBF]/20 rounded-lg transition-colors z-10"
            >
              <X size={24} className="text-[#F8FAFC]" />
            </button>

            <h2 className="text-2xl font-black text-[#F8FAFC] mb-6 pr-10">Калькулятор зарплаты</h2>

            <div className="mb-4">
              <label className="block text-[#C9A84C] font-bold text-sm mb-2 uppercase">Должность</label>
              <div className="grid grid-cols-2 gap-2">
                {allVacancies.map((vac) => (
                  <button
                    key={vac.id}
                    onClick={() => handleVacancyChange(vac.id)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                      selectedVacancyId === vac.id
                        ? "bg-[#7B3FBF] text-white font-semibold"
                        : "bg-[#0D1B3E] border border-[#7B3FBF]/30 text-[#F8FAFC] hover:border-[#7B3FBF]/60"
                    }`}
                  >
                    <span>{vac.icon}</span>
                    <span className="truncate">{vac.position}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[#C9A84C] font-bold text-sm mb-2 uppercase">Уровень</label>
                <div className="grid grid-cols-2 gap-2">
                  {["min", "max"].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelChange(level)}
                      className={`py-2 rounded-lg font-bold text-sm transition-all ${
                        selectedLevel === level
                          ? "bg-[#C9A84C] text-[#05070A]"
                          : "bg-[#0D1B3E] border border-[#C9A84C]/30 text-[#C9A84C]"
                      }`}
                    >
                      {level === "min" ? "От" : "До"}
                    </button>
                  ))}
                </div>
              </div>

              {isDriver && (
                <div>
                  <label className="block text-[#C9A84C] font-bold text-sm mb-2 uppercase">Категория</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(vacancy.salary.categories).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleDriverCategoryChange(cat)}
                        className={`py-2 rounded-lg font-bold text-xs transition-all ${
                          selectedDriverCategory === cat
                            ? "bg-[#7B3FBF] text-white"
                            : "bg-[#0D1B3E] border border-[#7B3FBF]/30 text-[#7B3FBF]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card-gold rounded-xl p-5 space-y-3">
              <div className="text-sm text-[#C9A84C]/70 uppercase tracking-wide">
                {vacancy.position}
                {isDriver && selectedDriverCategory && ` (кат. ${selectedDriverCategory})`}
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-[#F8FAFC]/70 text-sm">Ежемесячный оклад:</span>
                <span className="text-xl font-black text-[#F8FAFC]">{salary.monthlySalaryFormatted}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[#F8FAFC]/70 text-sm">За {salary.stintDuration} месяца:</span>
                <span className="text-lg font-bold text-[#C9A84C]">{salary.totalMonthsFormatted}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[#F8FAFC]/70 text-sm">Подъёмные:</span>
                <span className="text-lg font-bold text-[#7B3FBF]">{salary.oneTimePaymentFormatted}</span>
              </div>
              <div className="flex justify-between items-baseline pt-3 border-t border-[#C9A84C]/30">
                <span className="font-bold text-[#F8FAFC]">ИТОГО:</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C9A84C] to-[#7B3FBF]">
                  {salary.totalForStintFormatted}
                </span>
              </div>
            </div>

            <div className="mt-4 bg-[#05070A]/50 rounded-xl p-4 space-y-1.5">
              <p className="text-sm font-semibold text-[#C9A84C] mb-2">✨ Включено:</p>
              <p className="text-xs text-[#F8FAFC]/70">✅ Проживание: {benefits.accommodation}</p>
              <p className="text-xs text-[#F8FAFC]/70">✅ Питание: {benefits.meals}</p>
              <p className="text-xs text-[#F8FAFC]/70">✅ Страховка: {benefits.insurance}</p>
              <p className="text-xs text-[#F8FAFC]/70">✅ Проезд: {benefits.travel}</p>
            </div>

            <button
              onClick={handleApply}
              className="w-full mt-5 py-3 rounded-lg bg-gradient-to-r from-[#7B3FBF] to-[#8B4FCF] hover:from-[#8B4FCF] hover:to-[#9B5FDF] text-white font-bold transition-all"
            >
              📝 Оставить заявку
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
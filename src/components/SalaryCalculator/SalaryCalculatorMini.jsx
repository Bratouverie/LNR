import { useCalculatorState } from "./useCalculatorState";

export default function SalaryCalculatorMini({ vacancyId = "raznorabochiy", compact = false }) {
  const {
    selectedLevel,
    selectedDriverCategory,
    vacancy,
    isDriver,
    salary,
    handleLevelChange,
    handleDriverCategoryChange,
  } = useCalculatorState(vacancyId);

  if (!salary || !vacancy) return null;

  return (
    <div className={`rounded-xl ${compact ? "p-4 bg-[#0D1B3E]" : "p-6 glass-card"}`}>
      <div className={`text-[#C9A84C]/70 mb-2 ${compact ? "text-sm" : "text-base"}`}>
        Рассчитайте вашу зарплату
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {["min", "max"].map((level) => (
          <button
            key={level}
            onClick={() => handleLevelChange(level)}
            className={`py-2 rounded-lg font-bold text-sm transition-all ${
              selectedLevel === level
                ? "bg-[#C9A84C] text-[#05070A]"
                : "bg-[#05070A] border border-[#C9A84C]/30 text-[#C9A84C]"
            }`}
          >
            {level === "min" ? "От" : "До"}
          </button>
        ))}
      </div>

      {isDriver && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {Object.keys(vacancy.salary.categories).map((cat) => (
            <button
              key={cat}
              onClick={() => handleDriverCategoryChange(cat)}
              className={`py-1.5 text-xs rounded font-bold transition-all ${
                selectedDriverCategory === cat
                  ? "bg-[#7B3FBF] text-white"
                  : "bg-[#05070A] border border-[#7B3FBF]/30 text-[#7B3FBF]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <div className="bg-[#05070A]/50 rounded-lg p-3 text-center">
        <div className="text-2xl font-black text-[#C9A84C]">{salary.totalForStintFormatted}</div>
        <div className="text-xs text-[#F8FAFC]/50 mt-1">за {salary.stintDuration} месяца</div>
      </div>

      <button
        onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })}
        className="w-full mt-3 py-2 rounded-lg bg-[#7B3FBF] text-white font-bold text-sm hover:bg-[#8B4FCF] transition-all"
      >
        Заявка
      </button>
    </div>
  );
}
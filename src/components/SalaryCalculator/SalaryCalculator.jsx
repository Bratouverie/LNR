import { useCalculatorState } from "./useCalculatorState";
import { getCommonBenefits, GLOBAL_CONFIG, calculateVacancySalaryWithTax } from "@/data/vacanciesConfig";

export default function SalaryCalculator({ preselectedPosition, initialVacancy, onApply }) {
  const effectiveInitial = preselectedPosition || initialVacancy || "raznorabochiy";
  const {
    selectedVacancyId,
    selectedLevel,
    selectedDriverCategory,
    vacancy,
    isDriver,
    allVacancies,
    handleVacancyChange,
    handleLevelChange,
    handleDriverCategoryChange,
  } = useCalculatorState(effectiveInitial);

  const benefits = getCommonBenefits();
  const salaryWithTax = calculateVacancySalaryWithTax(
    selectedVacancyId,
    selectedLevel,
    isDriver ? selectedDriverCategory : null
  );

  if (!salaryWithTax || !vacancy) return null;

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
    <section id="calculator" className="py-24 sm:py-32 bg-secondary/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Калькулятор</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Рассчитайте вашу зарплату
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Выберите должность и узнайте полную компенсацию за {GLOBAL_CONFIG.compensation.stintDuration} месяца работы на вахте
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT: SELECTORS */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 lg:sticky lg:top-24 space-y-6">
              <div>
                <label className="block text-accent font-inter font-bold text-sm mb-3 uppercase tracking-wide">1. Выберите должность</label>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {allVacancies.map((vac) => (
                    <button
                      key={vac.id}
                      onClick={() => handleVacancyChange(vac.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 font-inter text-sm ${
                        selectedVacancyId === vac.id
                          ? "bg-primary text-primary-foreground font-semibold shadow-md"
                          : "bg-secondary border border-border text-foreground hover:border-accent/40"
                      }`}
                    >
                      <span className="text-lg">{vac.icon}</span>
                      <span>{vac.position}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-accent font-inter font-bold text-sm mb-3 uppercase tracking-wide">2. Уровень оклада</label>
                <div className="grid grid-cols-2 gap-2">
                  {["min", "max"].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleLevelChange(level)}
                      className={`py-2.5 rounded-lg font-inter font-semibold transition-all text-xs ${
                        selectedLevel === level
                          ? "bg-accent text-accent-foreground shadow-md"
                          : "bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-accent/40"
                      }`}
                    >
                      {level === "min" ? `От ${levelMin?.toLocaleString("ru-RU")} ₽` : `До ${levelMax?.toLocaleString("ru-RU")} ₽`}
                    </button>
                  ))}
                </div>
              </div>

              {isDriver && (
                <div className="pt-4 border-t border-border">
                  <label className="block text-accent font-inter font-bold text-sm mb-3 uppercase tracking-wide">3. Категория прав</label>
                  <div className="space-y-2">
                    {Object.keys(vacancy.salary.categories).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleDriverCategoryChange(cat)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg font-inter text-sm transition-all ${
                          selectedDriverCategory === cat
                            ? "bg-accent text-accent-foreground font-semibold shadow-md"
                            : "bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-accent/40"
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

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-2">
            <div className="bg-card border-2 border-border rounded-xl p-6 sm:p-8">
              <div className="mb-6 pb-6 border-b border-border">
                <div className="text-xs text-accent font-mono font-semibold uppercase tracking-wider mb-2">Выбранная должность</div>
                <h3 className="text-2xl sm:text-3xl font-inter font-black text-foreground">
                  {vacancy.position}
                  {isDriver && selectedDriverCategory && <span className="text-accent"> (кат. {selectedDriverCategory})</span>}
                </h3>
                <p className="text-sm text-muted-foreground font-inter mt-2 leading-relaxed">{vacancy.role}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-inter text-sm">Ежемесячный оклад (брутто)</span>
                  <span className="text-xl font-mono font-black text-foreground">{salaryWithTax.monthlySalaryGrossFormatted}</span>
                </div>

                <div className="flex items-baseline justify-between py-1">
                  <span className="text-muted-foreground/70 font-inter text-xs">в т.ч. НДФЛ 13%</span>
                  <span className="text-sm font-mono text-muted-foreground/70">–{salaryWithTax.monthlyTaxFormatted}</span>
                </div>

                <div className="flex items-baseline justify-between py-3 px-4 bg-accent/5 rounded-lg">
                  <span className="text-foreground font-inter font-bold">На руки в месяц</span>
                  <span className="text-2xl font-mono font-black text-accent">{salaryWithTax.monthlySalaryNetFormatted}</span>
                </div>

                <div className="my-2 h-px bg-border" />

                <div className="flex items-baseline justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-inter text-sm">За {salaryWithTax.stintDuration} месяца (на руки)</span>
                  <span className="text-lg font-mono font-bold text-foreground">{salaryWithTax.totalNetSalaryFormatted}</span>
                </div>

                <div className="flex items-baseline justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground font-inter text-sm">Подъёмные (без налога)</span>
                  <span className="text-lg font-mono font-bold text-primary">{salaryWithTax.oneTimePaymentFormatted}</span>
                </div>

                <div className="flex items-baseline justify-between mt-4 bg-primary text-primary-foreground rounded-xl p-5">
                  <span className="font-inter font-bold text-sm sm:text-base">Итого к получению за {salaryWithTax.stintDuration} мес.</span>
                  <span className="text-3xl sm:text-4xl font-mono font-black">
                    {salaryWithTax.totalNetWithBonusFormatted}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="bg-secondary rounded-xl p-5">
                  <p className="text-sm font-inter font-semibold text-foreground mb-4">Дополнительно включено в пакет:</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <span className="text-accent shrink-0 mt-0.5">✓</span>
                      <span className="text-sm text-muted-foreground font-inter"><span className="text-foreground font-semibold">Проживание:</span> {benefits.accommodation}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-accent shrink-0 mt-0.5">✓</span>
                      <span className="text-sm text-muted-foreground font-inter"><span className="text-foreground font-semibold">Питание:</span> {benefits.meals}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-accent shrink-0 mt-0.5">✓</span>
                      <span className="text-sm text-muted-foreground font-inter"><span className="text-foreground font-semibold">Страховка:</span> {benefits.insurance}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-accent shrink-0 mt-0.5">✓</span>
                      <span className="text-sm text-muted-foreground font-inter"><span className="text-foreground font-semibold">Проезд:</span> {benefits.travel}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="w-full mt-6 px-6 py-4 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold text-base transition-all shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30"
              >
                Оставить заявку на эту должность
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
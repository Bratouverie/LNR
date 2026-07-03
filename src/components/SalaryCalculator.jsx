import { useState, useEffect } from "react";
import { Calculator, TrendingUp, Info, CheckCircle, ArrowRight } from "lucide-react";
import { SALARY_LIST, CONTRACT_DURATIONS, UPLIFTS, TAX_RATE, fmt } from "@/data/vacanciesConfig";

export default function SalaryCalculator({ preselectedPosition, onApply }) {
  const [positionKey, setPositionKey] = useState("stroitel");
  const [durationKey, setDurationKey] = useState("3_months");
  const [showNet, setShowNet] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Sync with preselected position from vacancies section
  useEffect(() => {
    if (preselectedPosition && SALARY_LIST.find((s) => s.key === preselectedPosition)) {
      setPositionKey(preselectedPosition);
      setShowResults(true);
    }
  }, [preselectedPosition]);

  const vac = SALARY_LIST.find((s) => s.key === positionKey) || SALARY_LIST[1];
  const dur = CONTRACT_DURATIONS[durationKey];

  const adjustedSalary = vac.base * dur.multiplier;
  const totalSalary = adjustedSalary * dur.months;
  const taxes = totalSalary * TAX_RATE;
  const netSalary = totalSalary - taxes;
  const grossIncome = UPLIFTS + totalSalary;
  const netIncome = UPLIFTS + netSalary;
  const saved = Math.round((25000 + 18000 + 15000) * dur.months);

  const handleCalculate = () => {
    setShowResults(true);
    setTimeout(() => {
      const el = document.getElementById("calc-results");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  return (
    <section id="calculator" className="py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Калькулятор</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Рассчитайте свой доход за 60 секунд
          </h2>
          <p className="text-muted-foreground font-inter mt-3 max-w-xl mx-auto text-sm">
            Выберите специальность и срок вахты — узнайте точный доход с учётом налогов и подъёмных
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* Form */}
            <div className="p-6 sm:p-8 space-y-6 border-b md:border-b-0 md:border-r border-border">
              <div>
                <label className="block font-inter font-semibold text-sm text-foreground mb-2">Специальность *</label>
                <select
                  value={positionKey}
                  onChange={(e) => setPositionKey(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {SALARY_LIST.map((v) => (
                    <option key={v.key} value={v.key}>{v.label} — {fmt(v.base)}/мес</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-inter font-semibold text-sm text-foreground mb-2">Срок вахты *</label>
                <select
                  value={durationKey}
                  onChange={(e) => setDurationKey(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {Object.entries(CONTRACT_DURATIONS).map(([key, d]) => (
                    <option key={key} value={key}>{d.label} — {d.note}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-inter font-semibold text-sm text-foreground mb-2">Отображение</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowNet(false)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all ${
                      !showNet ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Брутто
                  </button>
                  <button
                    onClick={() => setShowNet(true)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all ${
                      showNet ? "bg-primary text-primary-foreground" : "bg-secondary border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Нетто (чистыми)
                  </button>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="font-inter text-xs text-muted-foreground leading-relaxed">
                    Подъёмные <strong className="text-foreground">625 000 ₽</strong> выплачиваются при подписании договора в течение 5 дней, <strong className="text-foreground">без вычета налогов</strong>.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Рассчитать доход
              </button>
              <p className="font-inter text-xs text-muted-foreground text-center">Расчёт по данным на июль 2026 года</p>
            </div>

            {/* Results */}
            <div id="calc-results" className="p-6 sm:p-8 bg-primary text-primary-foreground">
              {!showResults ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <Calculator className="h-12 w-12 text-white/30" />
                  <p className="font-inter text-sm text-white/50">Заполните форму и нажмите «Рассчитать доход»</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Main result */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      <h3 className="font-inter font-bold text-base">Ваш доход за {dur.months} мес.</h3>
                    </div>
                    <div className="text-4xl sm:text-5xl font-mono font-black text-accent leading-tight">
                      {showNet ? fmt(netIncome) : fmt(grossIncome)}
                    </div>
                    <p className="font-inter text-xs text-white/50 mt-2">
                      Это {fmt(adjustedSalary)} в месяц (средняя)
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2 border-t border-white/20 pt-4">
                    <Row label="Подъёмные" value={fmt(UPLIFTS)} accent note="без налогов, на карту через 5 дней" />
                    <Row label="Зарплата за период" value={fmt(totalSalary)} />
                    <Row label="Налог (НДФЛ 13%)" value={"− " + fmt(taxes)} red />
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-inter font-semibold text-white">Итого {showNet ? "на руки" : "до налогов"}</span>
                      <span className={`font-mono font-black text-2xl ${showNet ? "text-accent" : "text-white"}`}>
                        {showNet ? fmt(netIncome) : fmt(grossIncome)}
                      </span>
                    </div>
                  </div>

                  {/* Saved */}
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="font-inter text-xs text-white/60 mb-1">+ экономия на бесплатных льготах</div>
                    <div className="font-inter text-sm font-bold text-white">~{fmt(saved)}</div>
                    <div className="font-inter text-xs text-white/50">жильё, питание, проезд</div>
                  </div>

                  {/* Scenarios */}
                  <div className="border-t border-white/20 pt-4 space-y-2">
                    <div className="font-inter text-xs text-white/60 mb-2">Примеры дохода (чистыми):</div>
                    <Scenario label="Базовый" desc="Разнорабочий, без премий" amount={1495000} />
                    <Scenario label="С бонусами" desc="Строитель, безаварийная работа" amount={1570000} />
                    <Scenario label="Максимальный" desc="Медработник, 2-й контракт (+15%)" amount={1835000} />
                  </div>

                  {/* CTA */}
                  {onApply && (
                    <button
                      onClick={() => onApply(vac.label)}
                      className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-3 rounded-xl transition-colors text-sm mt-2"
                    >
                      Оставить заявку: {vac.label}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  <p className="font-inter text-xs text-white/40 text-center">
                    Расчёт примерный. Точная сумма зависит от объекта и выслуги.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, accent, red, note }) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <span className="font-inter text-sm text-white/60">{label}</span>
        {note && <div className="font-inter text-xs text-white/40">{note}</div>}
      </div>
      <span className={`font-mono font-bold text-sm ${accent ? "text-accent" : red ? "text-red-400" : "text-white"}`}>{value}</span>
    </div>
  );
}

function Scenario({ label, desc, amount }) {
  return (
    <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
      <div>
        <div className="font-inter text-xs font-semibold text-white/80">{label}</div>
        <div className="font-inter text-xs text-white/40">{desc}</div>
      </div>
      <span className="font-mono font-bold text-sm text-accent">{fmt(amount)}</span>
    </div>
  );
}
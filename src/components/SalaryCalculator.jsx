import { useState } from "react";
import { Calculator, TrendingUp, Info } from "lucide-react";

const VACANCIES = [
  { label: "Разнорабочий", salary: 320000 },
  { label: "Строитель", salary: 355000 },
  { label: "Водитель кат. B", salary: 320000 },
  { label: "Водитель кат. C", salary: 335000 },
  { label: "Водитель кат. CE", salary: 345000 },
  { label: "Автослесарь", salary: 340000 },
  { label: "Охранник", salary: 330000 },
  { label: "Медработник", salary: 360000 },
  { label: "Инженер связи", salary: 375000 },
  { label: "Оператор БПЛА", salary: 380000 },
  { label: "Взрывотехник", salary: 445000 },
];

const fmt = (n) => n.toLocaleString("ru-RU") + " ₽";

export default function SalaryCalculator() {
  const [vacancyIdx, setVacancyIdx] = useState(1);
  const [months, setMonths] = useState(3);  // вахта 3 месяца
  const [withBonus, setWithBonus] = useState(true);

  const vac = VACANCIES[vacancyIdx];
  const salary = vac.salary;
  const totalSalary = salary * months;
  const bonuses = withBonus ? Math.round(salary * 0.05 * months) : 0;
  const podyomnye = 625000;  // подъёмные за 3-месячную вахту
  const gross = totalSalary + bonuses + podyomnye;
  const net = Math.round(gross * 0.87);
  const saved = Math.round((25000 + 18000 + 15000) * months); // жильё+еда+проезд

  return (
    <section id="calculator" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Калькулятор</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Рассчитайте свой доход
          </h2>
          <p className="text-muted-foreground font-inter mt-3 max-w-xl mx-auto text-sm">
            Выберите специальность и срок (начиная с 3 месяцев) — узнайте точный доход за вахту(ы)
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          <div className="grid md:grid-cols-2">
            {/* Controls */}
            <div className="p-6 sm:p-8 space-y-6 border-b md:border-b-0 md:border-r border-border">
              <div>
                <label className="block font-inter font-semibold text-sm text-foreground mb-2">Специальность</label>
                <select
                  value={vacancyIdx}
                  onChange={(e) => setVacancyIdx(Number(e.target.value))}
                  className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {VACANCIES.map((v, i) => (
                    <option key={i} value={i}>{v.label} — {(v.salary).toLocaleString("ru-RU")} ₽/мес</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-inter font-semibold text-sm text-foreground mb-2">
                  Срок вахты: <span className="text-accent">{months} мес.</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={3}
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-inter mt-1">
                  <span>3 мес (1 вахта)</span><span>6 мес (2)</span><span>9 мес (3)</span><span>12 мес (4)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-secondary/50 rounded-xl p-4">
                <input
                  type="checkbox"
                  id="bonus"
                  checked={withBonus}
                  onChange={(e) => setWithBonus(e.target.checked)}
                  className="w-4 h-4 accent-accent"
                />
                <label htmlFor="bonus" className="font-inter text-sm text-foreground cursor-pointer">
                  Включить премиальные (~5%/мес)
                </label>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="font-inter text-xs text-muted-foreground leading-relaxed">
                    Подъёмные <strong className="text-foreground">625 000 ₽ за каждую 3-месячную вахту</strong> выплачиваются при подписании договора в течение 5 рабочих дней.
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="p-6 sm:p-8 bg-primary text-primary-foreground">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="h-5 w-5 text-accent" />
                <h3 className="font-inter font-bold text-base">Ваш доход за {months} мес.</h3>
              </div>

              <div className="space-y-4">
                <ResultRow label="Зарплата (оклад)" value={fmt(totalSalary)} />
                {withBonus && <ResultRow label="Бонусы и премии" value={fmt(bonuses)} />}
                <ResultRow label="Подъёмные" value={fmt(podyomnye)} accent />
                <div className="border-t border-white/20 pt-4 mt-2">
                  <ResultRow label="Итого до налогов" value={fmt(gross)} large />
                  <ResultRow label="На руки (−13% НДФЛ)" value={fmt(net)} large accent />
                </div>
                <div className="bg-white/10 rounded-xl p-3 mt-2">
                  <div className="font-inter text-xs text-white/60 mb-1">+ экономия на бесплатных льготах</div>
                  <div className="font-inter text-sm font-bold text-white">~{fmt(saved)}</div>
                  <div className="font-inter text-xs text-white/50">жильё, питание, проезд</div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/20 pt-5">
                <div className="font-inter text-xs text-white/50 mb-1">Совокупный доход за {months} мес. (с льготами)</div>
                <div className="font-inter text-3xl font-black text-accent">
                  {fmt(net + saved)}
                </div>
              </div>

              <a
                href="tel:88002228463"
                className="flex items-center justify-center gap-2 w-full mt-5 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Записаться — 8-800-222-84-63
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultRow({ label, value, accent, large }) {
  return (
    <div className="flex justify-between items-center">
      <span className={`font-inter text-sm ${large ? "font-semibold text-white" : "text-white/60"}`}>{label}</span>
      <span className={`font-inter font-bold ${large ? "text-base" : "text-sm"} ${accent ? "text-accent" : "text-white"}`}>{value}</span>
    </div>
  );
}
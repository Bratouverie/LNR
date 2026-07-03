import { CheckCircle, Home, Banknote, Shield, GraduationCap, Award, Users } from "lucide-react";
import { GLOBAL_CONFIG, getMinSalaryAcrossVacancies, getMaxSalaryAcrossVacancies, getAverageTotalIncome, formatCurrency } from "@/data/vacanciesConfig";

const DURING_CONTRACT = [
  { param: "Зарплата", desc: "Ежемесячно, 2 раза в месяц", amount: `${Math.round(getMinSalaryAcrossVacancies()/1000)}–${Math.round(getMaxSalaryAcrossVacancies()/1000)} К` },
  { param: "Подъёмные", desc: "При подписании договора", amount: `${Math.round(GLOBAL_CONFIG.compensation.oneTimePayment/1000)} К` },
  { param: "Жильё", desc: "2–3 чел. на комнату", amount: "0 ₽ (включено)" },
  { param: "Питание", desc: "3-разовое (завтрак, обед, ужин)", amount: "0 ₽ (включено)" },
  { param: "Интернет", desc: "Wi-Fi на базе", amount: "0 ₽" },
  { param: "Медстраховка", desc: "ОМС + полис ДМС", amount: "0 ₽ (включено)" },
  { param: "Страховка от НС", desc: "1.5–14.7 млн ₽", amount: "0 ₽ (включено)" },
  { param: "Спецодежда", desc: "СИЗ, рабочая одежда", amount: "0 ₽ (выдаётся)" },
  { param: "Спортзал", desc: "Тренажёры, турники", amount: "0 ₽" },
  { param: "Психолог", desc: "24/7 консультации", amount: "0 ₽" },
];

const AFTER_CONTRACT = [
  { param: "Налоговый вычет", desc: "13% при покупке недвижимости", amount: "до 2 млн ₽" },
  { param: "Земельный участок", desc: "0.25 га в ДНР/ЛНР", amount: "вне очереди" },
  { param: "Статус ветерана", desc: "Удостоверение + льготы", amount: "пожизненно" },
  { param: "Федеральные льготы", desc: "ЖКХ −25–50%, медицина", amount: "постоянно" },
  { param: "Пенсионные доплаты", desc: "+3 года к трудовому стажу", amount: "~15–20 К/мес" },
  { param: "Грант на бизнес", desc: "При 2+ контрактах", amount: "300 К" },
  { param: "Приоритет трудоустройства", desc: "На проекты Братоуверие", amount: "постоянно" },
  { param: "Скидки на лекарства", desc: "Рецептурные препараты", amount: "50%" },
  { param: "Проездные билеты", desc: "Ж/Д, самолёты (региональные)", amount: "50%" },
];

const EXAMPLES = [
  {
    icon: Home,
    text: "Купил квартиру за 3 млн. Вернул 13% налога = 390 К. Земельный участок в ДНР — получил бесплатно!",
  },
  {
    icon: Banknote,
    text: "Открыл магазин. Получил грант 300 К + пенсионные доплаты 15 К/мес = окупился за 20 месяцев.",
  },
  {
    icon: GraduationCap,
    text: "Оформил земельный участок, получил статус ветерана — дети учатся в гос. вузах со скидкой.",
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Льготы</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Ваши права и льготы: во время и после
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Конкретные суммы и условия — без абстрактных обещаний
          </p>
        </div>

        {/* Two tables side by side */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* During contract */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              <h3 className="font-inter font-bold text-sm">Во время контракта (3 месяца)</h3>
            </div>
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="bg-secondary/40 border-b border-border">
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground text-xs">Параметр</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground text-xs">Описание</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-foreground text-xs">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {DURING_CONTRACT.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                    <td className="px-4 py-2.5 text-foreground font-medium text-xs">{row.param}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{row.desc}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-accent text-xs">{row.amount}</td>
                  </tr>
                ))}
                <tr className="bg-accent/10 border-t-2 border-accent/30">
                  <td className="px-4 py-3 font-bold text-foreground text-xs" colSpan={2}>ИТОГО за {GLOBAL_CONFIG.compensation.stintDuration} месяца</td>
                  <td className="px-4 py-3 text-right font-mono font-black text-accent text-sm">~{formatCurrency(getAverageTotalIncome())}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* After contract */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              <h3 className="font-inter font-bold text-sm">После контракта (на всю жизнь)</h3>
            </div>
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="bg-secondary/40 border-b border-border">
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground text-xs">Параметр</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground text-xs">Описание</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-foreground text-xs">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {AFTER_CONTRACT.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                    <td className="px-4 py-2.5 text-foreground font-medium text-xs">{row.param}</td>
                    <td className="px-4 py-2.5 text-muted-foreground text-xs">{row.desc}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-accent text-xs">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Examples */}
        <div>
          <h3 className="font-inter font-bold text-lg text-foreground text-center mb-6">Примеры использования льгот</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {EXAMPLES.map((ex, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                  <ex.icon className="h-5 w-5 text-accent" />
                </div>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">{ex.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
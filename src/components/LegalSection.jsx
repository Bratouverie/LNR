import { useState } from "react";
import { Scale, FileText, Home, Banknote, Heart, CheckCircle } from "lucide-react";

const TABS = [
{ id: "disputes", label: "Споры", icon: Scale },
{ id: "termination", label: "Уход из программы", icon: Home },
{ id: "contract", label: "Трудовой договор", icon: FileText },
{ id: "salary", label: "Гарантии зарплаты", icon: Banknote },
{ id: "social", label: "Соц. пакет", icon: Heart },
{ id: "legal_info", label: "Юридическая информация", icon: Scale }];


const DISPUTES_STEPS = [
{
  num: "1",
  title: "Внутреннее разрешение (досудебное)",
  items: [
  "Работник направляет письменную жалобу руководителю объекта или в HR-отдел",
  "Срок рассмотрения: 10–15 рабочих дней",
  "Попытка компромисса и мирного урегулирования",
  "Составление акта о разрешении спора"]

},
{
  num: "2",
  title: "Обращение в профсоюз",
  items: [
  "Консультация и поддержка профсоюза",
  "Участие в переговорах между работником и работодателем"]

},
{
  num: "3",
  title: "Судебное разрешение",
  items: [
  "При невозможности досудебного урегулирования — обращение в суд",
  "Суд города Москвы",
  "Судебные разбирательства по разрешению конфликтов и спорных ситуаций осуществляются через суд города Москвы",
  "Судебные издержки возвращаются при победе работника"]

}];


const DISPUTES_TABLE = [
{ problem: "Невыплата зарплаты", who: "Менеджер программы, бухгалтер", procedure: "Письмо с претензией, проверка платежей", term: "5–10 дней" },
{ problem: "Нарушение графика работы", who: "Профсоюз, инспекция труда", procedure: "Анализ графика, переговоры", term: "15–20 дней" },
{ problem: "Отказ в отпуске", who: "Менеджер программы, юрист", procedure: "Проверка законности, переговоры", term: "10–15 дней" },
{ problem: "Дисциплинарное взыскание", who: "Комиссия программы", procedure: "Заслушивание обеих сторон, голосование", term: "15–20 дней" },
{ problem: "Травма на работе", who: "Страховая компания, суд", procedure: "Расследование, медэкспертиза", term: "20–30 дней" }];


const TERMINATION = [
{
  title: "По инициативе работника",
  color: "border-blue-200 bg-blue-50",
  badge: "bg-blue-100 text-blue-700",
  items: [
  "Письменное уведомление за 2 недели",
  "Причины: личные обстоятельства, здоровье, семья",
  "Выплаты: вся заработанная зарплата + компенсация за неиспользованный отпуск",
  "Возможная потеря: часть единовременной выплаты (если не отработан полный год)"]

},
{
  title: "По инициативе работодателя",
  color: "border-red-200 bg-red-50",
  badge: "bg-red-100 text-red-700",
  items: [
  "При серьёзном нарушении правил или закона",
  "При неисправимых ошибках, ведущих к убыткам",
  "При состоянии здоровья, препятствующем работе",
  "Выплаты: зарплата + компенсация за отпуск + выходное пособие (1 месячный оклад)"]

},
{
  title: "По соглашению сторон",
  color: "border-green-200 bg-green-50",
  badge: "bg-green-100 text-green-700",
  items: [
  "Обе стороны согласны на досрочное прекращение",
  "Выплаты: согласно соглашению (обычно полная компенсация)"]

}];


const RETURN_HOME = [
"Бесплатный билет на любой транспорт (самолёт, поезд, автобус)",
"Трансфер от места работы до аэропорта/вокзала",
"Доставка личных вещей домой — компания оплачивает до 50 кг",
"Рекомендательное письмо о проделанной работе",
"Справка о доходах для налоговых целей"];


const CONTRACT_INFO = [
{ label: "Форма", value: "Письменный трудовой договор (обязательно)" },
{ label: "Тип", value: "Трудовой договор на определённый срок (ст. 59 ТК РФ)" },
{ label: "Срок действия", value: "3 месяца (90 дней)" },
{ label: "Метод работы", value: "Вахтовый метод (ст. 217–229 ТК РФ)" },
{ label: "Дата начала", value: "3–20 июля 2026 г." },
{ label: "Дата окончания", value: "Октябрь 2026 г." },
{ label: "Испытательный срок", value: "Не применяется (вахтовая работа)" }];


const SALARY_GUARANTEES = [
{ title: "Своевременная выплата", items: ["Дважды в месяц (аванс + расчёт)", "Перечисление на банковскую карту в течение 3 рабочих дней", "Зарплата не ниже МРОТ (программа — существенно выше)"] },
{ title: "Сверхурочные", items: ["Первые 2 часа — минимум 1,5-кратный оклад", "Последующие часы — минимум 2-кратный оклад"] },
{ title: "Выходные и праздники", items: ["Минимум 2-кратный размер оклада", "Альтернатива: другой день отдыха"] },
{ title: "Больничный", items: ["При производственной травме: 100% средней зарплаты", "При заболевании: 80–100% (зависит от стажа)", "Максимум 30 дней в год"] },
{ title: "Отпуск", items: ["Минимум 28 календарных дней", "Взрывотехники: доп. 7–14 дней", "Выплата отпускных: 100% средней зарплаты за последние 12 месяцев"] },
{ title: "Компенсация при увольнении", items: ["По инициативе работодателя: выходное пособие ≥ 1 месячного оклада", "По соглашению сторон: согласуется индивидуально"] }];


const SOCIAL_PACKAGE = [
{ title: "Медицинская страховка", items: ["Полис ОМС (обязательное медицинское страхование)", "Страховка от НС на производстве (взносы 0,2–8,5% зарплаты)", "Дополнительная добровольная страховка (возможно)"] },
{ title: "Страховка при травме/инвалидности/смерти", items: ["При травме: компенсация + выплаты от 1 до 100% средней зарплаты", "При инвалидности: пожизненная пенсия", "При смерти: единовременное пособие семье + пенсия по потере кормильца"] },
{ title: "Пенсионные отчисления", items: ["Работодатель платит 22% зарплаты в Пенсионный фонд", "Отчисления увеличивают будущую пенсию работника"] },
{ title: "Для женщин (беременность и материнство)", items: ["Декретный отпуск 140 дней (100% средней зарплаты)", "Многоплодная беременность: 194 дня", "Отпуск по уходу до 3 лет (пособие 40% до 1,5 лет)", "Нельзя уволить беременную сотрудницу"] },
{ title: "Налоги и льготы", items: ["НДФЛ 13% (стандартная ставка)", "Возможны налоговые вычеты (имущественный и др.)", "Бесплатное жильё во время вахты"] }];


export default function LegalSection() {
  const [activeTab, setActiveTab] = useState("disputes");

  return (
    <section id="legal" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Юридическая информация</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Права, гарантии и трудовой договор
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Полная юридическая информация о форме занятости, гарантиях по ТК РФ, порядке разрешения споров и условиях выхода из программы.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map((t) =>
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
            activeTab === t.id ?
            "bg-primary text-primary-foreground shadow-lg" :
            "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"}`
            }>
            
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )}
        </div>

        {/* Disputes */}
        {activeTab === "disputes" &&
        <div className="space-y-8">
            <div className="grid sm:grid-cols-3 gap-5">
              {DISPUTES_STEPS.map((step) =>
            <div key={step.num} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-mono font-bold text-white text-sm shrink-0">{step.num}</div>
                    <div className="font-inter font-bold text-sm text-foreground">{step.title}</div>
                  </div>
                  <ul className="space-y-2">
                    {step.items.map((item, i) =>
                <li key={i} className="flex items-start gap-2 text-xs font-inter text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />{item}
                      </li>
                )}
                  </ul>
                </div>
            )}
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-secondary/60 px-5 py-3">
                <div className="font-inter font-bold text-sm text-foreground">Примеры спорных ситуаций и сроки решения</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-inter">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 text-muted-foreground font-semibold">Проблема</th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-semibold hidden md:table-cell">Кто разбирается</th>
                      <th className="text-left px-5 py-3 text-muted-foreground font-semibold hidden lg:table-cell">Процедура</th>
                      <th className="text-center px-5 py-3 text-muted-foreground font-semibold">Срок</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DISPUTES_TABLE.map((row, i) =>
                  <tr key={row.problem} className={i % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                        <td className="px-5 py-3 font-medium text-foreground">{row.problem}</td>
                        <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{row.who}</td>
                        <td className="px-5 py-3 text-muted-foreground hidden lg:table-cell">{row.procedure}</td>
                        <td className="px-5 py-3 text-center font-mono font-bold text-accent">{row.term}</td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }

        {/* Termination */}
        {activeTab === "termination" &&
        <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-5">
              {TERMINATION.map((t) =>
            <div key={t.title} className={`border rounded-2xl p-5 ${t.color}`}>
                  <div className={`inline-block text-xs font-inter font-bold px-2 py-1 rounded-full mb-4 ${t.badge}`}>{t.title}</div>
                  <ul className="space-y-2">
                    {t.items.map((item, i) =>
                <li key={i} className="flex items-start gap-2 text-sm font-inter text-foreground">
                        <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                      </li>
                )}
                  </ul>
                </div>
            )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-inter font-bold text-foreground mb-4">Возврат домой и помощь при уходе</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {RETURN_HOME.map((item, i) =>
              <div key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />{item}
                  </div>
              )}
              </div>
            </div>
          </div>
        }

        {/* Contract */}
        {activeTab === "contract" &&
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl overflow-hidden">
            <div className="bg-primary p-5">
              <div className="font-inter font-black text-white text-lg">Трудовой договор на вахтовую работу</div>
              <div className="font-inter text-white/70 text-sm mt-1">Основной тип трудоустройства в программе</div>
            </div>
            <div className="divide-y divide-border">
              {CONTRACT_INFO.map((row) =>
            <div key={row.label} className="flex items-start justify-between gap-4 px-5 py-3">
                  <span className="text-sm text-muted-foreground font-inter shrink-0">{row.label}</span>
                  <span className="text-sm text-foreground font-inter font-medium text-right">{row.value}</span>
                </div>
            )}
            </div>
            <div className="p-5 bg-accent/5 border-t border-border">
              <p className="text-sm font-inter text-foreground">
                <span className="font-bold">Рекомендуемая форма: Трудовой договор</span> — даёт максимальные гарантии и защиту работнику по ТК РФ.
              </p>
            </div>
          </div>
        }

        {/* Salary guarantees */}
        {activeTab === "salary" &&
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SALARY_GUARANTEES.map((g) =>
          <div key={g.title} className="bg-card border border-border rounded-2xl p-5">
                <div className="font-inter font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />{g.title}
                </div>
                <ul className="space-y-1.5">
                  {g.items.map((item, i) =>
              <li key={i} className="flex items-start gap-2 text-xs font-inter text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />{item}
                    </li>
              )}
                </ul>
              </div>
          )}
          </div>
        }

        {/* Legal info anchor */}
        {activeTab === "legal_info" &&
        <div className="max-w-2xl mx-auto bg-accent/5 border border-accent/20 rounded-2xl p-6 text-center">
          <p className="font-inter text-foreground text-base font-semibold mb-2">Юридическая информация</p>
          <p className="font-inter text-muted-foreground text-sm mb-4">Полная правовая документация: политика конфиденциальности, реквизиты компании, нормативно-правовая база.</p>
          <a href="/privacy" className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-6 py-3 rounded-xl transition-colors">
            Открыть политику конфиденциальности
          </a>
        </div>
        }

        {/* Social package */}
        {activeTab === "social" &&
        <div className="grid sm:grid-cols-2 gap-5">
            {SOCIAL_PACKAGE.map((g) =>
          <div key={g.title} className="bg-card border border-border rounded-2xl p-5">
                <div className="font-inter font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4 text-accent shrink-0" />{g.title}
                </div>
                <ul className="space-y-1.5">
                  {g.items.map((item, i) =>
              <li key={i} className="flex items-start gap-2 text-xs font-inter text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />{item}
                    </li>
              )}
                </ul>
              </div>
          )}
          </div>
        }

      </div>
    </section>);

}
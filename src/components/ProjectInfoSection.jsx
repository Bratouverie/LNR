import { Target, Home, School, Zap, Users, TrendingUp } from "lucide-react";

const GOALS = [
{
  icon: Home,
  title: "Восстановление жилого фонда",
  items: [
  "Восстановление частично разрушенных жилых домов (более 1000 квартир в приоритете)",
  "Полная реконструкция полностью разрушенных зданий",
  "Обеспечение условий для возврата населения в города",
  "Создание безопасного и комфортного жилого пространства"]

},
{
  icon: School,
  title: "Социальная инфраструктура",
  items: [
  "Восстановление школ и образовательных учреждений (50+ школ)",
  "Восстановление больниц и медицинских центров (20+ учреждений)",
  "Восстановление детских садов и учреждений культуры",
  "Восстановление спортивных объектов и досуговых центров"]

},
{
  icon: Zap,
  title: "Городская инфраструктура",
  items: [
  "Восстановление дорожной сети и уличного освещения (100+ км дорог)",
  "Восстановление систем водоснабжения и канализации (150+ км трубопроводов)",
  "Восстановление электроснабжения и телекоммуникаций (200+ км кабелей)",
  "Восстановление общественного транспорта"]

},
{
  icon: Users,
  title: "Экономические и социальные цели",
  items: [
  "Создание рабочих мест для местного населения (2000+ рабочих мест)",
  "Обеспечение доходов семей участников программы",
  "Развитие строительной промышленности в регионах ЛНР и ДНР",
  "Повышение инвестиционной привлекательности городов"]

},
{
  icon: TrendingUp,
  title: "Демографические цели",
  items: [
  "Возврат населения в восстанавливаемые города",
  "Укрепление социального единства и интеграции",
  "Демонстрация государственной поддержки и заботы о населении"]

}];


const NAMES = [
{ label: "Полное название", value: "«Программа массового подбора специалистов для комплексного восстановления инфраструктуры Луганской и Донецкой народных республик»" },
{ label: "Сокращённое название", value: "«Программа восстановления ЛНР и ДНР»" },
{ label: "Альтернативные обозначения", value: "«Проект восстановления городов ЛНР и ДНР» · «Программа «Братоуверие» · «Восстановление — 2026»" }];


export default function ProjectInfoSection() {
  return (
    <section id="project" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">О проекте</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">Программа восстановления ЛНР и ДНР

          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Оперативное и комплексное восстановление жилищно-коммунального хозяйства, социальной инфраструктуры и городской среды в Луганской и Донецкой народных республиках.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-12 max-w-4xl mx-auto hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-inter font-bold text-lg text-foreground">Название проекта</h3>
          </div>
          <div className="space-y-4">
            {NAMES.map((n) =>
            <div key={n.label} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                <span className="font-inter text-sm font-semibold text-muted-foreground shrink-0 sm:w-52">{n.label}</span>
                <span className="font-inter text-sm text-foreground">{n.value}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GOALS.map((g) =>
          <div key={g.title} className="bg-card border border-border rounded-2xl p-6 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <g.icon className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-inter font-bold text-sm text-foreground leading-tight">{g.title}</h3>
              </div>
              <ul className="space-y-2">
                {g.items.map((item, i) =>
              <li key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                    <span className="font-inter text-xs text-muted-foreground leading-relaxed">{item}</span>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>);

}
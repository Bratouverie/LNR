import { useState } from "react";
import { Shield, Home, UtensilsCrossed, FileCheck, Star, GraduationCap, ScrollText } from "lucide-react";

const TABS = [
{
  id: "contract", icon: ScrollText, label: "Контракт",
  content: [
  "Трудовой договор по ст. 56 ТК РФ, вахтовый метод работы",
  "Срок контракта: 1 год (25 мая 2026 — 25 мая 2027)",
  "Место работы: города ЛНР и ДНР (определяется после подписания)",
  "График: 5–6 дневная рабочая неделя, 8–10 часов в день",
  "Единовременная выплата: 500 000 рублей при подписании",
  "Зарплата на банковскую карту дважды в месяц (аванс + расчёт)",
  "Оплачиваемый отпуск: минимум 28 календарных дней в год",
  "Конфиденциальность: обязательство не разглашать коммерческую информацию проекта"]

},
{
  id: "safety", icon: Shield, label: "Безопасность",
  content: [
  "Круглосуточная охрана объектов Вооружёнными Силами РФ",
  "Сопровождение при перемещении между объектами",
  "Организация пропускного режима и контроль безопасности",
  "Оперативное реагирование в случае внештатных ситуаций"]

},
{
  id: "housing", icon: Home, label: "Проживание",
  content: [
  "Благоустроенное жильё — комнаты на 2–3 человека",
  "Бытовая техника, интернет и все удобства",
  "Организованная территория с охраной и инфраструктурой"]

},
{
  id: "food", icon: UtensilsCrossed, label: "Питание",
  content: [
  "Трёхразовое горячее питание в столовой",
  "Сбалансированное меню с учётом физических нагрузок",
  "Возможность диетического питания по медицинским показаниям"]

},
{
  id: "social", icon: FileCheck, label: "Гарантии",
  content: [
  "Официальное трудоустройство по ТК РФ",
  "Медицинская страховка (полис ОМС) + страховка от несчастных случаев",
  "Страховка на случай инвалидности; выплаты при травме или смерти",
  "Выплата при болезни — минимум 60% средней зарплаты по ТК РФ",
  "Оплаченное лечение 100% при производственной травме, сохранение рабочего места",
  "Оплачиваемый декретный отпуск и пособие по материнству (для женщин)",
  "Компенсация проезда к месту работы и обратно (100%)",
  "При прекращении контракта: выплата всех задолженных сумм + сертификат об опыте"]

},
{
  id: "privileges", icon: Star, label: "Привилегии",
  content: [
  "Земельный участок вне очереди на территории ЛНР или ДНР",
  "Присвоение статуса ветерана — федеральные и региональные льготы",
  "Налоговые послабления",
  "Льготное медицинское обслуживание",
  "Субсидии на коммунальные услуги",
  "Приоритетное право на санаторно-курортное лечение"]

},
{
  id: "career", icon: GraduationCap, label: "Обучение",
  content: [
  "Обучение и повышение квалификации за счёт работодателя",
  "Курсы, тренинги, сертификация",
  "Карьерный рост внутри программы и после её завершения",
  "Благодарственные письма и грамоты за добросовестный труд"]

}];


export default function ConditionsSection({ images }) {
  const [active, setActive] = useState("safety");
  const tab = TABS.find((t) => t.id === active);

  const imageMap = {
    contract: images.team,
    safety: images.security,
    housing: images.housing,
    food: images.dining,
    social: images.team,
    privileges: images.team,
    career: images.team
  };

  return (
    <section id="conditions" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden">
        <div className="text-center mb-16">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Условия</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Условия и гарантии
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TABS.map((t) =>
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
            active === t.id ?
            "bg-primary text-primary-foreground shadow-lg" :
            "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"}`
            }>
            
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
            <img
              src={imageMap[active]}
              alt={tab.label}
              className="w-full h-full object-cover" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <tab.icon className="h-5 w-5 text-accent" />
              <span className="text-white font-inter font-bold">{tab.label}</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-inter font-bold text-foreground mb-6">{tab.label}</h3>
            <ul className="space-y-4">
              {tab.content.map((item, i) =>
              <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  <span className="text-foreground font-inter">{item}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);

}
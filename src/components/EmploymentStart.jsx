import { X, CheckCircle2, ShieldCheck, Stethoscope, FileSignature, Bus, Clock } from "lucide-react";

/**
 * «НАЧАТЬ ТРУДОУСТРОЙСТВО» (наряд Мастера 13.11.2026).
 * Показывается сразу после заявки: человек видит весь путь по шагам и
 * может начать анкету, не теряя времени — вакансии закрываются.
 */
const STEPS = [
  { icon: CheckCircle2, title: "Заявка принята", text: "Ваши контакты уже в системе подбора. Куратор увидит заявку сегодня." },
  { icon: ShieldCheck, title: "Проверка СБ и документов", text: "2–3 рабочих дня: проверка документов и допуска на объект." },
  { icon: Stethoscope, title: "Медкомиссия (ВВК)", text: "Проходится в городе точки сбора — точку сбора вы выбираете в анкете, мы записываем и оплачиваем." },
  { icon: FileSignature, title: "Трудовой договор", text: "Оформление по ТК РФ с ООО «НВС»: оклад, подъёмные, вахта 3/1." },
  { icon: Bus, title: "Выезд на объект", text: "Групповой выезд с точки сбора, дорогу и жильё берём на себя." },
];

export default function EmploymentStart({ open, onClose, anketaUrl }) {
  if (!open) return null;
  const go = () => {
    if (anketaUrl) { window.location.href = anketaUrl; return; }
    window.location.href = "https://bro-crm.ru/form";
  };
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl p-6 sm:p-8">
        <button type="button" onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors" aria-label="Закрыть">
          <X className="h-4 w-4" />
        </button>

        <div className="inline-flex items-center gap-2 bg-accent/15 text-accent rounded-full px-3 py-1 mb-4">
          <Clock className="h-3.5 w-3.5" />
          <span className="text-xs font-inter font-bold">Вакансии закрываются — набор идёт сейчас</span>
        </div>

        <h3 className="font-inter font-black text-2xl text-foreground mb-2">Трудоустройство по шагам</h3>
        <p className="font-inter text-sm text-muted-foreground mb-6">
          Пять шагов от анкеты до выезда. Чем раньше заполните — тем больше шансов попасть в ближайшую группу.
        </p>

        <ol className="space-y-4 mb-6">
          {STEPS.map((s, i) => (
            <li key={i} className="flex gap-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-inter font-bold text-sm text-foreground">{i + 1}. {s.title}</div>
                <div className="font-inter text-xs text-muted-foreground mt-0.5">{s.text}</div>
              </div>
            </li>
          ))}
        </ol>

        <button type="button" onClick={go}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-4 px-6 transition-colors shadow-lg shadow-accent/20">
          Начать заполнение анкеты
        </button>
        <p className="font-inter text-[11px] text-muted-foreground text-center mt-3">
          Анкета занимает 10–15 минут. Данные защищены, передаются только в отдел подбора.
        </p>
      </div>
    </div>
  );
}

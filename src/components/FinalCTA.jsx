import { Phone, Mail, MessageSquare, Users } from "lucide-react";

export default function FinalCTA({ onOpenApplication, onCallback }) {
  const totalSlots = 200;
  const taken = 153;
  const remaining = totalSlots - taken;
  const percent = (taken / totalSlots) * 100;

  return (
    <section id="final-cta" className="py-24 sm:py-32 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent font-inter font-bold text-sm">Вахта запускается в июле</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-inter font-black text-white tracking-tight mb-6">
          Начните прямо сейчас
        </h2>

        <p className="text-lg text-white/60 font-inter font-light max-w-xl mx-auto mb-10">
          Заявки рассматриваются 3 дня → медкомиссия во вторник → отправка в пятницу
        </p>

        {/* Urgency: slots remaining */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              <span className="font-inter text-sm font-medium text-white/80">Осталось мест:</span>
            </div>
            <span className="font-mono text-2xl font-black text-accent">{remaining}</span>
          </div>
          <div className="text-xs text-white/50 font-inter mb-3">из {totalSlots} для набора в июле</div>
          {/* Progress bar */}
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div className="bg-accent h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/40 font-inter">
            <span>{taken} забронировано</span>
            <span>{remaining} свободно</span>
          </div>
        </div>

        {/* Two CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onOpenApplication}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-accent/25 transition-all hover:shadow-xl hover:scale-105"
          >
            Оставить заявку за 2 минуты
          </button>
          <button
            onClick={onCallback}
            className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/10 font-inter font-medium text-base px-8 py-4 rounded-xl transition-colors"
          >
            Задать вопрос менеджеру
          </button>
        </div>

        {/* Three contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <a href="tel:+74996864630" className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <Phone className="h-5 w-5 text-accent" />
            <span className="font-inter text-xs text-white/50">Телефон</span>
            <span className="font-inter text-sm font-semibold text-white">+7 (499) 686-46-30</span>
          </a>
          <a href="mailto:hh@vosstanovim-dnr.ru" className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <Mail className="h-5 w-5 text-accent" />
            <span className="font-inter text-xs text-white/50">Email</span>
            <span className="font-inter text-sm font-semibold text-white">hh@vosstanovim-dnr.ru</span>
          </a>
          <a href="https://max.ru/u/f9LHodD0cOLnAxokVgBK1HcwEnGhlBy0W7dVL4IAtZFgqRBl5Imbli5RDlY" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
            <MessageSquare className="h-5 w-5 text-accent" />
            <span className="font-inter text-xs text-white/50">Telegram</span>
            <span className="font-inter text-sm font-semibold text-white">Макс</span>
          </a>
        </div>
      </div>
    </section>
  );
}
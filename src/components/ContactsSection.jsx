import { Phone, MapPin, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactsSection({ onCallback }) {
  return (
    <section id="contacts" className="py-24 sm:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Связь</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Приём заявок и сотрудничество
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Программу реализует ООО «БРАТОУВЕРИЕ-СНБ» по поручению Правительства РФ
          </p>
        </div>

        {/* Единый телефон */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-8 text-center mb-8">
          <div className="text-white/60 font-inter text-sm mb-2">Единый телефон приёма заявок</div>
          <a href="tel:88002228463" className="text-3xl sm:text-4xl font-mono font-black text-accent hover:text-accent/80 transition-colors">
            8-800-222-84-63
          </a>
          <div className="text-white/60 font-inter text-sm mt-2">По вопросам трудоустройства граждан и сотрудничества с кадровыми агентствами · Звонок бесплатный</div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <a
              href="https://max.ru/u/f9LHodD0cOLnAxokVgBK1HcwEnGhlBy0W7dVL4IAtZFgqRBl5Imbli5RDlY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-inter font-semibold transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Написать в Макс
            </a>
            <Button
              onClick={onCallback}
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-inter font-semibold px-6 py-3"
            >
              <Phone className="h-4 w-4 mr-2" />
              Заказать обратный звонок
            </Button>
          </div>
        </div>

        {/* Email блоки */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-inter font-bold text-foreground text-sm">Сотрудничество с кадровыми агентствами</div>
                <div className="text-xs text-muted-foreground">Приём заявок от агентств, партнёрские программы</div>
              </div>
            </div>
            <a href="mailto:hh@bratouverie-snb.ru" className="block text-accent font-mono text-sm font-semibold hover:underline">
              hh@bratouverie-snb.ru
            </a>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              По вопросам партнёрства, агентских договоров и передачи кандидатов от кадровых агентств направляйте письма на указанный адрес.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-inter font-bold text-foreground text-sm">Трудоустройство граждан</div>
                <div className="text-xs text-muted-foreground">Приём резюме, вопросы по трудоустройству</div>
              </div>
            </div>
            <a href="mailto:hh@vosstanovim-dnr.ru" className="block text-accent font-mono text-sm font-semibold hover:underline">
              hh@vosstanovim-dnr.ru
            </a>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Для подачи заявки на участие в программе, вопросов о вакансиях, условиях труда и порядке трудоустройства направляйте письма на указанный адрес.
            </p>
          </div>
        </div>

        {/* Адреса офисов */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-6 py-4 border-b border-border flex-wrap">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent shrink-0" />
              <span className="font-inter font-medium text-foreground text-sm">г. Хабаровск, ул. Карла Маркса, д. 66</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent shrink-0" />
              <span className="font-inter font-medium text-foreground text-sm">г. Тамбов, ул. Коммунальная, 6</span>
            </div>
            <span className="text-xs text-muted-foreground font-inter">Пн–Пт 09:00–18:00, Сб 10:00–14:00</span>
          </div>
          <div className="h-64 sm:h-80 bg-muted">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=135.0550%2C48.4700%2C135.0850%2C48.4900&layer=mapnik&marker=48.4800%2C135.0700"
              className="w-full h-full border-0"
              title="Карта"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
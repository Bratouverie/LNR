import { Phone, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactsSection({ onCallback }) {
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=135.0550%2C48.4700%2C135.0850%2C48.4900&layer=mapnik&marker=48.4800%2C135.0700";

  return (
    <section id="contacts" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Контакты</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Свяжитесь с нами
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Отбор специалистов ведёт ООО «БРАТОУВЕРИЕ-СНБ»
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-accent/30 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-inter font-bold text-lg">ИА</span>
              </div>
              <div>
                <div className="font-inter font-bold text-foreground">Игорь Андреевич</div>
                <div className="font-mono text-sm text-muted-foreground">Специалист по отбору</div>
              </div>
            </div>
            <a
              href="tel:+79223120735"
              className="flex items-center gap-3 bg-accent/5 hover:bg-accent/10 text-foreground rounded-lg px-4 py-3 transition-colors"
            >
              <Phone className="h-4 w-4 text-accent" />
              <span className="font-mono text-sm font-medium">+7 922 312-07-35</span>
            </a>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:border-accent/30 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-inter font-bold text-lg">ЯЕ</span>
              </div>
              <div>
                <div className="font-inter font-bold text-foreground">Яков Евгеньевич</div>
                <div className="font-mono text-sm text-muted-foreground">Специалист по отбору</div>
              </div>
            </div>
            <a
              href="tel:+79191072244"
              className="flex items-center gap-3 bg-accent/5 hover:bg-accent/10 text-foreground rounded-lg px-4 py-3 transition-colors"
            >
              <Phone className="h-4 w-4 text-accent" />
              <span className="font-mono text-sm font-medium">+7 919 107-22-44</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="https://max.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-inter font-semibold transition-colors"
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

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <MapPin className="h-5 w-5 text-accent" />
            <span className="font-inter font-medium text-foreground">
              г. Хабаровск, ул. Карла Маркса, д. 66
            </span>
          </div>
          <div className="h-64 sm:h-80 bg-muted">
            <iframe
              src={mapUrl}
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
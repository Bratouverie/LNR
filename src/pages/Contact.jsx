import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

const contacts = [
  {
    icon: Phone,
    title: "Единый номер (бесплатно)",
    value: "8-800-222-84-63",
    href: "tel:88002228463",
    note: "Пн–Пт 09:00–18:00, Сб 10:00–14:00",
  },
  {
    icon: Mail,
    title: "Трудоустройство",
    value: "hh@vosstanovim-dnr.ru",
    href: "mailto:hh@vosstanovim-dnr.ru",
    note: "Вопросы по вакансиям и заявкам",
  },
  {
    icon: Mail,
    title: "Поддержка",
    value: "support@vosstanovim-dnr.ru",
    href: "mailto:support@vosstanovim-dnr.ru",
    note: "Техническая и общая поддержка",
  },
  {
    icon: Mail,
    title: "Партнёрство и агентства",
    value: "partner@bratouverie-snb.ru",
    href: "mailto:partner@bratouverie-snb.ru",
    note: "Сотрудничество с агентствами занятости",
  },
  {
    icon: MapPin,
    title: "Юридический адрес",
    value: "692510, Приморский край, г. Уссурийск, пер. Мирный, д. 1",
    href: null,
    note: "ООО «Братоуверие-СНБ»",
  },
  {
    icon: MapPin,
    title: "Фактический офис",
    value: "г. Хабаровск, ул. Карла Маркса, д. 66",
    href: null,
    note: "Основной операционный офис",
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary pt-12 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-inter text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <h1 className="text-3xl sm:text-4xl font-inter font-black text-white tracking-tight">
            Контакты
          </h1>
          <p className="text-white/60 font-inter text-base mt-3">
            Свяжитесь с нами любым удобным способом — ответим в течение часа в рабочее время.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {contacts.map(({ icon: Icon, title, value, href, note }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <div className="font-inter text-xs text-muted-foreground mb-0.5">{title}</div>
                {href ? (
                  <a href={href} className="font-inter font-semibold text-sm text-foreground hover:text-accent transition-colors">
                    {value}
                  </a>
                ) : (
                  <p className="font-inter font-semibold text-sm text-foreground">{value}</p>
                )}
                {note && <p className="font-inter text-xs text-muted-foreground mt-0.5">{note}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-accent" />
              <h2 className="font-inter font-bold text-white">Часы работы</h2>
            </div>
            <p className="font-inter text-white/70 text-sm">Понедельник – Пятница: 09:00 – 18:00</p>
            <p className="font-inter text-white/70 text-sm">Суббота: 10:00 – 14:00</p>
            <p className="font-inter text-white/50 text-sm">Воскресенье: выходной</p>
          </div>
          <a
            href="tel:88002228463"
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold px-6 py-3 rounded-xl transition-colors text-sm shrink-0"
          >
            <Phone className="h-4 w-4" />
            Позвонить бесплатно
          </a>
        </div>
      </div>
    </div>
  );
}
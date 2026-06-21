import { Link } from "react-router-dom";
import { ArrowLeft, Users, MapPin, Shield, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary pt-12 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white font-inter text-sm mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <h1 className="text-3xl sm:text-4xl font-inter font-black text-white tracking-tight">
            О программе восстановления ЛНР и ДНР
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        <section className="prose-custom">
          <p className="font-inter text-base text-muted-foreground leading-relaxed mb-4">
            Портал <strong className="text-foreground">vosstanovim-dnr.ru</strong> — официальный рекрутинговый ресурс программы комплексного восстановления Луганской и Донецкой Народных Республик, реализуемой при поддержке Правительства Российской Федерации. Мы связываем квалифицированных специалистов из всех регионов страны с работодателями, которые занимаются реальным восстановлением жилья, инфраструктуры и социальных объектов на новых территориях.
          </p>
          <p className="font-inter text-base text-muted-foreground leading-relaxed mb-4">
            Портал создан для рабочих, водителей, инженеров, медицинских работников, специалистов по безопасности и операторов специализированной техники, которые хотят принять участие в масштабных строительных проектах государственной важности. Участники программы получают официальное трудоустройство по трудовому договору, конкурентоспособную заработную плату от 300 000 рублей в месяц, единовременные подъёмные в размере 625 000 рублей, полное страховое покрытие до 14 700 000 рублей, а также бесплатное проживание, питание и транспортное обеспечение.
          </p>
          <p className="font-inter text-base text-muted-foreground leading-relaxed mb-4">
            Оператором программы трудоустройства выступает ООО «Братоуверие-СНБ» — компания с подтверждённым опытом работы в сфере строительства и восстановления объектов в сложных условиях. Головной офис расположен в Приморском крае, г. Уссурийск. Работа ведётся на объектах в Мариуполе, Луганске, Макеевке, Алчевске и других городах ДНР и ЛНР.
          </p>
          <p className="font-inter text-base text-muted-foreground leading-relaxed">
            Мы ценим каждого участника программы и обеспечиваем полную прозрачность условий сотрудничества: все договорённости закрепляются в официальном трудовом договоре ещё до выезда на объект. Наша цель — дать людям возможность внести вклад в историческое восстановление страны и при этом обеспечить им достойные условия труда, безопасность и справедливое вознаграждение.
          </p>
        </section>

        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { icon: Users, title: "Для кого программа", text: "Рабочие, водители, инженеры, медики, охранники, операторы БПЛА и другие специалисты из всех регионов России." },
            { icon: MapPin, title: "География работ", text: "Мариуполь, Луганск, Макеевка, Алчевск и другие города ЛНР и ДНР." },
            { icon: TrendingUp, title: "Условия участия", text: "Официальный трудовой договор, зарплата от 300 000 ₽/мес, подъёмные 625 000 ₽, жильё и питание бесплатно." },
            { icon: Shield, title: "Кто организует", text: "ООО «Братоуверие-СНБ» при поддержке Правительства РФ. ИНН: 2511135442, ОГРН: 1262500006966." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h2 className="font-inter font-bold text-sm text-foreground mb-1">{title}</h2>
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap">
          <Link to="/contact" className="bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold px-6 py-3 rounded-xl transition-colors text-sm">
            Связаться с нами
          </Link>
          <Link to="/" className="bg-secondary hover:bg-secondary/80 text-foreground font-inter font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
            Смотреть вакансии
          </Link>
        </div>
      </div>
    </div>
  );
}
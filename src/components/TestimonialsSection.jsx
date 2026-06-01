import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Алексей М.",
    role: "Строитель, Хабаровск",
    text: "Поехал с опаской, но всё оказалось именно так, как описывали. Получил 2 500 000 ₽ подъёмных при подписании договора, жильё нормальное, кормят хорошо. Зарплата 230 000 в месяц — за год заработал больше, чем за три года дома. Уже оформил земельный участок в ЛНР.",
    stars: 5,
    duration: "1 год в программе",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Дмитрий К.",
    role: "Водитель кат. C, Владивосток",
    text: "Работаю на технике, возим стройматериалы. Платят вовремя, дважды в месяц как обещали — получаю около 180 000 в месяц плюс надбавки. Охрана хорошая — ни разу не чувствовал угрозы. Рекомендую тем, кто не боится работать.",
    stars: 5,
    duration: "8 месяцев в программе",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Сергей Н.",
    role: "Инженер связи, Хабаровск",
    text: "Специалистов по моей профессии берут с удовольствием. Условия хорошие, задачи интересные — восстанавливаем связь в ЛНР. Зарплата 240 000 ₽/мес, документы оформили быстро, все выплаты пришли точно в срок.",
    stars: 5,
    duration: "6 месяцев в программе",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Игорь В.",
    role: "Разнорабочий, Комсомольск-на-Амуре",
    text: "Без специальности взяли разнорабочим. Обучили прямо на месте. Получаю 200 000 в месяц — это намного больше, чем я зарабатывал дома. Ребята в бригаде хорошие, дружный коллектив.",
    stars: 4,
    duration: "4 месяца в программе",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Михаил Т.",
    role: "Охранник, Биробиджан",
    text: "Прошёл службу, поэтому опыт есть. Условия хорошие: посты оборудованы, видеонаблюдение работает. Получаю около 195 000 в месяц плюс надбавки за ночные смены. Начальство адекватное.",
    stars: 5,
    duration: "9 месяцев в программе",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Николай Р.",
    role: "Автослесарь, Хабаровск",
    text: "Занимаюсь ремонтом техники на базе. Работы много, но и платят соответственно — около 220 000 в месяц. За полгода отложил больше, чем мог за два года дома. Семья довольна. После контракта планирую продлить.",
    stars: 5,
    duration: "6 месяцев в программе",
    photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop&crop=face",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Отзывы</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Истории участников
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Реальные отзывы участников программы восстановления ЛНР и ДНР.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-accent/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-3">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div>
                  <div className="font-inter font-bold text-sm text-foreground">{t.name}</div>
                  <div className="font-inter text-xs text-muted-foreground">{t.role}</div>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} className="h-3 w-3 fill-accent text-accent" />
                    ))}
                    {[...Array(5 - t.stars)].map((_, s) => (
                      <Star key={s} className="h-3 w-3 text-muted-foreground" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <Quote className="h-6 w-6 text-accent/20 absolute -top-1 -left-1" />
                <p className="font-inter text-sm text-muted-foreground leading-relaxed pl-4">
                  {t.text}
                </p>
              </div>

              <div className="mt-auto pt-3 border-t border-border">
                <span className="font-mono text-xs text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full">
                  {t.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
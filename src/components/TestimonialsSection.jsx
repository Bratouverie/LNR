import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Алексей М.",
    role: "Строитель, Омск",
    text: "Поехал с опаской, но всё оказалось именно так, как описывали. Получил 625 000 ₽ подъёмных при подписании, жильё нормальное, кормят хорошо. За год заработал больше, чем за три года дома. Уже оформил земельный участок в ЛНР.",
    stars: 5,
    duration: "1 год в программе",
    photo: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/df7c0fdaf_.png",
  },
  {
    name: "Дмитрий К.",
    role: "Водитель кат. C, Тюмень",
    text: "Работаю на технике, возим стройматериалы. Платят вовремя, дважды в месяц — около 350 000 плюс надбавки за безаварийную работу. Охрана хорошая, ни разу не чувствовал угрозы. Рекомендую тем, кто не боится работать.",
    stars: 5,
    duration: "8 месяцев в программе",
    photo: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/924a2e8fd_.png",
  },
  {
    name: "Игорь В.",
    role: "Разнорабочий, Бийск",
    text: "Без специальности взяли разнорабочим. Обучили на месте. Получаю 320 000 в месяц — больше, чем зарабатывал дома. Ребята в бригаде хорошие. Минус — скучаю по семье, но интернет помогает. Буду продлевать контракт.",
    stars: 4,
    duration: "4 месяца в программе",
    photo: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/5c14a0714_.png",
  },
  {
    name: "Михаил Т.",
    role: "Охранник, Саратов",
    text: "Прошёл службу, опыт есть. Условия нормальные: посты оборудованы, видеонаблюдение работает. Получаю около 330 000 плюс ночные. Начальство адекватное. Первые недели было тревожно из-за обстановки, потом привык.",
    stars: 4,
    duration: "9 месяцев в программе",
    photo: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/ec3c66fdb_.png",
  },
  {
    name: "Андрей П.",
    role: "Разнорабочий, Красноярск",
    text: "Работа тяжёлая, не буду скрывать. Физически непросто, особенно первые недели. Но платят честно — все суммы как обещали. Жильё и питание включены, это плюс. Был один тревожный момент, но охрана сработала чётко. В целом доволен, но это не для всех.",
    stars: 3,
    duration: "3 месяца в программе",
    photo: "https://media.base44.com/images/public/69f4a665db2c72a42818d397/440293e06_.png",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Отзывы</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Голоса участников: правда без прикрас
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Реальные отзывы — включая критические. Мы не скрываем недостатки.
          </p>
        </div>

        {/* Rating summary */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[5, 4, 3].map((rating) => {
            const count = TESTIMONIALS.filter((t) => t.stars === rating).length;
            return (
              <div key={rating} className="bg-card border border-border rounded-lg px-4 py-2 flex items-center gap-2">
                <span className="font-inter text-xs text-muted-foreground">{rating}★</span>
                <div className="flex gap-0.5">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                  ))}
                </div>
                <span className="font-mono text-xs font-bold text-foreground">{count}</span>
              </div>
            );
          })}
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
                      <Star key={s} className="h-3 w-3 text-muted-foreground/30" />
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
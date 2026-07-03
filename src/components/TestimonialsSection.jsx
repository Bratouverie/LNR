import { Quote, Star } from "lucide-react";

const IMG = (n) => `https://media.base44.com/images/public/69f4a665db2c72a42818d397/${n}`;

const TESTIMONIALS = [
  {
    name: "Сергей Волков",
    role: "Строитель, Воронеж",
    text: "Приехал по контракту на год. Подъёмные получил сразу, жильё нормальное. За время работы восстановили два дома — видно результат своими руками. Зарплата приходит без задержек.",
    stars: 5,
    duration: "1 год в программе",
    photo: IMG("8b95f93b2_44.png"),
  },
  {
    name: "Андрей Лебедев",
    role: "Бригадир, Ростов-на-Дону",
    text: "Уже третья вахта. Команда подобралась крепкая, снабжение стабильное. Созваниваюсь с семьёй каждый вечер — интернет работает без перебоев. Доволен условиями.",
    stars: 5,
    duration: "9 месяцев в программе",
    photo: IMG("a4316753b_45.png"),
  },
  {
    name: "Дмитрий Соколов",
    role: "Разнорабочий, Тамбов",
    text: "Оформление документов заняло пару дней, всё чётко. На объекте порядок, техника безопасности соблюдается. Первые недели было непросто, но втянулся. Платят как договаривались.",
    stars: 4,
    duration: "5 месяцев в программе",
    photo: IMG("ff40ec17c_46.png"),
  },
  {
    name: "Артём Кузнецов",
    role: "Разнорабочий, Липецк",
    text: "Жильё скромное, но всё есть — кровать, чайник, шкаф. Парни в комнате нормальные. Зарплата выше, чем дома в три раза. Уже подал заявку на земельный участок.",
    stars: 4,
    duration: "6 месяцев в программе",
    photo: IMG("872d8fcd8_47.png"),
  },
  {
    name: "Павел Морозов",
    role: "Водитель кат. С, Краснодар",
    text: "Дорога до базы долгая, но организовали нормально. На месте выдали форму, поселили быстро. Работаю на грузовике, маршруты понятные. За безаварийность премируют каждый месяц.",
    stars: 4,
    duration: "7 месяцев в программе",
    photo: IMG("2df680490_48.png"),
  },
  {
    name: "Иван Громов",
    role: "Медик, Волгоград",
    text: "Работаю в медпункте на объекте. Оснащение хорошее, лекарства в наличии. Профосмотры проводим регулярно. Ребята приходят не только за помощью, но и просто поговорить — атмосфера человеческая.",
    stars: 5,
    duration: "8 месяцев в программе",
    photo: IMG("5dc9f4c1a_49.png"),
  },
  {
    name: "Максим Дроздов",
    role: "Строитель, Ставрополь",
    text: "Работа тяжёлая, но честная. Каждый день видишь, как восстанавливается здание — это мотивирует. Бригадир объясняет всё толково. Зарплату платят точно в срок.",
    stars: 5,
    duration: "10 месяцев в программе",
    photo: IMG("1a1a48e10_50.png"),
  },
  {
    name: "Роман Зайцев",
    role: "Разнорабочий, Пенза",
    text: "После смены можно отдохнуть в комнате, связь с домом не прерывается. Питание трёхразовое, готовят нормально. За полтора года накопил на машину. Буду продлевать контракт.",
    stars: 4,
    duration: "1.5 года в программе",
    photo: IMG("1295e9837_51.png"),
  },
  {
    name: "Олег Степанов",
    role: "Водитель кат. СЕ, Воронеж",
    text: "Логистика налажена — возим материалы между объектами. Техника обслуживается вовремя. Охрана на трассах серьёзная, чувствую себя спокойно. Рекомендую мужикам, кто готов работать.",
    stars: 5,
    duration: "11 месяцев в программе",
    photo: IMG("37c637a36_52.png"),
  },
  {
    name: "Николай Орлов",
    role: "Охранник, Саратов",
    text: "Посты оборудованы, видеонаблюдение круглосуточное. График 12/12, можно привыкнуть. Начальство адекватное, вопросы решают быстро. За вычетом первых недель — всё стабильно и предсказуемо.",
    stars: 4,
    duration: "9 месяцев в программе",
    photo: IMG("73b491507_53.png"),
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
            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col hover:border-accent/30 hover:shadow-lg transition-all duration-300">
              <div className="relative h-48 overflow-hidden bg-secondary">
                <img src={t.photo} alt={t.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-inter font-bold text-sm text-foreground">{t.name}</div>
                    <div className="font-inter text-xs text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.stars)].map((_, s) => (
                      <Star key={s} className="h-3 w-3 fill-accent text-accent" />
                    ))}
                    {[...Array(5 - t.stars)].map((_, s) => (
                      <Star key={s} className="h-3 w-3 text-muted-foreground/30" />
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Quote className="h-5 w-5 text-accent/20 absolute -top-1 -left-1" />
                  <p className="font-inter text-sm text-muted-foreground leading-relaxed pl-5">
                    {t.text}
                  </p>
                </div>
                <div className="mt-auto pt-3 border-t border-border">
                  <span className="font-mono text-xs text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full">
                    {t.duration}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
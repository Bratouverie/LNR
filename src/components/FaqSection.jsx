import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "Какой минимальный и максимальный возраст?",
    a: "Возраст участников: 18–60 лет. Отбор производится в соответствии с компетенциями кандидата, опытом и состоянием здоровья.",
  },
  {
    q: "Какой опыт работы нужен?",
    a: "Для большинства вакансий — от 1 года. Разнорабочим принимают без опыта (обучение на месте). Для водителей, инженеров, взрывотехников требуется подтверждённая квалификация.",
  },
  {
    q: "Есть ли образование как требование?",
    a: "Для разнорабочих — среднее образование. Для специалистов (инженеры, медработники) — профильное среднее или высшее образование по специальности.",
  },
  {
    q: "Могу ли я работать с семьёй (жена, брат)?",
    a: "Да, если оба подходят по требованиям. Размещение раздельное, но можно подать заявки одновременно и попасть на один объект. Укажите родственные связи в заявке.",
  },
  {
    q: "Что будет, если заболею на вахте?",
    a: "Медпункт на базе работает 24/7. Лечение бесплатное, лекарства выдаются. При необходимости — больничный (60–80% зарплаты). Страховка покрывает все расходы. Психолог доступен круглосуточно.",
  },
  {
    q: "Могу ли я уехать домой в исключительных обстоятельствах?",
    a: "Да. По семейным обстоятельствам (смерть родственника, болезнь близких) возможен выезд домой за счёт работодателя. Заявление подаётся руководителю объекта, рассматривается оперативно.",
  },
  {
    q: "Как получить земельный участок в ДНР?",
    a: "После завершения контракта (3 месяца) подаётся заявление. Участок 0,25 га выделяется в течение 1–3 месяцев. Оформление бесплатно. Можно выбрать ДНР или ЛНР.",
  },
  {
    q: "Налоги — за чей счёт?",
    a: "НДФЛ 13% удерживается из зарплаты. Страховые взносы (ПФР 22%) платит работодатель. Подъёмные 625 000 ₽ выплачиваются без вычета налогов. Налоговый вычет 13% можно вернуть через декларацию ФНС.",
  },
  {
    q: "Могу ли я работать два контракта подряд?",
    a: "Да. При продлении на 2-й контракт — повышение зарплаты на 10–15%. При 2+ контрактах — право на грант 300 000 ₽ на открытие бизнеса.",
  },
  {
    q: "Как часто летают домой?",
    a: "После завершения контракта (3 месяца) — отправка домой за счёт программы (авиа или ж/д). Во время контракта — выходные в городах ЛНР/ДНР (Макеевка, Мариуполь, Луганск, Алчевск).",
  },
  {
    q: "Есть ли семейные льготы?",
    a: "Да: ежемесячная выплата на ребёнка 20 000 ₽, покрытие ипотеки до 400 000 ₽ на период вахты, единовременное пособие при рождении ребёнка 25 000 ₽.",
  },
  {
    q: "Что будет при политическом конфликте?",
    a: "Трудовой договор составлен по ТК РФ. При любых обстоятельствах ваши права защищены трудовым законодательством. Все споры решаются через трудовую инспекцию или суд.",
  },
  {
    q: "Кто платит страховку?",
    a: "Страховка полностью оплачена работодателем. Покрытие: от 1 500 000 ₽ (травма) до 14 700 000 ₽ (максимальная выплата). При инвалидности — 9 000 000 ₽.",
  },
  {
    q: "Как связаться с поддержкой, если проблемы?",
    a: "Горячая линия: 8-800-222-84-63 (бесплатно). Юрист: +7 (4212) 51-59-30 доб. 704. Психолог: 24/7 на базе. Email: support@bratouverie-snb.ru",
  },
  {
    q: "Это не контракт с Минобороны?",
    a: "Нет. Это гражданский трудовой договор с ООО «Братоуверие-СНБ» по ТК РФ. Вы занимаетесь восстановительными работами. Оружие не выдаётся. Уволиться можно в любой момент по ТК РФ.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left bg-card hover:bg-secondary/40 transition-colors"
      >
        <span className="font-inter font-semibold text-sm text-foreground">{q}</span>
        {open ? <ChevronUp className="h-4 w-4 text-accent shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-5 py-4 bg-secondary/20 border-t border-border">
          <p className="font-inter text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqSection() {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            15 самых важных вопросов
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Только ключевые вопросы без воды — честные и прямые ответы
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
          <p className="font-inter font-semibold text-base text-foreground mb-4">
            Не нашли ответ? Задайте вопрос напрямую:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-3">
            <a href="tel:88002228463" className="text-accent hover:underline font-semibold text-sm font-inter">
              ☎ 8-800-222-84-63 (бесплатно)
            </a>
            <a href="mailto:hh@vosstanovim-dnr.ru" className="text-accent hover:underline font-semibold text-sm font-inter">
              📧 hh@vosstanovim-dnr.ru
            </a>
            <a
              href="https://max.ru/u/f9LHodD0cOLnAxokVgBK1HcwEnGhlBy0W7dVL4IAtZFgqRBl5Imbli5RDlY"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-semibold text-sm font-inter"
            >
              💬 Написать в Макс
            </a>
          </div>
          <p className="font-inter text-xs text-muted-foreground italic">Вахта запускается в июле</p>
        </div>
      </div>
    </section>
  );
}
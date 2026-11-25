import { ShieldCheck, CheckCircle, MessageSquare, FileText } from "lucide-react";

/**
 * ПЕРЕРАБОТАНО ПО СЛОВУ МАСТЕРА 26.11.2026.
 * Было противоречие: заголовок «100% НЕ контракт с МО РФ» и ответ «контракт с Минобороны
 * не заключается» — при этом по Правилам № 2255 (п. 18) контракт с Минобороны подписывается
 * в пункте сбора. Человек, дочитав до документа, ловил нас на слове.
 * Теперь честно и как выгода: работа гражданская, а контракт — защита, которая закрепляет
 * статус ветерана, выплаты, жильё, медицину, страховку и бронирование.
 */
const QA_ITEMS = [
  {
    q: "Придётся ли подписывать контракт с Минобороны?",
    a: "Да, один раз и в пункте сбора. И это ваша защита, а не повинность: контракт закрепляет статус ветерана боевых действий, ежемесячную выплату, 50% на жильё и коммунальные услуги, страховку, кредитные каникулы и бронирование. До подписи вы читаете все пункты и можете показать документ юристу.",
  },
  {
    q: "Работа будет гражданской или боевой?",
    a: "Гражданской. Вы восстанавливаете инфраструктуру по своей специальности: сварка, монтаж, электрика, отделка, логистика. К боевым задачам вас не привлекают, оружие не выдают.",
  },
  {
    q: "Могу ли я уйти в любой момент?",
    a: "Да. Вы подаёте заявление на увольнение за 2 недели по ТК РФ. Все заработанные средства выплачиваются в полном объёме.",
  },
  {
    q: "На каком основании я нахожусь в ЛНР/ДНР?",
    a: "По служебному удостоверению и пропуску. Вы имеете гражданский статус — работник программы восстановления.",
  },
  {
    q: "Что будет при ранении?",
    a: "Обязательное государственное страхование: выплаты от 1 500 000 ₽ до 14 700 000 ₽ в срок 15 дней после документов, бесплатное лечение, сохранение рабочего места, пособие по нетрудоспособности (≥60% зарплаты).",
  },
  {
    q: "Как проверить компанию?",
    a: "ОГРН 1247700464880, ИНН 9725162767, КПП 772001001. Проверить можно в ЕГРЮЛ и на сайте ФНС по реквизитам.",
  },
  {
    q: "Кто контролирует мои права?",
    a: "Трудовая инспекция РФ, администрации ЛНР/ДНР, уполномоченный по правам человека. Бесплатный юрист на базе 24/7.",
  },
];

export default function NotMilitaryContract() {
  return (
    <section id="not-military" className="py-24 sm:py-32 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-accent" />
            <span className="text-accent font-inter font-bold text-sm">Гражданская работа · контракт как защита</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground tracking-tight">
            Работа гражданская.
            <br />
            <span className="text-accent">Контракт — ваша защита, а не повинность.</span>
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            7 прямых ответов: что вы подписываете, что получаете и чего с вами не будет
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {QA_ITEMS.map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                  <span className="font-mono text-xs font-bold text-accent">{i + 1}</span>
                </div>
                <h3 className="font-inter font-bold text-sm text-foreground pt-1">{item.q}</h3>
              </div>
              <div className="flex items-start gap-2 pl-11">
                <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="font-inter text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <p className="font-inter text-sm text-muted-foreground text-center max-w-lg">
            Трудовой договор по Трудовому кодексу РФ плюс контракт с Минобороны в пункте сбора. Условия и льготы — в разделе{" "}
            <a href="#contract-2255" className="text-accent font-semibold hover:underline">16 положений Правил № 2255</a>.
          </p>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <a
              href="#contract-2255"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-inter font-bold text-sm text-primary-foreground hover:opacity-90 transition"
            >
              <FileText className="h-4 w-4" />
              Что даёт контракт: 16 положений
            </a>
            <a
              href="#callback"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-3 font-inter font-bold text-sm text-foreground hover:border-accent hover:text-accent transition"
            >
              <MessageSquare className="h-4 w-4" />
              Консультация юриста бесплатно
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

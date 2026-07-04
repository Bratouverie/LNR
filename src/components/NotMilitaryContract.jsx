import { ShieldX, CheckCircle, MessageSquare } from "lucide-react";

const QA_ITEMS = [
  {
    q: "Это не контракт с Минобороны?",
    a: "Нет. Контракт заключается только с ООО «Братоуверие-СНБ» по Трудовому кодексу РФ. Это гражданская работа на восстановлении инфраструктуры.",
  },
  {
    q: "Могу ли я уйти в любой момент?",
    a: "Да. Вы подаёте заявление на увольнение за 2 недели (по ТК РФ). Все заработанные средства выплачиваются в полном объёме.",
  },
  {
    q: "Будут ли выдавать оружие?",
    a: "Нет. Вооружённая охрана объектов — задача ВС РФ и ЧОП. Вы занимаетесь гражданской работой по своей специальности.",
  },
  {
    q: "На каком основании я нахожусь в ЛНР/ДНР?",
    a: "По служебному удостоверению и пропуску. Вы имеете гражданский статус — работник программы восстановления.",
  },
  {
    q: "Что будет при ранении?",
    a: "Страховка от 1 500 000 ₽ до 14 700 000 ₽, бесплатное лечение, сохранение рабочего места, пособие по нетрудоспособности (≥60% зарплаты).",
  },
  {
    q: "Как проверить компанию?",
    a: "ОГРН 1262500006966, ИНН 2511135442, КПП 251101001. Проверить можно в ЕГАИС и на сайте ФНС по реквизитам.",
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
            <ShieldX className="h-5 w-5 text-accent" />
            <span className="text-accent font-inter font-bold text-sm">100% НЕ контракт с МО РФ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground tracking-tight">
            Это гражданская работа, а не военный контракт.
            <br />
            <span className="text-accent">Честно.</span>
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            7 прямых вопросов и честных ответов о том, чем эта работа НЕ является
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

        {/* Contract note + CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4">
          <p className="font-inter text-sm text-muted-foreground text-center max-w-lg">
            Типовой трудовой договор по Трудовому кодексу РФ. Ознакомьтесь с условиями контракта в разделе{" "}
            <a href="#vacancies" className="text-accent font-semibold hover:underline">Вакансии</a>.
          </p>
          <a
            href="tel:88002228463"
            className="flex items-center gap-2 border border-border hover:border-accent hover:text-accent font-inter font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <MessageSquare className="h-4 w-4" />
            Консультация юриста бесплатно
          </a>
        </div>
      </div>
    </section>
  );
}
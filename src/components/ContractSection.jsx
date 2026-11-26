import { ShieldCheck, CheckCircle2, FileText, MessageSquare, Star, Wallet, Home, HeartPulse, Ban, CalendarDays, CreditCard, Stethoscope, Lock } from "lucide-react";
import { CONTRACT_DOC } from "@/lib/contractValue";

/**
 * ОДИН БЛОК О КОНТРАКТЕ (слово Мастера 26.11.2026).
 * Было два блока подряд (#not-military и #contract-2255) и внутри второго — внутренняя
 * инструкция куратора для менеджера. Инструкция снята с сайта и из публичного кода:
 * она нужна только менеджеру в руководстве, кандидату её читать нельзя.
 * Осталось самое важное для убеждения: четыре главные выгоды цифрами, три прямых ответа
 * на страхи, шесть гарантий строкой и ссылка на полный документ.
 */

const MAIN_FACTS = [
  { icon: Star, value: "Ветеран", label: "статус ветерана боевых действий и удостоверение" },
  { icon: Wallet, value: "4 838,63 ₽", label: "ежемесячная выплата, индексируется с 1 февраля" },
  { icon: Home, value: "50%", label: "жильё и капремонт, включая семью" },
  { icon: HeartPulse, value: "до 14,7 млн ₽", label: "страхование, выплата за 15 дней" },
];

const ANSWERS = [
  {
    q: "Придётся ли подписывать контракт с Минобороны?",
    a: "Да, один раз и в пункте сбора. До подписи вы читаете все пункты и можете показать документ юристу. Это защита, которая закрепляет льготы, а не повинность.",
  },
  {
    q: "Работа гражданская или боевая?",
    a: "Гражданская: восстановление инфраструктуры по вашей специальности. К боевым задачам не привлекают, оружие не выдают, на время работы вы забронированы.",
  },
  {
    q: "Можно ли уйти в любой момент?",
    a: "Да: заявление за две недели по ТК РФ. Всё заработанное выплачивается в полном объёме.",
  },
];

const MORE = [
  { icon: Ban, text: "Бронирование на весь период работы: к военным действиям привлечь нельзя" },
  { icon: CreditCard, text: "Кредитные каникулы на срок контракта плюс 30 дней, для вас и семьи" },
  { icon: CalendarDays, text: "Отпуск в удобное время и до 35 дней без сохранения зарплаты" },
  { icon: Stethoscope, text: "Медпомощь вне очереди, протезирование, госпитали ветеранов войн" },
  { icon: Wallet, text: "Доход по контракту не облагается НДФЛ в предусмотренных законом случаях" },
  { icon: Lock, text: "Семье — 5 000 000 ₽; сведения об объектах и маршрутах закрыты по закону" },
];

export default function ContractSection() {
  return (
    <section id="contract" className="py-20 sm:py-28 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-2 mb-5">
            <ShieldCheck className="h-4 w-4 text-accent" />
            <span className="text-accent font-inter font-bold text-xs sm:text-sm">Гражданская работа · контракт как защита</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground tracking-tight">
            Работа гражданская.
            <br />
            <span className="text-accent">Контракт — ваша защита, а не повинность.</span>
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Подписывается один раз, в пункте сбора. Вот что он вам даёт — коротко и по документу.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {MAIN_FACTS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-4 text-center">
              <Icon className="h-5 w-5 text-accent mx-auto mb-2" />
              <div className="font-inter font-black text-lg text-foreground leading-tight">{value}</div>
              <div className="font-inter text-[12px] text-muted-foreground leading-snug mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {ANSWERS.map((item) => (
            <div key={item.q} className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-inter font-bold text-sm text-foreground leading-snug">{item.q}</h3>
              <div className="flex items-start gap-2 mt-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <p className="font-inter text-[13px] text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-secondary/40 border border-border rounded-xl p-4 sm:p-5">
          <h3 className="font-inter font-bold text-sm text-foreground mb-3">Ещё по Правилам № 2255</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {MORE.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2">
                <Icon className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span className="font-inter text-[13px] text-muted-foreground leading-snug">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="font-inter text-xs text-muted-foreground text-center max-w-lg">
            Трудовой договор по ТК РФ на вахту 3+1 и контракт с Минобороны в пункте сбора. Полный текст —
            Приложение № 9 к госпрограмме, {CONTRACT_DOC.pages} страниц.
          </p>
          <div className="grid w-full gap-3 sm:grid-cols-2">
            <a
              href={CONTRACT_DOC.urlFull}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-inter font-bold text-sm text-white shadow-lg shadow-accent/25 hover:bg-accent/90 transition"
            >
              <FileText className="h-4 w-4" />
              Открыть документ: Правила № 2255
            </a>
            <a
              href="#callback"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-accent/30 bg-white px-5 py-3 font-inter font-bold text-sm text-[#0B2545] hover:border-accent hover:bg-accent/5 transition"
            >
              <MessageSquare className="h-4 w-4" />
              Бесплатная консультация юриста
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

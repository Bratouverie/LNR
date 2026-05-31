import { FileText, Phone, Stethoscope, PenTool, Plane } from "lucide-react";

const STEPS = [
  { icon: FileText, num: "01", title: "Оставить заявку", desc: "Заполните форму на сайте или позвоните нам" },
  { icon: Phone, num: "02", title: "Собеседование", desc: "По телефону или через мессенджер «Макс»" },
  { icon: Stethoscope, num: "03", title: "Медкомиссия", desc: "г. Хабаровск, ул. Карла Маркса, д. 66 или г. Тамбов, ул. Коммунальная, 6 (Тамбовская область) и др. города (уточнять)" },
  { icon: PenTool, num: "04", title: "Подготовка", desc: "Оформление документов и зачисление в программу" },
  { icon: Plane, num: "05", title: "Отправка на вахту", desc: "Сбор в Хабаровске, Тамбове или др. городе (будет доведено своевременно) → отправка к месту работы, подписание трудового договора" },
];

export default function HowToJoinSection() {
  return (
    <section id="how-to-join" className="py-24 sm:py-32 bg-secondary/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Процесс</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Как присоединиться
          </h2>
        </div>

        {/* Progress Rail */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-border sm:-translate-x-px" />

          <div className="space-y-12">
            {STEPS.map((step, i) => (
              <div key={step.num} className={`relative flex items-start gap-6 sm:gap-12 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                {/* Content */}
                <div className={`flex-1 sm:text-${i % 2 === 0 ? "right" : "left"} pl-16 sm:pl-0`}>
                  <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300 inline-block text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className="h-5 w-5 text-accent" />
                      <span className="font-mono text-xs text-accent font-bold">{step.num}</span>
                    </div>
                    <h3 className="font-inter font-bold text-lg text-foreground">{step.title}</h3>
                    <p className="font-inter text-sm text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-4 border-background shadow-sm z-10 mt-8" />

                {/* Spacer for other side */}
                <div className="hidden sm:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
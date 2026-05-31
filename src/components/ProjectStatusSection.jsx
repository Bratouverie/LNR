import { Shield, Building, FileText, Phone, Mail, MapPin } from "lucide-react";

const DOCS = [
  {
    num: "1",
    title: "Постановление Правительства РФ №2255",
    date: "22.12.2023",
    desc: "«О программе восстановления инфраструктуры Луганской и Донецкой народных республик»",
    items: ["Утверждение программы восстановления", "Выделение финансирования", "Назначение ответственных органов", "Установление сроков и целевых показателей"],
    status: "Действующий, без изменений",
  },
  {
    num: "2",
    title: "Указ Президента РФ №121",
    date: "01.03.2022",
    desc: "«О мерах по поддержке граждан, принимающих участие в специальной военной операции»",
    items: ["Распространяется на участников программы восстановления", "Социальная поддержка, пенсии, земельные участки, налоговые льготы"],
    status: "Действующий",
  },
  {
    num: "3",
    title: "Указ Президента РФ №372",
    date: "05.05.2023",
    desc: "«О мерах по поддержке семей лиц, принимающих участие в специальной военной операции»",
    items: ["Социальная поддержка семей участников программы", "Пособия на детей, помощь при смерти, компенсации"],
    status: "Действующий",
  },
  {
    num: "4",
    title: "Приказ Администрации Хабаровска",
    date: "",
    desc: "Учреждение координационного центра программы",
    items: ["Ответственность: Администрация Хабаровска", "Контроль реализации, выделение ресурсов"],
    status: "Действующий",
  },
];

const SUPPORT = [
  { label: "Федеральное финансирование", items: ["Прямое финансирование из Федерального казначейства", "Гарантии по выплатам участникам", "Страховка от несчастных случаев (ФСС)"] },
  { label: "Поддержка Администраций ЛНР и ДНР", items: ["Местная координация проекта", "Предоставление объектов для восстановления", "Взаимодействие с местным населением"] },
  { label: "Поддержка органов безопасности", items: ["Военная охрана объектов", "Сопровождение при перемещении", "Обеспечение безопасности персонала"] },
  { label: "Координация с министерствами РФ", items: ["Министерство развития Дальнего Востока и Арктики", "Министерство строительства и ЖКХ", "Министерство внутренних дел РФ", "Министерство обороны РФ"] },
];

const REQUISITES = [
  { label: "ИНН", value: "2511135442" },
  { label: "КПП", value: "251101001" },
  { label: "ОГРН", value: "1132511007591" },
  { label: "Орг.-прав. форма", value: "ООО (частная компания)" },
  { label: "Юридический адрес", value: "Приморский край, г. Уссурийск, переулок Мирный, д. 1" },
  { label: "Банк", value: "Филиал «Хабаровский» АО «Альфа-Банк»" },
  { label: "Расчётный счёт", value: "40702810820110001074 (RUR)" },
  { label: "БИК", value: "40813770" },
];

export default function ProjectStatusSection() {
  return (
    <section id="status" className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Status */}
        <div>
          <div className="text-center mb-10">
            <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Статус</span>
            <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
              Статус и правовая основа
            </h2>
          </div>

          {/* Classification */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Тип проекта", value: "Государственный инфраструктурный" },
              { label: "Уровень", value: "Федеральный (государственный)" },
              { label: "Статус", value: "Активный, официально утверждён" },
              { label: "Поддержка", value: "Президент РФ, Правительство РФ" },
            ].map((c) => (
              <div key={c.label} className="bg-card border border-border rounded-xl p-4">
                <div className="text-xs font-inter text-muted-foreground mb-1">{c.label}</div>
                <div className="font-inter font-bold text-sm text-foreground">{c.value}</div>
              </div>
            ))}
          </div>

          {/* Docs */}
          <div className="grid sm:grid-cols-2 gap-5">
            {DOCS.map((doc) => (
              <div key={doc.num} className="bg-card border border-border rounded-2xl p-5 hover:border-accent/30 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-inter font-bold text-sm text-foreground">{doc.title}</div>
                    {doc.date && <div className="font-mono text-xs text-muted-foreground">от {doc.date}</div>}
                  </div>
                </div>
                <p className="font-inter text-xs text-muted-foreground mb-3 italic">{doc.desc}</p>
                <ul className="space-y-1.5 mb-3">
                  {doc.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-inter text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="inline-block text-xs font-inter font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-2xl font-inter font-black text-foreground mb-6 text-center">Государственная и муниципальная поддержка</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SUPPORT.map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-4 w-4 text-accent shrink-0" />
                  <div className="font-inter font-bold text-sm text-foreground">{s.label}</div>
                </div>
                <ul className="space-y-2">
                  {s.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-inter text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-5 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="font-inter text-sm text-foreground text-center mb-4">
              <span className="font-bold">Политическая поддержка:</span>{" "}
              Одобрение Президента РФ · Поддержка Совета Федерации и Государственной Думы · Широкое освещение в государственных СМИ
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { url: "https://dan-news.ru/interview/pomoch-vsej-stranoj-vsem-mirom.-kak-rossija-vosstanavlivaet-novye-regiony/", source: "dan-news.ru", text: "В работе по восстановлению новых регионов участвуют все министерства и федеральные службы. Минстрой — координатор работы." },
                { url: "https://ura.news/news/1052574442", source: "ura.news", text: "Россия планирует восстановить территорию ДНР и ЛНР до 2035 года — вице-премьер РФ Марат Хуснуллин." },
                { url: "https://vm.ru/society/973211-masshtabnaya-strojka-bolee-15-regionov-rossii-vzyali-shefstvo-nad-razrushennymi-rajonami-donbassa", source: "vm.ru", text: "Более 15 регионов России взяли шефство над разрушенными районами Донбасса." },
                { url: "https://rtvi.com/stories/tam-poka-ochen-napryazhennaya-obstanovka-bolee-30-regionov-podklyuchili-k-vosstanovleniyu-donbassa/", source: "rtvi.com", text: "Восстановление Донбасса оплачивается за счёт регионального бюджета, федеральных субсидий и частных спонсоров." },
              ].map((item) => (
                <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 bg-card border border-border rounded-xl p-3 hover:border-accent/40 hover:shadow-md transition-all group">
                  <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full bg-accent mt-2" />
                  <div>
                    <div className="font-mono text-xs text-accent font-semibold group-hover:underline mb-1">{item.source}</div>
                    <div className="font-inter text-xs text-muted-foreground leading-relaxed">{item.text}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Coordinator */}
        <div>
          <h3 className="text-2xl font-inter font-black text-foreground mb-6 text-center">Главный координатор проекта</h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="bg-primary p-5 flex items-center gap-3">
              <Building className="h-6 w-6 text-accent" />
              <div>
                <div className="font-inter font-black text-white text-lg">ООО «Братоуверие-СНБ»</div>
                <div className="font-inter text-white/70 text-sm">Генеральный подрядчик программы</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-0">
              {/* Contacts */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-border">
                <h4 className="font-inter font-bold text-sm text-foreground mb-4">Контакты</h4>
                <div className="space-y-3">
                  <a href="tel:88000010101" className="flex items-center gap-3 text-sm font-inter text-foreground hover:text-accent transition-colors font-semibold">
                    <Phone className="h-4 w-4 text-accent" />
                    8-800-001-01-01 (бесплатно)
                  </a>
                  <a href="mailto:hh@vosstanovim-dnr.ru" className="flex items-center gap-3 text-sm font-inter text-foreground hover:text-accent transition-colors">
                    <Mail className="h-4 w-4 text-accent" />
                    hh@vosstanovim-dnr.ru
                  </a>
                  <a href="mailto:partner@bratouverie-snb.ru" className="flex items-center gap-3 text-sm font-inter text-foreground hover:text-accent transition-colors">
                    <Mail className="h-4 w-4 text-accent" />
                    partner@bratouverie-snb.ru
                  </a>
                  <a href="mailto:support@vosstanovim-dnr.ru" className="flex items-center gap-3 text-sm font-inter text-foreground hover:text-accent transition-colors">
                    <Mail className="h-4 w-4 text-accent" />
                    support@vosstanovim-dnr.ru
                  </a>
                  <div className="flex items-start gap-3 text-sm font-inter text-muted-foreground">
                    <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    г. Хабаровск, ул. Карла Маркса, д. 66
                  </div>
                  <div className="flex items-start gap-3 text-sm font-inter text-muted-foreground">
                    <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    г. Тамбов, ул. Коммунальная, 6 (Тамбовская область)
                  </div>
                </div>
              </div>
              {/* Requisites */}
              <div className="p-5">
                <h4 className="font-inter font-bold text-sm text-foreground mb-4">Реквизиты</h4>
                <div className="space-y-2">
                  {REQUISITES.map((r) => (
                    <div key={r.label} className="flex justify-between gap-3 text-xs font-inter">
                      <span className="text-muted-foreground shrink-0">{r.label}</span>
                      <span className="text-foreground font-medium text-right">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
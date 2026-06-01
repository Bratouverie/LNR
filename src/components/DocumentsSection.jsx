import { FileText, Mail, Phone, MapPin, CheckCircle, AlertCircle, Download } from "lucide-react";
import { useState } from "react";

const BASE_DOCS = [
  {
    title: "Паспорт РФ",
    items: ["Действительный (не просроченный)", "Копия всех страниц", "Оригинал для проверки по прибытию"],
  },
  {
    title: "Резюме",
    items: ["Формат PDF или Word, 1–2 страницы", "ФИО, дата рождения, контакты, опыт работы", "Образование и профессиональные навыки"],
  },
  {
    title: "Документы об образовании",
    items: ["Диплом об окончании среднего или высшего учебного заведения (копия)", "Оригиналы дипломов для проверки по прибытию на объект"],
  },
  {
    title: "Документы о квалификации",
    items: ["Свидетельство о квалификации (если есть)", "Сертификаты курсов обучения (если есть)", "Трудовая книжка (копия или выписка за 3–5 лет)"],
  },
];

const SPECIAL_DOCS = [
  { role: "Водители", items: ["Водительское удостоверение (копия + оригинал)", "Справка о состоянии здоровья водителя (форма 003-В/у)", "История ДТП и нарушений ПДД (из ГИБДД)"] },
  { role: "Взрывотехники", items: ["Удостоверение на право взрывных работ (копия)", "Сертификат по взрывотехнике (копия)", "Допуск на работу со взрывчатыми веществами (копия)"] },
  { role: "Операторы БПЛА", items: ["Сертификат оператора БПЛА (копия)", "Лицензия на управление БПЛА (если выдана)", "Портфолио работ (фото/видео проектов)"] },
  { role: "Инженеры связи", items: ["Диплом по специальности (копия)", "Сертификаты производителей оборудования (Huawei, Cisco, Nokia — если есть)"] },
  { role: "Медицинские работники", items: ["Диплом о медицинском образовании (копия)", "Лицензия на медицинскую деятельность (копия)", "Прививочный сертификат (копия)"] },
  { role: "Охранники", items: ["Свидетельство охранника (копия)", "Лицензия на охранную деятельность (копия)"] },
];

const CHANNELS = [
  {
  icon: Mail,
  title: "По e-mail",
  details: ["hh@vosstanovim-dnr.ru", "Тема: [ФИО] — Заявка на программу ЛНР/ДНР", "Документы архивом ZIP (если >5 файлов)"],
  },
  {
  icon: Phone,
  title: "По телефону",
  details: ["8-800-001-01-01 (бесплатно)", "Единый номер приёма заявок", "Консультация + список документов для вашей должности"],
  },
  {
    icon: MapPin,
    title: "Лично в Хабаровске",
    details: ["ул. Карла Маркса, д. 66", "Пн–Пт 09:00–18:00, Сб 10:00–14:00", "Запись по телефону за 1–2 дня"],
  },
];

const TIMELINE = [
  { stage: "Первичная обработка", duration: "2–3 дня" },
  { stage: "Собеседование", duration: "3–5 дней" },
  { stage: "Проверка безопасности", duration: "1–2 дня" },
  { stage: "Согласование медосмотра", duration: "2–3 дня" },
  { stage: "Медосмотр", duration: "1 день" },
  { stage: "Результаты медосмотра", duration: "3–5 дней" },
  { stage: "Финальное решение", duration: "2–3 дня" },
  { stage: "Оформление документов", duration: "3–5 дней" },
  { stage: "Координация выезда", duration: "5–7 дней" },
  { stage: "ИТОГО", duration: "3–4 недели", bold: true },
];

export default function DocumentsSection() {
  const [tab, setTab] = useState("base");

  return (
    <section id="documents" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        <div className="text-center">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Документы</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Документы для подачи
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Полный пакет документов ускоряет рассмотрение заявки. Ниже — список обязательных и дополнительных документов.
          </p>
        </div>



        {/* Legal Basis Download */}
        <div className="bg-secondary/60 border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <FileText className="h-7 w-7 text-accent" />
            </div>
            <div>
              <div className="font-inter font-bold text-lg text-foreground">Юридическое основание проекта</div>
              <div className="text-muted-foreground font-inter text-sm mt-1">Постановление Правительства РФ от 22 декабря 2023 г. № 2255 · Государственная программа восстановления ДНР и ЛНР</div>
            </div>
          </div>
          <a
            href="https://media.base44.com/files/public/69f4a665db2c72a42818d397/a60e58511_Postanovlenie_11zon.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Download className="h-5 w-5" />
            Скачать постановление
          </a>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { id: "base", label: "Основные документы" },
            { id: "special", label: "По должностям" },
            { id: "submit", label: "Способы подачи" },
            { id: "timeline", label: "Сроки рассмотрения" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-all duration-200 ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Base docs */}
        {tab === "base" && (
          <div className="grid sm:grid-cols-2 gap-5">
            {BASE_DOCS.map((doc) => (
              <div key={doc.title} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  <div className="font-inter font-bold text-foreground">{doc.title}</div>
                </div>
                <ul className="space-y-2">
                  {doc.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="sm:col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="font-inter text-sm text-amber-800">
                <span className="font-bold">Дополнительно рекомендуется:</span> рекомендательные письма от 1–2 работодателей, справка о несудимости из МВД (срок действия 3 месяца), медицинские справки при наличии.
              </div>
            </div>
          </div>
        )}

        {/* Special docs */}
        {tab === "special" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPECIAL_DOCS.map((s) => (
              <div key={s.role} className="bg-card border border-border rounded-2xl p-5">
                <div className="font-inter font-bold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  {s.role}
                </div>
                <ul className="space-y-2">
                  {s.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs font-inter text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Submit channels */}
        {tab === "submit" && (
          <div className="grid sm:grid-cols-3 gap-5">
            {CHANNELS.map((c) => (
              <div key={c.title} className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <c.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="font-inter font-bold text-foreground">{c.title}</div>
                </div>
                <ul className="space-y-2">
                  {c.details.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-inter text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {tab === "timeline" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm font-inter">
                <thead>
                  <tr className="bg-secondary/60">
                    <th className="text-left px-5 py-3 font-semibold text-foreground">Этап</th>
                    <th className="text-center px-5 py-3 font-semibold text-foreground">Срок</th>
                  </tr>
                </thead>
                <tbody>
                  {TIMELINE.map((row, i) => (
                    <tr key={row.stage} className={row.bold ? "bg-accent/10" : i % 2 === 0 ? "bg-card" : "bg-secondary/20"}>
                      <td className={`px-5 py-3 ${row.bold ? "font-bold text-foreground" : "text-muted-foreground"}`}>{row.stage}</td>
                      <td className={`px-5 py-3 text-center font-mono font-bold ${row.bold ? "text-accent text-base" : "text-accent"}`}>{row.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm font-inter text-foreground text-center">
              <span className="font-bold">Ускоренный процесс:</span> В период активного набора (8 июня – 6 июля) сроки могут быть сокращены до 2–3 недель.
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
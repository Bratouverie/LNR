import { Shield, Database, Lock, UserCheck, AlertTriangle, FileText, Building } from "lucide-react";

const COLLECTED_DATA = [
  "ФИО, дата рождения, адрес проживания",
  "Паспортные данные",
  "Информация об образовании и опыте работы",
  "Информация о состоянии здоровья (медицинские данные)",
  "Информация о семье и близких родственниках",
  "Номер телефона и адрес электронной почты",
  "Номер банковского счёта (для выплаты зарплаты)",
];

const DATA_PURPOSES = [
  "Реализация трудового договора и выполнение обязательств работодателя",
  "Проверка безопасности и соответствия кандидата требованиям",
  "Обязательное социальное страхование",
  "Ведение кадровой документации",
  "Связь с работником и информирование об условиях",
];

const DATA_PROTECTION = [
  "Данные хранятся в защищённой базе данных на защищённом сервере",
  "Доступ имеют только уполномоченные лица (менеджеры, бухгалтеры, юристы)",
  "Регулярные проверки безопасности",
  "Шифрование персональных данных при передаче",
  "Уничтожение данных спустя 5 лет после завершения контракта (согласно законодательству)",
];

const DATA_RIGHTS = [
  "Право доступа к своим данным",
  "Право уточнения или исправления неправильных данных",
  "Право на удаление данных (за исключением данных, требуемых по закону)",
  "Право на получение информации об использовании данных",
];

const CONFIDENTIAL_RESTRICTIONS = [
  "Разглашать информацию о зарплате и условиях третьим лицам",
  "Делать фотографии и видео на объектах без разрешения",
  "Публиковать информацию в социальных сетях о деталях проекта",
  "Передавать документы третьим лицам",
];

const LEGAL_ACTS = [
  { title: "Трудовой кодекс РФ", items: ["Ст. 56 — Трудовой договор", "Ст. 153 — Оплата в выходные и праздничные дни", "Ст. 217–229 — Вахтовый метод работы"] },
  { title: "ФЗ от 27.07.2006 №152-ФЗ", items: ["О защите персональных данных"] },
  { title: "ФЗ от 13.12.2010 №273-ФЗ", items: ["Об информации, информационных технологиях и защите информации"] },
  { title: "ФЗ от 24.07.1998 №125-ФЗ", items: ["Об обязательном социальном страховании от несчастных случаев на производстве"] },
  { title: "Постановление Правительства РФ №2255", items: ["от 22.12.2023 — О программе восстановления инфраструктуры ЛНР и ДНР", "Приказы МВД и МЧС России (о сопровождении и безопасности)"] },
];

const REQUISITES = [
  { label: "Полное наименование", value: "ООО «Братоуверие-СНБ»" },
  { label: "ИНН", value: "2511135442" },
  { label: "КПП", value: "251101001" },
  { label: "ОГРН", value: "1132511007591" },
  { label: "Дата регистрации", value: "2011 г." },
  { label: "Юридический адрес", value: "Приморский край, г. Уссурийск, пер. Мирный, д. 1" },
  { label: "Фактический адрес", value: "г. Хабаровск, ул. Карла Маркса, д. 66" },
  { label: "Банк", value: "Филиал «Хабаровский» АО «Альфа-Банк»" },
  { label: "Расчётный счёт", value: "40702810820110001074 (RUR)" },
  { label: "БИК", value: "040813770" },
  { label: "Корреспондентский счёт", value: "30101810800000000770" },
  { label: "Генеральный директор", value: "Ануфриев Яков Евгеньевич" },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Header */}
        <div>
          <a href="/" className="text-sm text-accent hover:underline font-inter mb-6 inline-block">← На главную</a>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mt-2">
            Политика конфиденциальности
          </h1>
          <p className="text-muted-foreground mt-3 leading-relaxed">
            Обработка персональных данных осуществляется в соответствии с Федеральным законом от 27.07.2006 №152-ФЗ «О защите персональных данных» и ФЗ от 13.12.2010 №273-ФЗ.
          </p>
        </div>

        {/* Collected data */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Database className="h-4 w-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg text-foreground">Собираемые данные</h2>
          </div>
          <ul className="space-y-2">
            {COLLECTED_DATA.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Purposes */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg text-foreground">Цели обработки данных</h2>
          </div>
          <ul className="space-y-2">
            {DATA_PURPOSES.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Protection */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Lock className="h-4 w-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg text-foreground">Защита данных</h2>
          </div>
          <ul className="space-y-2">
            {DATA_PROTECTION.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Rights */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <UserCheck className="h-4 w-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg text-foreground">Права работника в отношении персональных данных</h2>
          </div>
          <ul className="space-y-2 mb-4">
            {DATA_RIGHTS.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-sm text-foreground">
            По вопросам защиты данных обращайтесь:{" "}
            <a href="mailto:legal@bratouvernie.ru" className="text-accent hover:underline font-medium">legal@bratouvernie.ru</a>
          </div>
        </div>

        {/* Confidentiality */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <h2 className="font-bold text-lg text-foreground">Конфиденциальность коммерческой информации</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Вся информация о проекте, условиях работы, переписка, фотографии и видео являются конфиденциальными. Работнику запрещается:
          </p>
          <ul className="space-y-2 mb-4">
            {CONFIDENTIAL_RESTRICTIONS.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg p-3">
            При нарушении конфиденциальности работник может быть привлечён к дисциплинарной и материальной ответственности.
          </p>
        </div>

        {/* Legal acts */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Shield className="h-4 w-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg text-foreground">Нормативно-правовые акты</h2>
          </div>
          <div className="space-y-4">
            {LEGAL_ACTS.map((act) => (
              <div key={act.title}>
                <div className="font-semibold text-sm text-foreground mb-1">{act.title}</div>
                {act.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground ml-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-2" />
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Requisites */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
              <Building className="h-4 w-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg text-foreground">Реквизиты компании</h2>
          </div>
          <div className="space-y-2">
            {REQUISITES.map((r) => (
              <div key={r.label} className="flex justify-between gap-4 text-sm border-b border-border/50 pb-2 last:border-0">
                <span className="text-muted-foreground shrink-0">{r.label}</span>
                <span className="text-foreground font-medium text-right">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
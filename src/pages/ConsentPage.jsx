import { Link } from "react-router-dom";
import { ArrowLeft, Download, FileText } from "lucide-react";

const COMPANY = "ООО «НВС»";
const INN = "9725162767";
const KPP = "772001001";
const OGRN = "1247700464880";
const ADDRESS = "111675, город Москва, Лухмановская ул, д. 34, помещ. 15/1";
const EMAIL = "support@vosstanovim-dnr.ru";
const DATE = "01.01.2024";

export const CONSENT_TEXT = {
  title: "Согласие на обработку персональных данных",
  sections: [
    {
      heading: null,
      text: `Я, субъект персональных данных (далее — Субъект), настоящим даю своё согласие ${COMPANY} (ИНН ${INN}), расположенному по адресу: ${ADDRESS} (далее — Оператор), на обработку моих персональных данных в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».`,
    },
    {
      heading: "1. Перечень персональных данных",
      text: `Субъект даёт согласие на обработку следующих персональных данных:\n— фамилия, имя, отчество;\n— номер мобильного телефона;\n— адрес электронной почты;\n— иные данные, добровольно указанные Субъектом при заполнении форм на сайте vosstanovim-dnr.ru.`,
    },
    {
      heading: "2. Цели обработки",
      text: `Персональные данные обрабатываются в следующих целях:\n— рассмотрение заявки на участие в программе восстановления ЛНР и ДНР;\n— связь с Субъектом для уточнения условий участия;\n— оформление трудового договора;\n— направление информационных сообщений по вопросам трудоустройства.`,
    },
    {
      heading: "3. Перечень действий с персональными данными",
      text: `Оператор вправе совершать следующие действия: сбор, запись, систематизация, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передача (предоставление, доступ), блокирование, удаление, уничтожение персональных данных.`,
    },
    {
      heading: "4. Срок действия согласия",
      text: `Настоящее согласие действует с момента его предоставления и до достижения целей обработки персональных данных, либо до момента его отзыва Субъектом.`,
    },
    {
      heading: "5. Порядок отзыва согласия",
      text: `Субъект вправе в любой момент отозвать настоящее согласие, направив письменное уведомление Оператору по адресу: ${ADDRESS}, либо на электронную почту ${EMAIL}. После получения уведомления Оператор прекращает обработку персональных данных Субъекта в срок, не превышающий 30 (тридцати) рабочих дней.`,
    },
    {
      heading: "6. Передача третьим лицам",
      text: `Оператор не передаёт персональные данные третьим лицам без согласия Субъекта, за исключением случаев, предусмотренных действующим законодательством Российской Федерации.`,
    },
    {
      heading: "7. Подтверждение",
      text: `Нажимая кнопку «Отправить» или проставляя отметку в соответствующем поле на сайте, Субъект подтверждает, что ознакомился с настоящим согласием, понимает его содержание и полностью соглашается с его условиями.`,
    },
  ],
  signature: {
    company: COMPANY,
    inn: INN,
    kpp: KPP,
    ogrn: OGRN,
    address: ADDRESS,
    email: EMAIL,
    date: DATE,
  },
};

function generateDocxBlob() {
  // Build a simple RTF document that Word/LibreOffice opens as .docx-like
  // We use a plain text approach with proper encoding
  const lines = [
    CONSENT_TEXT.title,
    "",
    ...CONSENT_TEXT.sections.flatMap((s) => [
      s.heading ? s.heading : "",
      s.text,
      "",
    ]),
    `Оператор: ${CONSENT_TEXT.signature.company}`,
    `ИНН: ${CONSENT_TEXT.signature.inn}`,
    `Адрес: ${CONSENT_TEXT.signature.address}`,
  ];

  // Create RTF content
  const rtfContent = `{\\rtf1\\ansi\\ansicpg1251\\deff0
{\\fonttbl{\\f0\\froman\\fcharset204 Times New Roman;}}
{\\colortbl ;}
\\paperw11906\\paperh16838\\margl1800\\margr1800\\margt1440\\margb1440
\\widowctrl\\hyphauto
{\\pard\\qc\\b\\fs28 ${escapeRtf(CONSENT_TEXT.title)}\\par}
\\pard\\sb240\\sa120\\fs22
${CONSENT_TEXT.sections
  .map((s) => {
    const heading = s.heading
      ? `{\\pard\\sb200\\sa80\\b\\fs22 ${escapeRtf(s.heading)}\\par}\n`
      : "";
    const body = `{\\pard\\sa100\\fs22 ${escapeRtf(s.text).replace(/\\n/g, "\\par ")}\\par}\n`;
    return heading + body;
  })
  .join("")}
{\\pard\\sb300\\sa80\\b\\fs22 Оператор:\\b0  ${escapeRtf(CONSENT_TEXT.signature.company)}\\par}
{\\pard\\sa80\\fs22 ИНН: ${escapeRtf(CONSENT_TEXT.signature.inn)}\\par}
{\\pard\\sa80\\fs22 Адрес: ${escapeRtf(CONSENT_TEXT.signature.address)}\\par}
{\\pard\\sb400\\sa80\\fs22 Субъект персональных данных: ________________________ / ________________________\\par}
{\\pard\\sa80\\fs22 (подпись) (расшифровка подписи)\\par}
{\\pard\\sa80\\fs22 Дата: «___» _______________ 20___ г.\\par}
}`;

  return new Blob([rtfContent], { type: "application/rtf" });
}

function escapeRtf(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code > 127) return `\\'${code.toString(16).padStart(2, "0")}`;
      return c;
    })
    .join("");
}

function handleDownload() {
  const blob = generateDocxBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Согласие_на_обработку_персональных_данных.rtf";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ConsentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary pt-12 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-inter text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6 text-accent" />
                <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">
                  Документ
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-inter font-black text-white tracking-tight">
                Согласие на обработку<br className="hidden sm:block" /> персональных данных
              </h1>
            </div>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm shrink-0"
            >
              <Download className="h-4 w-4" />
              Скачать документ (.rtf / Word)
            </button>
          </div>
        </div>
      </div>

      {/* Document body — A4-like */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {/* A4 page simulation */}
          <div
            className="mx-auto bg-white font-inter text-foreground"
            style={{
              maxWidth: "794px",
              minHeight: "1123px",
              padding: "60px 72px",
              boxSizing: "border-box",
            }}
          >
            {/* Title */}
            <h2 className="text-center text-xl font-bold mb-6 leading-snug">
              {CONSENT_TEXT.title}
            </h2>

            {/* Sections */}
            <div className="space-y-4 text-[14px] leading-relaxed">
              {CONSENT_TEXT.sections.map((s, i) => (
                <div key={i}>
                  {s.heading && (
                    <p className="font-bold mb-1">{s.heading}</p>
                  )}
                  <p className="text-gray-700 whitespace-pre-line">{s.text}</p>
                </div>
              ))}
            </div>

            {/* Operator details */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-1 text-[14px]">
              <p><span className="font-semibold">Оператор:</span> {CONSENT_TEXT.signature.company}</p>
              <p><span className="font-semibold">ИНН:</span> {CONSENT_TEXT.signature.inn} &nbsp;<span className="font-semibold">КПП:</span> {CONSENT_TEXT.signature.kpp} &nbsp;<span className="font-semibold">ОГРН:</span> {CONSENT_TEXT.signature.ogrn}</p>
              <p><span className="font-semibold">Адрес:</span> {CONSENT_TEXT.signature.address}</p>
              <p><span className="font-semibold">E-mail:</span> {CONSENT_TEXT.signature.email}</p>
            </div>

            {/* Signature block */}
            <div className="mt-10 space-y-4 text-[14px]">
              <div className="flex items-end gap-8">
                <div className="flex-1">
                  <div className="border-b border-gray-400 h-8" />
                  <p className="text-gray-500 text-xs mt-1 text-center">подпись Субъекта</p>
                </div>
                <div className="flex-1">
                  <div className="border-b border-gray-400 h-8" />
                  <p className="text-gray-500 text-xs mt-1 text-center">расшифровка подписи</p>
                </div>
              </div>
              <p className="text-gray-600">
                Дата: «___» _______________ 20___ г.
              </p>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <Download className="h-4 w-4" />
            Скачать «Согласие на обработку персональных данных» (.rtf / Word)
          </button>
        </div>
      </div>
    </div>
  );
}
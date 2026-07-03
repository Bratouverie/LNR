import { useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { VACANCIES_DATA } from "@/lib/vacanciesData";
import { CONTRACT_COMMON, CONTRACT_VACANCY_EXTRA } from "@/lib/contractData";
import { buildContractBlocks } from "@/lib/contractBuilder";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Loader2 } from "lucide-react";

function buildContractHtml(data) {
  let html = "";
  html += `<h1 style="text-align:center;font-size:20pt;font-weight:bold;margin-bottom:8px;">${data.title}</h1>`;
  if (data.subtitle) {
    html += `<h2 style="text-align:center;font-size:14pt;font-weight:bold;margin-bottom:20px;">${data.subtitle}</h2>`;
  }
  for (const block of data.blocks) {
    switch (block.type) {
      case "heading":
        html += `<h3 style="font-size:12pt;font-weight:bold;margin-top:18px;margin-bottom:8px;border-bottom:1px solid #999;padding-bottom:3px;">${block.text}</h3>`;
        break;
      case "subheading":
        html += `<h4 style="font-size:11pt;font-weight:bold;margin-top:12px;margin-bottom:6px;">${block.text}</h4>`;
        break;
      case "paragraph":
        html += `<p style="font-size:10pt;text-align:justify;margin-bottom:6px;line-height:1.5;">${block.text}</p>`;
        break;
      case "bullets":
        html += `<ul style="font-size:10pt;margin-bottom:8px;padding-left:20px;line-height:1.5;">${block.items.map(i => `<li style="margin-bottom:3px;">${i}</li>`).join("")}</ul>`;
        break;
      case "table":
        html += `<table style="width:100%;border-collapse:collapse;font-size:9pt;margin-bottom:12px;">`;
        if (block.headers) {
          html += `<thead><tr>${block.headers.map(h => `<th style="border:1px solid #999;padding:5px;background:#e8e8e8;font-weight:bold;">${h}</th>`).join("")}</tr></thead>`;
        }
        html += `<tbody>`;
        for (const row of (block.rows || [])) {
          const cells = Array.isArray(row) ? row : [row];
          html += `<tr>${cells.map(c => `<td style="border:1px solid #999;padding:5px;">${c}</td>`).join("")}</tr>`;
        }
        html += `</tbody></table>`;
        break;
    }
  }
  return html;
}

export default function ContractView() {
  const { id } = useParams();
  const printRef = useRef();

  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const vacancy = VACANCIES_DATA.find((v) => v.id === id);
  const extra = CONTRACT_VACANCY_EXTRA[id];

  if (!vacancy || !extra) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">Договор не найден</p>
        <Link to="/">
          <Button variant="outline">На главную</Button>
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const contractData = buildContractBlocks(id);
      if (!contractData) throw new Error("Данные договора не найдены");

      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      const div = document.createElement("div");
      div.style.position = "absolute";
      div.style.left = "-9999px";
      div.style.top = "0";
      div.style.width = "794px";
      div.style.padding = "40px";
      div.style.background = "white";
      div.style.fontFamily = "'Times New Roman', Times, serif";
      div.style.color = "#222";
      div.innerHTML = buildContractHtml(contractData);
      document.body.appendChild(div);

      const canvas = await html2canvas(div, { scale: 2, useCORS: true });
      document.body.removeChild(div);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Договор_${vacancy?.title || id}.pdf`);
    } catch (e) {
      alert("Не удалось создать PDF: " + (e?.message || "ошибка"));
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      const contract = buildContractBlocks(id);
      const res = await base44.functions.invoke("generateContractDocx", contract);
      const { base64, filename } = res.data;
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `${extra.fullTitle}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Ошибка при создании DOCX: " + e.message);
    } finally {
      setDownloadingDocx(false);
    }
  };

  const location = vacancy.conditions?.location || "Мариуполь, Макеевка, Луганск, Алчевск";

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Toolbar — скрыт при печати */}
      <div className="print:hidden sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to={`/vacancy/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к вакансии
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Печать
            </Button>
            <Button
              onClick={handleDownloadDocx}
              disabled={downloadingDocx}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {downloadingDocx ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Скачать DOCX
            </Button>
            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              size="sm"
              className="gap-2 bg-accent hover:bg-accent/90 text-white"
            >
              {downloadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Скачать PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Страница договора */}
      <div className="max-w-5xl mx-auto px-4 py-8 print:py-0 print:px-0 print:max-w-none">
        <div
          ref={printRef}
          className="bg-white shadow-lg print:shadow-none"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        >
          {/* Шапка с конфиденциальностью */}
          <div className="border-b-2 border-gray-800 px-12 pt-8 pb-4 print:px-16 print:pt-10">
            <div className="flex items-start justify-between mb-6">
              <div className="text-xs text-gray-500 max-w-xs leading-snug border border-gray-300 rounded px-3 py-2">
                <strong>КОНФИДЕНЦИАЛЬНО.</strong> Копирование, распространение и передача третьим лицам запрещены.<br />
                Только для ознакомления и служебного пользования.
              </div>
              <div className="text-right text-xs text-gray-500">
                <div>Дата составления: {CONTRACT_COMMON.contractDate}</div>
                <div className="mt-1">Статус: Ознакомительная версия</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">Трудовой договор</div>
              <h1 className="text-2xl font-bold uppercase tracking-wide text-gray-900 mb-1">
                {extra.fullTitle.toUpperCase()}
              </h1>
              <div className="text-sm text-gray-600 mt-2">
                <span className="inline-block border border-gray-300 rounded px-3 py-1">
                  ОЗНАКОМИТЕЛЬНАЯ ВЕРСИЯ — официальный договор подписывается на месте несения вахты
                </span>
              </div>
            </div>
          </div>

          {/* Тело договора */}
          <div className="px-12 py-8 print:px-16 text-sm leading-relaxed text-gray-800 space-y-6">

            {/* 1. Стороны */}
            <ContractSection num="1" title="СТОРОНЫ ДОГОВОРА">
              <div className="border border-gray-300 rounded p-3 bg-gray-50 text-sm space-y-0.5">
                <p><strong>Работодатель:</strong> ООО «Братоуверие-СНБ»</p>
                <p>ОГРН: 1262500006966 &nbsp;|&nbsp; ИНН: 2511135442 &nbsp;|&nbsp; КПП: 251101001</p>
                <p>Юридический адрес: 692510, Приморский край, г.о. Уссурийский, г. Уссурийск, пер. Мирный, д. 1</p>
                <p>Расчётный счёт: 40702810820110001074</p>
                <p>Банк: ФИЛИАЛ «ХАБАРОВСКИЙ» АО «АЛЬФА-БАНК»</p>
                <p>БИК: 040813770 &nbsp;|&nbsp; Корр. счёт: 30101810800000000770</p>
                <p>Тел.: +7(4212) 51-59-30 &nbsp;|&nbsp; E-mail: hh@bratouverie-snb.ru &nbsp;|&nbsp; Сайт: bratouverie-snb.ru</p>
              </div>
              <p className="mt-3">
                <strong>Работник:</strong> _______________________________ (ФИО), паспорт РФ серия __________, номер __________, выданный _________________________, дата выдачи ______________. Дата рождения: ______________. Постоянное место проживания: _________________________________________________.
              </p>

              <SubSection title="1.1 Организация безопасности и доставки Федеральной службой безопасности РФ">
                <p>{CONTRACT_COMMON.contractSections.moSection}</p>
                <p className="mt-2">Нарушение требований ФСБ России влечёт немедленное расторжение договора без выплаты компенсаций и возможное привлечение к ответственности.</p>
              </SubSection>
            </ContractSection>

            {/* 2. Предмет договора */}
            <ContractSection num="2" title="ПРЕДМЕТ И УСЛОВИЯ ДОГОВОРА">
              <SubSection title="2.1 Должность и трудовые функции">
                <p>Работник принимается на должность <strong>{extra.fullTitle}</strong> на период одной календарной вахты продолжительностью {CONTRACT_COMMON.vacancyDays} дней (далее — «вахтовая смена»). Ориентировочное начало вахты: <strong>{CONTRACT_COMMON.vacancyStart}</strong> (в зависимости от формирования группы). Срок вахты: 3 месяца.</p>
              </SubSection>

              <SubSection title="2.2 Основные трудовые обязанности">
                <p>Работник обязуется выполнять следующие трудовые функции:</p>
                <BulletList items={extra.duties} />
              </SubSection>

              <SubSection title="2.3 Место работы">
                <p>Работник направляется на работу по адресу: <strong>{location}</strong> и прилегающие объекты по указанию работодателя. Конкретное распределение осуществляется работодателем в зависимости от текущих потребностей проекта. Работник обязуется следовать всем указаниям по переводу на иные объекты.</p>
              </SubSection>
            </ContractSection>

            {/* 3. Требования */}
            <ContractSection num="3" title="ТРЕБОВАНИЯ К РАБОТНИКУ">
              <SubSection title="3.1 Образование и квалификация">
                <p><strong>Образование:</strong> {extra.requirements.education}</p>
                <p className="mt-2"><strong>Опыт работы:</strong> {extra.requirements.experience}</p>
                <p className="mt-2"><strong>Профессиональные навыки и компетенции:</strong></p>
                <BulletList items={extra.requirements.skills} />
              </SubSection>

              <SubSection title="3.2 Возрастные и медицинские требования">
                <p><strong>Возрастные ограничения:</strong> {extra.requirements.age}. Отбор производится в соответствии с компетенциями кандидата, опытом и состоянием здоровья.</p>
                <p className="mt-2"><strong>Медицинские противопоказания:</strong> {extra.requirements.contraindications}. Работник обязуется предоставить медицинское заключение о пригодности к работе в установленные сроки.</p>
              </SubSection>

              <SubSection title="3.3 Личные качества">
                <p>Работник должен обладать высокой ответственностью, дисциплинированностью, способностью к работе в команде, готовностью к работе в сложных и стрессовых условиях. Употребление алкоголя и наркотических веществ категорически запрещено в период вахты.</p>
              </SubSection>
            </ContractSection>

            {/* 4. Режим работы */}
            <ContractSection num="4" title="РЕЖИМ РАБОТЫ">
              <SubSection title="4.1 Формат работы">
                <p>Работник принимается на работу на условиях вахтового метода организации труда в соответствии с Трудовым кодексом Российской Федерации (ст. 217–229). Вахта продолжается {CONTRACT_COMMON.vacancyDays} дней (3 месяца).</p>
              </SubSection>
              <SubSection title="4.2 График работы">
                <p><strong>Рабочая неделя и рабочий день:</strong> {extra.schedule}. Время отдыха между сменами предоставляется согласно внутреннему распорядку объекта. Возможны экстренные вызовы при критических ситуациях.</p>
              </SubSection>
              <SubSection title="4.3 Длительность вахты">
                <p><strong>Общая длительность вахты:</strong> {CONTRACT_COMMON.vacancyDays} дней (3 месяца). Во время вахты отпуск не предоставляется. Время отдыха между сменами предоставляется согласно внутреннему распорядку объекта.</p>
              </SubSection>
            </ContractSection>

            {/* 5. Проживание */}
            <ContractSection num="5" title="МЕСТО ПРОЖИВАНИЯ, ПИТАНИЕ И ОБЕСПЕЧЕНИЕ">
              <SubSection title="5.1 Проживание">
                <BulletList items={CONTRACT_COMMON.housing} />
              </SubSection>
              <SubSection title="5.2 Питание">
                <BulletList items={CONTRACT_COMMON.food} />
              </SubSection>
              <SubSection title="5.3 Специальная одежда и оборудование">
                <p><strong>Работодатель выдаёт:</strong> {extra.provision}. Все предметы выдаются на период вахты и должны быть возвращены в конце вахтовой смены.</p>
              </SubSection>
            </ContractSection>

            {/* 6. Зарплата */}
            <ContractSection num="6" title="КОМПЕНСАЦИОННЫЙ ПАКЕТ И ЗАРАБОТНАЯ ПЛАТА">
              <SubSection title="6.1 Заработная плата">
                <table className="w-full border border-gray-300 text-sm mt-2">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold bg-gray-50 w-1/2">Базовый оклад</td>
                      <td className="px-4 py-2">{extra.salaryBase}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 font-semibold bg-gray-50">Надбавки</td>
                      <td className="px-4 py-2">{extra.salaryBonus}</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="px-4 py-2 font-bold text-gray-900">ИТОГО в месяц</td>
                      <td className="px-4 py-2 font-bold text-gray-900">{extra.salaryTotal}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-semibold bg-gray-50">Единовременная выплата за вахту</td>
                      <td className="px-4 py-2 font-bold">625 000 ₽</td>
                    </tr>
                  </tbody>
                </table>
              </SubSection>
              <SubSection title="6.2 Дополнительные выплаты и премии">
                <BulletList items={extra.perks} />
              </SubSection>
              <SubSection title="6.3 Оплата проезда">
                <p>Работодатель производит {CONTRACT_COMMON.travelCompensation} компенсацию всех расходов на проезд: от места постоянного проживания до места работы и обратно, при перемещении между объектами, включая доставку из аэропорта и возмещение питания в пути.</p>
              </SubSection>
              <SubSection title="6.4 Порядок выплаты заработной платы">
                <p>Периодичность: дважды в месяц. Аванс — не позднее 15-го числа, окончательный расчёт — не позднее 3-го числа следующего месяца. Способ: перевод на банковский счёт или наличными. Работник получает расчётный лист с детализацией всех надбавок и удержаний.</p>
              </SubSection>
            </ContractSection>

            {/* 7. Страхование */}
            <ContractSection num="7" title="СТРАХОВАНИЕ И СОЦИАЛЬНЫЕ ГАРАНТИИ">
              <SubSection title="7.1 Медицинское страхование">
                <p>Работодатель обеспечивает работника полной медицинской страховкой, включающей амбулаторное и стационарное лечение, экстренную медицинскую помощь, стоматологическое и офтальмологическое лечение, вакцинацию и иммунопрофилактику, психологическую помощь, санаторно-курортное лечение (один раз в два года). Страховка распространяется на членов семьи работника (супруг/а и дети до 18 лет) в части амбулаторного лечения.</p>
              </SubSection>
              <SubSection title="7.2 Страховка от несчастных случаев на производстве">
                <table className="w-full border border-gray-300 text-sm mt-2">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 bg-gray-50 w-2/3">Производственная травма</td>
                      <td className="px-4 py-2 font-semibold">не менее 1 500 000 ₽</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="px-4 py-2 bg-gray-50">Установление инвалидности вследствие производственной травмы или профзаболевания</td>
                      <td className="px-4 py-2 font-semibold">не менее 9 000 000 ₽</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 bg-gray-50 font-bold">Максимальная страховая выплата</td>
                      <td className="px-4 py-2 font-bold">14 700 000 ₽</td>
                    </tr>
                  </tbody>
                </table>
              </SubSection>
              <SubSection title="7.3 Социальные гарантии">
                <BulletList items={CONTRACT_COMMON.socialGuarantees} />
              </SubSection>
            </ContractSection>

            {/* 8. Безопасность */}
            <ContractSection num="8" title="БЕЗОПАСНОСТЬ И ОХРАНА ТРУДА">
              <SubSection title="8.1 Обеспечение безопасности">
                <p className="mb-2">Работа осуществляется на восстанавливаемых территориях ЛНР и ДНР под охраной и обеспечением безопасности силовых структур Российской Федерации.</p>
                <BulletList items={CONTRACT_COMMON.security} />
              </SubSection>
              <SubSection title="8.2 Обязанности работника в области охраны труда">
                <p>Работник обязуется: проходить все инструктажи по безопасности; использовать защитную одежду и оборудование; немедленно сообщать об опасностях и неисправностях; не работать в состоянии опьянения или недомогания; соблюдать установленные санитарные и технические нормы; проходить регулярные медицинские осмотры.</p>
              </SubSection>
            </ContractSection>

            {/* 9. Конфиденциальность */}
            <ContractSection num="9" title="РЕЖИМ КОНФИДЕНЦИАЛЬНОСТИ И БЕЗОПАСНОСТЬ ИНФОРМАЦИИ">
              <p>Работник принимает обязательства по строгому соблюдению конфиденциальности в соответствии с Федеральным законом «О государственной тайне» и Федеральным законом «О персональных данных». Работник обязуется не разглашать информацию о работодателе, объектах, коллегах, условиях труда, а также не размещать сведения в социальных сетях и СМИ. Обязательство конфиденциальности действует бессрочно — в том числе после окончания вахты.</p>
              <p className="mt-2">Нарушение влечёт немедленное расторжение договора без выплаты компенсаций, возмещение убытков и привлечение к ответственности в соответствии с действующим законодательством.</p>
            </ContractSection>

            {/* 10. Привилегии и карьера */}
            <ContractSection num="10" title="ЛЬГОТЫ, ПРИВИЛЕГИИ И КАРЬЕРНЫЙ РОСТ">
              <SubSection title="10.1 Льготы и привилегии">
                <BulletList items={CONTRACT_COMMON.privileges} />
              </SubSection>
              <SubSection title="10.2 Обучение и повышение квалификации">
                <BulletList items={CONTRACT_COMMON.education} />
              </SubSection>
              <SubSection title="10.3 Карьерный рост и перспективы">
                <p>{extra.prospects}</p>
              </SubSection>
              <SubSection title="10.4 Продление контракта">
                <BulletList items={CONTRACT_COMMON.contractSections.renewalConditions} />
              </SubSection>
            </ContractSection>

            {/* 11. Расторжение */}
            <ContractSection num="11" title="ОСНОВАНИЯ И ПОРЯДОК РАСТОРЖЕНИЯ ДОГОВОРА">
              <p>Договор может быть расторгнут по следующим основаниям:</p>
              <BulletList items={CONTRACT_COMMON.contractSections.terminationConditions} />
              <p className="mt-3">При расторжении работнику выплачиваются все накопленные суммы, включая невыплаченную заработную плату, компенсацию за неиспользованный отпуск и все причитающиеся бонусы. Обеспечивается безопасное возвращение. Выдаётся справка о работе и рекомендательное письмо.</p>
            </ContractSection>

            {/* 12. Разрешение споров */}
            <ContractSection num="12" title="РАЗРЕШЕНИЕ КОНФЛИКТОВ И ПРИМЕНИМОЕ ПРАВО">
              <p>Договор регулируется Трудовым кодексом Российской Федерации и иными федеральными законами. При возникновении споров стороны обязуются разрешить их в досудебном порядке путём переговоров. При невозможности — в судебном порядке. Работник защищён от любых репрессалий за подачу законных жалоб.</p>
            </ContractSection>

            {/* 13. Заключительные положения */}
            <ContractSection num="13" title="ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ">
              <p>Настоящий договор является ознакомительной версией, содержащей все основные положения официального договора. Официальная версия будет подписана на месте несения вахты после прибытия работника. Все условия ознакомительной версии будут сохранены в официальной версии.</p>
              <p className="mt-2">Подписав договор, работник подтверждает, что полностью ознакомился с условиями, понимает свои права и обязанности, добровольно принимает все обязательства и не имеет противопоказаний по здоровью.</p>
            </ContractSection>

            {/* Подписи */}
            <div className="mt-10 pt-6 border-t-2 border-gray-800">
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="font-bold text-gray-900 mb-4">РАБОТНИК:</p>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Фамилия, имя, отчество:</p>
                      <div className="border-b border-gray-400 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Паспортные данные:</p>
                      <div className="border-b border-gray-400 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Мобильный телефон:</p>
                      <div className="border-b border-gray-400 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-1">Электронная почта:</p>
                      <div className="border-b border-gray-400 h-6" />
                    </div>
                    <div className="flex gap-8 mt-2">
                      <div className="flex-1">
                        <p className="text-gray-500 text-xs mb-1">Дата:</p>
                        <div className="border-b border-gray-400 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-500 text-xs mb-1">Подпись:</p>
                        <div className="border-b border-gray-400 h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-gray-900 mb-4">РАБОТОДАТЕЛЬ:</p>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">ООО «Братоуверие-СНБ»</p>
                    <p className="text-xs text-gray-600">ОГРН: 1262500006966 | ИНН: 2511135442 | КПП: 251101001</p>
                    <p className="text-xs text-gray-600">692510, Приморский край, г.о. Уссурийский, г. Уссурийск, пер. Мирный, д. 1</p>
                    <p className="text-xs text-gray-600">Р/сч: 40702810820110001074</p>
                    <p className="text-xs text-gray-600">Банк: ФИЛИАЛ «ХАБАРОВСКИЙ» АО «АЛЬФА-БАНК»</p>
                    <p className="text-xs text-gray-600">БИК: 040813770 | Корр. счёт: 30101810800000000770</p>
                    <p className="text-xs text-gray-600">Тел.: +7(4212) 51-59-30 | hh@bratouverie-snb.ru | bratouverie-snb.ru</p>
                    <div className="mt-4 space-y-3">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Генеральный директор:</p>
                        <p className="text-sm">______________ Я.Е. Ануфриев &nbsp;&nbsp;&nbsp;&nbsp; М.П.</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Дата:</p>
                        <div className="border-b border-gray-400 h-6 w-40" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Приложения */}
              <div className="mt-8 pt-4 border-t border-gray-300">
                <p className="font-bold text-sm text-gray-800 mb-2">ПРИЛОЖЕНИЯ К ДОГОВОРУ:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Приложение 1: Положение о режиме конфиденциальности и неразглашении информации</p>
                  <p>Приложение 2: Положение о безопасности на рабочем месте и охране труда</p>
                  <p>Приложение 3: График работы и график выплат заработной платы</p>
                  <p>Приложение 4: Описание специализированного оборудования, инструмента и СИЗ</p>
                </div>
              </div>

              {/* Нижний колонтитул */}
              <div className="mt-6 pt-3 border-t border-gray-200 text-center text-xs text-gray-400">
                Дата составления: {CONTRACT_COMMON.contractDate} · Ознакомительная версия трудового договора ·
                Официальная версия подписывается на месте несения вахты ·
                <strong className="ml-1">КОНФИДЕНЦИАЛЬНО — только для служебного пользования</strong>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          @page { margin: 15mm 20mm; size: A4; }
        }
      `}</style>
    </div>
  );
}

function ContractSection({ num, title, children }) {
  return (
    <div className="space-y-3">
      <h2 className="font-bold text-base text-gray-900 uppercase tracking-wide border-b border-gray-300 pb-1">
        {num}. {title}
      </h2>
      <div className="space-y-3 pl-2">{children}</div>
    </div>
  );
}

function SubSection({ title, children }) {
  return (
    <div className="mt-3">
      <h3 className="font-semibold text-sm text-gray-800 mb-1">{title}</h3>
      <div className="pl-3">{children}</div>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="list-none space-y-1 mt-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gray-500 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
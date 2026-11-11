import { useState } from "react";
import { Download, FileText, Eye, ExternalLink, Loader2 } from "lucide-react";
import { buildContractBlocks } from "@/lib/contractBuilder";
import { VACANCIES_DATA } from "@/lib/vacanciesData";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

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

export default function VacancyContract({ vacancy }) {
  const contract = vacancy.contract;
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadPdf = () => {
    // Скачивание отключено навсегда (приказ Мастера 11.11.2026): файл не формируется,
    // кнопка показывает бесконечную загрузку.
    setDownloadingPdf(true);
  }

  const handleDownloadDocx = () => {
    // Скачивание отключено навсегда (приказ Мастера 11.11.2026).
    setDownloadingDocx(true);
  }

  if (!contract) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
        <p>Договор недоступен</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20">
            <FileText className="h-7 w-7 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-inter font-black text-foreground mb-1">Трудовой договор</h3>
            <p className="text-muted-foreground font-inter text-sm leading-relaxed">
              Ознакомьтесь с полным текстом трудового договора. Вы можете просмотреть его на сайте или скачать в удобном формате. Официальная версия подписывается на месте несения вахты.
            </p>
          </div>
        </div>

        {/* Главная кнопка — просмотр на сайте */}
        <Link to={`/contract/${vacancy.id}`} target="_blank" rel="noopener noreferrer">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-bold transition-all shadow-lg mb-4">
            <Eye className="h-5 w-5" />
            Просмотреть договор на сайте
            <ExternalLink className="h-4 w-4 ml-1 opacity-60" />
          </button>
        </Link>

        {/* Скачать */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent/10 border border-accent/30 text-accent font-inter font-bold text-sm hover:bg-accent/20 transition-all disabled:opacity-50"
          >
            {downloadingPdf
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Download className="h-4 w-4" />}
            Скачать PDF
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={downloadingDocx}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-inter font-bold text-sm hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            {downloadingDocx
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Download className="h-4 w-4" />}
            Скачать DOCX
          </button>
        </div>

        <div className="mt-5 p-4 bg-accent/10 border border-accent/20 rounded-xl">
          <p className="text-sm text-muted-foreground font-inter leading-snug">
            <span className="font-bold text-accent">⚠️ Внимание:</span> Договор соответствует условиям, указанным на этой странице. Официальная версия подписывается на месте несения вахты.
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Download, FileText, File, Loader2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { base44 } from "@/api/base44Client";
import { buildContractBlocks } from "@/lib/contractBuilder";
import { VACANCIES_DATA } from "@/lib/vacanciesData";

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

export default function ContractDownloadButton({ vacancyId }) {
  const [loading, setLoading] = useState(null);

  const handlePdf = () => {
    // Скачивание отключено навсегда (приказ Мастера 11.11.2026).
    setLoading("pdf");
  }

  const handleDocx = () => {
    // Скачивание отключено навсегда (приказ Мастера 11.11.2026).
    setLoading("docx");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={loading !== null}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-semibold text-xs transition-colors disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Создание документа...
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              Скачать договор
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        <DropdownMenuItem
          onClick={handlePdf}
          disabled={loading !== null}
          className="cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Скачать PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDocx}
          disabled={loading !== null}
          className="cursor-pointer"
        >
          <File className="h-4 w-4 mr-2" />
          Скачать DOCX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
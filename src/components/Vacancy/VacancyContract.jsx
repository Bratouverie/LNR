import { useState } from "react";
import { Download, FileText, Eye, ExternalLink, Loader2 } from "lucide-react";
import { buildContractBlocks } from "@/lib/contractBuilder";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

export default function VacancyContract({ vacancy }) {
  const contract = vacancy.contract;
  const [downloadingDocx, setDownloadingDocx] = useState(false);

  const handleDownloadDocx = async () => {
    setDownloadingDocx(true);
    try {
      const contractData = buildContractBlocks(vacancy.id);
      const res = await base44.functions.invoke("generateContractDocx", contractData);
      const { base64, filename } = res.data;
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || `Договор_${vacancy.title || vacancy.id}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Ошибка при создании DOCX: " + e.message);
    } finally {
      setDownloadingDocx(false);
    }
  };

  if (!contract) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-[#F8FAFC]/60">
        <p>Договор недоступен</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-8">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-14 h-14 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0 border border-[#C9A84C]/20">
            <FileText className="h-7 w-7 text-[#C9A84C]" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-[#F8FAFC] mb-1">Трудовой договор</h3>
            <p className="text-[#F8FAFC]/60 font-inter text-sm leading-relaxed">
              Ознакомьтесь с полным текстом трудового договора. Вы можете просмотреть его на сайте или скачать в удобном формате. Официальная версия подписывается на месте несения вахты.
            </p>
          </div>
        </div>

        {/* Главная кнопка — просмотр на сайте */}
        <Link to={`/contract/${vacancy.id}`} target="_blank" rel="noopener noreferrer">
          <button className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#7B3FBF] hover:bg-[#8B4FCF] text-white font-bold transition-all shadow-lg shadow-[#7B3FBF]/30 hover:shadow-[#7B3FBF]/50 mb-4">
            <Eye className="h-5 w-5" />
            Просмотреть договор на сайте
            <ExternalLink className="h-4 w-4 ml-1 opacity-60" />
          </button>
        </Link>

        {/* Скачать */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={contract.pdfUrl || vacancy.contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] font-bold text-sm hover:bg-[#C9A84C]/20 transition-all"
          >
            <Download className="h-4 w-4" />
            Скачать PDF
          </a>

          <button
            onClick={handleDownloadDocx}
            disabled={downloadingDocx}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#7B3FBF]/10 border border-[#7B3FBF]/30 text-[#7B3FBF] font-bold text-sm hover:bg-[#7B3FBF]/20 transition-all disabled:opacity-50"
          >
            {downloadingDocx
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Download className="h-4 w-4" />}
            Скачать DOCX
          </button>
        </div>

        <div className="mt-5 p-4 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl">
          <p className="text-sm text-[#F8FAFC]/70 font-inter leading-snug">
            <span className="font-bold text-[#C9A84C]">⚠️ Внимание:</span> Договор соответствует условиям, указанным на этой странице. Официальная версия подписывается на месте несения вахты.
          </p>
        </div>
      </div>
    </div>
  );
}
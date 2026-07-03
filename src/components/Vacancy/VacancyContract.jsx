import { useState } from "react";
import { Download, FileText, Eye, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground">
        <p>Договор недоступен</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
            <FileText className="h-7 w-7 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-foreground mb-1">Трудовой договор</h3>
            <p className="text-muted-foreground font-inter text-sm leading-relaxed">
              Ознакомьтесь с полным текстом трудового договора. Официальная версия подписывается на месте несения вахты.
            </p>
          </div>
        </div>

        {/* Главная кнопка — просмотр на сайте */}
        <Link to={`/contract/${vacancy.id}`} target="_blank" rel="noopener noreferrer">
          <Button className="w-full gap-2 bg-primary hover:bg-accent text-primary-foreground font-inter font-bold py-6 text-base mb-4 transition-all">
            <Eye className="h-5 w-5" />
            Просмотреть договор на сайте
            <ExternalLink className="h-4 w-4 ml-1 opacity-60" />
          </Button>
        </Link>

        {/* Скачать */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={contract.pdfUrl || vacancy.contractUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground font-inter font-semibold text-sm hover:border-accent/40 hover:text-accent transition-all"
          >
            <Download className="h-4 w-4" />
            Скачать PDF
          </a>

          <Button
            onClick={handleDownloadDocx}
            disabled={downloadingDocx}
            variant="outline"
            className="flex items-center justify-center gap-2 rounded-xl font-inter font-semibold text-sm hover:border-accent/40 hover:text-accent transition-all"
          >
            {downloadingDocx
              ? <Loader2 className="h-4 w-4 animate-spin" />
              : <Download className="h-4 w-4" />}
            Скачать DOCX
          </Button>
        </div>

        <div className="mt-5 p-4 bg-accent/5 border border-accent/20 rounded-xl">
          <p className="text-sm text-muted-foreground font-inter leading-snug">
            <span className="font-bold text-accent">⚠️ Внимание:</span> Договор соответствует условиям, указанным на этой странице. Официальная версия подписывается на месте несения вахты.
          </p>
        </div>
      </div>
    </div>
  );
}
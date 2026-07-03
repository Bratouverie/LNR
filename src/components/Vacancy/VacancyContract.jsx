import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Eye } from "lucide-react";
import ContractViewer from "./ContractViewer";

export default function VacancyContract({ vacancy }) {
  const contract = vacancy.contract;
  const [showViewer, setShowViewer] = useState(false);

  if (!contract) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-[#F8FAFC]/60">
        <p>Договор недоступен</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex items-start gap-6 mb-6">
          <FileText size={48} className="text-[#C9A84C] flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-2xl font-black text-[#F8FAFC] mb-2">📄 Трудовой договор</h3>
            <p className="text-[#F8FAFC]/70">
              Ознакомьтесь с полным текстом трудового договора. Вы можете просмотреть договор на сайте или скачать его в удобном формате.
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button
            onClick={() => setShowViewer(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-[#7B3FBF] hover:bg-[#8B4FCF] text-white font-bold transition-all shadow-lg shadow-[#7B3FBF]/30 hover:shadow-[#7B3FBF]/50"
          >
            <Eye size={20} /> Просмотреть договор на сайте
          </button>

          <div className="grid md:grid-cols-3 gap-3">
            <a
              href={contract.pdfUrl || vacancy.contractUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] font-bold hover:bg-[#C9A84C]/20 transition-all"
            >
              <Download size={18} /> PDF
            </a>
            <a
              href={`/contract/${vacancy.id}`}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#7B3FBF]/10 border border-[#7B3FBF]/30 text-[#7B3FBF] font-bold hover:bg-[#7B3FBF]/20 transition-all"
            >
              <FileText size={18} /> Страница договора
            </a>
            <button
              onClick={() => window.open(`/contract/${vacancy.id}`, "_blank")}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#7B3FBF]/10 border border-[#7B3FBF]/30 text-[#7B3FBF] font-bold hover:bg-[#7B3FBF]/20 transition-all"
            >
              <Download size={18} /> DOCX
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg">
          <p className="text-sm text-[#F8FAFC]/70">
            <span className="font-bold text-[#C9A84C]">⚠️ Внимание:</span> Договор соответствует трудовому законодательству РФ и условиям, указанным на этой странице. Официальная версия подписывается на месте несения вахты.
          </p>
        </div>
      </motion.div>

      {showViewer && (
        <ContractViewer
          contract={contract}
          vacancyId={vacancy.id}
          onClose={() => setShowViewer(false)}
        />
      )}
    </div>
  );
}
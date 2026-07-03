import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ContractViewer({ contract, vacancyId, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7;
  const pdfUrl = contract.pdfUrl || `https://media.base44.com/contracts/${vacancyId}.pdf`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0D1B3E] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-[#7B3FBF]/20">
            <h3 className="text-xl font-black text-[#F8FAFC]">📄 {contract.fileName}</h3>
            <button onClick={onClose} className="p-2 hover:bg-[#7B3FBF]/20 rounded-lg transition-colors">
              <X size={24} className="text-[#F8FAFC]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#05070A]">
            <iframe
              src={pdfUrl + "#page=" + currentPage}
              className="w-full h-[600px] rounded-lg"
              style={{ border: "none" }}
              title="Договор"
            />
          </div>

          <div className="flex items-center justify-between p-4 border-t border-[#7B3FBF]/20 bg-[#0D1B3E]">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-[#7B3FBF]/20 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={20} className="text-[#C9A84C]" />
            </button>
            <span className="text-[#F8FAFC]/70 font-bold">
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-[#7B3FBF]/20 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={20} className="text-[#C9A84C]" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
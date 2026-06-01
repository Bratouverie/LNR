import { Phone, MessageSquare, FileText } from "lucide-react";

export default function StickyCommandBar({ onOpenApplication }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary/95 backdrop-blur-md border-t border-white/10 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-4">
        <a
          href="tel:88002228463"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-colors"
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">8-800-222-84-63</span>
        </a>
        <a
          href="https://max.ru/u/f9LHodD0cOLnAxokVgBK1HcwEnGhlBy0W7dVL4IAtZFgqRBl5Imbli5RDlY"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg font-inter text-sm font-medium transition-colors"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Макс</span>
        </a>
        <button
          onClick={onOpenApplication}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 rounded-lg font-inter text-sm font-bold transition-colors shadow-lg shadow-accent/25"
        >
          <FileText className="h-4 w-4" />
          Заявка
        </button>
      </div>
    </div>
  );
}
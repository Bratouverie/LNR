import { useState } from "react";
import { ChevronDown, FileText, ShieldCheck, MapPin } from "lucide-react";
import { CONTRACT_DOC, CONTRACT_FACTS, POINT_BRIEF } from "@/lib/contractValue";

/**
 * ПРАВИЛА № 2255 НА ЛЕНДИНГЕ (слово Мастера 26.11.2026: «на vosstanovim-dnr.ru нужно»).
 * Коротко, по пунктам документа: что даёт контракт, каждое положение с основанием в законе,
 * и что говорит куратор в точке сбора. Полный текст — PDF, ссылка внизу блока.
 */
export default function Contract2255() {
  const [open, setOpen] = useState(null);
  return (
    <section id="contract-2255" className="py-24 sm:py-32 bg-secondary/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Правила № 2255</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Что даёт контракт: 16 положений документа
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-2xl mx-auto">
            Коротко, по пунктам Правил: статус ветерана, выплаты, жильё, медицина, страховка и бронирование.
            Ничего «на словах» — у каждого положения есть основание в законе. Полный текст в PDF на 7 страниц.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {CONTRACT_FACTS.map((fact, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="text-left bg-card border border-border rounded-xl p-4 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-[11px] font-bold text-accent">{fact.num}</span>
                  <h3 className="font-inter font-bold text-sm text-foreground mt-1">{fact.title}</h3>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </div>
              {open === i && (
                <div className="mt-3 space-y-2">
                  <p className="font-inter text-[13px] text-muted-foreground leading-relaxed">{fact.text}</p>
                  <p className="font-inter text-[11px] text-muted-foreground/80">Основание: {fact.art}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-accent" />
            <h3 className="font-inter font-black text-lg text-foreground">Точка сбора: что говорит куратор</h3>
          </div>
          <p className="font-inter text-sm text-muted-foreground leading-relaxed">{POINT_BRIEF.text}</p>
          <ul className="mt-4 space-y-2">
            {POINT_BRIEF.why.map((one, i) => (
              <li key={i} className="flex gap-2 font-inter text-[13px] text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>{one}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a
            href={CONTRACT_DOC.urlFull}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 font-inter font-bold text-sm text-white shadow-lg shadow-accent/25 hover:bg-accent/90 transition"
          >
            <FileText className="h-4 w-4" />
            Правила № 2255 — PDF, {CONTRACT_DOC.pages} стр.
          </a>
          <a
            href="#callback"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-accent/30 bg-white px-5 py-3 font-inter font-bold text-sm text-[#0B2545] hover:border-accent hover:bg-accent/5 transition"
          >
            Задать вопрос по документу
          </a>
        </div>
      </div>
    </section>
  );
}

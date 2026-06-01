import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const GOV_LOGO = "https://media.base44.com/images/public/69f4a665db2c72a42818d397/b880d120f_mediapreview.jpeg";

const NAV_GROUPS = [
  {
    label: "О программе",
    items: [
      { label: "О программе", href: "#about" },
      { label: "Как устроена программа", href: "#mechanism" },
      { label: "Статус проекта", href: "#project-status" },
      { label: "Сроки и этапы", href: "#timeline" },
      { label: "География", href: "#geography" },
    ],
  },
  {
    label: "Вакансии",
    items: [
      { label: "Все вакансии", href: "#vacancies" },
      { label: "Условия труда", href: "#conditions" },
      { label: "Оплата труда", href: "#payment" },
      { label: "Как вступить", href: "#how-to-join" },
    ],
  },
  {
    label: "Поддержка",
    items: [
      { label: "Льготы и программы", href: "#benefits" },
      { label: "Безопасность", href: "#safety" },
      { label: "Отзывы", href: "#testimonials" },
      { label: "Фотогалерея", href: "#gallery" },
    ],
  },
  {
    label: "Информация",
    items: [
    { label: "Документы", href: "#documents" },
    { label: "FAQ", href: "#faq" },
    { label: "Юридическая информация", href: "#legal" },
    { label: "Контакты", href: "#contacts" },
    ],
  },
];

function DropdownMenu({ group, scrollTo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-white/70 hover:text-white text-sm font-inter font-medium px-3 py-2 rounded-md transition-colors"
      >
        {group.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-primary border border-white/15 rounded-xl shadow-2xl py-1.5 min-w-[200px] z-50">
          {group.items.map((item) => (
            <button
              key={item.href}
              onClick={() => { scrollTo(item.href); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm font-inter text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ onOpenApplication }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img
              src={GOV_LOGO}
              alt="Правительство РФ"
              className="h-10 w-auto object-contain rounded"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-white font-inter font-bold text-sm tracking-tight">
                Правительство РФ
              </span>
              <span className="text-white/50 font-inter text-[10px] font-normal tracking-wide">
                Программа восстановления
              </span>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_GROUPS.map((group) => (
              <DropdownMenu key={group.label} group={group} scrollTo={scrollTo} />
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center">
            <Button
              onClick={onOpenApplication}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-semibold text-sm px-5"
            >
              Оставить заявку
            </Button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-primary border-t border-white/10 px-4 pb-4 max-h-[80vh] overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="border-b border-white/5 last:border-0">
              <button
                onClick={() => setMobileExpanded(mobileExpanded === group.label ? null : group.label)}
                className="flex items-center justify-between w-full py-3 text-white/90 font-inter font-semibold text-sm"
              >
                {group.label}
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileExpanded === group.label ? "rotate-180" : ""}`} />
              </button>
              {mobileExpanded === group.label && (
                <div className="pb-2 pl-3 space-y-1">
                  {group.items.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => scrollTo(item.href)}
                      className="block w-full text-left py-2 text-white/60 hover:text-white text-sm font-inter transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button
            onClick={() => { setMobileOpen(false); onOpenApplication(); }}
            className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-semibold"
          >
            Оставить заявку
          </Button>
        </div>
      )}
    </nav>
  );
}
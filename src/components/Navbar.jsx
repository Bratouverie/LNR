import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "О программе", href: "#about" },
  { label: "Вакансии", href: "#vacancies" },
  { label: "Условия", href: "#conditions" },
  { label: "Оплата", href: "#payment" },
  { label: "Льготы", href: "#benefits" },
  { label: "Как вступить", href: "#how-to-join" },
  { label: "FAQ", href: "#faq" },
  { label: "Контакты", href: "#contacts" },
];

export default function Navbar({ onOpenApplication }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Coat_of_Arms_of_the_Russian_Federation.svg/120px-Coat_of_Arms_of_the_Russian_Federation.svg.png"
              alt="Герб РФ"
              className="h-10 w-10 object-contain"
            />
            <span className="text-white font-inter font-bold text-sm sm:text-base tracking-tight leading-tight">
              Правительство РФ<br className="sm:hidden" />
              <span className="hidden sm:inline"> · </span>
              <span className="text-white/60 font-normal text-xs sm:text-sm">Программа восстановления</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-white/70 hover:text-white text-sm font-inter font-medium px-3 py-2 rounded-md transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:88000010101" className="text-white/70 hover:text-white font-mono text-sm transition-colors">
              8-800-001-01-01
            </a>
            <Button
              onClick={onOpenApplication}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-semibold text-sm px-5"
            >
              Оставить заявку
            </Button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-white p-2"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-primary border-t border-white/10 px-4 pb-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left text-white/80 hover:text-white py-3 text-sm font-inter border-b border-white/5 last:border-0"
            >
              {link.label}
            </button>
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
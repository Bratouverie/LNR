export default function Footer() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "О программе", href: "#about" },
    { label: "Вакансии", href: "#vacancies" },
    { label: "Условия", href: "#conditions" },
    { label: "Оплата", href: "#payment" },
    { label: "Как вступить", href: "#how-to-join" },
    { label: "Контакты", href: "#contacts" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/user_69f4a60c5f6a1719d380566c/d2da9e18f_IMG_1680.PNG"
              alt="Герб Хабаровска"
              className="h-12 w-12 object-contain"
            />
            <div>
              <div className="font-inter font-bold text-sm">Администрация Хабаровска</div>
              <div className="font-inter text-xs text-white/50">Программа восстановления ЛНР и ДНР</div>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-sm text-white/50 hover:text-white font-inter transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/30 font-inter">
            © {new Date().getFullYear()} Администрация города Хабаровска. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
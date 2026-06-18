import { Link } from "react-router-dom";

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

        {/* Top: logo + nav */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-10">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69f4a665db2c72a42818d397/341496496_Logosvg.png"
              alt="Логотип"
              className="h-12 w-auto object-contain"
            />
            <div>
              <div className="font-inter font-bold text-sm">Правительство РФ</div>
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

        {/* Info grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-t border-b border-white/10">

          {/* Company */}
          <div>
            <div className="font-inter font-bold text-xs text-white/40 uppercase tracking-widest mb-3">Подрядчик</div>
            <div className="font-inter font-semibold text-sm text-white mb-2">ООО «Братоуверие-СНБ»</div>
            <div className="space-y-1 text-xs text-white/50 font-inter">
              <div>ИНН: 2511135442</div>
              <div>ОГРН: 1132511007591</div>
              <div>Ген. директор: Ануфриев Я.Е.</div>
              <div className="pt-1">Юр. адрес: Приморский край, г. Уссурийск, пер. Мирный, д. 1</div>
              <div>Факт. адрес: г. Хабаровск, ул. Карла Маркса, д. 66</div>
              <div>Доп. офис: г. Тамбов, ул. Коммунальная, 6</div>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <div className="font-inter font-bold text-xs text-white/40 uppercase tracking-widest mb-3">Контакты</div>
            <div className="space-y-2 text-xs text-white/50 font-inter">
              <div><a href="tel:88002228463" className="hover:text-white transition-colors font-semibold">8-800-222-84-63 (бесплатно)</a></div>
              <div className="text-white/30">Единый номер приёма заявок</div>
              <div className="pt-1"><a href="mailto:hh@vosstanovim-dnr.ru" className="hover:text-white transition-colors">hh@vosstanovim-dnr.ru</a></div>
              <div className="text-white/30">Трудоустройство граждан</div>
              <div className="pt-1"><a href="mailto:partner@bratouverie-snb.ru" className="hover:text-white transition-colors">partner@bratouverie-snb.ru</a></div>
              <div className="text-white/30">Сотрудничество с агентствами</div>
              <div className="pt-1"><a href="mailto:support@vosstanovim-dnr.ru" className="hover:text-white transition-colors">support@vosstanovim-dnr.ru</a></div>
              <div className="text-white/30">Поддержка</div>
              <div className="pt-1">Часы работы: Пн–Пт 09:00–18:00, Сб 10:00–14:00</div>
            </div>
          </div>

          {/* Legal basis */}
          <div>
            <div className="font-inter font-bold text-xs text-white/40 uppercase tracking-widest mb-3">Правовая основа</div>
            <div className="space-y-1.5 text-xs text-white/50 font-inter">
              <div>ТК РФ — ст. 56, 59, 115, 153, 184, 217–229</div>
              <div>ФЗ №152-ФЗ — защита перс. данных</div>
              <div>ФЗ №125-ФЗ — обяз. соц. страхование</div>
              <div>Пост. Прав. РФ №2255 от 22.12.2023</div>
              <div>Указ Президента №121 от 01.03.2022</div>
              <div>Указ Президента №372 от 05.05.2023</div>
            </div>
          </div>

          {/* Dispute resolution */}
          <div>
            <div className="font-inter font-bold text-xs text-white/40 uppercase tracking-widest mb-3">Разрешение споров</div>
            <div className="space-y-1.5 text-xs text-white/50 font-inter">
              <div>1. Внутреннее разрешение — 10–15 раб. дней</div>
              <div>2. Обращение в профсоюз</div>
              <div>3. Судебное разбирательство (Хабаровский край)</div>
              <div className="pt-1">Досрочное расторжение:</div>
              <div>По инициативе работника — уведомление за 2 недели</div>
              <div>Бесплатный билет домой + доставка вещей до 50 кг</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-white/30 font-inter">
            © {new Date().getFullYear()} Правительство РФ · ООО «Братоуверие-СНБ». Все права защищены.
          </p>
          <p className="text-xs text-white/30 font-inter">
            <a href="https://vosstanovim-dnr.ru" className="hover:text-white transition-colors">https://vosstanovim-dnr.ru</a>
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="/privacy" className="text-xs text-white/40 hover:text-white font-inter transition-colors underline">
              Политика конфиденциальности
            </a>
            <Link to="/about" className="text-xs text-white/40 hover:text-white font-inter transition-colors underline">
              О программе
            </Link>
            <Link to="/contact" className="text-xs text-white/40 hover:text-white font-inter transition-colors underline">
              Контакты
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
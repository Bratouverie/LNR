import { useState } from "react";
import { ExternalLink, Clock, Newspaper } from "lucide-react";

const NEWS = [
  {
    title: "Правительство РФ утвердило новые выплаты работникам программы восстановления ЛНР и ДНР",
    source: "Российская газета",
    date: "2026-06-04",
    url: "https://rg.ru",
    tag: "Официально",
    excerpt: "Постановление закрепляет единовременные подъёмные выплаты в размере 2 500 000 ₽ и расширяет перечень льгот для участников государственной программы восстановления новых регионов.",
  },
  {
    title: "В Мариуполе восстановлены более 4 000 жилых домов — Минстрой РФ",
    source: "ТАСС",
    date: "2026-06-02",
    url: "https://tass.ru",
    tag: "Строительство",
    excerpt: "Министерство строительства сообщает о рекордных темпах восстановления жилого фонда в Мариуполе. Параллельно ведётся строительство школ, детских садов и объектов здравоохранения.",
  },
  {
    title: "Спрос на рабочие специальности в ДНР и ЛНР вырос на 38% — аналитика HeadHunter",
    source: "РБК",
    date: "2026-05-30",
    url: "https://rbc.ru",
    tag: "Рынок труда",
    excerpt: "Согласно данным крупнейшего job-портала страны, количество вакансий вахтового формата в новых регионах продолжает расти. Наиболее востребованы строители, водители и инженеры.",
  },
  {
    title: "Луганск получил новые объекты коммунальной инфраструктуры в рамках федеральной программы",
    source: "Коммерсантъ",
    date: "2026-05-28",
    url: "https://kommersant.ru",
    tag: "Инфраструктура",
    excerpt: "В Луганске завершены работы по восстановлению водопроводных сетей и тепловых магистралей. В проекте участвовали более 800 специалистов из различных регионов России.",
  },
  {
    title: "Ветераны восстановления ДНР и ЛНР получат приоритет при распределении земельных участков",
    source: "Парламентская газета",
    date: "2026-05-22",
    url: "https://pnp.ru",
    tag: "Льготы",
    excerpt: "Соответствующий законопроект принят в третьем чтении. Участники программы восстановления, отработавшие полный срок, получат право на земельный участок площадью до 15 соток.",
  },
  {
    title: "Новый жилой квартал в Макеевке: 1 200 квартир для жителей ДНР сдан досрочно",
    source: "Interfax",
    date: "2026-05-18",
    url: "https://interfax.ru",
    tag: "Строительство",
    excerpt: "Строительство жилого комплекса было завершено на три недели раньше срока благодаря слаженной работе специалистов из 14 регионов России. Проект стал одним из крупнейших в истории программы.",
  },
];

const TAG_COLORS = {
  "Официально": "bg-blue-100 text-blue-700",
  "Строительство": "bg-orange-100 text-orange-700",
  "Рынок труда": "bg-green-100 text-green-700",
  "Инфраструктура": "bg-purple-100 text-purple-700",
  "Льготы": "bg-yellow-100 text-yellow-700",
};

export default function NewsSection() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? NEWS : NEWS.slice(0, 3);

  return (
    <section id="news" className="py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Новости</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Актуальные новости программы
          </h2>
          <p className="text-muted-foreground font-inter mt-3 max-w-xl mx-auto text-sm">
            Последние события и официальные сообщения о ходе восстановления ЛНР и ДНР
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((n, i) => (
            <a
              key={i}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-xs font-inter font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[n.tag] || "bg-secondary text-muted-foreground"}`}>
                  {n.tag}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-inter shrink-0">
                  <Clock className="h-3 w-3" />
                  {new Date(n.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                </div>
              </div>

              <h3 className="font-inter font-bold text-sm text-foreground leading-snug group-hover:text-accent transition-colors">
                {n.title}
              </h3>

              <p className="font-inter text-xs text-muted-foreground leading-relaxed flex-1">
                {n.excerpt}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-inter">
                  <Newspaper className="h-3 w-3" />
                  {n.source}
                </div>
                <span className="flex items-center gap-1 text-xs text-accent font-semibold font-inter group-hover:gap-2 transition-all">
                  Читать <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>

        {!expanded && (
          <div className="text-center mt-8">
            <button
              onClick={() => setExpanded(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-8 py-3 rounded-xl transition-colors text-sm"
            >
              Показать все новости ({NEWS.length})
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
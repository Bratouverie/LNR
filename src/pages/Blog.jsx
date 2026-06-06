import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Tag, ArrowRight, TrendingUp, Phone } from "lucide-react";
import { BLOG_ARTICLES } from "@/lib/blogData";
import LiveChat from "@/components/LiveChat";
import VisitorCounter from "@/components/VisitorCounter";

const CATEGORY_COLORS = {
  "Вакансии": "bg-blue-100 text-blue-700",
  "Оплата труда": "bg-green-100 text-green-700",
  "Безопасность": "bg-red-100 text-red-700",
  "Как вступить": "bg-purple-100 text-purple-700",
  "Условия": "bg-orange-100 text-orange-700",
  "Льготы": "bg-yellow-100 text-yellow-700",
};

export default function Blog() {
  const featured = BLOG_ARTICLES[0];
  const rest = BLOG_ARTICLES.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-inter text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase block mb-3">Блог</span>
          <h1 className="text-3xl sm:text-5xl font-inter font-black text-white tracking-tight mb-4">
            Полезные статьи
          </h1>
          <p className="text-white/70 font-inter text-base max-w-2xl leading-relaxed">
            Всё о работе в ЛНР и ДНР: вакансии, зарплаты, условия программы восстановления, льготы и советы участникам.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { label: "Зарплата от", value: "300 000 ₽/мес" },
              { label: "Подъёмные", value: "2 500 000 ₽" },
              { label: "Страховка", value: "до 14,7 млн ₽" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
                <div className="text-white/50 text-xs font-inter">{s.label}</div>
                <div className="text-white font-mono font-bold text-sm">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Featured article */}
        <Link to={`/blog/${featured.slug}`} className="group block mb-12">
          <div className="grid sm:grid-cols-2 gap-0 bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-xl transition-all duration-300">
            {featured.image && (
              <div className="h-56 sm:h-auto overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            )}
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-xs font-mono text-accent font-semibold bg-accent/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Актуально
                </span>
                <span className={`text-xs font-inter font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[featured.category] || "bg-secondary text-muted-foreground"}`}>
                  {featured.category}
                </span>
              </div>
              <h2 className="font-inter font-black text-xl sm:text-2xl text-foreground leading-tight mb-3 group-hover:text-accent transition-colors">
                {featured.title}
              </h2>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">
                {featured.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-inter">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {featured.readTime}
                  </span>
                  <span>
                    {new Date(featured.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-sm text-accent font-semibold font-inter">
                  Читать <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              {article.image && (
                <div className="h-44 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-inter font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[article.category] || "bg-secondary text-muted-foreground"}`}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-inter">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="font-inter font-bold text-foreground text-base leading-snug group-hover:text-accent transition-colors line-clamp-3">
                  {article.title}
                </h2>

                <p className="font-inter text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">
                  {article.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                  <span className="text-xs text-muted-foreground font-inter">
                    {new Date(article.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-accent font-semibold font-inter">
                    Читать
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-primary rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-inter font-black text-xl text-white mb-2">Готовы начать?</h3>
            <p className="font-inter text-white/70 text-sm">Позвоните бесплатно или оставьте заявку — ответим в течение часа.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:88002228463"
              className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-3 px-6 rounded-xl transition-colors text-sm"
            >
              <Phone className="h-4 w-4" />
              8-800-222-84-63
            </a>
            <Link
              to="/"
              className="flex items-center justify-center bg-white/10 hover:bg-white/20 text-white font-inter font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
            >
              Все вакансии
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Tag, Phone } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { BLOG_ARTICLES } from "@/lib/blogData";

export default function BlogArticle() {
  const { slug } = useParams();
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-inter">Статья не найдена</p>
        <Link to="/blog" className="text-accent hover:underline font-inter">← Все статьи</Link>
      </div>
    );
  }

  const related = BLOG_ARTICLES.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-inter text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Все статьи
          </Link>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="flex items-center gap-1 text-xs font-mono text-accent font-semibold bg-accent/20 px-2 py-0.5 rounded-full">
              <Tag className="h-3 w-3" />
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-white/50 font-inter">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
            <span className="text-xs text-white/40 font-inter">
              {new Date(article.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-inter font-black text-white tracking-tight leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2">
            <div className="prose prose-slate max-w-none
              prose-headings:font-inter prose-headings:font-bold prose-headings:text-foreground
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-inter prose-p:text-sm
              prose-li:text-muted-foreground prose-li:font-inter prose-li:text-sm
              prose-strong:text-foreground prose-strong:font-semibold
              prose-table:text-sm prose-th:font-semibold prose-th:text-foreground prose-td:text-muted-foreground
              prose-table:border prose-th:border prose-td:border prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2
            ">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* CTA */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-5 sticky top-20">
              <h3 className="font-inter font-bold mb-2">Хотите участвовать?</h3>
              <p className="font-inter text-sm text-white/70 mb-4 leading-relaxed">
                Зарплата от 300 000 ₽/мес + подъёмные 2 500 000 ₽. Звоните бесплатно!
              </p>
              <a
                href="tel:88002228463"
                className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-3 rounded-xl transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                8-800-222-84-63
              </a>
              <Link
                to="/#vacancies"
                className="flex items-center justify-center w-full mt-2 bg-white/10 hover:bg-white/20 text-white font-inter font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Смотреть вакансии
              </Link>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-inter font-bold text-foreground mb-4 text-sm">Читайте также</h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      to={`/blog/${r.slug}`}
                      className="block group"
                    >
                      <p className="font-inter text-sm text-foreground group-hover:text-accent transition-colors leading-snug">
                        {r.title}
                      </p>
                      <span className="font-inter text-xs text-muted-foreground">{r.readTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-inter font-bold text-foreground mb-3 text-sm">Темы</h3>
              <div className="flex flex-wrap gap-2">
                {article.keywords.map((kw) => (
                  <span key={kw} className="text-xs font-inter text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LiveChat from "@/components/LiveChat";
import VisitorCounter from "@/components/VisitorCounter";
import { ArrowLeft, Clock, Tag, Phone, ChevronRight, Calendar, User, TrendingUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { base44 } from "@/api/base44Client";
import { BLOG_ARTICLES } from "@/lib/blogData";
import ArticleChart from "@/components/blog/ArticleChart";
import ArticleTimeline from "@/components/blog/ArticleTimeline";

export default function BlogArticle() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const posts = await base44.entities.BlogPost.filter({ slug, status: "published" }, "-date", 1);
      if (posts && posts.length > 0) {
        setArticle(posts[0]);
        try {
          const all = await base44.entities.BlogPost.filter({ status: "published" }, "-date", 4);
          setRelated(all.filter((p) => p.id !== posts[0].id).slice(0, 3));
        } catch {
          setRelated([]);
        }
      } else {
        setNotFound(true);
      }
    } catch (err) {
      // Fallback to static data
      const staticArticle = BLOG_ARTICLES.find((a) => a.slug === slug);
      if (staticArticle) {
        setArticle(staticArticle);
        setRelated(BLOG_ARTICLES.filter((a) => a.id !== staticArticle.id).slice(0, 3));
      } else {
        setNotFound(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // SEO: update document title
  useEffect(() => {
    if (article) {
      document.title = article.seoTitle || `${article.title} — Восстановим ДНР`;
      if (article.seoDescription || article.description) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", article.seoDescription || article.description);
      }
    }
    return () => {
      document.title = "Восстановим ДНР — Работа на восстановлении ЛНР и ДНР";
    };
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground font-inter">Статья не найдена</p>
        <Link to="/blog" className="text-accent hover:underline font-inter">← Все статьи</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative bg-primary pt-16 overflow-hidden">
        {article.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${article.image})` }}
          />
        )}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-white/40 text-xs font-inter mb-8">
            <Link to="/" className="hover:text-white transition-colors">Главная</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-white transition-colors">Блог</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/60 truncate max-w-[200px]">{article.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-mono text-accent font-semibold bg-accent/20 px-3 py-1 rounded-full">
              <Tag className="h-3 w-3" />
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/50 font-inter">
              <Clock className="h-3 w-3" />
              {article.readTime} чтения
            </span>
            <span className="flex items-center gap-1.5 text-xs text-white/40 font-inter">
              <Calendar className="h-3 w-3" />
              {new Date(article.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-inter font-black text-white tracking-tight leading-tight max-w-4xl mb-4">
            {article.seoTitle || article.title}
          </h1>
          <p className="text-white/70 font-inter text-base max-w-3xl leading-relaxed">
            {article.seoDescription || article.description}
          </p>
        </div>
      </div>

      {/* Hero image strip */}
      {article.image && (
        <div className="w-full h-56 sm:h-72 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <VisitorCounter />
      <LiveChat />
      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main content */}
          <article className="lg:col-span-2 space-y-10">

            {/* Chart / infographic block */}
            {article.chartData && article.chartData.type !== "timeline" && (
              <ArticleChart data={article.chartData} />
            )}

            {/* Timeline chart */}
            {article.chartData && article.chartData.type === "timeline" && (
              <ArticleTimeline data={article.chartData} />
            )}

            {/* Article text */}
            <div className="prose-custom">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-xl sm:text-2xl font-inter font-black text-foreground mt-10 mb-4 pb-2 border-b border-border">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base sm:text-lg font-inter font-bold text-foreground mt-7 mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="font-inter text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-2 mb-5 ml-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-2 mb-5 ml-1 list-decimal list-inside">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="font-inter text-sm text-muted-foreground pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-accent before:shrink-0">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-foreground">{children}</strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-accent bg-accent/5 px-5 py-4 rounded-r-xl my-6 italic font-inter text-sm text-foreground/80 leading-relaxed">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6 rounded-xl border border-border">
                      <table className="w-full text-sm font-inter">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-primary text-primary-foreground">{children}</thead>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider">{children}</th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-3 border-t border-border text-muted-foreground">{children}</td>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-secondary/50 transition-colors">{children}</tr>
                  ),
                  a: ({ children, href }) => (
                    <a href={href} className="text-accent underline hover:no-underline" target="_blank" rel="noopener noreferrer">{children}</a>
                  ),
                  code: ({ children }) => (
                    <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono text-foreground">{children}</code>
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {article.keywords && article.keywords.length > 0 && (
              <div className="pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {article.keywords.map((kw) => (
                    <span key={kw} className="text-xs font-inter text-muted-foreground bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors">
                      #{kw.replace(/\s+/g, "_")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author / source block */}
            <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                <User className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="font-inter font-bold text-sm text-foreground mb-1">Редакция vosstanovim-dnr.ru</div>
                <p className="font-inter text-xs text-muted-foreground leading-relaxed">
                  Материал подготовлен на основе официальных данных программы восстановления ЛНР и ДНР.
                  Актуализирован {new Date(article.date).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}.
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Sticky CTA */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-accent" />
                <h3 className="font-inter font-bold text-base">Хотите участвовать?</h3>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs font-inter">
                  <span className="text-white/60">Зарплата от</span>
                  <span className="font-bold text-accent">300 000 ₽/мес</span>
                </div>
                <div className="flex justify-between text-xs font-inter">
                  <span className="text-white/60">Подъёмные</span>
                  <span className="font-bold text-accent">2 500 000 ₽</span>
                </div>
                <div className="flex justify-between text-xs font-inter">
                  <span className="text-white/60">Страховка</span>
                  <span className="font-bold text-white">до 14,7 млн ₽</span>
                </div>
                <div className="flex justify-between text-xs font-inter">
                  <span className="text-white/60">Жильё и питание</span>
                  <span className="font-bold text-white">Бесплатно</span>
                </div>
              </div>
              <a
                href="tel:88002228463"
                className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-accent-foreground font-inter font-bold py-3 rounded-xl transition-colors text-sm mb-2"
              >
                <Phone className="h-4 w-4" />
                8-800-222-84-63
              </a>
              <Link
                to="/"
                className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20 text-white font-inter font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Оставить заявку онлайн
              </Link>
            </div>

            {/* Key facts */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-inter font-bold text-foreground mb-4 text-sm">📌 Ключевые факты</h3>
              <div className="space-y-3">
                {[
                  { label: "Срок вахты", value: "1 год" },
                  { label: "Место работы", value: "Мариуполь, Луганск, Макеевка, Алчевск" },
                  { label: "Формат занятости", value: "Официальный трудовой договор" },
                  { label: "Выплата зарплаты", value: "2 раза в месяц" },
                  { label: "Страховое покрытие", value: "До 14 700 000 ₽" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col gap-0.5">
                    <span className="text-xs text-muted-foreground font-inter">{f.label}</span>
                    <span className="text-sm font-inter font-semibold text-foreground">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-inter font-bold text-foreground mb-4 text-sm">Читайте также</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.id || r.slug} to={`/blog/${r.slug}`} className="block group">
                      {r.image && (
                        <div className="w-full h-24 rounded-lg overflow-hidden mb-2">
                          <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <p className="font-inter text-sm text-foreground group-hover:text-accent transition-colors leading-snug font-medium">
                        {r.title}
                      </p>
                      <span className="font-inter text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />{r.readTime}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
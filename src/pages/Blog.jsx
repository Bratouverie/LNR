import { Link } from "react-router-dom";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import { BLOG_ARTICLES } from "@/lib/blogData";

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary pt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-inter text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase block mb-3">Блог</span>
          <h1 className="text-3xl sm:text-5xl font-inter font-black text-white tracking-tight mb-4">
            Статьи и советы
          </h1>
          <p className="text-white/70 font-inter text-base max-w-2xl leading-relaxed">
            Полезные материалы о работе в ЛНР и ДНР, условиях программы восстановления, вакансиях и льготах для участников.
          </p>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_ARTICLES.map((article) => (
            <Link
              key={article.id}
              to={`/blog/${article.slug}`}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1 text-xs font-mono text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full">
                    <Tag className="h-3 w-3" />
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-inter">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="font-inter font-bold text-foreground text-base leading-snug group-hover:text-accent transition-colors">
                  {article.title}
                </h2>

                <p className="font-inter text-sm text-muted-foreground leading-relaxed flex-1">
                  {article.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                  <span className="text-xs text-muted-foreground font-inter">
                    {new Date(article.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
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
      </div>
    </div>
  );
}
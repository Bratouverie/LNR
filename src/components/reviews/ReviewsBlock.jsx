import { useState } from "react";
import { Plus } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";
import { SEED_REVIEWS } from "@/lib/reviewSeedData";

// [CLAUDE FIX 2026-07-06] Статические отзывы — часть дизайна страницы
// Отзывы встроены в код, рендерятся мгновенно, без сетевых запросов
// 9 отзывов показываются сразу, 3 дополнительных — по кнопке "Показать ещё"
// Функционал создания/модерации временно отключён

const PAGE_SIZE = 9;

export default function ReviewsBlock() {
  const [reviews] = useState(SEED_REVIEWS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedReview, setSelectedReview] = useState(null);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <section id="reviews" className="py-24 sm:py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-accent font-mono text-sm font-semibold tracking-widest uppercase">Отзывы</span>
          <h2 className="text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight">
            Реальные отзывы участников
          </h2>
          <p className="text-muted-foreground font-inter mt-4 max-w-xl mx-auto">
            Поделитесь своим опытом или прочитайте отзывы тех, кто уже работает в программе восстановления.
          </p>
        </div>

        {/* Grid — статические отзывы */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleReviews.map((review, index) => (
            <ReviewCard
              key={review.id}
              review={review}
              isHighlighted={index === 0}
              onClick={() => setSelectedReview(review)}
            />
          ))}
        </div>

        {/* Load more — 3 дополнительных отзыва */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + 3)}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 font-inter text-sm font-medium text-foreground hover:border-accent/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Показать ещё
            </button>
          </div>
        )}
      </div>

      {/* Modal: full review */}
      <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
    </section>
  );
}
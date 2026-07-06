import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2, MessageSquare } from "lucide-react";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";
import ReviewForm from "./ReviewForm";
import { getCachedReviews, setCachedReviews } from "@/lib/reviewCache";
import { SEED_REVIEWS } from "@/lib/reviewSeedData";

const PAGE_SIZE = 9;

export default function ReviewsBlock() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await base44.functions.invoke("getPublicReviews", { limit: 100, offset: 0 });
      const data = res.data?.reviews || [];
      if (data.length > 0) {
        setReviews(data);
        setCachedReviews(data);
      } else {
        setReviews(getCachedReviews() || SEED_REVIEWS);
      }
    } catch (err) {
      // Сеть недоступна (CORS на неверефицированном домене) — fallback на кеш или seed
      setReviews(getCachedReviews() || SEED_REVIEWS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleFormSuccess = () => {
    setFormOpen(false);
    setTimeout(() => fetchReviews(), 1500);
  };

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

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-accent animate-spin" />
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <>
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-inter text-sm text-muted-foreground">Пока нет одобренных отзывов.</p>
                <p className="font-inter text-sm text-muted-foreground mt-1">Будьте первым!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onClick={() => setSelectedReview(review)}
                  />
                ))}
              </div>
            )}

            {/* Load more */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="rounded-lg border border-border bg-card px-6 py-2.5 font-inter text-sm font-medium text-foreground hover:border-accent/30 transition-colors"
                >
                  Загрузить ещё
                </button>
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-inter text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            Оставить отзыв
          </button>
        </div>
      </div>

      {/* Modal: full review */}
      <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />

      {/* Modal: form */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setFormOpen(false)}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-inter font-bold text-lg text-foreground">Оставить отзыв</h3>
                  <button
                    onClick={() => setFormOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ReviewForm
                  onClose={() => setFormOpen(false)}
                  onSuccess={handleFormSuccess}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
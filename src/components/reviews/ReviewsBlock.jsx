import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Loader2 } from 'lucide-react';
import { STATIC_REVIEWS } from '@/lib/staticReviews';
import ReviewCard from './ReviewCard';
import ReviewModal from './ReviewModal';
import ReviewForm from './ReviewForm';

// [HYBRID LOADING 2026-07-06] Двухуровневая система загрузки
// Уровень 1 (оптимизм): fetch /data/reviews.json (свежие данные с сервера)
// Уровень 2 (пессимизм): STATIC_REVIEWS как fallback (встроенные данные)
// Результат: 12 отзывов ВСЕГДА видны, никогда ошибка

const PAGE_SIZE = 9;
const CACHE_VERSION = '2026-07-06-12-00';

export default function ReviewsBlock() {
  const [reviews, setReviews] = useState(STATIC_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/data/reviews.json?v=${CACHE_VERSION}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data.reviews)) {
          throw new Error('Invalid JSON: reviews is not array');
        }

        if (data.reviews.length === 0) {
          throw new Error('Empty reviews array');
        }

        setReviews(data.reviews);
      } catch (err) {
        console.warn('[ReviewsBlock] Failed to fetch /data/reviews.json:', err.message);
        setReviews(STATIC_REVIEWS);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleFormSuccess = () => {
    setFormOpen(false);
  };

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <section id='reviews' className='py-24 sm:py-32 bg-secondary/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <span className='text-accent font-mono text-sm font-semibold tracking-widest uppercase'>
            Отзывы
          </span>
          <h2 className='text-3xl sm:text-4xl font-inter font-black text-foreground mt-3 tracking-tight'>
            Реальные отзывы участников
          </h2>
          <p className='text-muted-foreground font-inter mt-4 max-w-xl mx-auto'>
            Поделитесь своим опытом или прочитайте отзывы тех, кто уже работает в
            программе восстановления.
          </p>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className='flex justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-accent' />
          </div>
        )}

        {/* Grid отзывов */}
        {!loading && reviews && reviews.length > 0 && (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
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
          <div className='flex justify-center mt-8'>
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className='rounded-lg border border-border bg-card px-6 py-2.5 font-inter text-sm font-medium text-foreground hover:border-accent/30 transition-colors'
            >
              Загрузить ещё
            </button>
          </div>
        )}

        {/* CTA */}
        <div className='flex justify-center mt-10'>
          <button
            onClick={() => setFormOpen(true)}
            className='flex items-center gap-2 rounded-lg bg-accent text-accent-foreground px-6 py-3 font-inter text-sm font-bold hover:opacity-90 transition-opacity'
          >
            <Plus className='h-4 w-4' />
            Оставить отзыв
          </button>
        </div>
      </div>

      {/* Modal: просмотр отзыва */}
      <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />

      {/* Modal: форма нового отзыва */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4'
            onClick={() => setFormOpen(false)}
            role='dialog'
            aria-modal='true'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className='bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto'
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='font-inter font-bold text-lg text-foreground'>
                    Оставить отзыв
                  </h3>
                  <button
                    onClick={() => setFormOpen(false)}
                    className='text-muted-foreground hover:text-foreground transition-colors'
                  >
                    <X className='h-5 w-5' />
                  </button>
                </div>
                <ReviewForm onClose={() => setFormOpen(false)} onSuccess={handleFormSuccess} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
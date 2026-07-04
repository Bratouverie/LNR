import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Clock, Calendar } from "lucide-react";
import ReviewStars from "./ReviewStars";

export default function ReviewModal({ review, onClose }) {
  const date = review?.created_date
    ? new Date(review.created_date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <AnimatePresence>
      {review && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="p-6">
              <button
                className="float-right text-muted-foreground hover:text-foreground transition-colors"
                onClick={onClose}
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <img
                  src={review.photo}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover border border-border"
                />
                <div>
                  <h3 className="font-inter font-bold text-lg text-foreground">{review.name}</h3>
                  <p className="font-inter text-sm text-muted-foreground">{review.position}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <ReviewStars value={review.stars} readonly size={18} />
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-xs text-muted-foreground font-inter">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-accent" />{review.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-accent" />{review.monthsInProgram} мес. в программе
                </span>
                {date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-accent" />{date}
                  </span>
                )}
              </div>

              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="font-inter text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {review.text}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
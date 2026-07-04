import { MapPin, Clock } from "lucide-react";
import ReviewStars from "./ReviewStars";

export default function ReviewCard({ review, onClick }) {
  const truncated =
    review.text.length > 200 ? review.text.slice(0, 200) + "…" : review.text;

  return (
    <div
      className="bg-card border border-border rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:border-accent/30 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={review.photo}
          alt={review.name}
          loading="lazy"
          decoding="async"
          className="w-14 h-14 rounded-full object-cover border border-border shrink-0"
        />
        <div className="min-w-0">
          <div className="font-inter font-bold text-foreground truncate">{review.name}</div>
          <div className="font-inter text-xs text-muted-foreground truncate">{review.position}</div>
        </div>
      </div>
      <ReviewStars value={review.stars} readonly size={14} />
      <p className="font-inter text-sm text-muted-foreground mt-2 line-clamp-3">{truncated}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="font-inter text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3 w-3" />{review.city}
        </span>
        <span className="font-mono text-xs text-accent flex items-center gap-1">
          <Clock className="h-3 w-3" />{review.monthsInProgram} мес.
        </span>
      </div>
    </div>
  );
}
import { Star } from "lucide-react";

export default function ReviewStars({ value = 0, onChange, size = 16, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
          aria-label={`${star} звёзд`}
        >
          <Star
            style={{ width: size, height: size }}
            className={
              star <= value
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }
          />
        </button>
      ))}
    </div>
  );
}
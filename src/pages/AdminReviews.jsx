import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Check, X, Trash2, Loader2, Star, Search } from "lucide-react";
import ReviewStars from "@/components/reviews/ReviewStars";

const TABS = [
  { key: "pending", label: "На модерации" },
  { key: "approved", label: "Одобрены" },
  { key: "rejected", label: "Отклонены" },
];

export default function AdminReviews() {
  const [activeTab, setActiveTab] = useState("pending");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState({});

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Review.filter(
        { status: activeTab },
        "-created_date",
        200
      );
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAction = async (id, action) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      if (action === "approve") {
        await base44.entities.Review.update(id, { status: "approved" });
      } else if (action === "reject") {
        await base44.entities.Review.update(id, { status: "rejected" });
      } else if (action === "delete") {
        await base44.entities.Review.delete(id);
      }
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // ignore
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const filtered = search
    ? reviews.filter(
        (r) =>
          r.name?.toLowerCase().includes(search.toLowerCase()) ||
          r.position?.toLowerCase().includes(search.toLowerCase()) ||
          r.city?.toLowerCase().includes(search.toLowerCase())
      )
    : reviews;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-inter font-black text-2xl text-foreground mb-6">
          Модерация отзывов
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-inter text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, должности, городу…"
            className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 font-inter text-sm"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-accent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="font-inter text-sm text-muted-foreground text-center py-12">
            Нет отзывов в этой категории.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => (
              <div
                key={review.id}
                className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4"
              >
                <img
                  src={review.photo}
                  alt={review.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-inter font-bold text-foreground">{review.name}</span>
                    <ReviewStars value={review.stars} readonly size={12} />
                    <span className="font-inter text-xs text-muted-foreground">
                      {review.position} • {review.city} • {review.monthsInProgram} мес.
                    </span>
                  </div>
                  <p className="font-inter text-sm text-muted-foreground mt-2 line-clamp-3">
                    {review.text}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground/60 mt-1">
                    {review.ipAddress} • {new Date(review.created_date).toLocaleString("ru-RU")}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {activeTab === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(review.id, "approve")}
                        disabled={actionLoading[review.id]}
                        className="rounded-lg bg-green-600 text-white p-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                        title="Одобрить"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAction(review.id, "reject")}
                        disabled={actionLoading[review.id]}
                        className="rounded-lg bg-orange-500 text-white p-2 hover:bg-orange-600 transition-colors disabled:opacity-50"
                        title="Отклонить"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  {activeTab === "rejected" && (
                    <button
                      onClick={() => handleAction(review.id, "approve")}
                      disabled={actionLoading[review.id]}
                      className="rounded-lg bg-green-600 text-white p-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                      title="Одобрить"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleAction(review.id, "delete")}
                    disabled={actionLoading[review.id]}
                    className="rounded-lg bg-destructive text-destructive-foreground p-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    title="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
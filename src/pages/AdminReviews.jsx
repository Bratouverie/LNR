import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { getToken } from '@/lib/crmAuth';
import { Check, X, Trash2, Loader2, Search, Star, AlertCircle } from 'lucide-react';
import ReviewStars from '@/components/reviews/ReviewStars';

const TABS = [
  { key: 'pending', label: 'На модерации' },
  { key: 'approved', label: 'Одобрены' },
  { key: 'rejected', label: 'Отклонены' },
];

const REJECT_REASONS = [
  { value: 'spam', label: 'Спам' },
  { value: 'offensive', label: 'Оскорбительный контент' },
  { value: 'fake', label: 'Фейковый отзыв' },
  { value: 'other', label: 'Другое' },
];

export default function AdminReviews() {
  const [activeTab, setActiveTab] = useState('pending');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('spam');
  const [rejectLoading, setRejectLoading] = useState(false);
  const token = getToken();

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('getReviews', { token, status: activeTab });
      setReviews(res.data?.reviews || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки отзывов');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleApprove = async (id) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    setError('');
    try {
      await base44.functions.invoke('approveReview', { token, reviewId: id });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при одобрении отзыва');
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setRejectLoading(true);
    setError('');
    try {
      await base44.functions.invoke('rejectReview', { token, reviewId: rejectTarget.id, reason: rejectReason });
      setReviews((prev) => prev.filter((r) => r.id !== rejectTarget.id));
      setRejectTarget(null);
      setRejectReason('spam');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при отклонении отзыва');
    } finally {
      setRejectLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить отзыв? Отзыв будет скрыт, но останется в базе данных.')) return;
    setActionLoading((p) => ({ ...p, [id]: true }));
    setError('');
    try {
      await base44.functions.invoke('deleteReview', { token, reviewId: id });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при удалении отзыва');
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const filtered = search
    ? reviews.filter((r) =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.position?.toLowerCase().includes(search.toLowerCase()) ||
        r.city?.toLowerCase().includes(search.toLowerCase())
      )
    : reviews;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Модерация отзывов</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Управление отзывами с сайта и от кандидатов</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-white border border-border text-muted-foreground hover:text-foreground hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени, должности, городу…"
          className="w-full rounded-lg border border-input bg-white pl-10 pr-3 py-2 text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-accent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">Нет отзывов в этой категории.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4">
              <img src={review.photo} alt={review.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-foreground">{review.name}</span>
                  <ReviewStars value={review.stars} readonly size={12} />
                  <span className="text-xs text-muted-foreground">
                    {review.position} • {review.city} • {review.monthsInProgram} мес.
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{review.text}</p>
                {review.rejectionReason && (
                  <p className="text-xs text-destructive mt-1">Причина отклонения: {review.rejectionReason}</p>
                )}
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {review.ipAddress} • {new Date(review.created_date).toLocaleString('ru-RU')}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {(activeTab === 'pending' || activeTab === 'rejected') && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={actionLoading[review.id]}
                    className="rounded-lg bg-green-600 text-white p-2 hover:bg-green-700 transition-colors disabled:opacity-50"
                    title="Одобрить"
                  >
                    {actionLoading[review.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </button>
                )}
                {(activeTab === 'pending' || activeTab === 'approved') && (
                  <button
                    onClick={() => { setRejectTarget(review); setRejectReason('spam'); }}
                    disabled={actionLoading[review.id]}
                    className="rounded-lg bg-orange-500 text-white p-2 hover:bg-orange-600 transition-colors disabled:opacity-50"
                    title="Отклонить"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
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

      {rejectTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !rejectLoading && setRejectTarget(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-foreground mb-1">Отклонить отзыв?</h3>
            <p className="text-sm text-muted-foreground mb-4">Выберите причину отклонения:</p>
            <div className="space-y-2 mb-4">
              {REJECT_REASONS.map((r) => (
                <label key={r.value} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${rejectReason === r.value ? 'border-accent bg-accent/5' : 'border-border hover:bg-slate-50'}`}>
                  <input type="radio" name="rejectReason" value={r.value} checked={rejectReason === r.value} onChange={(e) => setRejectReason(e.target.value)} />
                  <span className="text-sm">{r.label}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setRejectTarget(null)} disabled={rejectLoading} className="px-4 py-2 rounded-lg text-sm border border-border hover:bg-slate-50">Отмена</button>
              <button onClick={handleRejectConfirm} disabled={rejectLoading} className="px-4 py-2 rounded-lg text-sm bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 flex items-center gap-1">
                {rejectLoading && <Loader2 className="w-3 h-3 animate-spin" />} Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
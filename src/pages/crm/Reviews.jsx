import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { getToken } from '@/lib/crmAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Trash2, Loader2, Search, MessageSquare } from 'lucide-react';

const TABS = [
  { key: 'pending', label: 'На модерации' },
  { key: 'approved', label: 'Одобрены' },
  { key: 'rejected', label: 'Отклонены' },
];

export default function CrmReviews() {
  const [activeTab, setActiveTab] = useState('pending');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const token = getToken();

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('getCandidates', { token });
      // Reviews are fetched directly via entity SDK (RLS allows admin reads)
      const data = await base44.entities.Review.filter({ status: activeTab }, '-created_date', 200);
      setReviews(data || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, token]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleAction = async (id, action) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      if (action === 'approve') {
        await base44.entities.Review.update(id, { status: 'approved' });
      } else if (action === 'reject') {
        await base44.entities.Review.update(id, { status: 'rejected' });
      } else if (action === 'delete') {
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
    ? reviews.filter((r) =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.position?.toLowerCase().includes(search.toLowerCase()) ||
        r.city?.toLowerCase().includes(search.toLowerCase())
      )
    : reviews;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-5 h-5" /> Отзывы
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Модерация отзывов кандидатов и публики</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени, должности, городу..."
          className="w-full rounded-lg border border-input bg-white pl-10 pr-3 py-2 text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Нет отзывов в этой категории</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex gap-4">
              <img
                src={review.photo}
                alt={review.name}
                className="w-14 h-14 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-foreground">{review.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {review.position} · {review.city} · {review.monthsInProgram} мес.
                  </span>
                  <span className="text-xs text-amber-500">{'★'.repeat(review.stars)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{review.text}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {review.ipAddress} · {new Date(review.created_date).toLocaleString('ru-RU')}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {activeTab === 'pending' && (
                  <>
                    <Button size="icon" variant="ghost" onClick={() => handleAction(review.id, 'approve')} disabled={actionLoading[review.id]} className="text-green-600 hover:text-green-700" title="Одобрить">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleAction(review.id, 'reject')} disabled={actionLoading[review.id]} className="text-orange-500" title="Отклонить">
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {activeTab === 'rejected' && (
                  <Button size="icon" variant="ghost" onClick={() => handleAction(review.id, 'approve')} disabled={actionLoading[review.id]} className="text-green-600" title="Одобрить">
                    <Check className="w-4 h-4" />
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => handleAction(review.id, 'delete')} disabled={actionLoading[review.id]} className="text-destructive" title="Удалить">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
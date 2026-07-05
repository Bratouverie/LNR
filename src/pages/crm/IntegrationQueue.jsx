import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { getToken } from '@/lib/crmAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Database, Inbox } from 'lucide-react';

const QUEUE_STATUS_LABELS = {
  pending: 'Ожидает',
  processed: 'Обработан',
  error: 'Ошибка',
  duplicate: 'Дубликат',
};

const QUEUE_STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  processed: 'bg-emerald-100 text-emerald-700',
  error: 'bg-red-100 text-red-700',
  duplicate: 'bg-slate-100 text-slate-700',
};

const SOURCE_LABELS = {
  genspark: 'Genspark',
  voip: 'VoIP',
  web_form: 'Веб-форма',
  telegram: 'Telegram',
};

export default function IntegrationQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const token = getToken();

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('getIntegrationQueue', { token, status: filterStatus || undefined });
      setQueue(res.data?.queue || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки очереди');
    } finally {
      setLoading(false);
    }
  }, [token, filterStatus]);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const statuses = ['', 'pending', 'processed', 'error', 'duplicate'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Database className="w-5 h-5" /> Очередь интеграций
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Всего записей: {queue.length}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchQueue} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Обновить
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              filterStatus === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s === '' ? 'Все' : QUEUE_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-destructive">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : queue.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
          <Inbox className="w-8 h-8" />
          <span>Нет записей в очереди</span>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Источник</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Внешний ID</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Данные</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Статус</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Попытки</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Ошибка</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((q) => (
                  <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3">
                      <Badge className="bg-slate-100 text-slate-700 border-0">{SOURCE_LABELS[q.source] || q.source}</Badge>
                    </td>
                    <td className="p-3 text-xs font-mono text-muted-foreground">{q.externalId}</td>
                    <td className="p-3 text-xs text-muted-foreground max-w-xs truncate">
                      {q.payload ? JSON.stringify(q.payload).slice(0, 80) : '—'}
                    </td>
                    <td className="p-3 text-center">
                      <Badge className={`${QUEUE_STATUS_COLORS[q.status]} border-0`}>{QUEUE_STATUS_LABELS[q.status]}</Badge>
                    </td>
                    <td className="p-3 text-center">{q.attemptCount || 0}</td>
                    <td className="p-3 text-xs text-red-600 max-w-xs truncate">{q.errorMessage || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
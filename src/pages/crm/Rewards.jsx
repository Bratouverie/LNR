import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { getToken, getManager } from '@/lib/crmAuth';
import { REWARD_STATUS_LABELS, REWARD_STATUS_COLORS, formatKopecks } from '@/lib/crmConstants';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const token = getToken();

  const fetchRewards = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('getRewardTransactions', { token });
      setRewards(res.data?.rewards || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки выплат');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchRewards(); }, [fetchRewards]);

  const handlePayout = async (rewardId) => {
    setProcessingId(rewardId);
    try {
      await base44.functions.invoke('processRewardPayout', { token, rewardTransactionId: rewardId });
      await fetchRewards();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка выплаты');
    } finally {
      setProcessingId(null);
    }
  };

  const totalPending = rewards.filter((r) => r.status === 'pending_payment');
  const totalPaid = rewards.filter((r) => r.status === 'paid');

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5" /> Выплаты вознаграждений
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ожидают: {totalPending.length} • Выплачено: {totalPaid.length}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchRewards} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Обновить
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-muted-foreground mb-1">Сумма ожидает</p>
          <p className="text-lg font-bold text-amber-600">
            {formatKopecks(totalPending.reduce((s, r) => s + (r.rewardFinal || 0), 0))}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-muted-foreground mb-1">Сумма выплачено</p>
          <p className="text-lg font-bold text-emerald-600">
            {formatKopecks(totalPaid.reduce((s, r) => s + (r.rewardFinal || 0), 0))}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-muted-foreground mb-1">Всего транзакций</p>
          <p className="text-lg font-bold text-foreground">{rewards.length}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-destructive">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : rewards.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Нет транзакций</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Кандидат</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Менеджер</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">База</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Итого</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Статус</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Действие</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-xs font-mono text-muted-foreground truncate max-w-32">{r.candidateId?.slice(0, 8)}...</td>
                    <td className="p-3 text-xs font-mono text-muted-foreground truncate max-w-32">{r.managerId?.slice(0, 8)}...</td>
                    <td className="p-3 text-right">{formatKopecks(r.rewardBase)}</td>
                    <td className="p-3 text-right font-semibold">{formatKopecks(r.rewardFinal)}</td>
                    <td className="p-3 text-center">
                      <Badge className={`${REWARD_STATUS_COLORS[r.status]} border-0`}>
                        {REWARD_STATUS_LABELS[r.status]}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      {r.status === 'pending_payment' ? (
                        <Button size="sm" onClick={() => handlePayout(r.id)} disabled={processingId === r.id}>
                          {processingId === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                          Выплатить
                        </Button>
                      ) : r.status === 'failed' ? (
                        <span className="text-xs text-red-600 flex items-center justify-end gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Ошибка
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
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
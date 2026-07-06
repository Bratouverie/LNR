import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { getToken, getManager, isAdmin } from '@/lib/crmAuth';
import { STATUS_LABELS } from '@/lib/crmConstants';
import CandidateCard from '@/components/crm/CandidateCard';
import TransitionDialog from '@/components/crm/TransitionDialog';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Users } from 'lucide-react';
import CreateCandidateDialog from '@/components/crm/CreateCandidateDialog';
import { isSuperAdmin } from '@/lib/crmAuth';

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [transitionCandidate, setTransitionCandidate] = useState(null);

  const manager = getManager();
  const token = getToken();
  const admin = isAdmin();

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('getCandidates', { token });
      setCandidates(res.data?.candidates || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки кандидатов');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  const handleTransitioned = () => {
    setTransitionCandidate(null);
    fetchCandidates();
  };

  const statuses = ['all', ...Object.keys(STATUS_LABELS)];
  const filtered = filterStatus === 'all'
    ? candidates
    : candidates.filter((c) => c.status === filterStatus);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5" /> Кандидаты
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {admin ? 'Все кандидаты' : 'Ваши кандидаты'} — всего: {candidates.length}
          </p>
        </div>
        <div className="flex gap-2">
          {isSuperAdmin() && <CreateCandidateDialog onCreated={fetchCandidates} />}
          <Button variant="outline" size="sm" onClick={fetchCandidates} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Обновить
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              filterStatus === s
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s === 'all' ? 'Все' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-destructive">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Нет кандидатов в этой категории</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <CandidateCard key={c.id} candidate={c} onTransition={setTransitionCandidate} />
          ))}
        </div>
      )}

      {transitionCandidate && (
        <TransitionDialog
          candidate={transitionCandidate}
          token={token}
          onTransitioned={handleTransitioned}
        />
      )}
    </div>
  );
}
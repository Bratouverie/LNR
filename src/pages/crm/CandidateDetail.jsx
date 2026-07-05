import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { getToken, getManager } from '@/lib/crmAuth';
import { REWARD_STATUS_LABELS, REWARD_STATUS_COLORS, formatKopecks } from '@/lib/crmConstants';
import CandidateInfoCard from '@/components/crm/CandidateInfoCard';
import Timeline from '@/components/crm/Timeline';
import TransitionDialog from '@/components/crm/TransitionDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, ArrowRight, DollarSign } from 'lucide-react';

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [logs, setLogs] = useState([]);
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const token = getToken();

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await base44.functions.invoke('getCandidateDetail', { token, candidateId: id });
        setCandidate(res.data?.candidate);
        setLogs(res.data?.logs || []);
        setReward(res.data?.reward);
      } catch (err) {
        setError(err.response?.data?.error || 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, token]);

  const handleTransitioned = () => {
    setShowTransition(false);
    // Refetch
    setLoading(true);
    base44.functions.invoke('getCandidateDetail', { token, candidateId: id })
      .then((res) => {
        setCandidate(res.data?.candidate);
        setLogs(res.data?.logs || []);
        setReward(res.data?.reward);
      })
      .catch((err) => setError(err.response?.data?.error || 'Ошибка'))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/crm/dashboard')}>
          <ArrowLeft className="w-4 h-4" /> Назад
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-destructive">{error}</div>
      </div>
    );
  }

  if (!candidate) return null;

  const manager = getManager();
  const canTransition = candidate.status !== 'completed' && candidate.status !== 'rejected';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/crm/dashboard')}>
          <ArrowLeft className="w-4 h-4" /> К списку
        </Button>
        {canTransition && (
          <Button size="sm" onClick={() => setShowTransition(true)}>
            <ArrowRight className="w-4 h-4" /> Сменить статус
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 space-y-5">
          <CandidateInfoCard candidate={candidate} />

          {reward && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Выплата
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">База:</span>
                  <span>{formatKopecks(reward.rewardBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Множитель:</span>
                  <span>{(reward.rewardMultiplier / 100).toFixed(1)}x</span>
                </div>
                <div className="flex justify-between font-semibold pt-1 border-t border-slate-100">
                  <span>Итого:</span>
                  <span>{formatKopecks(reward.rewardFinal)}</span>
                </div>
                <div className="pt-1">
                  <Badge className={`${REWARD_STATUS_COLORS[reward.status]} border-0`}>
                    {REWARD_STATUS_LABELS[reward.status]}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <Timeline logs={logs} />
        </div>
      </div>

      {showTransition && (
        <TransitionDialog
          candidate={candidate}
          token={token}
          onTransitioned={handleTransitioned}
        />
      )}
    </div>
  );
}
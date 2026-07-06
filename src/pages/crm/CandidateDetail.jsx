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
import { Loader2, ArrowLeft, ArrowRight, DollarSign, Mail, Copy, Check, Shield } from 'lucide-react';

export default function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [logs, setLogs] = useState([]);
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const [anketaLink, setAnketaLink] = useState('');
  const [anketaLoading, setAnketaLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const token = getToken();

  const canSendAnketa = candidate?.status === 'assigned' || candidate?.status === 'anketa_pending';
  const canSendSb = candidate?.status === 'anketa_filled' || candidate?.status === 'sb_check';

  const [sbLink, setSbLink] = useState('');
  const [sbLoading, setSbLoading] = useState(false);

  const handleGenerateSbLink = async () => {
    setSbLoading(true);
    try {
      const res = await base44.functions.invoke('generateSbToken', { token, candidateId: id });
      if (res.data?.link) setSbLink(res.data.link);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка генерации ссылки СБ');
    } finally {
      setSbLoading(false);
    }
  };

  const handleGenerateAnketaLink = async () => {
    setAnketaLoading(true);
    try {
      const res = await base44.functions.invoke('generateAnketaToken', { token, candidateId: id });
      if (res.data?.link) {
        setAnketaLink(res.data.link);
        // Also transition to anketa_pending if currently 'assigned'
        if (candidate.status === 'assigned') {
          await base44.functions.invoke('transitionCandidate', {
            token, candidateId: id, targetStatus: 'anketa_pending',
          });
          handleTransitioned();
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка генерации ссылки');
    } finally {
      setAnketaLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(anketaLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

          {canSendSb && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" /> Проверка СБ
              </h3>
              {!sbLink ? (
                <Button size="sm" variant="outline" onClick={handleGenerateSbLink} disabled={sbLoading} className="w-full">
                  {sbLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  Сгенерировать ссылку для СБ
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      readOnly
                      value={sbLink}
                      className="flex-1 bg-transparent text-xs text-slate-600 outline-none truncate"
                    />
                    <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(sbLink); }} className="h-7 w-7 shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ссылка действительна 24 часа. Отправьте её офицеру СБ.
                  </p>
                </div>
              )}
            </div>
          )}

          {canSendAnketa && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" /> Анкета кандидата
              </h3>
              {!anketaLink ? (
                <Button size="sm" variant="outline" onClick={handleGenerateAnketaLink} disabled={anketaLoading} className="w-full">
                  {anketaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Сгенерировать ссылку
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    <input
                      type="text"
                      readOnly
                      value={anketaLink}
                      className="flex-1 bg-transparent text-xs text-slate-600 outline-none truncate"
                    />
                    <Button size="icon" variant="ghost" onClick={handleCopyLink} className="h-7 w-7 shrink-0">
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ссылка действительна 7 дней. Отправьте её кандидату.
                  </p>
                </div>
              )}
            </div>
          )}

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
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { STATUS_LABELS, TRANSITIONS } from '@/lib/crmConstants';
import { Loader2, ArrowRight } from 'lucide-react';

export default function TransitionDialog({ candidate, token, onTransitioned }) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [reason, setReason] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const open = !!candidate;
  const currentStatus = candidate?.status;
  const allowed = currentStatus ? TRANSITIONS[currentStatus] || [] : [];

  useEffect(() => {
    if (open) {
      setSelectedStatus(null);
      setReason('');
      setComment('');
      setError('');
    }
  }, [open, candidate?.id]);

  const isReject = selectedStatus === 'rejected';

  const handleSubmit = async () => {
    if (!selectedStatus) return;
    if (isReject && !reason) {
      setError('Укажите причину отклонения');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { base44 } = await import('@/api/base44Client');
      await base44.functions.invoke('transitionCandidate', {
        token,
        candidateId: candidate.id,
        targetStatus: selectedStatus,
        reason: isReject ? reason : undefined,
        comment: comment || undefined,
      });
      onTransitioned();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка смены статуса');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onTransitioned()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Смена статуса кандидата</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{candidate?.fullName}</span>
            {' — '}
            <span>{currentStatus && STATUS_LABELS[currentStatus]}</span>
          </div>
          <div>
            <Label>Новый статус</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {allowed.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                    selectedStatus === status
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-white border-slate-200 hover:border-primary hover:bg-slate-50'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>
          {isReject && (
            <div>
              <Label htmlFor="reason">Причина отклонения *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="reject:REASON_CODE или текст причины"
                rows={2}
              />
            </div>
          )}
          <div>
            <Label htmlFor="comment">Комментарий (необязательно)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Комментарий к переходу..."
              rows={2}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onTransitioned} disabled={loading}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedStatus || loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Подтвердить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
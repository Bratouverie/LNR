import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS, STATUS_COLORS, TRANSITIONS } from '@/lib/crmConstants';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function CandidateCard({ candidate, onTransition }) {
  const status = candidate.status || 'pending';
  const allowed = TRANSITIONS[status] || [];
  const canTransition = allowed.length > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground truncate">{candidate.fullName}</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
            {candidate.phone && (
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{candidate.phone}</span>
            )}
            {candidate.email && (
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{candidate.email}</span>
            )}
            {candidate.city && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{candidate.city}</span>
            )}
          </div>
        </div>
        <Badge className={`${STATUS_COLORS[status]} border-0 shrink-0`}>
          {STATUS_LABELS[status]}
        </Badge>
      </div>
      {candidate.desiredPosition && (
        <p className="text-sm text-muted-foreground mb-3 truncate">
          Должность: {candidate.desiredPosition}
        </p>
      )}
      {candidate.source && (
        <p className="text-xs text-muted-foreground mb-3">
          Источник: {candidate.source}
        </p>
      )}
      {canTransition ? (
        <Button size="sm" variant="outline" onClick={() => onTransition(candidate)} className="w-full">
          Сменить статус <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      ) : (
        <p className="text-xs text-center text-muted-foreground py-2">
          {status === 'completed' ? 'Завершён — ожидает выплаты' : 'Финальный статус'}
        </p>
      )}
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/crmConstants';
import { Phone, Mail, MapPin, Calendar, Briefcase, ArrowRight, Clock } from 'lucide-react';

export default function CandidateInfoCard({ candidate }) {
  const status = candidate.status || 'pending';

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground">{candidate.fullName}</h2>
          {candidate.desiredPosition && (
            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> {candidate.desiredPosition}
            </p>
          )}
        </div>
        <Badge className={`${STATUS_COLORS[status]} border-0 shrink-0`}>
          {STATUS_LABELS[status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {candidate.phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4 shrink-0" /> {candidate.phone}
          </div>
        )}
        {candidate.email && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="w-4 h-4 shrink-0" /> {candidate.email}
          </div>
        )}
        {candidate.city && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" /> {candidate.city}
          </div>
        )}
        {candidate.birthDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 shrink-0" /> {candidate.birthDate}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
        {candidate.source && (
          <Badge variant="outline" className="text-xs">Источник: {candidate.source}</Badge>
        )}
        {candidate.rewardMultiplier && candidate.rewardMultiplier > 100 && (
          <Badge variant="outline" className="text-xs">
            Множитель: {(candidate.rewardMultiplier / 100).toFixed(1)}x
          </Badge>
        )}
        {candidate.externalId && (
          <Badge variant="outline" className="text-xs font-mono">ext: {candidate.externalId}</Badge>
        )}
      </div>
    </div>
  );
}
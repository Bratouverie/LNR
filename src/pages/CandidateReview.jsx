import React from 'react';
import { Loader2 } from 'lucide-react';

export default function CandidateReview() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Загрузка формы отзыва...</p>
      </div>
    </div>
  );
}
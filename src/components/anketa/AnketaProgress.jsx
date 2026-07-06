import React from 'react';

export default function AnketaProgress({ daysRemaining, sectionsFilled, totalSections }) {
  const percent = Math.round((sectionsFilled / totalSections) * 100);
  const urgent = daysRemaining <= 1;

  return (
    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 mb-6">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Прогресс заполнения</span>
            <span className="font-semibold text-foreground">{percent}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${urgent ? 'bg-red-500' : 'bg-accent'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className={`text-right shrink-0 ${urgent ? 'text-red-600' : 'text-muted-foreground'}`}>
          <p className="text-xs">Осталось</p>
          <p className="font-bold text-lg leading-none">{daysRemaining}д</p>
        </div>
      </div>
    </div>
  );
}
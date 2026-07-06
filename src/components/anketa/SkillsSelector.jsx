import React from 'react';
import { Check } from 'lucide-react';
import { getSkillsForPosition } from '@/lib/anketaSkills';

export default function SkillsSelector({ position, selected, onToggle }) {
  const skills = getSkillsForPosition(position);

  if (skills.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        Выберите должность, чтобы увидеть доступные навыки.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {skills.map((skill) => {
        const isSelected = selected.includes(skill);
        return (
          <button
            key={skill}
            type="button"
            onClick={() => onToggle(skill)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-colors ${
              isSelected
                ? 'border-accent bg-accent/10 text-foreground'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
              isSelected ? 'bg-accent border-accent text-white' : 'border-slate-300'
            }`}>
              {isSelected && <Check className="w-3 h-3" />}
            </span>
            {skill}
          </button>
        );
      })}
    </div>
  );
}
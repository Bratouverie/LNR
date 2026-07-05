import React from 'react';
import { Badge } from '@/components/ui/badge';
import { STATUS_LABELS } from '@/lib/crmConstants';
import { CheckCircle, ArrowRight, XCircle, FileText, MessageSquare, UserPlus } from 'lucide-react';

const ACTION_ICONS = {
  created: UserPlus,
  transition: ArrowRight,
  update: CheckCircle,
  reject: XCircle,
  comment: MessageSquare,
  document_upload: FileText,
};

const ACTION_LABELS = {
  created: 'Создан',
  transition: 'Переход',
  update: 'Обновление',
  reject: 'Отклонение',
  comment: 'Комментарий',
  document_upload: 'Документ',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Timeline({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Нет записей в истории
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">История изменений</h3>
      <div className="space-y-0">
        {logs.map((log, idx) => {
          const Icon = ACTION_ICONS[log.action] || CheckCircle;
          const isLast = idx === logs.length - 1;
          return (
            <div key={log.id} className="flex gap-3">
              {/* Timeline line + dot */}
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  log.action === 'reject' ? 'bg-red-100' : 'bg-slate-100'
                }`}>
                  <Icon className={`w-4 h-4 ${log.action === 'reject' ? 'text-red-600' : 'text-slate-600'}`} />
                </div>
                {!isLast && <div className="w-px h-full min-h-6 bg-slate-200 mt-1" />}
              </div>

              {/* Content */}
              <div className="flex-1 pb-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">
                    {ACTION_LABELS[log.action] || log.action}
                  </span>
                  {log.action === 'transition' && log.from && log.to && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {STATUS_LABELS[log.from] || log.from}
                      <ArrowRight className="w-3 h-3" />
                      {STATUS_LABELS[log.to] || log.to}
                    </span>
                  )}
                </div>
                {log.reason && (
                  <p className="text-xs text-muted-foreground mt-0.5">Причина: {log.reason}</p>
                )}
                {log.field && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Поле: {log.field}
                    {log.oldValue !== undefined && ` (было: ${log.oldValue})`}
                    {log.newValue !== undefined && ` → ${log.newValue}`}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span>{formatDate(log.created_date)}</span>
                  <span>•</span>
                  <span className="font-mono">{log.actor}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
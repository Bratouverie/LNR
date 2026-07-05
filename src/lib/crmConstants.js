// FSM status definitions, labels, colors, and transition map

export const STATUS_LABELS = {
  pending: 'Ожидает',
  assigned: 'Назначен',
  anketa_pending: 'Анкета ожидает',
  anketa_filled: 'Анкета заполнена',
  sb_check: 'Проверка СБ',
  ready_for_medical: 'Готов к медкомиссии',
  medical_passed: 'Медкомиссия пройдена',
  contract_signed: 'Договор подписан',
  completed: 'Завершён',
  rejected: 'Отклонён',
};

export const STATUS_COLORS = {
  pending: 'bg-slate-100 text-slate-700',
  assigned: 'bg-blue-100 text-blue-700',
  anketa_pending: 'bg-amber-100 text-amber-700',
  anketa_filled: 'bg-cyan-100 text-cyan-700',
  sb_check: 'bg-purple-100 text-purple-700',
  ready_for_medical: 'bg-indigo-100 text-indigo-700',
  medical_passed: 'bg-teal-100 text-teal-700',
  contract_signed: 'bg-green-100 text-green-700',
  completed: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

export const TRANSITIONS = {
  pending: ['assigned'],
  assigned: ['anketa_pending', 'rejected'],
  anketa_pending: ['anketa_filled', 'rejected'],
  anketa_filled: ['sb_check', 'rejected'],
  sb_check: ['ready_for_medical', 'rejected'],
  ready_for_medical: ['medical_passed', 'rejected'],
  medical_passed: ['contract_signed', 'rejected'],
  contract_signed: ['completed', 'rejected'],
  completed: [],
  rejected: [],
};

export const REWARD_STATUS_LABELS = {
  pending_payment: 'Ожидает выплаты',
  processing: 'Обрабатывается',
  paid: 'Выплачено',
  failed: 'Ошибка',
  cancelled: 'Отменено',
};

export const REWARD_STATUS_COLORS = {
  pending_payment: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  cancelled: 'bg-slate-100 text-slate-700',
};

export function formatKopecks(kopecks) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(kopecks / 100);
}
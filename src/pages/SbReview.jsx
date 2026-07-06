import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

export default function SbReview() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [candidate, setCandidate] = useState(null);
  const [anketa, setAnketa] = useState(null);
  const [hoursRemaining, setHoursRemaining] = useState(24);
  const [tokenUsed, setTokenUsed] = useState(false);
  const [result, setResult] = useState(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) { setError('Токен не найден в ссылке'); setLoading(false); return; }
    setToken(t);
    loadData(t);
  }, []);

  const loadData = async (t) => {
    try {
      const res = await base44.functions.invoke('getSbReview', { token: t });
      setCandidate(res.data?.candidate);
      setAnketa(res.data?.anketa);
      setHoursRemaining(res.data?.hoursRemaining || 24);
      setTokenUsed(res.data?.tokenUsed);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await base44.functions.invoke('submitSbReview', { token, decision: 'approved' });
      if (res.data?.success) {
        setResult('approved');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason) { setError('Укажите причину отклонения'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await base44.functions.invoke('submitSbReview', {
        token, decision: 'rejected', reason: rejectReason, comment: rejectComment,
      });
      if (res.data?.success) {
        setResult('rejected');
        setShowReject(false);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
          {result === 'approved' ? (
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          )}
          <h1 className="text-xl font-bold text-foreground mb-2">
            {result === 'approved' ? 'Кандидат одобрен' : 'Кандидат отклонён'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {result === 'approved'
              ? 'Кандидат переведён на этап медкомиссии.'
              : 'Решение об отклонении отправлено менеджеру.'}
          </p>
        </div>
      </div>
    );
  }

  if (error && !candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-foreground mb-2">Ошибка</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const a = anketa || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Проверка СБ</h1>
            <p className="text-sm text-muted-foreground">{candidate?.fullName}</p>
          </div>
          <div className="text-right">
            <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Осталось</p>
            <p className="font-bold text-sm">{hoursRemaining}ч</p>
          </div>
        </div>

        {tokenUsed && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            Эта ссылка уже была использована. Решение уже принято.
          </div>
        )}

        {/* Candidate Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Основная информация</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Info label="ФИО" value={a.fullName || candidate?.fullName} />
            <Info label="Телефон" value={candidate?.phone} />
            <Info label="Email" value={a.email || candidate?.email} />
            <Info label="Город" value={a.cityOfResidence || candidate?.city} />
            <Info label="Должность" value={a.desiredPosition || candidate?.desiredPosition} />
            <Info label="Дата рождения" value={a.birthDate} />
          </div>
        </div>

        {/* Passport */}
        {a.passportSeries && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Паспортные данные</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Серия" value={a.passportSeries} />
              <Info label="Номер" value={a.passportNumber} />
              <Info label="Кем выдан" value={a.passportIssuedBy} />
              <Info label="Дата выдачи" value={a.passportIssueDate} />
              <Info label="Код подразделения" value={a.passportDepartmentCode} />
              <Info label="Гражданство" value={a.citizenship} />
            </div>
          </div>
        )}

        {/* Documents */}
        {(a.passportPhotoUrl || a.snilsUrl) && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Документы</h2>
            <div className="grid grid-cols-2 gap-3">
              {a.passportPhotoUrl && <DocLink label="Паспорт (фото)" url={a.passportPhotoUrl} />}
              {a.passportRegistrationUrl && <DocLink label="Паспорт (прописка)" url={a.passportRegistrationUrl} />}
              {a.snilsUrl && <DocLink label="СНИЛС" url={a.snilsUrl} />}
              {a.photoUrl && <DocLink label="Фото 3x4" url={a.photoUrl} />}
              {a.diplomaUrl && <DocLink label="Диплом" url={a.diplomaUrl} />}
              {a.medicalReportUrl && <DocLink label="Медсправка" url={a.medicalReportUrl} />}
            </div>
          </div>
        )}

        {/* Health */}
        {a.chronicDiseases && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Здоровье</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Хронические заболевания" value={a.chronicDiseases} />
              <Info label="Судимости" value={a.hasConvictions} />
              <Info label="Группа крови" value={a.bloodType} />
              <Info label="Рост/Вес" value={`${a.height || '—'} см / ${a.weight || '—'} кг`} />
            </div>
          </div>
        )}

        {/* Skills */}
        {a.professionalSkills && a.professionalSkills.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Профессиональные навыки</h2>
            <div className="flex flex-wrap gap-2">
              {a.professionalSkills.map((s) => (
                <span key={s} className="px-2 py-1 bg-slate-100 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {!tokenUsed && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-destructive mb-3">{error}</div>}
            {showReject ? (
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Отклонение кандидата</h2>
                <div>
                  <label className="text-sm font-medium mb-1 block">Причина *</label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">— Выберите причину —</option>
                    <option value="Судимость">Судимость</option>
                    <option value="Недостоверные данные">Недостоверные данные</option>
                    <option value="Проблемы с документами">Проблемы с документами</option>
                    <option value="Медицинские противопоказания">Медицинские противопоказания</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Комментарий</label>
                  <textarea
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    placeholder="Дополнительные детали..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowReject(false)} disabled={submitting} className="flex-1">
                    Отмена
                  </Button>
                  <Button variant="destructive" onClick={handleReject} disabled={submitting} className="flex-1">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                    Подтвердить отклонение
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handleApprove} disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Одобрить
                </Button>
                <Button variant="destructive" onClick={() => setShowReject(true)} disabled={submitting} className="flex-1">
                  <XCircle className="w-4 h-4" /> Отклонить
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || '—'}</p>
    </div>
  );
}

function DocLink({ label, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm hover:bg-slate-100 transition-colors">
      <span className="text-accent">📄</span>
      <span className="truncate">{label}</span>
    </a>
  );
}
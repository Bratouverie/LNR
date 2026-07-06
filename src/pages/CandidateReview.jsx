import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/anketa/FileUpload';
import { Loader2, CheckCircle2, AlertCircle, Star, Send } from 'lucide-react';

export default function CandidateReview() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [tokenUsed, setTokenUsed] = useState(false);
  const [token, setToken] = useState('');

  const [form, setForm] = useState({
    name: '', position: '', city: '', stars: 5, text: '', monthsInProgram: 1,
  });
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) { setError('Токен не найден'); setLoading(false); return; }
    setToken(t);
    loadData(t);
  }, []);

  const loadData = async (t) => {
    try {
      const res = await base44.functions.invoke('getCandidateReview', { token: t });
      setCandidate(res.data?.candidate);
      setTokenUsed(res.data?.tokenUsed);
      if (res.data?.candidate) {
        setForm((f) => ({
          ...f,
          name: res.data.candidate.fullName || '',
          position: res.data.candidate.desiredPosition || '',
          city: res.data.candidate.city || '',
        }));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.position.trim() || !form.city.trim() || !form.text.trim() || !photo) {
      setError('Заполните все обязательные поля и загрузите фото');
      return;
    }
    if (form.text.trim().length < 10 || form.text.trim().length > 1000) {
      setError('Текст отзыва должен быть от 10 до 1000 символов');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await base44.functions.invoke('submitCandidateReview', {
        token, ...form, photo,
      });
      if (res.data?.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка отправки отзыва');
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Спасибо за отзыв!</h1>
          <p className="text-sm text-muted-foreground">Ваш отзыв отправлен на модерацию.</p>
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

  if (tokenUsed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md text-center bg-white rounded-2xl shadow-lg p-8">
          <CheckCircle2 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-lg font-bold text-foreground mb-2">Отзыв уже отправлен</h1>
          <p className="text-sm text-muted-foreground">Вы уже оставили отзыв. Спасибо!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 pb-12">
      <div className="max-w-2xl mx-auto px-4 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Оставить отзыв</h1>
          {candidate && <p className="text-sm text-muted-foreground mt-1">{candidate.fullName}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-destructive">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Ваше имя *</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Должность *</Label>
              <Input value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Город *</Label>
              <Input value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Месяцев в программе *</Label>
              <Input type="number" min={1} max={12} value={form.monthsInProgram} onChange={(e) => setForm((f) => ({ ...f, monthsInProgram: Number(e.target.value) }))} />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">Оценка *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, stars: n }))}
                  className="p-1"
                >
                  <Star className={`w-7 h-7 ${n <= form.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-1.5 block">Текст отзыва * (10–1000 символов)</Label>
            <Textarea
              value={form.text}
              onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
              rows={4}
              placeholder="Расскажите о вашем опыте работы..."
            />
          </div>

          <FileUpload label="Ваше фото *" required onChange={setPhoto} />

          <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-accent hover:bg-accent/90">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Отправить отзыв
          </Button>
        </div>
      </div>
    </div>
  );
}
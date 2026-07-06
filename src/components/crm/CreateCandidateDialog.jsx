import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { getToken } from '@/lib/crmAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, UserPlus, Copy, Check } from 'lucide-react';
import { POSITIONS } from '@/lib/anketaSkills';

export default function CreateCandidateDialog({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [copied, setCopied] = useState(false);
  const token = getToken();

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', city: '', desiredPosition: '',
  });

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone) {
      setError('ФИО и телефон обязательны');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await base44.functions.invoke('createCandidate', { token, ...form });
      if (res.data?.success) {
        setSuccess(res.data);
        if (onCreated) onCreated();
      } else {
        setError(res.data?.error || 'Ошибка создания');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания кандидата');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSuccess(null);
    setError('');
    setForm({ fullName: '', phone: '', email: '', city: '', desiredPosition: '' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(success.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} className="bg-accent hover:bg-accent/90">
        <UserPlus className="w-4 h-4" /> Создать кандидата
      </Button>

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Создание кандидата</DialogTitle>
          </DialogHeader>

          {success ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 text-green-600">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">Кандидат создан!</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1 text-sm">
                <p><span className="text-muted-foreground">ФИО:</span> {form.fullName}</p>
                <p><span className="text-muted-foreground">Статус:</span> anketa_pending</p>
              </div>
              <div>
                <Label className="text-sm font-medium mb-1.5 block">Ссылка на анкету (действительна 7 дней)</Label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="text"
                    readOnly
                    value={success.link}
                    className="flex-1 bg-transparent text-xs text-slate-600 outline-none truncate"
                  />
                  <Button size="icon" variant="ghost" onClick={handleCopy} className="h-7 w-7 shrink-0">
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
              {form.email && (
                <p className="text-xs text-muted-foreground">Ссылка отправлена на email кандидата.</p>
              )}
              <DialogFooter>
                <Button onClick={handleClose} className="w-full">Готово</Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-3 py-2">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-destructive">{error}</div>
                )}
                <div>
                  <Label className="text-sm font-medium">ФИО *</Label>
                  <Input value={form.fullName} onChange={update('fullName')} placeholder="Иванов Иван Иванович" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Телефон *</Label>
                  <Input value={form.phone} onChange={update('phone')} placeholder="+7 (999) 123-45-67" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <Input type="email" value={form.email} onChange={update('email')} placeholder="example@mail.ru" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Город</Label>
                  <Input value={form.city} onChange={update('city')} placeholder="Владивосток" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Желаемая должность</Label>
                  <select
                    value={form.desiredPosition}
                    onChange={update('desiredPosition')}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">— Выберите —</option>
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Отмена</Button>
                <Button onClick={handleSubmit} disabled={submitting} className="bg-accent hover:bg-accent/90">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Создать
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { getToken } from '@/lib/crmAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, RefreshCw, MapPin, Plus, Pencil } from 'lucide-react';

const EMPTY_FORM = { name: '', city: '', lat: '', lng: '', description: '', phone: '', workHours: '' };

export default function AssemblyPoints() {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const token = getToken();

  const fetchPoints = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('getAssemblyPoints', { token });
      setPoints(res.data?.assemblyPoints || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки точек сбора');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchPoints(); }, [fetchPoints]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (point) => {
    setForm({
      name: point.name || '',
      city: point.city || '',
      lat: point.lat?.toString() || '',
      lng: point.lng?.toString() || '',
      description: point.description || '',
      phone: point.phone || '',
      workHours: point.workHours || '',
    });
    setEditId(point.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await base44.functions.invoke('saveAssemblyPoint', {
        token,
        id: editId || undefined,
        name: form.name,
        city: form.city,
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
        description: form.description || undefined,
        phone: form.phone || undefined,
        workHours: form.workHours || undefined,
      });
      setShowForm(false);
      await fetchPoints();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Точки сбора
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Всего точек: {points.length}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchPoints} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Обновить
          </Button>
          <Button size="sm" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Добавить
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-destructive">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : points.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Нет точек сбора</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {points.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{p.name}</h3>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{p.city}</p>
              {p.description && <p className="text-xs text-muted-foreground">{p.description}</p>}
              <div className="flex flex-wrap gap-3 pt-1 text-xs text-muted-foreground">
                {p.phone && <span>{p.phone}</span>}
                {p.workHours && <span>{p.workHours}</span>}
              </div>
              <p className="text-xs font-mono text-slate-400 pt-1">{p.lat?.toFixed(4)}, {p.lng?.toFixed(4)}</p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editId ? 'Редактировать точку' : 'Новая точка сбора'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Город *</Label>
              <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="lat">Широта *</Label>
                <Input id="lat" type="number" step="any" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Долгота *</Label>
                <Input id="lng" type="number" step="any" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Описание / Адрес</Label>
              <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workHours">Часы работы</Label>
                <Input id="workHours" value={form.workHours} onChange={(e) => setForm({ ...form, workHours: e.target.value })} placeholder="пн–пт 9:00–18:00" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Отмена</Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Сохранить
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
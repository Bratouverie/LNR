import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { getToken } from '@/lib/crmAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, UserPlus, Users as UsersIcon, ShieldCheck, ShieldOff, Ban, CheckCircle } from 'lucide-react';

const ROLE_LABELS = {
  manager: 'Менеджер',
  security_officer: 'Служба безопасности',
  super_admin: 'Супер-админ',
};

const ROLE_COLORS = {
  manager: 'bg-blue-100 text-blue-700',
  security_officer: 'bg-purple-100 text-purple-700',
  super_admin: 'bg-emerald-100 text-emerald-700',
};

export default function Managers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const token = getToken();

  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', secretCode: '', role: 'manager',
  });

  const fetchManagers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await base44.functions.invoke('getManagers', { token });
      setManagers(res.data?.managers || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка загрузки менеджеров');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchManagers(); }, [fetchManagers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading('create');
    setError('');
    try {
      await base44.functions.invoke('createManager', { token, ...form });
      setShowCreate(false);
      setForm({ fullName: '', phone: '', email: '', secretCode: '', role: 'manager' });
      await fetchManagers();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка создания менеджера');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async (managerId, action) => {
    setActionLoading(`${managerId}-${action}`);
    setError('');
    try {
      await base44.functions.invoke('toggleManagerStatus', { token, managerId, action });
      await fetchManagers();
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка');
    } finally {
      setActionLoading(null);
    }
  };

  const activeCount = managers.filter((m) => m.isActive && !m.isBlocked).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <UsersIcon className="w-5 h-5" /> Менеджеры
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Всего: {managers.length} • Активных: {activeCount}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchManagers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Обновить
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <UserPlus className="w-4 h-4" /> Создать
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
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">ФИО</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Телефон</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Роль</th>
                  <th className="text-center p-3 font-medium text-muted-foreground">Статус</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Действия</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 font-medium">{m.fullName}</td>
                    <td className="p-3 text-muted-foreground">{m.phone}</td>
                    <td className="p-3">
                      <Badge className={`${ROLE_COLORS[m.role]} border-0`}>{ROLE_LABELS[m.role]}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      {m.isBlocked ? (
                        <span className="text-xs text-red-600 font-medium">Заблокирован</span>
                      ) : m.isActive ? (
                        <span className="text-xs text-emerald-600 font-medium">Активен</span>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Отключён</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        {m.isBlocked ? (
                          <Button
                            variant="outline" size="sm"
                            onClick={() => handleToggle(m.id, 'unblock')}
                            disabled={actionLoading === `${m.id}-unblock`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Разблокировать
                          </Button>
                        ) : (
                          <Button
                            variant="outline" size="sm"
                            onClick={() => handleToggle(m.id, 'block')}
                            disabled={actionLoading === `${m.id}-block`}
                            className="text-red-600 hover:text-red-700"
                          >
                            {actionLoading === `${m.id}-block` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                            Блок
                          </Button>
                        )}
                        {m.isActive ? (
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleToggle(m.id, 'deactivate')}
                            disabled={actionLoading === `${m.id}-deactivate`}
                          >
                            <ShieldOff className="w-3.5 h-3.5" /> Откл
                          </Button>
                        ) : (
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => handleToggle(m.id, 'activate')}
                            disabled={actionLoading === `${m.id}-activate`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Вкл
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать менеджера</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО *</Label>
              <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secretCode">Секретный код *</Label>
              <Input id="secretCode" value={form.secretCode} onChange={(e) => setForm({ ...form, secretCode: e.target.value })} required placeholder="например, crm2025new" />
              <p className="text-xs text-muted-foreground">Код будет захеширован (SHA-256) перед сохранением</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Роль *</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Менеджер</SelectItem>
                  <SelectItem value="security_officer">Служба безопасности</SelectItem>
                  <SelectItem value="super_admin">Супер-админ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Отмена</Button>
              <Button type="submit" disabled={actionLoading === 'create'}>
                {actionLoading === 'create' && <Loader2 className="w-4 h-4 animate-spin" />} Создать
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
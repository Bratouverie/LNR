import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated, getManager, logout, isAdmin, isSuperAdmin } from '@/lib/crmAuth';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, DollarSign, LogOut, Shield, Database, MapPin, MessageSquare, Newspaper } from 'lucide-react';

const navItems = [
  { to: '/crm/dashboard', label: 'Кандидаты', icon: LayoutDashboard, roles: ['manager', 'security_officer', 'super_admin'] },
  { to: '/crm/rewards', label: 'Выплаты', icon: DollarSign, roles: ['super_admin'] },
  { to: '/crm/managers', label: 'Менеджеры', icon: Users, roles: ['super_admin'] },
  { to: '/crm/assembly-points', label: 'Точки сбора', icon: MapPin, roles: ['super_admin'] },
  { to: '/crm/integration-queue', label: 'Очередь интеграций', icon: Database, roles: ['super_admin'] },
  { to: '/crm/admin/reviews', label: 'Отзывы', icon: MessageSquare, roles: ['super_admin'] },
  { to: '/crm/blog', label: 'Блог', icon: Newspaper, roles: ['super_admin'] },
];

export default function CrmLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated()) {
    navigate('/crm/login');
    return null;
  }

  const manager = getManager();
  if (!manager) {
    navigate('/crm/login');
    return null;
  }

  const visibleNav = navItems.filter((item) => item.roles.includes(manager.role));

  const handleLogout = () => {
    logout();
    navigate('/crm/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-primary text-primary-foreground transition-transform duration-200 flex flex-col`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="font-bold text-lg">CRM Система</span>
          </div>
        </div>
        <div className="p-4 border-b border-white/10">
          <p className="text-sm font-medium truncate">{manager.fullName}</p>
          <p className="text-xs text-white/60 mt-0.5">
            {manager.role === 'super_admin' ? 'Супер-админ' : manager.role === 'security_officer' ? 'Служба безопасности' : 'Менеджер'}
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/15 font-medium' : 'hover:bg-white/10'}`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="md:hidden sticky top-0 z-20 bg-primary text-primary-foreground p-3 flex items-center">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>
          <span className="ml-3 font-bold">CRM</span>
        </div>
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
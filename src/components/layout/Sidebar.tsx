import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Kanban,
  MessageSquare,
  Zap,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contatos', icon: Users, label: 'Contatos' },
  { to: '/empresas', icon: Building2, label: 'Empresas' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/inbox', icon: MessageSquare, label: 'Inbox' },
  { to: '/automacoes', icon: Zap, label: 'Automações' },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { member, organization, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleNavClick = () => {
    if (onNavigate) onNavigate();
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-gray-900 text-gray-300 transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-white text-sm truncate">
              {organization?.name || 'CRM'}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-gray-800 transition-colors hidden md:block"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={handleNavClick}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-2 space-y-1">
        <NavLink
          to="/configuracoes"
          onClick={handleNavClick}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            )
          }
          title={collapsed ? 'Configurações' : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Configurações</span>}
        </NavLink>

        <div className="flex items-center justify-between px-3 py-2">
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {member?.display_name || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 truncate">{member?.role}</p>
            </div>
          )}
          <button
            onClick={signOut}
            className="p-1.5 rounded-md text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

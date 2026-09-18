import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FolderKanban, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '../../app/store.js';
import { cn } from '../../utils/cn.js';

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();

  const links = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/examples', label: 'Examples', icon: FolderKanban },
    { to: '/users', label: 'Users', icon: Users },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                )
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </div>

      {user?.role === 'admin' && (
        <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded-xl flex items-center gap-2.5 text-xs text-blue-300">
          <ShieldAlert className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>Admin Access Active</span>
        </div>
      )}
    </aside>
  );
};

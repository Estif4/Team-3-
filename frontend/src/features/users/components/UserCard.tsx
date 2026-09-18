import React from 'react';
import { User } from '../../../types/index.js';
import { Shield, User as UserIcon } from 'lucide-react';

export interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          {user.role === 'admin' ? <Shield className="w-6 h-6" /> : <UserIcon className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                  : 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
              }`}
            >
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

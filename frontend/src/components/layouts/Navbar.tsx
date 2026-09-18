import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../app/store.js';
import { Button } from '../ui/Button.js';
import { LogOut, User as UserIcon, Layers, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white hover:opacity-90 transition">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <span>MERN Stack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-300">
            <Link to="/examples" className="hover:text-white transition">Examples</Link>
            <Link to="/users" className="hover:text-white transition">Users</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                {user?.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-blue-400" />
                ) : (
                  <UserIcon className="w-4 h-4 text-slate-400" />
                )}
                <span>{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-1.5" /> Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

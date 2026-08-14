import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
  <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
    {/* Mobile hamburger */}
    <button
      onClick={onMenuToggle}
      className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      aria-label="Toggle menu"
    >
      <Menu className="w-5 h-5" />
    </button>

    {/* Search */}
    <div className="flex-1 max-w-sm relative hidden sm:flex items-center">
      <Search className="absolute left-2.5 w-4 h-4 text-slate-400" />
      <input
        type="text"
        placeholder="Search audits, findings…"
        className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brass-500/40 focus:border-brass-500/60 focus:bg-white transition"
      />
    </div>

    <div className="flex-1" />

    {/* Notifications */}
    <button className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
      <Bell className="w-5 h-5" />
      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
    </button>

    {/* Avatar */}
    <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
      <div className="w-8 h-8 rounded-full bg-brass-500 flex items-center justify-center text-white">
        <User className="w-4 h-4" />
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'User'}</p>
        <p className="text-[10px] text-slate-400 leading-none mt-0.5">{user?.role || ''}</p>
      </div>
      <button onClick={()=>{logout();navigate('/login')}} className="text-xs text-slate-500 hover:text-red-600 px-2">Sign out</button>
    </div>
  </header>
  );
}

export default Header;

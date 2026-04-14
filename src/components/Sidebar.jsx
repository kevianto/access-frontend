import React from 'react';
import { Sparkles, Car, User, Briefcase, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ currentView, onViewChange, userProfile }) => {
  const navItems = [
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'transport', label: 'Transport', icon: Car },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen bg-slate-900 text-white fixed left-0 top-0 z-50 shadow-2xl">
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={24} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase">Access AI</h1>
        </div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accessibility First</p>
      </div>

      <nav className="flex-1 p-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={22} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'} />
              <span className="text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-3xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-700 font-black text-xl">
            {userProfile?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-white truncate">{userProfile?.name || 'User'}</p>
            <p className="text-xs font-medium text-slate-500 truncate uppercase tracking-tight">
              {userProfile?.disabilityType || 'Member'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

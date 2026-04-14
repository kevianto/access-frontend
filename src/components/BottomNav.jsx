import React from 'react';
import { Sparkles, Car, User, Briefcase } from 'lucide-react';

const BottomNav = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles },
    { id: 'transport', label: 'Transport', icon: Car },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center w-full min-h-[48px] gap-1 transition-all ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-indigo-50' : 'bg-transparent'}`}>
                <Icon size={22} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

import React from 'react';
import { ShieldCheck, Info, Radio, Activity } from 'lucide-react';

const StatusBar = ({ status, loading }) => {
  const getStatusConfig = () => {
    if (loading) return {
      color: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
      icon: <Radio className="animate-pulse" size={14} />,
      label: 'AI Agent is Processing Task...'
    };
    
    switch (status) {
      case 'idle':
        return {
          color: 'bg-slate-500/10 text-slate-400 border-slate-700/50',
          icon: <Activity size={14} />,
          label: 'System Status: Standby'
        };
      case 'completed':
        return {
          color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
          icon: <ShieldCheck size={14} />,
          label: 'Task Execution Successful'
        };
      case 'error':
        return {
          color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
          icon: <Info size={14} />,
          label: 'Error: Connection Interrupted'
        };
      default:
        return {
          color: 'bg-slate-500/10 text-slate-400 border-slate-700/50',
          icon: <Activity size={14} />,
          label: 'System Initialized'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-500 ${config.color}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBar;

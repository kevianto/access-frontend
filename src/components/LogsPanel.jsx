import React, { useRef, useEffect } from 'react';
import { Terminal, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const LogsPanel = ({ logs, loading }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0 && !loading) return null;

  return (
    <div className="human-card flex flex-col h-[300px] overflow-hidden bg-white border-slate-200">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-slate-400" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Activity Log</h4>
        </div>
        {loading && <Loader2 size={14} className="animate-spin text-blue-500" />}
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px] leading-relaxed"
      >
        {logs.map((log, i) => {
          const isError = log.toLowerCase().includes('error');
          const isSuccess = log.toLowerCase().includes('successfully') || log.toLowerCase().includes('completed');
          
          return (
            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-1 duration-300">
              <span className="text-slate-300 shrink-0 select-none">[{i + 1}]</span>
              <div className="flex gap-2">
                {isSuccess && <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />}
                {isError && <AlertCircle size={12} className="text-red-500 mt-0.5 shrink-0" />}
                <p className={`${isError ? 'text-red-600' : isSuccess ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}>
                  {log}
                </p>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-3 animate-pulse">
            <span className="text-slate-200">[...]</span>
            <p className="text-slate-400 italic">Processing next step...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogsPanel;

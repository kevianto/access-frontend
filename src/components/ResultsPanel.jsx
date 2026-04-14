import React from 'react';
import { Database, Zap, ArrowDown } from 'lucide-react';

const ResultsPanel = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden glow-blue border-t-4 border-t-blue-500 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-blue-500/5">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-blue-400" />
          <h3 className="text-sm font-black tracking-widest text-blue-400 uppercase">Intelligence Report</h3>
        </div>
        <div className="bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">Verified Content</span>
        </div>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 gap-8">
          {data.map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-500/10 p-1.5 rounded text-blue-400">
                  <Zap size={12} />
                </div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                  Extraction Source: {item.step || 'Primary Page'}
                </h4>
              </div>

              <div className="bg-slate-950/80 border border-white/5 p-6 rounded-xl relative">
                <div className="text-slate-200 font-medium leading-loose text-lg whitespace-pre-wrap italic">
                  {typeof item.content === 'object' && item.content?.type === 'form_fields' 
                    ? `Form Discovered: ${item.content.questions.join(', ')}`
                    : typeof item.content === 'string' 
                    ? item.content 
                    : JSON.stringify(item.content)
                  }
                </div>
                <div className="absolute top-2 right-4 opacity-10 font-black text-4xl italic tracking-tighter pointer-events-none">
                  #{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center">
          <div className="flex flex-col items-center gap-2 opacity-30">
            <span className="text-[10px] font-bold uppercase tracking-widest">EndOfReport</span>
            <ArrowDown size={14} className="animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;

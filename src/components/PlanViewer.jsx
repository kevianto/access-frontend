import React from 'react';
import { List, CheckCircle2, Circle } from 'lucide-react';

const PlanViewer = ({ plan }) => {
  if (!plan) return null;

  return (
    <div className="human-card overflow-hidden bg-white border-slate-200">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <List size={14} className="text-slate-400" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Proposed Strategy</h4>
      </div>
      
      <div className="p-5 space-y-4">
        <p className="text-sm font-bold text-slate-800 leading-tight">
          {plan.goal}
        </p>
        
        <div className="space-y-3">
          {plan.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <div className="mt-0.5 text-blue-500 group-last:text-blue-300">
                <Circle size={10} fill="currentColor" fillOpacity={0.2} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                  Step {i + 1}: {(step.action || 'Action').replace('_', ' ')}
                </p>
                {step.value && (
                  <p className="text-xs text-slate-600 mt-0.5 italic">
                    "{step.value}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanViewer;

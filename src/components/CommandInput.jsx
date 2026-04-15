import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

const CommandInput = ({ onCommand, loading }) => {
  const [command, setCommand] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!command.trim() || loading) return;
    onCommand(command);
    setCommand('');
  };

  return (
    <div className="w-full">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white border border-slate-200 rounded-2xl p-2 transition-all shadow-sm focus-within:shadow-md focus-within:border-blue-400 group"
      >
        <div className="flex-none p-3">
          <Sparkles size={20} className={loading ? 'animate-spin text-blue-500' : 'text-slate-300 group-focus-within:text-blue-400 transition-colors'} />
        </div>
        
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="What would you like me to do?"
          disabled={loading}
          className="flex-1 bg-transparent border-none text-lg text-slate-900 placeholder:text-slate-400 focus:ring-0 focus:outline-none py-3"
        />

        <button
          type="submit"
          disabled={loading || !command.trim()}
          className="p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-xl transition-all shadow-sm active:scale-95"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};

export default CommandInput;

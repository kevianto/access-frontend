import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Layout, Accessibility, Activity, Info, Send } from 'lucide-react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import OnboardingWizard from './components/OnboardingWizard';
import VoiceAssistant from './components/VoiceAssistant';
import TransportBooking from './components/TransportBooking';
import JobBoard from './components/JobBoard';
import ProfileSettings from './components/ProfileSettings';
import CommandInput from './components/CommandInput';
import LogsPanel from './components/LogsPanel';
import PlanViewer from './components/PlanViewer';
import ResultsPanel from './components/ResultsPanel';
import useSpeech from './hooks/useSpeech';

function App() {
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState('assistant');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('onboarding_complete') === 'true';
  });
  
  const [logs, setLogs] = useState([]);
  const [plan, setPlan] = useState(null);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('idle');
  const [userProfile, setUserProfile] = useState(null);
  const [formFields, setFormFields] = useState(null);
  const [formResponses, setFormResponses] = useState({});
  const [isAccessibilityMode, setIsAccessibilityMode] = useState(() => {
    return localStorage.getItem('access_mode') === 'true';
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const { speak } = useSpeech();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const [deviceId] = useState(() => {
    const savedId = localStorage.getItem('access_device_id');
    if (savedId) return savedId;
    const newId = `dev_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('access_device_id', newId);
    return newId;
  });

  useEffect(() => {
    localStorage.setItem('access_mode', isAccessibilityMode);
  }, [isAccessibilityMode]);

  useEffect(() => {
    if (hasCompletedOnboarding) {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`${API_URL}/user/profile/${deviceId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.user) setUserProfile(data.user);
          }
        } catch (error) {
          console.error("Profile fetch error:", error);
        }
      };
      fetchProfile();
    }
  }, [deviceId, API_URL, hasCompletedOnboarding]);

  const handleOnboardingComplete = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, deviceId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        setHasCompletedOnboarding(true);
        localStorage.setItem('onboarding_complete', 'true');
        speak(`Welcome to Access AI, ${formData.name}. I am ready to assist you.`);
      }
    } catch (error) {
      console.error("Onboarding submission failed:", error);
    }
  };

  const handleCommand = async (command) => {
    if (!command.trim()) return;
    setLoading(true);
    setStatus('processing');
    setLogs([]);
    setPlan(null);
    setData([]);
    setFormFields(null);
    setFormResponses({});
    
    speak(`Working on: ${command}`);

    try {
      const response = await fetch(`${API_URL}/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, deviceId }),
      });

      if (!response.ok) throw new Error('Failed to connect.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        accumulatedContent += decoder.decode(value, { stream: true });
        const messages = accumulatedContent.split('\n\n');
        accumulatedContent = messages.pop();
        for (const message of messages) {
          const cleanMessage = message.trim();
          if (!cleanMessage || cleanMessage.startsWith(':')) continue;
          if (cleanMessage.startsWith('data: ')) {
            try {
              const event = JSON.parse(cleanMessage.replace('data: ', ''));
              handleStreamEvent(event);
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      setStatus('error');
      setLogs(prev => [...prev, `System Message: ${error.message}`]);
      speak("I encountered a problem. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStreamEvent = (event) => {
    switch (event.type) {
      case 'plan':
        setPlan(event.plan);
        speak(`I have a plan: ${event.plan.goal}`);
        break;
      case 'log':
        setLogs(prev => [...prev, event.message]);
        if (event.message.includes('Navigating') || event.message.includes('Found')) {
          speak(event.message);
        }
        break;
      case 'confirmation_required':
        setConfirmationMessage(event.message);
        setShowConfirmation(true);
        speak(event.message);
        break;
      case 'data':
        setData(prev => [...prev, event.data]);
        if (event.data.content?.type === 'form_fields') {
          setFormFields(event.data.content.questions);
          speak("I've discovered a form. Please provide the details in the UI.");
        } else {
          const contentSummary = typeof event.data.content === 'string' ? event.data.content.substring(0, 300) : "Information found";
          speak(`Information found: ${contentSummary}`);
        }
        break;
      case 'final':
        setStatus('completed');
        speak(event.status === 'success' ? "Task successfully completed." : "Finished with some issues.");
        break;
      case 'error':
        setStatus('error');
        setLogs(prev => [...prev, `Error: ${event.message}`]);
        speak(`Sorry, there was an error: ${event.message}`);
        break;
    }
  };

  const handleConfirm = async (confirmed) => {
    try {
      await fetch(`${API_URL}/command/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmed }),
      });
      setShowConfirmation(false);
      speak(confirmed ? "Proceeding." : "Cancelled.");
    } catch (e) {
      console.error("Confirmation error:", e);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const commandText = `Fill the form with these details: \${JSON.stringify(formResponses)} and submit it.`;
    setFormFields(null);
    handleCommand(commandText);
  };

  // If onboarding is not complete, show the wizard
  if (!hasCompletedOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isAccessibilityMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sidebar - Fixed on Desktop */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        userProfile={userProfile} 
      />

      {/* Main Layout Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen pb-24 lg:pb-0">
        
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              status === 'processing' ? 'bg-amber-100 text-amber-600 animate-pulse' :
              status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
              'bg-slate-100 text-slate-500'
            }`}>
              {status === 'idle' ? 'Ready' : status}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAccessibilityMode(!isAccessibilityMode)}
              className={`p-3 rounded-2xl border-2 transition-all ${
                isAccessibilityMode 
                  ? 'bg-indigo-600 border-indigo-400 text-white' 
                  : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
              }`}
              title="Toggle High Contrast Mode"
            >
              <Accessibility size={20} />
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-12 max-w-6xl mx-auto w-full">
          
          {/* View Switcher */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {currentView === 'assistant' && (
              <div className="space-y-12">
                <header className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    Hello, {userProfile?.name?.split(' ')[0] || 'there'}.<br/>
                    <span className="text-indigo-600">How can I help you today?</span>
                  </h2>
                </header>

                <div className="flex flex-col items-center gap-12">
                  <VoiceAssistant 
                    deviceId={deviceId} 
                    onStatusChange={setStatus} 
                    onLogsUpdate={setLogs} 
                    onPlanUpdate={setPlan}
                    onResultsUpdate={setData}
                  />
                  
                  <div className="w-full max-w-2xl relative group">
                    <div className="absolute -inset-4 bg-indigo-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                    <CommandInput onCommand={handleCommand} loading={loading} />
                  </div>
                </div>

                {/* Automation Progress/Results Grid */}
                {(plan || logs.length > 0 || data.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 border-t-2 border-slate-100">
                    <div className="lg:col-span-4 space-y-8">
                      <PlanViewer plan={plan} />
                    </div>
                    <div className="lg:col-span-8 space-y-8">
                      {data.length > 0 && <ResultsPanel data={data} />}
                      <LogsPanel logs={logs} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentView === 'transport' && (
              <TransportBooking deviceId={deviceId} userProfile={userProfile} />
            )}

            {currentView === 'jobs' && (
              <JobBoard deviceId={deviceId} userProfile={userProfile} />
            )}

            {currentView === 'profile' && (
              <ProfileSettings deviceId={deviceId} onProfileUpdate={setUserProfile} />
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[3.5rem] p-10 sm:p-16 max-w-xl w-full shadow-[0_0_100px_rgba(0,0,0,0.2)] border-4 border-white text-center space-y-12 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] mx-auto flex items-center justify-center text-amber-500">
              <Activity size={48} strokeWidth={3} className="animate-pulse" />
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">Confirmation Needed</h3>
              <p className="text-xl font-bold text-slate-500 leading-relaxed">{confirmationMessage}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <button 
                onClick={() => handleConfirm(true)} 
                className="flex-1 py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-indigo-200 active:scale-95 transition-all"
              >
                Yes, Proceed
              </button>
              <button 
                onClick={() => handleConfirm(false)} 
                className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-[1.5rem] font-black text-xl uppercase tracking-widest border-2 border-slate-100 active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Form Modal */}
      {formFields && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[3.5rem] p-10 sm:p-16 max-w-2xl w-full shadow-2xl border-4 border-white overflow-y-auto max-h-[90vh] space-y-10 animate-in zoom-in-95 duration-500">
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Form Discovered</h3>
              <p className="text-lg font-bold text-slate-500">I've identified the following fields. Please provide the answers you'd like me to submit.</p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-8">
              <div className="space-y-6">
                {formFields.map((field, idx) => (
                  <div key={idx} className="space-y-2">
                    <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">{field}</label>
                    <input
                      type="text"
                      onChange={(e) => setFormResponses({ ...formResponses, [field]: e.target.value })}
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder={`Enter \${field}...`}
                      required
                    />
                  </div>
                ))}
              </div>
              
              <button 
                type="submit"
                className="w-full py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Confirm & Submit Form
                <Send size={24} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}

export default App;

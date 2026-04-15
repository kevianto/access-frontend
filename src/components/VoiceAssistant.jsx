import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2, Sparkles, Volume2, AudioWaveform } from 'lucide-react';
import io from 'socket.io-client';
import useSpeech from '../hooks/useSpeech';

const API_URL = import.meta.env.VITE_API_URL || 'https://3sxl7nrx-3000.inc1.devtunnels.ms';

const VoiceAssistant = ({ deviceId, onStatusChange, onLogsUpdate, onPlanUpdate, onResultsUpdate }) => {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('idle');
  const [interimText, setInterimText] = useState('');
  const [transcript, setTranscript] = useState('');
  const { speak } = useSpeech();
  
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    socketRef.current = io(API_URL);

    socketRef.current.on('voice:interim', (data) => {
      setStatus(data.status || 'Thinking...');
      if (onStatusChange) onStatusChange(data.status);
      if (data.text) setTranscript(data.text);
      if (data.message && onLogsUpdate) {
        onLogsUpdate(prev => [...prev, data.message]);
      }
      if (data.reply) {
        setInterimText(data.reply);
        speak(data.reply);
      }
    });

    socketRef.current.on('voice:plan', (data) => {
      if (onPlanUpdate && data.plan) {
        const viewerPlan = {
          goal: data.plan.userReply,
          steps: data.plan.playwrightSteps.map(s => ({ 
             action: 'Automation',
             value: s 
          }))
        };
        onPlanUpdate(viewerPlan);
      }
    });

    socketRef.current.on('voice:response', (data) => {
      setStatus('idle');
      if (onStatusChange) onStatusChange('idle');
      if (data.reply) {
        setInterimText(data.reply);
        speak(data.reply);
      }
      if (data.data && onResultsUpdate) {
        onResultsUpdate(data.data);
      }
      if (!data.success && data.error) {
        console.error('Voice Error:', data.error);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [speak, onStatusChange, onLogsUpdate, onPlanUpdate, onResultsUpdate]);

  const startRecording = async () => {
    window.speechSynthesis.cancel();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result.split(',')[1];
          socketRef.current.emit('voice:input', { audioBase64: base64Audio, deviceId });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
      setStatus('Listening...');
      setInterimText('');
      setTranscript('');
    } catch (err) {
      console.error('Mic Error:', err);
      speak("Microphone access denied. Please check settings.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setStatus('Processing...');
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-lg mx-auto">
      {/* Waveform Visualization (Mock) */}
      <div className="h-16 flex items-end justify-center gap-1 px-10 w-full">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className={`w-1.5 bg-indigo-500 rounded-full transition-all duration-300 ${
              isListening ? 'animate-pulse' : 'h-2 opacity-20'
            }`}
            style={{ 
              height: isListening ? `${Math.random() * 100 + 20}%` : '8px',
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Main Mic Button */}
      <div className="relative group">
        <div className={`absolute -inset-8 bg-indigo-500/20 rounded-full blur-3xl transition-opacity duration-1000 ${isListening ? 'opacity-100' : 'opacity-0'}`} />
        
        <button
          onPointerDown={(e) => { e.preventDefault(); startRecording(); }}
          onPointerUp={(e) => { e.preventDefault(); stopRecording(); }}
          onPointerLeave={stopRecording}
          className={`relative flex items-center justify-center w-40 h-40 rounded-[3rem] transition-all duration-500 select-none touch-none shadow-2xl active:scale-90 ${
            isListening 
              ? 'bg-rose-600 rotate-90 scale-110 shadow-rose-500/40' 
              : status !== 'idle'
              ? 'bg-indigo-500 cursor-wait animate-pulse'
              : 'bg-indigo-700 hover:bg-indigo-800 shadow-indigo-500/20'
          }`}
          aria-label="Hold to Talk"
        >
          {status !== 'idle' && !isListening ? (
            <Loader2 className="text-white animate-spin" size={48} />
          ) : (
            <Mic className={`text-white transition-transform duration-500 ${isListening ? '-rotate-90 scale-125' : ''}`} size={48} />
          )}
          
          {/* Status Label Overlay */}
          <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-500 ${isListening ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <span className="px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest">
              Recording...
            </span>
          </div>
        </button>
      </div>

      {/* Spoken Feedback & Transcripts */}
      <div className="w-full text-center min-h-[100px] flex flex-col items-center justify-center gap-4">
        {transcript && (
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-in fade-in zoom-in-95">
            "{transcript}"
          </p>
        )}
        
        {interimText && (
          <div className="bg-indigo-50/50 backdrop-blur-sm px-8 py-6 rounded-[2.5rem] border-2 border-indigo-100/50 text-indigo-900 animate-in slide-in-from-bottom-2">
            <p className="text-lg font-bold leading-tight">{interimText}</p>
          </div>
        )}

        {!transcript && !interimText && (
          <p className="text-lg font-medium text-slate-400 max-w-[280px] leading-relaxed">
            {isListening ? "Listening to your request..." : "Hold the button to speak."}
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;

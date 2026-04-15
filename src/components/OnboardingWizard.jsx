import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, Accessibility, User, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    disabilityType: 'mobility',
    location: '',
    skills: ''
  });

  const steps = [
    {
      title: "Welcome to Access AI",
      description: "Let's personalize your assistant. What should we call you?",
      icon: <Sparkles className="text-indigo-600" size={40} />,
      content: (
        <div className="space-y-4">
          <label htmlFor="name" className="block text-sm font-black uppercase tracking-widest text-slate-400">Your Full Name</label>
          <input
            autoFocus
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-6 bg-slate-50 border-4 border-slate-100 rounded-3xl text-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none transition-all"
            placeholder="e.g. Jane Doe"
          />
        </div>
      )
    },
    {
      title: "How can we reach you?",
      description: "This helps with booking services and saving your progress.",
      icon: <Mail className="text-blue-600" size={40} />,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-black uppercase tracking-widest text-slate-400">Email Address</label>
            <input
              autoFocus
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-6 bg-slate-50 border-4 border-slate-100 rounded-3xl text-xl font-bold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="jane@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-black uppercase tracking-widest text-slate-400">Phone Number</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-6 bg-slate-50 border-4 border-slate-100 rounded-3xl text-xl font-bold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="+254..."
            />
          </div>
        </div>
      )
    },
    {
      title: "Tell us about your needs",
      description: "We'll tailor the interface and notifications to suit you.",
      icon: <Accessibility className="text-rose-600" size={40} />,
      content: (
        <div className="grid grid-cols-1 gap-4">
          <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Disability Type</label>
          {[
            { id: 'mobility', label: 'Mobility Impairment', desc: 'Focus on easy navigation and transport' },
            { id: 'visual', label: 'Visual Impairment', desc: 'High contrast and optimized for screen readers' },
            { id: 'hearing', label: 'Hearing Impairment', desc: 'Visual notifications and transcripts' },
            { id: 'cognitive', label: 'Cognitive / Learning', desc: 'Simplified interface and clear instructions' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setFormData({ ...formData, disabilityType: type.id })}
              className={`flex items-start gap-4 p-6 rounded-3xl border-4 transition-all text-left ${
                formData.disabilityType === type.id 
                  ? 'border-indigo-600 bg-indigo-50' 
                  : 'border-slate-100 bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className={`mt-1 w-6 h-6 rounded-full border-4 flex items-center justify-center ${
                formData.disabilityType === type.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
              }`}>
                {formData.disabilityType === type.id && <Check size={14} className="text-white" />}
              </div>
              <div>
                <p className="font-black text-slate-900 uppercase tracking-tight">{type.label}</p>
                <p className="text-sm font-bold text-slate-500">{type.desc}</p>
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "Where are you located?",
      description: "This helps us find local jobs and transport services.",
      icon: <MapPin className="text-emerald-600" size={40} />,
      content: (
        <div className="space-y-4">
          <label htmlFor="location" className="block text-sm font-black uppercase tracking-widest text-slate-400">City or Region</label>
          <input
            autoFocus
            id="location"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-6 bg-slate-50 border-4 border-slate-100 rounded-3xl text-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none transition-all"
            placeholder="e.g. Nairobi, Kenya"
          />
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentStepData = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col min-h-[600px] border-4 border-white">
        {/* Progress Bar */}
        <div className="h-3 bg-slate-100 w-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-10 sm:p-16 flex-1 flex flex-col">
          <div className="mb-12 flex items-center justify-between">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
              {currentStepData.icon}
            </div>
            <span className="text-sm font-black text-slate-300 uppercase tracking-[0.3em]">
              Step {step + 1} of {steps.length}
            </span>
          </div>

          <div className="space-y-4 mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
              {currentStepData.title}
            </h2>
            <p className="text-xl font-bold text-slate-500 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          <div className="flex-1">
            {currentStepData.content}
          </div>

          <div className="mt-12 pt-12 border-t-4 border-slate-50 flex gap-6">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-6 px-8 rounded-3xl font-black text-xl text-slate-400 border-4 border-slate-100 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <ChevronLeft size={24} />
                <span>Back</span>
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={step === 0 && !formData.name}
              className={`flex-[2] py-6 px-10 rounded-3xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 ${
                step === 0 && !formData.name
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700'
              }`}
            >
              <span>{step === steps.length - 1 ? "Let's Get Started" : "Continue"}</span>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;

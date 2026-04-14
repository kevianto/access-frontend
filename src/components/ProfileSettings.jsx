import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Accessibility, Save, CheckCircle, Heart } from 'lucide-react';

const ProfileSettings = ({ deviceId, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    disabilityType: 'mobility',
    location: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/user/profile/${deviceId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.user) setProfile({ ...profile, ...data.user });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    if (deviceId) fetchProfile();
  }, [deviceId, API_URL]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profile, deviceId }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        onProfileUpdate(data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Profile save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest">
          <Heart size={14} fill="currentColor" /> Profile & Preferences
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Identity</h2>
        <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-2xl">
          Keep your information updated to ensure the assistant and transport services serve you best.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details Card */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-8">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <User size={16} /> Personal Details
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18}/></div>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-12 pr-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={18}/></div>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-12 pr-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Card */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 space-y-8">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <Accessibility size={16} /> Accessibility
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={18}/></div>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full pl-12 pr-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Disability Type</label>
              <select
                value={profile.disabilityType}
                onChange={(e) => setProfile({ ...profile, disabilityType: e.target.value })}
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all appearance-none"
              >
                <option value="mobility">Mobility Impairment</option>
                <option value="visual">Visual Impairment</option>
                <option value="hearing">Hearing Impairment</option>
                <option value="cognitive">Cognitive / Learning</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Skills (for job matching)</label>
              <textarea
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                rows="2"
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 focus:border-indigo-500 focus:outline-none transition-all resize-none"
                placeholder="e.g. Graphic design, writing, data entry..."
              />
            </div>
          </div>
        </section>
      </div>

      {/* Save Button Bar */}
      <footer className="sticky bottom-24 lg:bottom-8 bg-slate-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
            {saved ? <CheckCircle className="text-emerald-400" /> : <Save className="text-slate-400" />}
          </div>
          <div>
            <p className="font-bold">{saved ? 'Profile updated!' : 'Unsaved changes'}</p>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">Changes are saved to your account</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
            loading 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95'
          }`}
        >
          {loading ? 'Saving...' : 'Update My Profile'}
        </button>
      </footer>
    </div>
  );
};

export default ProfileSettings;

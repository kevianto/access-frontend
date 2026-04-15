import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, CheckCircle2, ChevronRight, Filter, Info, Send } from 'lucide-react';

const DUMMY_JOBS = [
  {
    _id: 'dummy-1',
    title: 'Accessibility Quality Auditor',
    company: 'Inclusive Tech Lab',
    category: 'Engineering',
    location: 'Remote',
    salaryRange: '$3,500 - $5,500',
    description: 'Use your lived experience with assistive technology to test and improve web applications. We prioritize candidates who use screen readers or alternative input devices daily.',
    requirements: ['Proficiency in NVDA, JAWS, or VoiceOver', 'Understanding of WCAG 2.1', 'Strong descriptive writing skills'],
    accessibilityFeatures: ['Assistive Tech Stipend', 'Screen Reader Optimized Workflow', '100% Remote', 'Flexible Deadlines'],
    featured: true
  },
  {
    _id: 'dummy-2',
    title: 'Remote Transcription Specialist',
    company: 'EchoStream Media',
    category: 'Content',
    location: 'Fully Remote',
    salaryRange: '$2,000 - $3,500',
    description: 'Convert audio content into high-quality text. This role is perfect for detail-oriented individuals who prefer a quiet, controlled environment and asynchronous communication.',
    requirements: ['Excellent typing speed', 'Strong grammar skills', 'Ability to follow formatting guidelines'],
    accessibilityFeatures: ['Cognitive-friendly Pacing', 'No Audio/Video Calls Required', 'Text-based Management', 'Async Work'],
    featured: false
  },
  {
    _id: 'dummy-3',
    title: 'Virtual Customer Advocate',
    company: 'Supportive.io',
    category: 'Operations',
    location: 'Home Based',
    salaryRange: '$2,200 - $3,800',
    description: 'Provide empathetic support to our users via chat and email. We provide specialized ergonomics equipment and software to ensure a comfortable working environment.',
    requirements: ['Empathetic communicator', 'Problem-solving skills', 'Experience with CRM tools is a plus'],
    accessibilityFeatures: ['Full Ergonomics Kit', 'Voice-to-Text Software Provided', 'Mental Health Support', 'Customizable Schedule'],
    featured: true
  },
  {
    _id: 'dummy-4',
    title: 'Data Entry & Pattern Analyst',
    company: 'Insight Systems',
    category: 'Data',
    location: 'Hybrid / Nairobi',
    salaryRange: '$1,500 - $2,800',
    description: 'Analyze data patterns for our research team. Our office is fully wheelchair accessible with adjustable height desks and sensory-friendly zones.',
    requirements: ['High attention to detail', 'Basic MS Office knowledge', 'Reliable and consistent performance'],
    accessibilityFeatures: ['Step-free Office Access', 'Adjustable Height Desks', 'Sensory-friendly Zones', 'Transport Allowance'],
    featured: false
  },
  {
    _id: 'dummy-5',
    title: 'Digital Marketing Strategist',
    company: 'Visionary Agency',
    category: 'Marketing',
    location: 'Remote / Global',
    salaryRange: '$3,000 - $5,000',
    description: 'Help brands reach diverse audiences. We value neurodivergent perspectives in our creative process and offer a highly flexible, outcome-based work culture.',
    requirements: ['Marketing experience', 'Social media proficiency', 'Creative thinking'],
    accessibilityFeatures: ['Neuro-inclusive Culture', 'Outcome-based Evaluation', 'No Fixed Hours', 'Learning Allowance'],
    featured: false
  }
];

const JobBoard = ({ deviceId, userProfile }) => {
  const [jobs] = useState(DUMMY_JOBS);
  const [selectedJob, setSelectedJob] = useState(DUMMY_JOBS[0]);
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const handleApply = (jobId) => {
    setApplying(true);
    // Simulate API call for purely dummy experience
    setTimeout(() => {
      setAppliedJobs([...appliedJobs, jobId]);
      setApplying(false);
      alert('This is a demo application. Your profile has been shared with the employer in this simulation.');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest">
          <Briefcase size={14} fill="currentColor" /> Inclusive Career Center
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Jobs for You</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time opportunities</span>
        </div>
        <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-2xl">
          Discover opportunities at companies that prioritize accessibility and provide the tools you need to succeed.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Job List */}
        <section className="lg:col-span-7 space-y-6">
          {jobs.map((job) => (
            <div 
              key={job._id}
              onClick={() => setSelectedJob(job)}
              className={`group cursor-pointer bg-white p-8 rounded-[2.5rem] border-4 transition-all duration-300 ${
                selectedJob?._id === job._id 
                  ? 'border-indigo-600 shadow-2xl shadow-indigo-100 scale-[1.02]' 
                  : 'border-white shadow-xl shadow-slate-200/50 hover:border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <p className="text-lg font-bold text-slate-500">{job.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  {job.featured && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-md text-[9px] font-black uppercase tracking-tighter">
                      Featured
                    </span>
                  )}
                  <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {job.category}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                  <MapPin size={16} />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-lg">
                  {job.salaryRange}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Top Accessibility Features</p>
                <div className="flex flex-wrap gap-2">
                  {job.accessibilityFeatures.slice(0, 3).map((feat, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Job Details Detail View */}
        <section className="lg:col-span-5 sticky top-32">
          {selectedJob ? (
            <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl space-y-8 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                <h3 className="text-3xl font-black leading-tight">{selectedJob.title}</h3>
                <p className="text-indigo-400 font-bold text-lg">{selectedJob.company}</p>
              </div>

              <div className="space-y-4 text-slate-300">
                <p className="font-medium leading-relaxed">{selectedJob.description}</p>
                
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Requirements</p>
                  <ul className="space-y-1">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-bold">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-800 rounded-3xl p-6 space-y-4 border border-slate-700">
                <div className="flex items-center gap-2 text-amber-400">
                  <Info size={18} />
                  <span className="text-xs font-black uppercase tracking-widest">Application Info</span>
                </div>
                <p className="text-sm font-medium text-slate-400">
                  Applying as <span className="text-white font-bold">{userProfile?.name || 'Guest'}</span>. 
                  Your accessibility profile will be shared with the employer.
                </p>
              </div>

              <button
                onClick={() => handleApply(selectedJob._id)}
                disabled={applying || appliedJobs.includes(selectedJob._id)}
                className={`w-full py-6 rounded-2xl font-black text-xl uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                  appliedJobs.includes(selectedJob._id)
                    ? 'bg-emerald-500 text-white cursor-default'
                    : applying
                    ? 'bg-slate-700 text-slate-500 cursor-wait'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-900/50 active:scale-95'
                }`}
              >
                {appliedJobs.includes(selectedJob._id) ? (
                  <>
                    <CheckCircle2 size={24} />
                    Applied
                  </>
                ) : applying ? (
                  'Submitting...'
                ) : (
                  <>
                    Apply Now
                    <Send size={24} />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="h-full bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-4">
              <Briefcase size={64} className="text-slate-200" />
              <p className="text-xl font-black text-slate-300 uppercase tracking-widest">Select a job to<br/>view details</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default JobBoard;

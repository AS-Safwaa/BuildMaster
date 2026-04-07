import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WizardProvider, useWizard } from '../context/WizardContext';
import { Phase1 } from '../components/wizard/Phase1';
import { Phase2 } from '../components/wizard/Phase2';
import { Phase3 } from '../components/wizard/Phase3';
import { Phase4 } from '../components/wizard/Phase4';
import { Phase5 } from '../components/wizard/Phase5';
import { Phase6 } from '../components/wizard/Phase6';
import { Phase7 } from '../components/wizard/Phase7';
import { Phase8 } from '../components/wizard/Phase8';
import { Phase9 } from '../components/wizard/Phase9';
import { Check, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WizardContent = () => {
  const { currentPhase, data, phases } = useWizard();
  const navigate = useNavigate();
  
  const currentIndex = phases.findIndex(p => p.id === currentPhase);
  const progress = ((currentIndex + 1) / phases.length) * 100;

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Fixed Top Navbar */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-black text-xl leading-none mt-[-2px]">✧</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">PROJECTHUB</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Creative Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            Back to home
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-xs font-bold font-sans">Need help?</span>
          </div>
        </div>
      </header>

      {/* Fixed Horizontal Status Bar */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-3 shrink-0 z-40 shadow-sm overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4 md:gap-6">
          <p className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Progress</p>
          <div className="flex-1 h-1.5 md:h-2.5 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[10px] md:text-xs font-black text-blue-600 tabular-nums">{Math.round(progress)}%</p>
            <div className="h-3 w-px bg-slate-200 hidden md:block" />
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden md:block">
              {progress < 30 ? "Let's Get Started!" : progress < 60 ? "Doing Great!" : "Almost There!"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Stepper - Scrollable independently */}
        <aside className="w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex shrink-0">
          <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Current Phase</p>
            <div className="space-y-4 pb-10">
              {phases.map((phase, idx) => {
                const isActive = currentPhase === phase.id;
                const isPast = phases.findIndex(p => p.id === currentPhase) > idx;
                
                return (
                  <div 
                    key={phase.id} 
                    className={`flex gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                      isActive ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800 shadow-xl' : 
                      'border-transparent'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500 ${
                        isPast ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20' : 
                        isActive ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 
                        'bg-slate-50 border-slate-200 text-slate-400 border'
                      }`}>
                        {isPast ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-none mb-1.5 ${isActive ? 'text-white' : 'text-slate-700'}`}>{phase.title}</p>
                      <p className={`text-[10px] uppercase font-bold tracking-wider ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>{phase.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Guest Client</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pipeline Start</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Form Content Area - Fixed Layout */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
          <div className="max-w-4xl mx-auto py-12 px-6 md:px-12 lg:px-20 pb-40">
             <AnimatePresence mode="wait">
              {currentPhase === 1 && <Phase1 key="phase1" />}
              {currentPhase === 2 && <Phase2 key="phase2" />}
              {currentPhase === 3 && <Phase3 key="phase3" />}
              {currentPhase === 4 && <Phase4 key="phase4" />}
              {currentPhase === 5 && <Phase5 key="phase5" />}
              {currentPhase === 6 && <Phase6 key="phase6" />}
              {currentPhase === 7 && <Phase7 key="phase7" />}
              {currentPhase === 8 && <Phase8 key="phase8" />}
              {currentPhase === 9 && <Phase9 key="phase9" />}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export const GuestWizard = () => {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
};

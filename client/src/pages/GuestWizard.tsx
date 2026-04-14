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
import { useNavigate } from 'react-router-dom';

const WizardContent = () => {
  const { currentPhase, phases } = useWizard();
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
      </header>      {/* Zen Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "circOut" }}
        />
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Dynamic Encouragement Header */}
        <div className="pt-12 pb-6 px-8 text-center shrink-0">
          <motion.div 
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-100 rounded-full shadow-xl shadow-indigo-500/5 mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
              {progress < 20 ? "Welcome! Let's build something" : 
               progress < 40 ? "Great start, keep it rolling!" : 
               progress < 60 ? "Over halfway! You're amazing" : 
               progress < 80 ? "Almost at the finish line!" : 
               "One final verification!"}
            </p>
          </motion.div>
        </div>

        {/* Centered Focus Area */}
        <main className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="max-w-3xl mx-auto py-8 px-6 pb-40">
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

        {/* Floating Minimal Navigation (Optional but let's keep it simple) */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md p-2 rounded-[2rem] border border-white/20 shadow-2xl ring-1 ring-black/5">
             <div className="px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest tabular-nums">
                Step {currentIndex + 1} <span className="mx-2 text-slate-200">/</span> {phases.length}
             </div>
        </div>
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

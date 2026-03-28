import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WizardProvider, useWizard } from '../context/WizardContext';
import { Phase1 } from '../components/wizard/Phase1';
import { Phase2 } from '../components/wizard/Phase2';
import { Phase3 } from '../components/wizard/Phase3';
import { Phase4 } from '../components/wizard/Phase4';
import { Phase5 } from '../components/wizard/Phase5';
import { Check, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, title: 'Intent', desc: 'Business basics' },
  { id: 2, title: 'Context', desc: 'Services & USPs' },
  { id: 3, title: 'Voice', desc: 'Tagline & Tone' },
  { id: 4, title: 'Aesthetic', desc: 'Style preferences' },
  { id: 5, title: 'Review', desc: 'Confirm details' }
];

const WizardContent = () => {
  const { currentPhase } = useWizard();
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      <button 
        onClick={() => navigate('/')}
        className="md:hidden absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-md"
      >
        <ArrowLeft className="w-5 h-5 text-slate-600" />
      </button>

      {/* Sidebar Stepper */}
      <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-8 pb-4">
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-blue-600">✧</span> ProjectHub
          </h1>
        </div>

        <div className="px-8 mt-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Progress</p>
          <div className="space-y-6">
            {steps.map((step) => {
              const isActive = currentPhase === step.id;
              const isPast = currentPhase > step.id;
              
              return (
                <div key={step.id} className="flex gap-4 group relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      isPast ? 'bg-blue-600 text-white' : 
                      isActive ? 'border-2 border-blue-600 text-blue-600 bg-blue-50' : 
                      'border-2 border-slate-200 text-slate-400'
                    }`}>
                      {isPast ? <Check className="w-4 h-4" /> : step.id}
                    </div>
                    {step.id !== 5 && (
                      <div className={`w-0.5 h-full min-h-[2rem] my-1 rounded-full ${isPast ? 'bg-blue-600' : 'bg-slate-200'}`} />
                    )}
                  </div>
                  <div className="pb-4 pt-1">
                    <p className={`font-bold ${isActive || isPast ? 'text-slate-800' : 'text-slate-400'}`}>{step.title}</p>
                    <p className={`text-xs ${isActive ? 'text-blue-600 font-medium' : 'text-slate-400'}`}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto p-8">
          <div className="flex items-center gap-3 p-4 bg-slate-100 rounded-xl">
            <User className="w-8 h-8 text-slate-400" />
            <div>
              <p className="text-sm font-bold text-slate-700">Guest Client</p>
              <p className="text-xs text-slate-500">Unauthenticated Flow</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Progress Bar */}
      <div className="md:hidden w-full h-2 bg-slate-200 sticky top-0 z-40">
        <motion.div 
          className="h-full bg-blue-600" 
          initial={{ width: 0 }}
          animate={{ width: `${(currentPhase / 5) * 100}%` }}
        />
      </div>

      {/* Form Content Area */}
      <main className="flex-1 overflow-y-auto relative p-6 md:p-12 lg:p-20 h-full">
        <AnimatePresence mode="wait">
          {currentPhase === 1 && <Phase1 key="phase1" />}
          {currentPhase === 2 && <Phase2 key="phase2" />}
          {currentPhase === 3 && <Phase3 key="phase3" />}
          {currentPhase === 4 && <Phase4 key="phase4" />}
          {currentPhase === 5 && <Phase5 key="phase5" />}
        </AnimatePresence>
      </main>
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

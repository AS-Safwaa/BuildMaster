import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Layout, Palette, Globe, User, Users, ArrowRight } from 'lucide-react';

export const Phase1 = () => {
  const { data, updateData, goToNext, getStepNumber, autofill } = useWizard();

  const options = [
    { 
      id: 'Logo Design', 
      title: 'Design a Logo', 
      desc: 'Get a unique symbol for your business.', 
      icon: <Palette className="w-8 h-8" />,
      color: 'bg-rose-500'
    },
    { 
      id: 'Website', 
      title: 'Build a Website', 
      desc: 'Your professional home on the internet.', 
      icon: <Globe className="w-8 h-8" />,
      color: 'bg-emerald-500'
    },
    { 
      id: 'Website + Logo', 
      title: 'Both Logo & Site', 
      desc: 'The best way to start your business.', 
      icon: <Layout className="w-8 h-8" />,
      color: 'bg-blue-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight leading-none text-balance">Step {getStepNumber(1)}: Let's Get Started!</h2>
        <p className="text-base text-slate-500 font-medium font-sans">Which creative path should we embark on today? Choose the best fit for your venture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateData({ projectType: opt.id as any })}
            className={`p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-500 text-left relative overflow-hidden group ${
              data.projectType === opt.id 
                ? 'border-blue-500 bg-blue-50/30 shadow-sm' 
                : 'border-slate-50 bg-white hover:border-slate-100 shadow-sm'
            }`}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 ${
              data.projectType === opt.id ? opt.color + ' text-white shadow-xl shadow-blue-500/10' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
            }`}>
              {opt.icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 leading-none">{opt.title}</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed font-sans opacity-90">{opt.desc}</p>
            
            {data.projectType === opt.id && (
              <div className="absolute top-6 right-6">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                   <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {data.projectType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 pt-10"
          >
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Who is this for?</h3>
              <p className="text-base text-slate-500 font-medium font-sans">This helps us use the right words for your project.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 max-w-lg">
              <button
                onClick={() => updateData({ projectFor: 'self' })}
                className={`flex-1 flex items-center gap-4 px-8 py-5 rounded-3xl border-2 transition-all ${
                  data.projectFor === 'self' 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl' 
                    : 'border-slate-50 bg-white hover:border-slate-200 text-slate-600 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.projectFor === 'self' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <User className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight">My own business</span>
              </button>
              <button
                onClick={() => updateData({ projectFor: 'friend' })}
                className={`flex-1 flex items-center gap-4 px-8 py-5 rounded-3xl border-2 transition-all ${
                  data.projectFor === 'friend' 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xl' 
                    : 'border-slate-50 bg-white hover:border-slate-200 text-slate-600 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.projectFor === 'friend' ? 'bg-slate-800' : 'bg-slate-50'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight">For a client or friend</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center md:justify-start pt-8">
        <button
          onClick={goToNext}
          disabled={!data.projectType || !data.projectFor}
          className="group flex items-center gap-4 px-12 py-5 bg-blue-600 disabled:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[2rem] font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm"
        >
          Sounds good, let's proceed
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Prototype Quick Fill Section */}
      <div className="mt-20 pt-10 border-t border-slate-100">
         <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Prototype Quick Fill (Demo Only)</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['Logo Design', 'Website', 'Website + Logo'] as const).map(type => (
              <button
                key={type}
                onClick={() => autofill(type)}
                className="p-4 bg-slate-100 hover:bg-slate-200 rounded-2xl border-2 border-transparent hover:border-blue-200 text-[10px] font-bold text-slate-600 uppercase tracking-widest transition-all"
              >
                Autofill: {type}
              </button>
            ))}
         </div>
      </div>
    </motion.div>
  );
};

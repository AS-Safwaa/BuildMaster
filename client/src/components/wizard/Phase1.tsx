import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Layout, Palette, Globe, User, Users, Search } from 'lucide-react';

export const Phase1 = () => {
  const { data, updateData, goToNext, autofill } = useWizard();

  const handleTypeSelect = (type: any) => {
    updateData({ projectType: type });
    // Scroll slightly down or show next section
  };

  const handleForSelect = (forWhom: any) => {
    updateData({ projectFor: forWhom });
    // Smooth Auto-Forward
    setTimeout(() => {
        goToNext();
    }, 600);
  };

  const options = [
    { 
      id: 'Logo Design', 
      title: 'A New Logo', 
      icon: <Palette className="w-10 h-10" />,
      color: 'bg-indigo-500'
    },
    { 
      id: 'Website', 
      title: 'A Website', 
      icon: <Globe className="w-10 h-10" />,
      color: 'bg-emerald-500'
    },
    { 
      id: 'Website + Logo', 
      title: 'Logo & Site', 
      icon: <Layout className="w-10 h-10" />,
      color: 'bg-blue-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
      className="space-y-16 py-10"
    >
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">What are we building?</h2>
        <p className="text-lg text-slate-500 font-medium max-w-md mx-auto">Choose your path and let's get the momentum started.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleTypeSelect(opt.id)}
            className={`p-10 rounded-[3rem] border-4 transition-all duration-500 text-center relative overflow-hidden group ${
              data.projectType === opt.id 
                ? 'border-indigo-500 bg-white shadow-2xl shadow-indigo-500/20 scale-105' 
                : 'border-white bg-white hover:border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2'
            }`}
          >
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-all duration-500 ${
              data.projectType === opt.id ? opt.color + ' text-white rotate-6' : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100'
            }`}>
              {opt.icon}
            </div>
            <h3 className="text-xl font-black text-slate-900 leading-none">{opt.title}</h3>
            
            {data.projectType === opt.id && (
              <motion.div layoutId="check" className="absolute top-6 right-6">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                   <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </motion.div>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {data.projectType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="space-y-10 pt-10"
          >
            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Who is this for?</h3>
              <p className="text-slate-500 font-medium">Just one more click to lock this phase in.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                { id: 'self', label: 'My own business', icon: <User className="w-6 h-6"/> },
                { id: 'friend', label: 'For a client / friend', icon: <Users className="w-6 h-6"/> }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleForSelect(item.id)}
                  className={`group relative flex flex-col items-center gap-6 p-10 rounded-[3rem] border-4 transition-all duration-500 ${
                    data.projectFor === item.id 
                      ? 'border-slate-900 bg-slate-900 text-white shadow-2xl scale-105' 
                      : 'border-white bg-white hover:border-slate-200 text-slate-600 shadow-xl'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${data.projectFor === item.id ? 'bg-slate-800' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                    {item.id === data.projectFor ? <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2 }}>{item.icon}</motion.div> : item.icon}
                  </div>
                  <span className="font-black text-lg tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sneaky Shortcut for Pros */}
      <div className="flex justify-center opacity-30 hover:opacity-100 transition-opacity pt-20">
         <button 
           onClick={() => autofill('Website + Logo')}
           className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
         >
           <Search className="w-3 h-3"/> I'm in a hurry, autofill a demo
         </button>
      </div>
    </motion.div>
  );
};

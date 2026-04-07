import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Target, Zap, Mic, Type, Palette, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';

export const Phase6 = () => {
  const { data, updateData, goToNext, goToPrev } = useWizard();

  const goals = ['Get more calls', 'Show my work', 'Sell things online', 'Book appointments', 'Look professional'];
  const actions = ['Call Now', 'Get a Price', 'Book Now', 'Message Us', 'See Photos'];
  const tones = ['Friendly', 'Professional', 'Modern', 'Strong', 'Fancy'];
  const styles = ['Simple & Clean', 'Bold & Dark', 'Classic/Trustworthy', 'Modern/Techy'];

  const toggleArray = (field: keyof typeof data, value: string) => {
    const current = (data[field] as string[]) || [];
    if (current.includes(value)) {
      updateData({ [field]: current.filter(v => v !== value) });
    } else {
      updateData({ [field]: [...current, value] });
    }
  };

  const handleGoalClick = (g: string) => {
     toggleArray('websiteGoals', g);
  };

  const handleActionClick = (a: string) => {
    if (data.userAction === a) {
      updateData({ userAction: '' });
    } else {
      updateData({ userAction: a });
    }
  };

  const handleToggleSingle = (field: keyof typeof data, val: string) => {
    if (data[field] === val) {
      updateData({ [field]: '' });
    } else {
      updateData({ [field]: val });
    }
  };

  const addUSP = () => updateData({ usps: [...data.usps, ''] });
  const updateUSP = (idx: number, val: string) => {
    const newUSPs = [...data.usps];
    newUSPs[idx] = val;
    updateData({ usps: newUSPs });
  };
  const removeUSP = (idx: number) => {
    const newUSPs = [...data.usps];
    newUSPs.splice(idx, 1);
    updateData({ usps: newUSPs });
  };

  const addCustomGoal = () => updateData({ customGoals: [...data.customGoals, ''] });
  const updateCustomGoal = (idx: number, val: string) => {
    const next = [...data.customGoals];
    next[idx] = val;
    updateData({ customGoals: next });
  };
  const removeCustomGoal = (idx: number) => {
    const next = [...data.customGoals];
    next.splice(idx, 1);
    updateData({ customGoals: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight leading-none text-balance font-sans">Step 6: Your Website Goals</h2>
        <p className="text-base text-slate-500 font-medium">Finalize how you want to attract and talk to customers.</p>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
           <Target className="w-5 h-5 text-blue-600" /> What do you want your website to do?
        </h3>
        <div className="flex flex-wrap gap-2">
          {goals.map(g => (
            <button
              key={g} onClick={() => handleGoalClick(g)}
              className={`px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm ${
                data.websiteGoals.includes(g) ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
          <button 
             onClick={addCustomGoal}
             className="px-6 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2"
          >
             <Plus className="w-4 h-4" /> Add Custom Goal
          </button>
        </div>
        
        <AnimatePresence>
          {data.customGoals.length > 0 && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="space-y-2 overflow-hidden">
               {data.customGoals.map((g, idx) => (
                 <div key={idx} className="flex gap-2">
                    <input 
                      type="text" placeholder="Explain your goal..." value={g}
                      onChange={(e) => updateCustomGoal(idx, e.target.value)}
                      className="flex-1 p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm shadow-sm"
                    />
                    <button onClick={() => removeCustomGoal(idx)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors"><X className="w-4 h-4" /></button>
                 </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
           <Zap className="w-5 h-5 text-yellow-500" /> What should customers do first?
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map(a => (
            <button
              key={a} onClick={() => handleActionClick(a)}
              className={`p-4 rounded-xl border-2 text-xs font-black uppercase tracking-tight transition-all text-center shadow-sm ${
                data.userAction === a ? 'border-yellow-500 bg-yellow-50 shadow-md ring-2 ring-yellow-100' : 'border-slate-50 bg-white hover:border-slate-200'
              }`}
            >
              {a}
            </button>
          ))}
          <button 
             onClick={() => updateData({ userAction: 'custom' })}
             className={`p-4 rounded-xl border-2 border-dashed transition-all text-center shadow-sm font-bold text-[10px] uppercase tracking-widest ${
               data.userAction === 'custom' ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-100' : 'border-slate-50 bg-white hover:border-slate-200'
             }`}
          >
             <Plus className="w-3 h-3 inline mr-1" /> Custom Button
          </button>
        </div>
        
        <AnimatePresence>
          {data.userAction === 'custom' && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="pt-1 overflow-hidden">
               <input 
                 type="text" placeholder="e.g. Subscribe to Monthly Box"
                 value={data.customActions[0] || ''} onChange={(e) => updateData({ customActions: [e.target.value] })}
                 className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-yellow-500 font-black text-sm shadow-sm" 
               />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-5 bg-white p-8 rounded-[2rem] border-2 border-slate-50 shadow-sm relative overflow-hidden">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
           <Type className="w-5 h-5 text-purple-600" /> Got a catchy slogan?
        </h3>
        <p className="text-sm text-slate-500 font-medium font-sans">A short sentence that describes your business.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
           {[ 
             { id: 'yes', label: 'Yes, I have one', sub: 'Input it here' },
             { id: 'no', label: 'Not really', sub: 'Skip it for now' },
             { id: 'help', label: 'Help me write one', sub: 'We will suggest' }
           ].map(opt => (
             <button
                key={opt.id} onClick={() => handleToggleSingle('taglineStatus', opt.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-left shadow-sm ${
                  data.taglineStatus === opt.id ? 'border-purple-600 bg-purple-50 ring-4 ring-purple-100/50' : 'border-slate-50 bg-white hover:border-slate-200'
                }`}
             >
                <p className="font-bold text-slate-800 text-sm mb-1 leading-none">{opt.label}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{opt.sub}</p>
             </button>
           ))}
        </div>
        
        <AnimatePresence>
          {data.taglineStatus === 'yes' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="pt-2 overflow-hidden">
               <input 
                 type="text" placeholder="e.g. Quality Food, Delivered Fast!"
                 value={data.taglineCustom} onChange={(e) => updateData({ taglineCustom: e.target.value })}
                 className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-purple-100 font-bold text-sm shadow-inner" 
               />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
           <Mic className="w-5 h-5 text-indigo-500" /> What makes your business special?
        </h3>
        <p className="text-sm text-slate-500 font-medium font-sans">Why should people pick you? (e.g. Low price, 24/7 service)</p>
        <div className="space-y-2">
          {data.usps.map((u, idx) => (
            <div key={idx} className="flex gap-2">
              <input 
                type="text" placeholder="e.g. Free Home Delivery" value={u}
                onChange={(e) => updateUSP(idx, e.target.value)}
                className="flex-1 p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all text-sm shadow-sm"
              />
              <button onClick={() => removeUSP(idx)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors shadow-sm"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <button onClick={addUSP} className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors text-xs shadow-sm">
             <Plus className="w-3 h-3" /> Add a point
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-slate-100">
         <div className="space-y-5">
           <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
              <Palette className="w-5 h-5 text-pink-600" /> Website Look
           </h3>
           <div className="grid grid-cols-1 gap-2">
             {styles.map(s => (
               <button
                  key={s} onClick={() => handleToggleSingle('websiteStyle', s)}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between shadow-sm ${
                    data.websiteStyle === s ? 'border-pink-600 bg-pink-50 ring-2 ring-pink-50' : 'border-slate-50 bg-white hover:border-slate-200'
                  }`}
               >
                  <span className="font-bold text-slate-800 text-sm font-sans">{s}</span>
                  {data.websiteStyle === s && <div className="w-2 h-2 bg-pink-600 rounded-full" />}
               </button>
             ))}
           </div>
         </div>

         <div className="space-y-5">
           <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
              <Mic className="w-5 h-5 text-emerald-600" /> Your Brand's "Voice"
           </h3>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans ml-8">How should we talk to your customers?</p>
           <div className="grid grid-cols-1 gap-2">
             {tones.map(t => (
               <button
                  key={t} onClick={() => handleToggleSingle('preferredTone', t)}
                  className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between shadow-sm ${
                    data.preferredTone === t ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-50' : 'border-slate-50 bg-white hover:border-slate-200'
                  }`}
               >
                  <span className="font-bold text-slate-800 text-sm font-sans">{t}</span>
                  {data.preferredTone === t && <div className="w-2 h-2 bg-emerald-600 rounded-full" />}
               </button>
             ))}
           </div>
         </div>
      </div>

      <div className="flex justify-between items-center pt-10">
        <button onClick={goToPrev} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm shadow-sm font-sans">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm font-sans"
        >
          Sounds great!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

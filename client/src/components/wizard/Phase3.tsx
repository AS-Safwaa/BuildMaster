import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft, Plus, X, Check } from 'lucide-react';

export const Phase3 = () => {
  const { data, updateData, setPhase } = useWizard();

  const personalities = [
    'Professional', 'Friendly', 'Modern', 'Simple', 'Luxurious', 'Bold', 'Traditional'
  ];

  const designStyles = ['Clean & Simple', 'Big & Bold', 'Fancy', 'Old School', 'Techy'];
  const usageOptions = ['On my Website', 'Social Media', 'Business Cards', 'Clothing', 'Shop Sign', 'Packaging'];

  const toggleArray = (field: keyof typeof data, value: string) => {
    const current = (data[field] as string[]) || [];
    if (current.includes(value)) {
      updateData({ [field]: current.filter(v => v !== value) });
    } else {
      updateData({ [field]: [...current, value] });
    }
  };

  const addInput = (field: keyof typeof data) => {
    const current = (data[field] as string[]) || [];
    updateData({ [field]: [...current, ''] });
  };

  const updateInput = (field: keyof typeof data, index: number, value: string) => {
    const current = [...((data[field] as string[]) || [])];
    current[index] = value;
    updateData({ [field]: current });
  };

  const removeInput = (field: keyof typeof data, index: number) => {
    const current = [...((data[field] as string[]) || [])];
    current.splice(index, 1);
    updateData({ [field]: current });
  };

  const handleStatusClick = (id: 'none' | 'improve' | 'have') => {
    if (data.logoStatus === id) {
      updateData({ logoStatus: '' });
    } else {
      updateData({ logoStatus: id });
    }
  };

  const handleDesignStyleClick = (style: string) => {
     if (data.designStyle === style) {
       updateData({ designStyle: '' });
     } else {
       updateData({ designStyle: style });
     }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight leading-none text-balance">Step 3: Logo & Look</h2>
        <p className="text-base text-slate-500 font-medium font-sans">Let's decide how your business should look to customers.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900">Do you already have a logo?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'none', label: 'No, I need a new one', sub: 'Start fresh' },
            { id: 'improve', label: 'Yes, but fix it up', sub: 'Make it better' },
            { id: 'have', label: 'Yes, I Like it', sub: 'Use as it is' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleStatusClick(opt.id as any)}
              className={`p-5 rounded-[1.5rem] border-2 transition-all text-left relative overflow-hidden ${
                data.logoStatus === opt.id ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50/50 shadow-sm' : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'
              }`}
            >
              <p className="font-bold text-slate-800 text-sm mb-1 leading-none">{opt.label}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{opt.sub}</p>
              {data.logoStatus === opt.id && <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {data.logoStatus && data.logoStatus !== 'have' && (
          <motion.div
            key="logo-details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-10 overflow-hidden pt-4"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">What is the "vibe" of your business?</h3>
              <p className="text-sm text-slate-500 font-medium font-sans tracking-tight">Pick as many as you like.</p>
              <div className="flex flex-wrap gap-2">
                {personalities.map((p) => (
                  <button
                    key={p}
                    onClick={() => toggleArray('brandPersonality', p)}
                    className={`px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                      data.brandPersonality.includes(p) ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 font-sans">Which style do you like?</h3>
                <div className="space-y-2">
                  {designStyles.map(s => (
                    <button
                      key={s}
                      onClick={() => handleDesignStyleClick(s)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between shadow-sm ${
                        data.designStyle === s ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-50' : 'border-slate-50 bg-white hover:border-slate-200'
                      }`}
                    >
                      <span className="font-bold text-slate-800 text-sm">{s} Look</span>
                      {data.designStyle === s && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Where will you put the logo?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {usageOptions.map(u => (
                    <button
                      key={u}
                      onClick={() => toggleArray('logoUsage', u)}
                      className={`p-3 rounded-xl border-2 font-bold text-[11px] transition-all flex items-center gap-2 shadow-sm ${
                        data.logoUsage.includes(u) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${data.logoUsage.includes(u) ? 'border-white' : 'border-slate-300'}`}>
                         {data.logoUsage.includes(u) && <div className="w-1 h-1 bg-white rounded-full" />}
                      </div>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Got any logos you like?</h3>
              <p className="text-sm text-slate-500 font-medium font-sans">Add links or describe what you like about them.</p>
              <div className="space-y-2">
                {data.logoInspirations.map((url, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" placeholder="https://..." value={url} 
                      onChange={(e) => updateInput('logoInspirations', idx, e.target.value)}
                      className="flex-1 p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm shadow-sm"
                    />
                    <button onClick={() => removeInput('logoInspirations', idx)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addInput('logoInspirations')} className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors text-xs">
                  <Plus className="w-4 h-4" /> Add a Link
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 font-sans">Pick your favorite colors</h3>
                <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                   {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#8B5CF6', '#EC4899', '#111827'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => toggleArray('preferredColors', c)}
                      className={`w-full aspect-square rounded-2xl border-4 transition-all relative ${data.preferredColors.includes(c) ? 'border-slate-900 scale-105 shadow-xl' : 'border-white focus:border-slate-200'}`}
                      style={{ backgroundColor: c }}
                    >
                      {data.preferredColors.includes(c) && <Check className="w-5 h-5 text-white absolute top-1/2 left-1/2 mt-[-10px] ml-[-10px] drop-shadow-md" />}
                    </button>
                   ))}
                   <div className="relative w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group shadow-sm">
                      <input 
                        type="color" 
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!data.preferredColors.includes(val)) {
                            updateData({ preferredColors: [...data.preferredColors, val] });
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Plus className="w-6 h-6 text-slate-300 group-hover:text-slate-500 transition-colors" />
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900">Any colors you Hate?</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 font-sans">We won't use these colors.</p>
                <div className="flex flex-wrap gap-3">
                   <div className="relative w-14 h-14 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group shadow-sm">
                      <input 
                        type="color" 
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!data.avoidColors.includes(val)) {
                            updateData({ avoidColors: [...data.avoidColors, val] });
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <Plus className="w-6 h-6 text-slate-300 group-hover:text-slate-500 transition-colors" />
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {data.avoidColors.map(c => (
                        <div key={c} className="w-14 h-14 rounded-2xl relative overflow-hidden group shadow-sm border-2 border-white ring-1 ring-slate-100" style={{ backgroundColor: c }}>
                           <button 
                            onClick={() => toggleArray('avoidColors', c)} 
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                           >
                             <X className="w-5 h-5 text-white" />
                           </button>
                        </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center pt-10">
        <button onClick={() => setPhase(2)} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={() => setPhase(4)}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm"
        >
          Next Step
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

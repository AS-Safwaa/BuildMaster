import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft, Plus, X, Check } from 'lucide-react';

// --- High-Fidelity Brand DNA Data ---
const VIBE_DATA: Record<string, { examples: string[], desc: string }> = {
  'Professional': { examples: ['IBM', 'Microsoft', 'Goldman Sachs'], desc: 'Stable, Corporate, Reliable' },
  'Friendly': { examples: ['Mailchimp', 'Slack', 'Old Spice'], desc: 'Approachable, Warm, Human' },
  'Modern': { examples: ['Apple', 'Tesla', 'Airbnb'], desc: 'Cutting-edge, Forward-thinking' },
  'Simple': { examples: ['Google', 'Dropbox', 'Notion'], desc: 'Easy, Minimalist, Direct' },
  'Luxurious': { examples: ['Rolex', 'Chanel', 'Mercedes'], desc: 'Exclusive, High-end, Prestigious' },
  'Bold': { examples: ['Red Bull', 'Netflix', 'Nike'], desc: 'Energetic, Fearless, High-impact' },
  'Traditional': { examples: ['Coca-Cola', 'Ford', 'The New York Times'], desc: 'Timeless, Classic, Heritage' }
};

const STYLE_DATA: Record<string, { examples: string[] }> = {
  'Clean & Simple': { examples: ['Apple', 'Google'] },
  'Big & Bold': { examples: ['Red Bull', 'Nike'] },
  'Fancy': { examples: ['Cartier', 'Tiffany'] },
  'Old School': { examples: ['Jack Daniel\'s', 'Levi\'s'] },
  'Techy': { examples: ['Nvidia', 'Intel'] }
};

const COLOR_PSYCHOLOGY: Record<string, string> = {
  '#3B82F6': 'Trust & Security',
  '#EF4444': 'Power & Urgency',
  '#10B981': 'Growth & Health',
  '#F59E0B': 'Optimism & Warmth',
  '#6366F1': 'Logic & Stability',
  '#8B5CF6': 'Luxury & Mystery',
  '#EC4899': 'Vibrant & Playful',
  '#111827': 'Elegance & Authority'
};

export const Phase3 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber, getNextPhaseTitle } = useWizard();

  const personalities = Object.keys(VIBE_DATA);
  const designStyles = Object.keys(STYLE_DATA);
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
      className="space-y-12 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight leading-none text-balance">Step {getStepNumber(3)}: Logo & Brand DNA</h2>
        <p className="text-base text-slate-500 font-medium font-sans opacity-90">Defining the soul of your business and how it resonates with customers.</p>
      </div>

      {/* Logo Status Selector */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Current Pulse: Do you have a logo?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'none', label: 'No, Build from Scratch', sub: 'Infinite Possibilities' },
            { id: 'improve', label: 'Yes, Optimize Current', sub: 'Refined Evolution' },
            { id: 'have', label: 'Yes, Use Existing', sub: 'Direct Integration' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleStatusClick(opt.id as any)}
              className={`p-8 rounded-[2rem] border-2 transition-all text-left relative group overflow-hidden ${
                data.logoStatus === opt.id ? 'border-blue-600 bg-blue-50/40 ring-4 ring-blue-50/50 shadow-blue-600/10' : 'border-slate-50 bg-white hover:border-slate-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-colors ${data.logoStatus === opt.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                 <Plus className={`w-6 h-6 ${opt.id === 'have' ? 'rotate-45' : ''}`} />
              </div>
              <p className="font-black text-slate-900 text-lg mb-1 leading-tight">{opt.label}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{opt.sub}</p>
              {data.logoStatus === opt.id && (
                <Check className="absolute top-6 right-6 w-5 h-5 text-blue-600" />
              )}
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
            className="space-y-16 overflow-hidden pt-8 border-t border-slate-100"
          >
            {/* Personality / Vibe Selector */}
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-xl font-black text-slate-900">What is the "vibe" of your business?</h3>
                    <p className="text-sm text-slate-500 font-medium font-sans">Matches your industry's leading benchmarks.</p>
                 </div>
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Strategic Analysis</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {personalities.map((p) => {
                  const vibe = VIBE_DATA[p];
                  const isSelected = data.brandPersonality.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => toggleArray('brandPersonality', p)}
                      className={`p-6 rounded-[2rem] border-2 text-left transition-all relative group ${
                        isSelected ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                         <span className="font-black text-lg tracking-tight leading-none">{p}</span>
                         {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 transition-colors ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {vibe.desc}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {vibe.examples.map(ex => (
                          <span key={ex} className={`text-[9px] font-black px-2 py-0.5 rounded-md transition-colors ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                            {ex}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Design Style & Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900">Which style do you like?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {designStyles.map(s => {
                    const style = STYLE_DATA[s];
                    const isSelected = data.designStyle === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleDesignStyleClick(s)}
                        className={`p-6 rounded-[1.75rem] border-2 transition-all text-left shadow-sm relative group ${
                          isSelected ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50' : 'border-slate-50 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                           <span className="font-black text-slate-900 text-base">{s}</span>
                           <div className={`w-3 h-3 rounded-full transition-colors ${isSelected ? 'bg-blue-600' : 'bg-slate-200 group-hover:bg-slate-300'}`} />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {style.examples.map(ex => (
                            <span key={ex} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                               {ex}{' '}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900">Where will you put the logo?</h3>
                <div className="grid grid-cols-2 gap-3">
                  {usageOptions.map(u => (
                    <button
                      key={u}
                      onClick={() => toggleArray('logoUsage', u)}
                      className={`p-4 rounded-2xl border-2 font-bold text-xs transition-all flex items-center gap-3 shadow-sm ${
                        data.logoUsage.includes(u) ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-50 bg-white text-slate-600 hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors ${data.logoUsage.includes(u) ? 'border-white bg-white/20' : 'border-slate-200'}`}>
                         {data.logoUsage.includes(u) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inspo Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900">Got any logos you like?</h3>
              <p className="text-base text-slate-500 font-medium font-sans">Add links (Pinterest, Dribbble, etc.) or describe their vibe.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.logoInspirations.map((url, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input 
                      type="text" placeholder="https://dribbble.com/..." value={url} 
                      onChange={(e) => updateInput('logoInspirations', idx, e.target.value)}
                      className="flex-1 p-5 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm shadow-sm"
                    />
                    <button onClick={() => removeInput('logoInspirations', idx)} className="p-5 bg-white border-2 border-slate-50 text-rose-500 rounded-2xl hover:bg-rose-50 hover:border-rose-100 transition-all">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addInput('logoInspirations')} className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-black hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
                  <Plus className="w-5 h-5" /> Add Another Reference
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900">Pick your favorite colors</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Click a color to see its brand strategy.</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                   {Object.entries(COLOR_PSYCHOLOGY).map(([c, psychology]) => (
                    <button 
                      key={c} 
                      onClick={() => toggleArray('preferredColors', c)}
                      className={`w-full aspect-square rounded-[1.50rem] border-4 transition-all relative group overflow-hidden ${data.preferredColors.includes(c) ? 'border-slate-900 scale-110 shadow-2xl' : 'border-white hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                      title={psychology}
                    >
                      {data.preferredColors.includes(c) ? (
                        <Check className="w-6 h-6 text-white absolute top-1/2 left-1/2 mt-[-12px] ml-[-12px] drop-shadow-md" />
                      ) : (
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1">
                           <span className="text-[8px] font-black text-white text-center leading-none uppercase drop-shadow-md">{psychology}</span>
                        </div>
                      )}
                    </button>
                   ))}
                   <div className="relative w-full aspect-square rounded-[1.50rem] border-4 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group shadow-sm">
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
                      <Plus className="w-8 h-8 text-slate-300 group-hover:text-slate-500 transition-colors" />
                   </div>
                </div>
                {data.preferredColors.length > 0 && (
                   <div className="p-4 bg-slate-900 rounded-2xl flex flex-wrap gap-2">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest w-full mb-1">Selected Palette Strategy:</span>
                      {data.preferredColors.map(c => (
                         <div key={c} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }}></div>
                            <span className="text-[10px] font-black text-white uppercase">{COLOR_PSYCHOLOGY[c] || 'Custom Intent'}</span>
                         </div>
                      ))}
                   </div>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900">Any colors you "HATE"?</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System Rule: We will strictly avoid these tones throughout your brand identity.</p>
                <div className="flex flex-wrap gap-4">
                   <div className="relative w-16 h-16 rounded-[1.50rem] border-4 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group shadow-sm">
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
                      <Plus className="w-8 h-8 text-slate-300 group-hover:text-slate-500 transition-colors" />
                   </div>
                   <div className="flex flex-wrap gap-3">
                     {data.avoidColors.map(c => (
                        <div key={c} className="w-16 h-16 rounded-[1.50rem] relative overflow-hidden group shadow-xl border-4 border-white ring-2 ring-slate-100" style={{ backgroundColor: c }}>
                           <button 
                            onClick={() => toggleArray('avoidColors', c)} 
                            className="absolute inset-0 bg-rose-600/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                           >
                             <Check className="w-8 h-8 text-white rotate-45" />
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

      {/* Navigation */}
      <div className="flex justify-between items-center pt-20 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-3 px-8 py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-3xl font-bold hover:bg-slate-50 transition-all text-xs uppercase tracking-widest leading-none">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-6 px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest leading-none"
        >
          Proceed to {getNextPhaseTitle() || 'Next Step'}
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft, Plus, Check, Palette, Box, RefreshCw } from 'lucide-react';

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

const LOGO_TYPES = ['Wordmark', 'Icon/Symbol', 'Mascot', 'Combination Mark', 'Minimalist'];

export const Phase3 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();

  const toggleArray = (field: keyof typeof data, value: string) => {
    const current = (data[field] as string[]) || [];
    if (current.includes(value)) {
      updateData({ [field]: current.filter(v => v !== value) });
    } else {
      updateData({ [field]: [...current, value] });
    }
  };

  const SelectionCard = ({ id, label, sub, icon: Icon, active, onClick }: any) => (
    <button
      onClick={() => onClick(id)}
      className={`p-6 rounded-[2rem] border-2 transition-all text-left relative group overflow-hidden h-full ${
        active === id ? 'border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-50/30' : 'border-slate-50 bg-white hover:border-slate-200'
      }`}
    >
      <div className={`w-10 h-10 rounded-2xl mb-4 flex items-center justify-center transition-colors ${active === id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
         {Icon && <Icon className="w-5 h-5" />}
      </div>
      <p className="font-bold text-slate-900 text-base mb-1 leading-tight">{label}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
      {active === id && <Check className="absolute top-6 right-6 w-5 h-5 text-blue-600" />}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight leading-none text-balance font-sans">Step {getStepNumber(3)}: Logo & Brand DNA</h2>
        <p className="text-base text-slate-500 font-medium font-sans opacity-95">Let's define the soul of your business and how it resonates with customers.</p>
      </div>

      {/* Primary Flow Choice */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Current Pulse: Do you have a logo?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <SelectionCard id="none" label="Build from Scratch" sub="New Identity" icon={Plus} active={data.logoStatus} onClick={(id: any) => updateData({ logoStatus: id })} />
           <SelectionCard id="improve" label="Optimize Existing" sub="Refined Evolution" icon={RefreshCw} active={data.logoStatus} onClick={(id: any) => updateData({ logoStatus: id })} />
           <SelectionCard id="have" label="Use Existing" sub="Direct Integration" icon={Box} active={data.logoStatus} onClick={(id: any) => updateData({ logoStatus: id })} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {data.logoStatus === 'none' && (
          <motion.div key="scratch" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12 pt-8 border-t border-slate-100">
            {/* Vibe Selection */}
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">What is the "vibe" of your business?</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Object.keys(VIBE_DATA).map(p => {
                    const isSelected = data.brandPersonality.includes(p);
                    return (
                      <button 
                        key={p} onClick={() => toggleArray('brandPersonality', p)}
                        className={`p-5 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-white hover:border-slate-200'}`}
                      >
                        <p className={`text-sm mb-1 ${isSelected ? 'font-bold text-blue-700' : 'font-medium text-slate-700'}`}>{p}</p>
                        <p className="text-[9px] text-slate-400 font-medium capitalize">Eg: {VIBE_DATA[p].examples.join(', ')}</p>
                      </button>
                    )
                  })}
               </div>
            </div>

            {/* Style Selection */}
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Which style fits your vision?</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.keys(STYLE_DATA).map(s => {
                    const isSelected = data.designStyle === s;
                    return (
                      <button 
                        key={s} onClick={() => updateData({ designStyle: s })}
                        className={`p-5 rounded-2xl border-2 transition-all text-left ${isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-white hover:border-slate-200'}`}
                      >
                        <p className={`text-sm mb-1 ${isSelected ? 'font-bold text-blue-700' : 'font-medium text-slate-700'}`}>{s}</p>
                        <p className="text-[9px] text-slate-400 font-medium capitalize">Eg: {STYLE_DATA[s].examples.join(', ')}</p>
                      </button>
                    )
                  })}
               </div>
            </div>

            {/* Logo Type Selection */}
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Preferred Logo Type</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {LOGO_TYPES.map(t => (
                    <button 
                      key={t} onClick={() => updateData({ logoType: t })}
                      className={`p-3 rounded-xl border-2 font-bold text-[10px] text-center transition-all ${data.logoType === t ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200 shadow-sm'}`}
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>

            {/* Colors */}
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-3">
                  <Palette className="w-5 h-5 text-indigo-500" /> Color Mood
               </h3>
               <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {Object.entries(COLOR_PSYCHOLOGY).map(([c, psychology]) => (
                    <button 
                      key={c} onClick={() => toggleArray('preferredColors', c)}
                      className={`w-full aspect-square rounded-2xl border-4 transition-all relative ${data.preferredColors.includes(c) ? 'border-slate-900 scale-105 shadow-lg' : 'border-white'}`}
                      style={{ backgroundColor: c }}
                      title={psychology}
                    >
                      {data.preferredColors.includes(c) && <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-sm" />}
                    </button>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {data.logoStatus === 'improve' && (
          <motion.div key="optimize" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12 pt-8 border-t border-slate-100">
            <div className="space-y-6">
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">What would you like to improve?</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'modernize', label: 'Modernize & Simplify', sub: 'Bring it to 2024 standards' },
                    { id: 'elements', label: 'Keep elements, change vibe', sub: 'Maintain brand equity' },
                    { id: 'recolor', label: 'New Color Palette', sub: 'Fresh psychological impact' },
                    { id: 'full', label: 'Full Overhaul', sub: 'Keep name, change everything else' }
                  ].map(opt => (
                    <SelectionCard key={opt.id} id={opt.id} label={opt.label} sub={opt.sub} active={data.logoStylePreference} onClick={(id: any) => updateData({ logoStylePreference: id })} />
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-lg font-bold text-slate-800 tracking-tight">Any specific changes in mind?</h3>
               <textarea 
                  placeholder="e.g. Make the font bolder, remove the circle behind the icon..." 
                  value={data.tagline} onChange={(e) => updateData({ tagline: e.target.value })}
                  className="w-full p-5 bg-white border-2 border-slate-50 rounded-3xl outline-none focus:border-blue-500 font-medium text-sm shadow-sm resize-none h-32"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest leading-none">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-6 px-12 py-5 bg-blue-600 text-white rounded-[2rem] font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest leading-none"
        >
          Next Step!
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

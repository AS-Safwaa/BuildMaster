import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Target, Zap, Palette, ArrowRight, ArrowLeft, Plus, X, Link as LinkIcon, ExternalLink, Check } from 'lucide-react';

// --- Mock Admin-Controlled Master Data ---
const STYLE_REFERENCES: Record<string, string[]> = {
  'Simple & Clean': ['https://apple.com', 'https://stripe.com'],
  'Bold & Dark': ['https://linear.app', 'https://vercel.com'],
  'Classic/Trustworthy': ['https://goldmansachs.com', 'https://mercedes-benz.com'],
  'Modern/Techy': ['https://tesla.com', 'https://openai.com']
};

export const Phase6 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();

  const goals = ['Get more calls', 'Show my work', 'Sell things online', 'Book appointments', 'Look professional'];
  const actions = ['Call Now', 'Get a Price', 'Book Now', 'Message Us', 'See Photos'];
  const styles = ['Simple & Clean', 'Bold & Dark', 'Classic/Trustworthy', 'Modern/Techy'];

  const handleGoalClick = (g: string) => {
    const current = data.websiteGoals || [];
    if (current.includes(g)) {
      updateData({ websiteGoals: current.filter(v => v !== g) });
    } else if (current.length < 3) {
      updateData({ websiteGoals: [...current, g] });
    }
  };

  const handleActionClick = (a: string) => {
    updateData({ userAction: data.userAction === a ? '' : a });
  };

  const addReferenceLink = () => updateData({ referenceLinks: [...data.referenceLinks, ''] });
  const updateReferenceLink = (idx: number, val: string) => {
    const next = [...data.referenceLinks];
    next[idx] = val;
    updateData({ referenceLinks: next });
  };
  const removeReferenceLink = (idx: number) => {
    const next = [...data.referenceLinks];
    next.splice(idx, 1);
    updateData({ referenceLinks: next });
  };

  const addCompetitor = () => updateData({ competitorWebsites: [...data.competitorWebsites, ''] });
  const updateCompetitor = (idx: number, val: string) => {
    const next = [...data.competitorWebsites];
    next[idx] = val;
    updateData({ competitorWebsites: next });
  };
  const removeCompetitor = (idx: number) => {
    const next = [...data.competitorWebsites];
    next.splice(idx, 1);
    updateData({ competitorWebsites: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight leading-none text-balance font-sans">Step {getStepNumber(6)}: Goals & Strategy</h2>
        <p className="text-base text-slate-500 font-medium opacity-90 leading-relaxed">
           Finalize how you want to attract and talk to customers online.
        </p>
      </div>

      {/* Goals Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
               <Target className="w-5 h-5 text-blue-600" /> Website Goals
            </h3>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Select up to 3</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {goals.map(g => (
            <button
              key={g} onClick={() => handleGoalClick(g)}
              disabled={!data.websiteGoals.includes(g) && data.websiteGoals.length >= 3}
              className={`px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all shadow-sm ${
                data.websiteGoals.includes(g) ? 'border-blue-600 bg-blue-600 text-white shadow-lg' : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Action Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
               <Zap className="w-5 h-5 text-yellow-500" /> Customer Call-to-Action
            </h3>
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest bg-yellow-50 px-3 py-1 rounded-full">Pick one</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {actions.map(a => (
            <button
              key={a} onClick={() => handleActionClick(a)}
              className={`p-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all text-center shadow-sm ${
                data.userAction === a ? 'border-yellow-500 bg-yellow-50 shadow-md ring-4 ring-yellow-50/30' : 'border-slate-50 bg-white hover:border-slate-200'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Competitors Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
               <LinkIcon className="w-5 h-5 text-blue-600" /> Any websites like yours?
            </h3>
            <button onClick={addCompetitor} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95">
                <Plus className="w-4 h-4" />
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.competitorWebsites.map((url, idx) => (
            <div key={idx} className="flex gap-3">
              <input 
                type="text" placeholder="https://competitor.com" value={url} 
                onChange={(e) => updateCompetitor(idx, e.target.value)}
                className="flex-1 p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm shadow-sm"
              />
              <button onClick={() => removeCompetitor(idx)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          {data.competitorWebsites.length === 0 && (
             <p className="text-xs text-slate-400 font-medium italic text-center py-4 border-2 border-dashed border-slate-50 rounded-2xl">No competitor websites added yet.</p>
          )}
        </div>
      </div>

      {/* Website Look Section */}
      <div className="space-y-10 pt-10 border-t border-slate-100">
         <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <Palette className="w-5 h-5 text-pink-600" /> Website Style
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {styles.map(s => (
                <button
                  key={s} onClick={() => updateData({ websiteStyle: s })}
                  className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${
                    data.websiteStyle === s ? 'border-pink-600 bg-pink-50 shadow-md ring-4 ring-pink-50/30' : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <p className="font-bold text-slate-800 text-sm mb-1">{s}</p>
                  {data.websiteStyle === s && <Check className="absolute top-6 right-6 w-4 h-4 text-pink-600" />}
                </button>
              ))}
            </div>
         </div>

         <AnimatePresence>
            {data.websiteStyle && STYLE_REFERENCES[data.websiteStyle] && (
               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden">
                  <div className="p-6 bg-pink-50/30 border border-pink-100 rounded-[2rem] space-y-4">
                     <p className="text-xs font-black text-pink-600 uppercase tracking-[0.2em] mb-4">Admin Reference Links for {data.websiteStyle}</p>
                     <div className="flex flex-wrap gap-3">
                        {STYLE_REFERENCES[data.websiteStyle].map(link => (
                           <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-pink-100 text-pink-700 rounded-xl font-bold text-[10px] hover:shadow-md transition-all group">
                              {link.replace('https://', '')}
                              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                           </a>
                        ))}
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Your Reference Links</h3>
                <button onClick={addReferenceLink} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all active:scale-95">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.referenceLinks.map((url, idx) => (
                <div key={idx} className="flex gap-3">
                  <input 
                    type="text" placeholder="https://awwwards.com/..." value={url} 
                    onChange={(e) => updateReferenceLink(idx, e.target.value)}
                    className="flex-1 p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-pink-500 font-bold transition-all text-sm shadow-sm"
                  />
                  <button onClick={() => removeReferenceLink(idx)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest leading-none">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-6 px-12 py-6 bg-blue-600 text-white rounded-[2rem] font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest leading-none"
        >
          Almost There!
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

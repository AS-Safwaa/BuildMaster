import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Target, Zap, Palette, ArrowRight, ArrowLeft, Plus, X, Link } from 'lucide-react';

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

  const addCustomGoal = () => {
    if (data.websiteGoals.length < 3) {
        updateData({ customGoals: [...data.customGoals, ''] });
    }
  };
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight leading-none text-balance font-sans">Step {getStepNumber(6)}: Goals & Strategy</h2>
        <p className="text-base text-slate-500 font-medium opacity-90">
           Finalize how you want to attract and talk to customers online.
        </p>
      </div>

      {/* Goals Section */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
               <Target className="w-5 h-5 text-blue-600" /> What do you want your website to do?
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
          <button 
             onClick={addCustomGoal}
             disabled={data.websiteGoals.length >= 3}
             className="px-6 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
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

      {/* Action Section */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
               <Zap className="w-5 h-5 text-yellow-500" /> What should customers do first?
            </h3>
            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest bg-yellow-50 px-3 py-1 rounded-full">Select 1</span>
        </div>
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

      {/* Competitors Section (Moved from Step 8) */}
      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
           <Link className="w-5 h-5 text-blue-600" /> Any websites like yours?
        </h3>
        <p className="text-sm text-slate-500 font-medium font-sans">Add links to your competitors or similar businesses.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.competitorWebsites.map((url, idx) => (
            <div key={idx} className="flex gap-3">
              <input 
                type="text" placeholder="Eg: https://competitor.com" value={url} 
                onChange={(e) => updateCompetitor(idx, e.target.value)}
                className="flex-1 p-5 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm shadow-sm"
              />
              <button onClick={() => removeCompetitor(idx)} className="p-5 bg-white border-2 border-slate-50 text-rose-500 rounded-2xl hover:bg-rose-50 hover:border-rose-100 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button onClick={addCompetitor} className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-black hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
            <Plus className="w-5 h-5" /> Add Website
          </button>
        </div>
      </div>

      {/* Website Look Section */}
      <div className="space-y-6 pt-6 border-t border-slate-100">
         <div className="space-y-5">
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              <Palette className="w-5 h-5 text-pink-600" /> Website Look
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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
            <p className="text-sm text-slate-500 font-medium font-sans">Any reference links for the look?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.referenceLinks.map((url, idx) => (
                <div key={idx} className="flex gap-3">
                  <input 
                    type="text" placeholder="Eg: https://example.com" value={url} 
                    onChange={(e) => updateReferenceLink(idx, e.target.value)}
                    className="flex-1 p-5 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-pink-500 font-bold transition-all text-sm shadow-sm"
                  />
                  <button onClick={() => removeReferenceLink(idx)} className="p-5 bg-white border-2 border-slate-50 text-rose-500 rounded-2xl hover:bg-rose-50 hover:border-rose-100 transition-all">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button onClick={addReferenceLink} className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-slate-200 text-slate-400 rounded-2xl font-black hover:bg-slate-50 transition-all text-xs uppercase tracking-widest">
                <Plus className="w-5 h-5" /> Add Reference
              </button>
            </div>
          </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-10">
        <button onClick={goToPrev} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm shadow-sm font-sans">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-3xl font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm font-sans"
        >
          Sounds great!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

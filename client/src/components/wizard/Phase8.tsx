import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Layout, Search, Plus, X, ArrowRight, ArrowLeft, Package, Sparkles } from 'lucide-react';

export const Phase8 = () => {
  const { data, updateData, goToNext, goToPrev } = useWizard();

  const addons = [
    { id: 'seo', title: 'Find me on Google', desc: 'Basic SEO Setup' },
    { id: 'blog', title: 'Write news/blogs', desc: 'Content system' },
    { id: 'gmb', title: 'Put me on Maps', desc: 'Google Maps setup' },
    { id: 'wa', title: 'WhatsApp Button', desc: 'Direct chat' },
    { id: 'analytics', title: 'Track my visitors', desc: 'Know who visits' },
    { id: 'security', title: 'Extra Security', desc: 'Keep site safe' }
  ];

  const toggleAddon = (id: string) => {
    const current = data.addons || [];
    if (current.includes(id)) {
      updateData({ addons: current.filter(a => a !== id) });
    } else {
      updateData({ addons: [...current, id] });
    }
  };

  const addField = (field: 'competitorWebsites' | 'inspirationWebsites') => {
    updateData({ [field]: [...data[field], ''] });
  };

  const updateField = (field: 'competitorWebsites' | 'inspirationWebsites', idx: number, val: string) => {
    const arr = [...data[field]];
    arr[idx] = val;
    updateData({ [field]: arr });
  };

  const removeField = (field: 'competitorWebsites' | 'inspirationWebsites', idx: number) => {
    const arr = [...data[field]];
    arr.splice(idx, 1);
    updateData({ [field]: arr });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight leading-none text-balance">Step 8: Similar Websites & Extras</h2>
        <p className="text-base text-slate-500 font-medium">Show us some websites you like or are like yours.</p>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
           <Search className="w-5 h-5 text-blue-600" /> Any websites like yours?
        </h3>
        <p className="text-sm text-slate-500 font-medium">Add links to your competitors or similar businesses.</p>
        <div className="space-y-2">
           {data.competitorWebsites.map((c, idx) => (
             <div key={idx} className="flex gap-2">
                <input 
                  type="text" placeholder="https://..." value={c}
                  onChange={(e) => updateField('competitorWebsites', idx, e.target.value)}
                  className="flex-1 p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm"
                />
                <button onClick={() => removeField('competitorWebsites', idx)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors"><X className="w-4 h-4" /></button>
             </div>
           ))}
           <button onClick={() => addField('competitorWebsites')} className="flex items-center gap-2 px-6 py-2 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors text-xs">
              <Plus className="w-3 h-3" /> Add a website
           </button>
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
           <Layout className="w-5 h-5 text-purple-600" /> Any websites you really like?
        </h3>
        <p className="text-sm text-slate-500 font-medium">Links to websites where you love the beauty and feel.</p>
        <div className="space-y-2">
           {data.inspirationWebsites.map((i, idx) => (
             <div key={idx} className="flex gap-2">
                <input 
                  type="text" placeholder="https://..." value={i}
                  onChange={(e) => updateField('inspirationWebsites', idx, e.target.value)}
                  className="flex-1 p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm"
                />
                <button onClick={() => removeField('inspirationWebsites', idx)} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-colors"><X className="w-4 h-4" /></button>
             </div>
           ))}
           <button onClick={() => addField('inspirationWebsites')} className="flex items-center gap-2 px-6 py-2 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-colors text-xs">
              <Plus className="w-3 h-3" /> Add a website
           </button>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
           <Package className="w-5 h-5 text-indigo-500" /> Extra Features for you
        </h3>
        <p className="text-sm text-slate-500 font-medium">Pick any extra things you want for your website.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
           {addons.map(a => (
             <button
                key={a.id} onClick={() => toggleAddon(a.id)}
                className={`p-4 rounded-[1.5rem] border-2 transition-all text-left relative group ${
                  data.addons.includes(a.id) ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'
                }`}
             >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 transition-colors ${data.addons.includes(a.id) ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                   <Sparkles className="w-4 h-4" />
                </div>
                <p className="font-bold text-slate-800 leading-none mb-1 text-sm">{a.title}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{a.desc}</p>
             </button>
           ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-10">
        <button onClick={goToPrev} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm"
        >
          Check and Submit!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

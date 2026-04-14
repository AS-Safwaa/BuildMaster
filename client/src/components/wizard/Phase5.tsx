import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft, Plus, X, Star, Briefcase, Layers } from 'lucide-react';
import { useState } from 'react';

// --- Hierarchical Master Data ---
const BUSINESS_HIERARCHY: any = {
  'Real Estate': {
    subCategories: [
      {
        name: 'Residential Sales',
      }
    ]
  },
  'Technology': {
    subCategories: [
      {
        name: 'SaaS Platform',
        products: [
          { name: 'Analytics Dashboards', highImpact: true },
          { name: 'CRM Modules', highImpact: false },
          { name: 'Integration Hubs', highImpact: true }
        ],
        usps: ['99.9% Uptime', 'AI-Powered Extraction', 'Zero-Code Setup']
      }
    ]
  }
};

export const Phase5 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();
  const [customInputType, setCustomInputType] = useState<'products' | 'services' | 'usps' | null>(null);
  const [tempCustom, setTempCustom] = useState('');

  const currentCategory = BUSINESS_HIERARCHY[data.mainCategory] || null;
  const subCategories = currentCategory?.subCategories || [];
  const activeSub = subCategories.find((s: any) => s.name === data.subCategory);

  const toggleItem = (field: 'products' | 'services' | 'usps', item: string) => {
    const current = [...(data[field] || [])];
    if (current.includes(item)) {
      updateData({ [field]: current.filter((i: string) => i !== item) });
    } else {
      updateData({ [field]: [...current, item] });
    }
  };

  const toggleHighImpact = (product: string) => {
    const current = [...(data.highImpactProducts || [])];
    if (current.includes(product)) {
      updateData({ highImpactProducts: current.filter((p: string) => p !== product) });
    } else {
      updateData({ highImpactProducts: [...current, product] });
    }
  };

  const addCustomItem = (field: 'products' | 'services' | 'usps') => {
    if (!tempCustom.trim()) return;
    updateData({ [field]: [...(data[field] || []), tempCustom.trim()] });
    setTempCustom('');
    setCustomInputType(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight flex items-center gap-3">
          <Briefcase className="w-7 h-7 text-indigo-600" /> Step {getStepNumber(5)}: Business Mapping
        </h2>
        <p className="text-slate-500 font-medium">Classify your offerings for hyper-targeted design and branding.</p>
      </div>

      {/* Main & Sub Category Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Category</label>
          <select 
            value={data.mainCategory}
            onChange={(e) => updateData({ mainCategory: e.target.value, subCategory: '', products: [], usps: [], highImpactProducts: [] })}
            className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Category</option>
            {Object.keys(BUSINESS_HIERARCHY).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sub Category</label>
          <select 
            disabled={!data.mainCategory}
            value={data.subCategory}
            onChange={(e) => updateData({ subCategory: e.target.value, products: [], usps: [], highImpactProducts: [] })}
            className="w-full p-4 bg-slate-50 disabled:opacity-50 border-0 rounded-2xl font-bold text-slate-800 focus:ring-4 focus:ring-indigo-100 transition-all appearance-none cursor-pointer"
          >
            <option value="">Select Sub-Category</option>
            {subCategories.map((sub: any) => <option key={sub.name} value={sub.name}>{sub.name}</option>)}
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {data.subCategory && activeSub && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
            
            {/* Products Selection */}
            <div className="space-y-6 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center bg-indigo-50/50 -m-8 mb-8 p-8 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                   <Layers className="w-5 h-5 text-indigo-600" />
                   <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Main Products & Services</h3>
                </div>
                {!customInputType && (
                  <button onClick={() => setCustomInputType('products')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                    <Plus className="w-3 h-3" /> Add Custom
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {activeSub.products.map((p: any) => {
                  const isSelected = data.products.includes(p.name);
                  const isHighImpact = data.highImpactProducts.includes(p.name);
                  return (
                    <div key={p.name} className="flex items-center gap-1 group">
                      <button 
                        onClick={() => toggleItem('products', p.name)}
                        className={`px-5 py-3 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-3 ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-indigo-200'}`}
                      >
                        {p.name}
                        {p.highImpact && !isSelected && <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />}
                      </button>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.button 
                            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                            onClick={() => toggleHighImpact(p.name)}
                            className={`p-3 rounded-2xl border-2 transition-all ${isHighImpact ? 'border-amber-400 bg-amber-50 text-amber-500 shadow-md' : 'border-slate-100 bg-white text-slate-300 hover:text-amber-400'}`}
                            title="Highlight as High-Impact Offering"
                          >
                            <Star className={`w-5 h-5 ${isHighImpact ? 'fill-current' : ''}`} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                {/* Render Custom Entries */}
                {data.products.filter((p: string) => !activeSub.products.find((ap: any) => ap.name === p)).map((cp: string) => (
                   <div key={cp} className="flex items-center gap-2">
                     <div className="px-5 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-bold flex items-center gap-3">
                        {cp}
                        <button onClick={() => toggleItem('products', cp)} className="hover:text-rose-200 transition-colors"><X className="w-4 h-4" /></button>
                     </div>
                   </div>
                ))}
              </div>

              <AnimatePresence>
                {customInputType === 'products' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-8 overflow-hidden">
                    <div className="flex gap-4">
                      <input 
                        autoFocus
                        type="text" value={tempCustom} onChange={(e) => setTempCustom(e.target.value)}
                        placeholder="Type custom product/service..."
                        className="flex-1 p-4 bg-indigo-50 border-2 border-indigo-100 rounded-2xl font-bold text-indigo-900 outline-none focus:border-indigo-500 placeholder:text-indigo-300 transition-all"
                      />
                      <button onClick={() => addCustomItem('products')} className="px-6 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all">Apply</button>
                      <button onClick={() => { setCustomInputType(null); setTempCustom(''); }} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100"><X className="w-5 h-5" /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* USPs Selection */}
            <div className="space-y-6 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm border-dashed">
               <div className="flex justify-between items-center">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Unique Selling Points (USPs)</h3>
                  {!customInputType && (
                    <button onClick={() => setCustomInputType('usps')} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b-2 border-indigo-100 hover:border-indigo-600 transition-all">
                      + Add Custom USP
                    </button>
                  )}
               </div>
               <div className="flex flex-wrap gap-2 pt-2">
                  {activeSub.usps.map((usp: string) => (
                    <button
                      key={usp} onClick={() => toggleItem('usps', usp)}
                      className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${data.usps.includes(usp) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-300'}`}
                    >
                      {usp}
                    </button>
                  ))}
                  {data.usps.filter((u: string) => !activeSub.usps.includes(u)).map((cu: string) => (
                    <button key={cu} onClick={() => toggleItem('usps', cu)} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-2">
                      {cu} <X className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
               </div>
               
               <AnimatePresence>
                {customInputType === 'usps' && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-4 overflow-hidden">
                    <div className="flex gap-3">
                      <input 
                        autoFocus
                        type="text" value={tempCustom} onChange={(e) => setTempCustom(e.target.value)}
                        placeholder="Enter custom USP detail..."
                        className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs outline-none focus:border-indigo-500"
                      />
                      <button onClick={() => addCustomItem('usps')} className="px-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Add</button>
                      <button onClick={() => { setCustomInputType(null); setTempCustom(''); }} className="p-3 bg-slate-100 text-slate-400 rounded-xl"><X className="w-4 h-4" /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          disabled={!data.subCategory}
          className="group flex items-center gap-4 px-12 py-5 bg-indigo-600 disabled:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-3xl font-bold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest"
        >
          Check Strategy
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

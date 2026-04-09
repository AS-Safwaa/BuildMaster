import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';

export const Phase5 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();

  const businessCategories = [
    { id: 'Food', name: 'Food / Catering', sub: 'Cafe, Restaurant, Bakers' },
    { id: 'Healthcare', name: 'Healthcare', sub: 'Clinics, Doctors, Pharmacy' },
    { id: 'RealEstate', name: 'Real Estate', sub: 'Builders, Agents, Interior' },
    { id: 'Education', name: 'Education', sub: 'Tutors, Schools, Coaches' },
    { id: 'Retail', name: 'Retail / Shop', sub: 'Stores, Fashion, Gifts' },
    { id: 'Service', name: 'Other Services', sub: 'Legal, IT, CA, Beauty' },
    { id: 'Custom', name: 'Custom Industry', sub: 'Can\'t find yours? Add it here' }
  ];

  const updateList = (field: 'products' | 'services' | 'usps', idx: number, val: string) => {
    const next = [...(data[field] || [])];
    next[idx] = val;
    updateData({ [field]: next });
  };

  const addToList = (field: 'products' | 'services' | 'usps') => {
    updateData({ [field]: [...(data[field] || []), ''] });
  };

  const removeFromList = (field: 'products' | 'services' | 'usps', idx: number) => {
    const next = [...(data[field] || [])];
    next.splice(idx, 1);
    updateData({ [field]: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight leading-none">Step {getStepNumber(5)}: What do you do?</h2>
        <p className="text-base text-slate-500 font-medium font-sans opacity-95">Please pick your industry so we can set the right vibe.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Which Industry do you work in?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {businessCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateData({ mainCategory: cat.id })}
              className={`p-5 rounded-[1.5rem] border-2 transition-all text-left relative overflow-hidden group ${
                data.mainCategory === cat.id 
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                  : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'
              }`}
            >
              <h4 className="font-bold text-slate-800 text-sm mb-1">{cat.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{cat.sub}</p>
              {data.mainCategory === cat.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {data.mainCategory === 'Custom' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 overflow-hidden">
               <input 
                 type="text" placeholder="Enter your industry name" value={data.subCategory}
                 onChange={(e) => updateData({ subCategory: e.target.value })}
                 className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm shadow-sm"
               />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center justify-between">
            Products
            <button onClick={() => addToList('products')} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </h3>
          <div className="space-y-2">
            {data.products.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  type="text" placeholder="Product name" value={item}
                  onChange={(e) => updateList('products', idx, e.target.value)}
                  className="flex-1 p-3 bg-white border-2 border-slate-50 rounded-xl outline-none focus:border-blue-500 font-bold text-xs"
                />
                <button onClick={() => removeFromList('products', idx)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                   <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.products.length === 0 && <p className="text-xs text-slate-400 font-medium italic">No products added yet.</p>}
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center justify-between">
            Services
            <button onClick={() => addToList('services')} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </h3>
          <div className="space-y-2">
            {data.services.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  type="text" placeholder="Service name" value={item}
                  onChange={(e) => updateList('services', idx, e.target.value)}
                  className="flex-1 p-3 bg-white border-2 border-slate-50 rounded-xl outline-none focus:border-blue-500 font-bold text-xs"
                />
                <button onClick={() => removeFromList('services', idx)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                   <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.services.length === 0 && <p className="text-xs text-slate-400 font-medium italic">No services added yet.</p>}
          </div>
        </div>

        {/* USPs */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center justify-between">
            USPs
            <button onClick={() => addToList('usps')} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </h3>
          <div className="space-y-2">
            {data.usps.map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input 
                  type="text" placeholder="Unique Selling Point" value={item}
                  onChange={(e) => updateList('usps', idx, e.target.value)}
                  className="flex-1 p-3 bg-white border-2 border-slate-50 rounded-xl outline-none focus:border-blue-500 font-bold text-xs"
                />
                <button onClick={() => removeFromList('usps', idx)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                   <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.usps.length === 0 && <p className="text-xs text-slate-400 font-medium italic">No USPs added yet.</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-8">
        <button onClick={goToPrev} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          disabled={!data.mainCategory}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 disabled:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-3xl font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm"
        >
          Almost Done!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

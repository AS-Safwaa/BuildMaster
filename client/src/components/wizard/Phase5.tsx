import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const Phase5 = () => {
  const { data, updateData, setPhase } = useWizard();

  const businessCategories = [
    { id: 'Food', name: 'Food / Catering', sub: 'Cafe, Restaurant, Bakers' },
    { id: 'Healthcare', name: 'Healthcare', sub: 'Clinics, Doctors, Pharmacy' },
    { id: 'RealEstate', name: 'Real Estate', sub: 'Builders, Agents, Interior' },
    { id: 'Education', name: 'Education', sub: 'Tutors, Schools, Coaches' },
    { id: 'Retail', name: 'Retail / Shop', sub: 'Stores, Fashion, Gifts' },
    { id: 'Service', name: 'Other Services', sub: 'Legal, IT, CA, Beauty' }
  ];

  const subCategoriesData: Record<string, string[]> = {
    'Food': ['Restaurant', 'Street Food', 'Bakery', 'Catering Service'],
    'Healthcare': ['General Clinic', 'Specialist Doctor', 'Dental', 'Pharmacy'],
    'RealEstate': ['New Projects', 'Rent / Sell', 'Interior Design', 'Home Reno'],
    'Education': ['Private Tutor', 'Online Course', 'Pre-school', 'Coaching Center'],
    'Retail': ['Clothing', 'Grocery', 'Electronics', 'Footwear'],
    'Service': ['Salon / Spa', 'Legal Help', 'Tax / CA', 'AC / Home Repair']
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight leading-none">Step 5: What do you do?</h2>
        <p className="text-base text-slate-500 font-medium font-sans">Please pick your industry so we can set the right vibe.</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900">Which Industry do you work in?</h3>
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
              <h4 className="font-black text-slate-900 text-sm mb-1">{cat.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{cat.sub}</p>
              {data.mainCategory === cat.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {data.mainCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 pt-4 overflow-hidden"
          >
            <div className="space-y-4">
               <h3 className="text-lg font-black text-slate-900">What exactly is your specialty?</h3>
               <div className="flex flex-wrap gap-2">
                 {(subCategoriesData[data.mainCategory] || []).map(sub => (
                   <button
                      key={sub}
                      onClick={() => updateData({ subCategory: sub })}
                      className={`px-6 py-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                        data.subCategory === sub ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200 shadow-sm'
                      }`}
                   >
                     {sub}
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">Tell us more about what you offer</label>
               <textarea 
                 rows={3} placeholder="Example: We provide organic catering for weddings and small events..."
                 value={data.specialisation} onChange={(e) => updateData({ specialisation: e.target.value })}
                 className="w-full p-5 bg-white border-2 border-slate-50 rounded-3xl outline-none focus:border-blue-500 font-bold transition-all text-sm resize-none shadow-sm"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center pt-8">
        <button onClick={() => setPhase(4)} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={() => setPhase(6)}
          disabled={!data.mainCategory}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 disabled:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-3xl font-black shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm"
        >
          Almost Done!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

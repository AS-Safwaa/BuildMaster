import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../context/WizardContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const mockCategories = ["Healthcare", "Technology", "Retail", "Services", "Food & Beverage"];
const mockUSPs = ["24/7 Support", "Award Winning", "Eco-Friendly", "Fast Delivery", "Premium Quality"];

export const Phase2 = () => {
  const { data, updateData, setPhase } = useWizard();

  const toggleUSP = (usp: string) => {
    const current = new Set(data.usps);
    if (current.has(usp)) current.delete(usp);
    else current.add(usp);
    updateData({ usps: Array.from(current) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl space-y-8"
    >
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Business Context</h2>
        <p className="text-slate-500">Help us understand your niche and what makes you unique.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Select Main Category (Fetched from admin master)</label>
          <select 
            value={data.category} 
            onChange={(e) => updateData({ category: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">Choose a category...</option>
            {mockCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-slate-700 block">Unique Selling Points (Select multiple)</label>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {mockUSPs.map(usp => (
              <button
                key={usp}
                onClick={() => toggleUSP(usp)}
                className={`p-3 border rounded-xl text-sm font-medium transition-all text-left ${
                  data.usps.includes(usp) 
                  ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-[0_0_0_1px_#2563eb]' 
                  : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {usp}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-8 border-t border-slate-100">
        <button 
          onClick={() => setPhase(1)}
          className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button 
          onClick={() => setPhase(3)}
          className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Brand Tagline <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </motion.div>
  );
};

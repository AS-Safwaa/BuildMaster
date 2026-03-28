import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../context/WizardContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const Phase1 = () => {
  const { data, updateData, setPhase } = useWizard();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl space-y-8"
    >
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Business Essentials</h2>
        <p className="text-slate-500">Let's start with the core identity of your venture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Business Name *</label>
          <input 
            type="text" placeholder="e.g. HeartCare Advanced Clinic"
            value={data.businessName} onChange={(e) => updateData({ businessName: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Years of Establishment</label>
          <input 
            type="number" placeholder="YYYY"
            value={data.establishmentYear} onChange={(e) => updateData({ establishmentYear: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Primary Contact Email *</label>
          <input 
            type="email" placeholder="hello@yourbusiness.com"
            value={data.email} onChange={(e) => updateData({ email: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
          />
        </div>
      </div>

      <hr className="border-slate-200" />

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Domain & Hosting (Section 1A)</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="radio" name="domain" className="w-5 h-5 text-blue-600 focus:ring-blue-500" 
              onChange={() => updateData({ domainConfig: 'existing' })} 
              checked={data.domainConfig === 'existing'} />
            <span className="font-medium text-slate-700">I already have a domain</span>
          </label>
          
          <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="radio" name="domain" className="w-5 h-5 text-blue-600 focus:ring-blue-500" 
              onChange={() => updateData({ domainConfig: 'need_help' })}
              checked={data.domainConfig === 'need_help'} />
            <span className="font-medium text-slate-700">No, I need help to create one</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-8">
        <button 
          onClick={() => setPhase(2)}
          className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Continue to Context <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </motion.div>
  );
};

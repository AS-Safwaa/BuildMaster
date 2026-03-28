import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, UserPlus, Send } from 'lucide-react';

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
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Project Initialization</h2>
        <p className="text-slate-500">How did you hear about us, and what is your core identity?</p>
      </div>

      {/* Lead Source */}
      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
        <label className="text-sm font-bold text-slate-800 block mb-4">Are you starting this for yourself, or were you referred by our team/partner?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => updateData({ leadSource: 'self' })}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${data.leadSource === 'self' ? 'border-blue-600 bg-white shadow-md' : 'border-slate-200 bg-white opacity-70 hover:opacity-100'}`}
          >
            <UserPlus className={`w-5 h-5 ${data.leadSource === 'self' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="font-semibold text-slate-700">Starting for myself</span>
          </button>
          <button 
            onClick={() => updateData({ leadSource: 'referral' })}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${data.leadSource === 'referral' ? 'border-blue-600 bg-white shadow-md' : 'border-slate-200 bg-white opacity-70 hover:opacity-100'}`}
          >
            <Send className={`w-5 h-5 ${data.leadSource === 'referral' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span className="font-semibold text-slate-700">I was referred</span>
          </button>
        </div>
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

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Contact Person Name *</label>
          <input 
            type="text" placeholder="John Doe"
            value={data.contactName} onChange={(e) => updateData({ contactName: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Contact Phone *</label>
          <input 
            type="tel" placeholder="+1 (555) 000-0000"
            value={data.phone} onChange={(e) => updateData({ phone: e.target.value })}
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

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-slate-700">Full Business Address</label>
          <textarea 
            placeholder="Street Address, City, State, Country"
            rows={2}
            value={data.address} onChange={(e) => updateData({ address: e.target.value })}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none" 
          />
        </div>
      </div>

      <hr className="border-slate-200" />

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Domain Selection</h3>
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

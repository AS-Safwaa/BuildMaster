import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, UserPlus, Send, Handshake } from 'lucide-react';

import { useLocation } from 'react-router-dom';

export const Phase1 = () => {
  const { data, updateData, setPhase } = useWizard();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state?.leadSource && !data.leadSource) {
      updateData({ leadSource: location.state.leadSource });
    }
  }, [location.state]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl space-y-10 pb-20"
    >
      <div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Project Initialization</h2>
        <p className="text-lg text-slate-500">Let's start with your core identity and contact details.</p>
      </div>

      {data.leadSource === 'referral' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-8 rounded-3xl relative overflow-hidden shadow-sm"
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Handshake className="w-32 h-32 text-purple-600" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Handshake className="w-6 h-6 text-purple-600" /> Referrer Details
          </h3>
          <p className="text-sm text-slate-600 mb-6">Since you were referred to us, please provide the details of the person or agency that sent you. We want to thank them!</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Referrer Name *</label>
              <input 
                type="text" placeholder="e.g. Jane Smith"
                value={data.referrerName} onChange={(e) => updateData({ referrerName: e.target.value })}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Referrer Company</label>
              <input 
                type="text" placeholder="e.g. Acme Agency (Optional)"
                value={data.referrerCompany} onChange={(e) => updateData({ referrerCompany: e.target.value })}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Referrer Email</label>
              <input 
                type="email" placeholder="jane.smith@agency.com"
                value={data.referrerEmail} onChange={(e) => updateData({ referrerEmail: e.target.value })}
                className="w-full p-4 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 shadow-sm" 
              />
            </div>
          </div>
        </motion.div>
      )}

      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Your Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Business Name *</label>
            <input 
              type="text" placeholder="e.g. HeartCare Advanced Clinic"
              value={data.businessName} onChange={(e) => updateData({ businessName: e.target.value })}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Years of Establishment</label>
            <input 
              type="number" placeholder="YYYY"
              value={data.establishmentYear} onChange={(e) => updateData({ establishmentYear: e.target.value })}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Contact Person Name *</label>
            <input 
              type="text" placeholder="John Doe"
              value={data.contactName} onChange={(e) => updateData({ contactName: e.target.value })}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Contact Phone *</label>
            <input 
              type="tel" placeholder="+1 (555) 000-0000"
              value={data.phone} onChange={(e) => updateData({ phone: e.target.value })}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow" 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Primary Contact Email *</label>
            <input 
              type="email" placeholder="hello@yourbusiness.com"
              value={data.email} onChange={(e) => updateData({ email: e.target.value })}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-shadow" 
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Full Business Address</label>
            <textarea 
              placeholder="Street Address, City, State, Country"
              rows={2}
              value={data.address} onChange={(e) => updateData({ address: e.target.value })}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none transition-shadow" 
            />
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-6">Domain Selection</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-4 p-5 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
            <input type="radio" name="domain" className="w-5 h-5 text-blue-600 focus:ring-blue-500" 
              onChange={() => updateData({ domainConfig: 'existing' })} 
              checked={data.domainConfig === 'existing'} />
            <span className="font-bold text-slate-700 text-lg">I already have a domain</span>
          </label>
          
          <label className="flex items-center gap-4 p-5 border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all">
            <input type="radio" name="domain" className="w-5 h-5 text-blue-600 focus:ring-blue-500" 
              onChange={() => updateData({ domainConfig: 'need_help' })}
              checked={data.domainConfig === 'need_help'} />
            <span className="font-bold text-slate-700 text-lg">No, I need help to create one</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-10">
        <button 
          onClick={() => setPhase(2)}
          className="group flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all"
        >
          Continue to Context <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </motion.div>
  );
};

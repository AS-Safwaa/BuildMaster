import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Globe, Server, Mail, Phone, MessageCircle, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';

export const Phase4 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();

  const BooleanToggle = ({ label, sub, value, onChange, icon }: any) => (
    <div className="flex items-center justify-between p-5 bg-white rounded-3xl border-2 border-slate-50 hover:border-slate-200 transition-all cursor-pointer shadow-sm group" onClick={() => onChange(!value)}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${value ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
          {icon}
        </div>
        <div className="text-left">
          <p className="font-bold text-slate-800 text-sm leading-none mb-1">{label}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${value ? 'bg-blue-600' : 'bg-slate-200'}`}>
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${value ? 'right-1' : 'left-1'}`} />
      </div>
    </div>
  );

  const addCustomFeature = () => updateData({ customFeatures: [...data.customFeatures, ''] });
  const updateCustomFeature = (idx: number, val: string) => {
    const next = [...data.customFeatures];
    next[idx] = val;
    updateData({ customFeatures: next });
  };
  const removeCustomFeature = (idx: number) => {
    const next = [...data.customFeatures];
    next.splice(idx, 1);
    updateData({ customFeatures: next });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight leading-none text-balance font-sans">Step {getStepNumber(4)}: Your Website Name</h2>
        <p className="text-base text-slate-500 font-medium font-sans opacity-95">Do you already have a name like www.business.com?</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
           <Globe className="w-5 h-5 text-blue-600" /> Website Name (Domain)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: true, label: 'Yes, I bought one', sub: 'I already have the name' },
            { id: false, label: 'No, I need a name', sub: 'Help me pick/buy one' }
          ].map((opt) => (
            <button
              key={opt.label} 
              onClick={() => {
                if (data.hasDomain === opt.id) updateData({ hasDomain: null });
                else updateData({ hasDomain: opt.id });
              }}
              className={`p-6 rounded-[1.5rem] border-2 transition-all text-left ${
                data.hasDomain === opt.id ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50/50 shadow-sm' : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'
              }`}
            >
              <p className="font-bold text-slate-800 text-sm mb-1">{opt.label}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{opt.sub}</p>
            </button>
          ))}
        </div>
        
        <AnimatePresence>
          {data.hasDomain && (
             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 overflow-hidden">
                <input 
                  type="text" placeholder="e.g. www.myshop.com" value={data.preferredDomain}
                  onChange={(e) => updateData({ preferredDomain: e.target.value })}
                  className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm shadow-sm" 
                />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 font-sans">
          <Server className="w-5 h-5 text-purple-600" /> The "Technical House" (Hosting)
        </h3>
        <p className="text-sm text-slate-500 font-medium tracking-tight font-sans">Where should we keep your website files?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: true, label: 'I have my own', sub: 'I will handle it' },
            { id: false, label: 'You handle it', sub: 'Keep it easy for me' }
          ].map((opt) => (
            <button
              key={opt.label} 
              onClick={() => {
                if (data.hasHosting === opt.id) updateData({ hasHosting: null });
                else updateData({ hasHosting: opt.id });
              }}
              className={`p-6 rounded-[1.5rem] border-2 transition-all text-left ${
                data.hasHosting === opt.id ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-50/50 shadow-sm' : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'
              }`}
            >
              <p className="font-bold text-slate-800 text-sm mb-1">{opt.label}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
           <Mail className="w-5 h-5 text-indigo-500" /> Features for your customers
        </h3>
        <p className="text-sm text-slate-500 font-medium font-sans">Which buttons should we put on your website?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <BooleanToggle label="Direct Call Button" sub="Let customers call you easily" value={data.callNowToggle} onChange={(v: boolean) => updateData({ callNowToggle: v })} icon={<Phone className="w-5 h-5" />} />
           <BooleanToggle label="WhatsApp Button" sub="Chat with customers instantly" value={data.whatsappToggle} onChange={(v: boolean) => updateData({ whatsappToggle: v })} icon={<MessageCircle className="w-5 h-5" />} />
           <BooleanToggle label="Message Box" sub="Receive emails from website" value={data.contactFormToggle} onChange={(v: boolean) => updateData({ contactFormToggle: v })} icon={<Mail className="w-5 h-5" />} />
           
           <div className="flex flex-col gap-3 p-5 bg-white rounded-3xl border-2 border-slate-50 hover:border-slate-200 transition-all shadow-sm">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Plus className="w-5 h-5" />
                   </div>
                   <p className="font-bold text-slate-800 text-sm leading-none">Custom Feature</p>
                </div>
                <button onClick={addCustomFeature} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                   <Plus className="w-4 h-4" />
                </button>
             </div>
             
             <AnimatePresence>
               {data.customFeatures.length > 0 && (
                 <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="space-y-2 overflow-hidden">
                   {data.customFeatures.map((feat, idx) => (
                     <div key={idx} className="flex gap-2">
                       <input 
                         type="text" placeholder="e.g. Online Booking, Payment, etc." value={feat}
                         onChange={(e) => updateCustomFeature(idx, e.target.value)}
                         className="flex-1 p-3 bg-slate-50 border-0 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-xs"
                       />
                       <button onClick={() => removeCustomFeature(idx)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">
                          <X className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-10">
        <button onClick={goToPrev} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm shadow-sm font-sans">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-3xl font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm font-sans"
        >
          Next Step!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

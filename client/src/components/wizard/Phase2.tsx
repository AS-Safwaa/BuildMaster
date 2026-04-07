import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

export const Phase2 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Step {getStepNumber(2)}: About Your Business</h2>
        <p className="text-base text-slate-500 font-medium">Please tell us the basic details so we can set up your profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
            Business Name <span className="text-rose-400">*</span>
          </label>
          <input 
            type="text" placeholder="e.g. SR FoodKraft"
            value={data.businessName} onChange={(e) => updateData({ businessName: e.target.value })}
            className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm md:text-base" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
            When did you start?
          </label>
          <input 
            type="text" placeholder="Year (e.g. 2015)"
            value={data.establishmentYear} onChange={(e) => updateData({ establishmentYear: e.target.value })}
            className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm md:text-base" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
            Owner / Manager Name <span className="text-rose-400">*</span>
          </label>
          <input 
            type="text" placeholder="Your full name"
            value={data.contactName} onChange={(e) => updateData({ contactName: e.target.value })}
            className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm md:text-base" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
            Mobile Number <span className="text-rose-400">*</span>
          </label>
          <input 
            type="tel" placeholder="10-digit number"
            value={data.phone} onChange={(e) => updateData({ phone: e.target.value })}
            className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm md:text-base" 
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-2">
            Where do you work? (Area / City)
          </label>
          <input 
            type="text" placeholder="e.g. Mumbai, Navi Mumbai, etc."
            value={data.serviceAreas} onChange={(e) => updateData({ serviceAreas: e.target.value })}
            className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm md:text-base" 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm tracking-tight leading-none mb-1">Your Full Address</p>
            <p className="font-bold text-slate-800 text-sm tracking-tight leading-none mb-1">Your Full Address</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Help people find your shop/office</p>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <input type="text" placeholder="Building / Shop No." value={data.addressLine1} onChange={(e) => updateData({ addressLine1: e.target.value })} className="w-full p-4 bg-slate-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold" />
          <input type="text" placeholder="Street / Road Name" value={data.addressLine2} onChange={(e) => updateData({ addressLine2: e.target.value })} className="w-full p-4 bg-slate-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold" />
          <input type="text" placeholder="Area / Colony" value={data.area} onChange={(e) => updateData({ area: e.target.value })} className="w-full p-4 bg-slate-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold" />
          <input type="text" placeholder="City" value={data.city} onChange={(e) => updateData({ city: e.target.value })} className="w-full p-4 bg-slate-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold" />
          <input type="text" placeholder="State" value={data.state} onChange={(e) => updateData({ state: e.target.value })} className="w-full p-4 bg-slate-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold" />
          <input type="text" placeholder="Pincode" value={data.pincode} onChange={(e) => updateData({ pincode: e.target.value })} className="w-full p-4 bg-slate-50 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold" />
        </div>
      </div>

      <div className="flex justify-between items-center pt-10">
        <button onClick={goToPrev} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          disabled={!data.businessName || !data.contactName || !data.phone}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 disabled:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-3xl font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm"
        >
          Next Step
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

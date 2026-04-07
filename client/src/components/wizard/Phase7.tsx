import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Camera, Image as ImageIcon, Users, Star, Share2, ArrowRight, ArrowLeft } from 'lucide-react';

export const Phase7 = () => {
  const { data, updateData, goToNext, goToPrev } = useWizard();

  const BooleanToggle = ({ label, value, onChange, icon }: any) => (
    <div className="flex items-center justify-between p-6 bg-white rounded-3xl border-2 border-slate-50 hover:border-slate-200 shadow-sm transition-all cursor-pointer" onClick={() => onChange(!value)}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${value ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
          {icon}
        </div>
        <div className="text-left">
          <p className="font-bold text-slate-800 text-sm tracking-tight leading-none mb-1">{label}</p>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 leading-none">{value ? 'Active' : 'Not Active'}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-all duration-300 ${value ? 'bg-blue-600' : 'bg-slate-200'}`}>
        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${value ? 'right-1' : 'left-1'}`} />
      </div>
    </div>
  );

  const SocialInput = ({ platform, value, onChange }: any) => (
    <div className="space-y-1">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{platform}</label>
      <input 
        type="text" placeholder={`www.${platform.toLowerCase()}.com/yourname`} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-10 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight leading-none">Step 7: Photos & Social Links</h2>
        <p className="text-base text-slate-500 font-medium">Let's gather some beautiful pictures and your social links.</p>
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
           <Camera className="w-5 h-5 text-blue-600" /> Business Photos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
           <BooleanToggle label="I have my own photos" value={data.businessPhotosStatus} onChange={(v: boolean) => updateData({ businessPhotosStatus: v })} icon={<ImageIcon className="w-5 h-5" />} />
           <BooleanToggle label="Use generic photos" value={data.genericImagesToggle} onChange={(v: boolean) => updateData({ genericImagesToggle: v })} icon={<ImageIcon className="w-5 h-5" />} />
        </div>
        
        <AnimatePresence>
          {data.businessPhotosStatus && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-3 bg-white p-6 rounded-3xl border-2 border-blue-50 shadow-sm">
                <p className="text-sm font-bold text-slate-600">Link to Google Drive / iCloud / Photos</p>
                <input 
                  type="text" placeholder="Paste link here..." value={data.driveLink}
                  onChange={(e) => updateData({ driveLink: e.target.value })}
                  className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm"
                />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         <BooleanToggle label="Show my team members" value={data.teamMembersToggle} onChange={(v: boolean) => updateData({ teamMembersToggle: v })} icon={<Users className="w-5 h-5" />} />
         <BooleanToggle label="Show customer reviews" value={data.testimonialsToggle} onChange={(v: boolean) => updateData({ testimonialsToggle: v })} icon={<Star className="w-5 h-5" />} />
      </div>

      <div className="space-y-5">
        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
           <Share2 className="w-5 h-5 text-indigo-500" /> Social Links
        </h3>
        <p className="text-sm text-slate-500 font-medium">Link your Facebook, Instagram, or others.</p>
        <BooleanToggle label="Yes, link my social accounts" value={data.socialMediaToggle} onChange={(v: boolean) => updateData({ socialMediaToggle: v })} icon={<Share2 className="w-5 h-5" />} />
        
        <AnimatePresence>
          {data.socialMediaToggle && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden pt-2">
               {['Instagram', 'Facebook', 'LinkedIn'].map(plat => (
                 <SocialInput 
                   key={plat} platform={plat} value={data.socialLinks[plat] || ''}
                   onChange={(val: string) => updateData({ socialLinks: { ...data.socialLinks, [plat]: val } })}
                 />
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center pt-10">
        <button onClick={goToPrev} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-4 px-10 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm"
        >
          Check and Finish!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { 
  Camera, Image as ImageIcon, Users, Star, Share2, 
  ArrowRight, ArrowLeft, Plus, X, Globe, UserPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Phase7 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();
  const [isFetchingTeam, setIsFetchingTeam] = useState(false);

  const photoOptions = [
    { id: 'office', label: 'Office/Site Photos', icon: <ImageIcon /> },
    { id: 'products', label: 'Product Highlights', icon: <Camera /> },
    { id: 'team', label: 'Team in Action', icon: <Users /> },
    { id: 'stock', label: 'Generic Stock', icon: <Globe /> }
  ];

  const handleFetchTeam = () => {
    setIsFetchingTeam(true);
    // Simulate API fetch
    setTimeout(() => {
      const mockTeam = [
        { name: 'Rahul Sharma', role: 'Founder & Head Chef' },
        { name: 'Priya Das', role: 'Operations Manager' }
      ];
      updateData({ teamMembersData: mockTeam, teamMembersToggle: true });
      setIsFetchingTeam(false);
      toast.success('Team details synced from profile!');
    }, 1500);
  };

  const addSocialAccount = () => {
    updateData({ socialAccounts: [...data.socialAccounts, { platform: '', url: '' }] });
  };

  const updateSocialAccount = (idx: number, field: string, val: string) => {
    const next = [...data.socialAccounts];
    next[idx] = { ...next[idx], [field]: val };
    updateData({ socialAccounts: next });
  };

  const removeSocialAccount = (idx: number) => {
    const next = [...data.socialAccounts];
    next.splice(idx, 1);
    updateData({ socialAccounts: next });
  };

  const addTestimonial = () => {
    updateData({ testimonials: [...data.testimonials, ''] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Step {getStepNumber(7)}: Media & Trust</h2>
        <p className="text-slate-500 font-medium">Add human elements and social proof to build massive trust.</p>
      </div>

      {/* Media Selection (Single) */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
           <ImageIcon className="w-5 h-5 text-indigo-600" /> Primary Business Photos
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {photoOptions.map((opt) => (
             <button
               key={opt.id}
               onClick={() => updateData({ heroImagePreference: opt.id })}
               className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${data.heroImagePreference === opt.id ? 'border-indigo-600 bg-indigo-50 shadow-md ring-4 ring-indigo-50/50' : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'}`}
             >
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data.heroImagePreference === opt.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                 {opt.icon}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{opt.label}</span>
             </button>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm space-y-6">
         <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <Users className="w-6 h-6 text-blue-600" />
               <h3 className="text-lg font-bold text-slate-900">Team Presence</h3>
            </div>
            <button 
              onClick={handleFetchTeam}
              disabled={isFetchingTeam}
              className={`flex items-center gap-2 px-4 py-2 border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all ${isFetchingTeam ? 'opacity-50' : ''}`}
            >
               {isFetchingTeam ? 'Fetching...' : <><UserPlus className="w-4 h-4" /> Autofill Team</>}
            </button>
         </div>
         
         {data.teamMembersData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
               {data.teamMembersData.map((m, i) => (
                 <div key={i} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{m.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.role}</p>
                    </div>
                    <button onClick={() => {
                        const next = [...data.teamMembersData];
                        next.splice(i, 1);
                        updateData({ teamMembersData: next });
                    }} className="text-slate-300 hover:text-rose-500 transition-colors"><X className="w-4 h-4" /></button>
                 </div>
               ))}
            </div>
         )}
      </div>

      {/* Reviews Section */}
      <div className="space-y-6 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Star className="w-6 h-6 text-amber-500" />
               <h3 className="text-lg font-bold text-slate-900">Customer Proof</h3>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Include Reviews?</span>
               <button 
                 onClick={() => updateData({ includeReviews: !data.includeReviews })}
                 className={`w-12 h-6 rounded-full relative transition-all ${data.includeReviews ? 'bg-indigo-600' : 'bg-slate-200'}`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${data.includeReviews ? 'right-1' : 'left-1'}`} />
               </button>
            </div>
         </div>

         <AnimatePresence>
            {data.includeReviews && (
               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Approx. Reviews Count</label>
                        <input 
                           type="text" placeholder="e.g. 50+" value={data.reviewsCount}
                           onChange={(e) => updateData({ reviewsCount: e.target.value })}
                           className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Source</label>
                        <select 
                           value={data.reviewsSource}
                           onChange={(e) => updateData({ reviewsSource: e.target.value })}
                           className="w-full p-4 bg-slate-50 border-0 rounded-2xl font-bold text-sm appearance-none"
                        >
                           <option value="">Select Platform</option>
                           <option value="Google">Google Maps</option>
                           <option value="Trustpilot">Trustpilot</option>
                           <option value="JustDial">JustDial</option>
                           <option value="Other">Other Platform</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Highlighted Testimonial</label>
                        <button onClick={addTestimonial} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">+ Add More</button>
                     </div>
                     {data.testimonials.map((t, i) => (
                        <div key={i} className="relative group">
                           <textarea 
                              placeholder="Paste a glowing review from your customer here..."
                              value={t} onChange={(e) => {
                                const next = [...data.testimonials];
                                next[i] = e.target.value;
                                updateData({ testimonials: next });
                              }}
                              className="w-full p-5 bg-slate-50 border-0 rounded-2xl font-medium text-sm min-h-[100px] outline-none focus:ring-4 focus:ring-indigo-100 transition-all"
                           />
                           <button onClick={() => {
                              const next = [...data.testimonials];
                              next.splice(i, 1);
                              updateData({ testimonials: next });
                           }} className="absolute top-4 right-4 p-2 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4" /></button>
                        </div>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Social Media Accounts */}
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100/50">
           <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-bold text-slate-900">Social Synergy</h3>
           </div>
           <button onClick={addSocialAccount} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95">
              <Plus className="w-4 h-4" /> Add Profile
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {data.socialAccounts.map((acc, i) => (
             <div key={i} className="p-6 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm space-y-4 group relative">
                <button onClick={() => removeSocialAccount(i)} className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><X className="w-4 h-4" /></button>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform</label>
                      <input 
                         type="text" placeholder="e.g. Instagram" value={acc.platform}
                         onChange={(e) => updateSocialAccount(i, 'platform', e.target.value)}
                         className="w-full p-3 bg-slate-50 border-0 rounded-xl font-bold text-xs"
                      />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">URL / Link</label>
                      <input 
                         type="text" placeholder="link.co/..." value={acc.url}
                         onChange={(e) => updateSocialAccount(i, 'url', e.target.value)}
                         className="w-full p-3 bg-slate-50 border-0 rounded-xl font-bold text-xs"
                      />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-6 px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest"
        >
          Check and Finish!
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

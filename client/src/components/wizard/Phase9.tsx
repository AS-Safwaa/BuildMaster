import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { 
  CheckCircle2, Rocket, ArrowLeft, Loader2, Edit2, 
  ShieldCheck as Shield, Briefcase as Case, Palette as Paint, 
  Globe as Web, Zap as Fast, Camera as Photo, Check, ClipboardCheck, X, Heart
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

export const Phase9 = () => {
  const { data, goToPrev, setPhase } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    // Prototype Mode Simulation
    const { IS_PROTOTYPE } = await import('../../config/prototype');

    if (IS_PROTOTYPE) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitted(true);
        toast.success("Design Vision Locked! 🔐");
        setIsSubmitting(false);
        return;
    }

    try {
      const sessionId = `guest_${Date.now()}`;
      await axios.post(`${API_BASE_URL}/guest/submissions`, {
        session_id: sessionId,
        business_name: data.businessName,
        contact_phone: data.phone,
        answers: data
      });

      setSubmitted(true);
      toast.success("Success! We have the details, we'll start working!");
    } catch (error) {
      console.error(error);
      toast.error("Oops! Something went wrong while sending.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 max-w-xl mx-auto px-4">
        <div className="w-24 h-24 bg-indigo-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/10">
          <Rocket className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Vison Captured! 🚀</h2>
        <p className="text-lg text-slate-600 mb-12 font-medium font-sans leading-relaxed">
          Your project blueprint has been securely transmitted. Our design engineers are already analyzing your requirements!
        </p>
        <button onClick={() => navigate('/')} className="px-12 py-5 bg-indigo-600 text-white font-black rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  const Section = ({ title, icon, phase, children }: any) => (
    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mb-8 group hover:border-indigo-200 transition-all">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-sm">
            {icon}
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
        </div>
        <button onClick={() => setPhase(phase)} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-indigo-600 transition-all active:scale-95 shadow-sm">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
        {children}
      </div>
    </div>
  );

  const Entry = ({ label, value, highlight }: any) => (
    <div className="space-y-1">
       <div className="flex items-center gap-2">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
         {highlight && <div className="p-1 bg-amber-50 text-amber-500 rounded-md"><Fast className="w-2.5 h-2.5" /></div>}
       </div>
       <div className="font-bold text-slate-700 text-sm leading-snug">
         {Array.isArray(value) ? (
           <div className="flex flex-wrap gap-1.5 mt-1">
             {value.length > 0 ? value.map((v, i) => (
               <span key={i} className="px-2 py-1 bg-slate-100 rounded-md text-[10px] text-slate-600 border border-slate-200">{v}</span>
             )) : <span className="text-slate-300 italic">None</span>}
           </div>
         ) : (
          value || <span className="text-slate-300 italic">Not Added</span>
         )}
       </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pb-20 px-4"
    >
      <div className="text-center md:text-left mb-10">
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">The Big Reveal</h2>
        <p className="text-slate-500 font-medium font-sans">Verify your brand blueprint before it starts moving into production.</p>
      </div>

      <Section title="Brand Identity" icon={<Shield className="w-5 h-5"/>} phase={1}>
        <Entry label="Business Name" value={data.businessName} />
        <Entry label="Contact Phone" value={data.phone} />
        <Entry label="Contact Email" value={data.email} />
        <Entry label="City/Region" value={data.city} />
      </Section>

      <Section title="Product Ecosystem" icon={<Case className="w-5 h-5"/>} phase={5}>
        <Entry label="Classification" value={`${data.mainCategory} > ${data.subCategory}`} />
        <Entry label="Core Offerings" value={data.products} />
        <Entry label="High-Impact" value={data.highImpactProducts} highlight />
        <Entry label="Core USPs" value={data.usps} />
      </Section>

      <Section title="Digital Strategy" icon={<Web className="w-5 h-5"/>} phase={6}>
        <Entry label="Visual Theme" value={data.websiteStyle} />
        <Entry label="Preferred Example" value={data.preferredWebsite} />
        <Entry label="Competitor Benchmark" value={data.competitorWebsite} />
        <Entry label="Style Inspiration" value={data.inspiredWebsite} />
      </Section>

      <Section title="Trust Elements" icon={<Photo className="w-5 h-5"/>} phase={7}>
        <Entry label="Team Data" value={data.teamMembersData.map(m => `${m.name} (${m.role})`)} />
        <Entry label="Review Source" value={data.includeReviews ? `${data.reviewsSource} (${data.reviewsCount})` : 'Skipped'} />
        <Entry label="Social Synergy" value={data.socialAccounts.map(a => a.platform)} />
      </Section>

      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-200 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-all text-xs uppercase tracking-widest shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={() => setShowChecklist(true)} 
          className="group flex items-center gap-6 px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black shadow-2xl hover:shadow-indigo-500/20 hover:bg-indigo-600 hover:-translate-y-1 transition-all text-sm uppercase tracking-widest"
        >
          Check and Submit!
          <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Submission Checklist Modal */}
      <AnimatePresence>
        {showChecklist && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 text-center relative">
                 <button onClick={() => setShowChecklist(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><X className="w-6 h-6" /></button>
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <ClipboardCheck className="w-10 h-10" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">One Final Check</h3>
                 <p className="text-slate-500 font-medium mb-10 leading-relaxed px-4">Before we lock in your design vision, let's verify these critical links exist.</p>
                 
                 <div className="space-y-4 mb-10 text-left max-w-sm mx-auto">
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 ring-4 ring-slate-50/50">
                       <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"><Check className="w-5 h-5" /></div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Logo Identity</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.businessName} Assets Linked</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 ring-4 ring-slate-50/50">
                       <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"><Check className="w-5 h-5" /></div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Website Reference</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.preferredWebsite ? 'Benchmarked' : 'Stylized'}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 ring-4 ring-slate-50/50">
                       <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center animate-bounce shadow-lg shadow-indigo-500/20"><Heart className="w-5 h-5" /></div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">Ready to build?</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Everything looks perfect</p>
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full py-6 bg-indigo-600 disabled:bg-slate-300 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-4"
                 >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                    {isSubmitting ? 'Igniting Engines...' : 'Lauch My Project'}
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

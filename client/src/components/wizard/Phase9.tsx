import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { 
  Rocket, ArrowLeft, Loader2, Edit2, 
  ShieldCheck as Shield, Briefcase as Case, 
  Globe as Web, Camera as Photo, Check, ClipboardCheck, X, Star
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
        const { IS_PROTOTYPE } = await import('../../config/prototype');

        if (IS_PROTOTYPE) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitted(true);
            toast.success("Design Vision Locked! 🔐");
            setIsSubmitting(false);
            return;
        }

        try {
            // 1. Initialize Submission Session
            const startRes = await axios.post(`${API_BASE_URL}/guest/submissions`);
            const { session_id } = startRes.data;

            // 2. Persist Large Data Blob (Relational Harvesting Source)
            await axios.put(`${API_BASE_URL}/guest/submissions/${session_id}/answers`, {
                answers: [{ question_id: 999, answer_value: data }]
            });

            // 3. Complete and Trigger Realtime Harvesting
            await axios.post(`${API_BASE_URL}/guest/submissions/${session_id}/complete`, {
                business_name: data.businessName,
                contact_email: data.email,
                contact_phone: data.phone
            });

            setSubmitted(true);
            toast.success("Success! We have the details, we'll start working!");
        } catch (error) {
            console.error("Submission Sequence Error:", error);
            toast.error("Oops! Something went wrong while sending.");
        } finally {
            setIsSubmitting(false);
        }
    };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 max-w-2xl mx-auto px-4">
        <div className="w-32 h-32 bg-indigo-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-[0_20px_50px_rgba(79,70,229,0.3)] animate-bounce">
          <Rocket className="w-16 h-16 text-white" />
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Mission Launched!</h2>
        <p className="text-xl text-slate-500 mb-12 font-medium font-sans leading-relaxed max-w-lg mx-auto">
          Your brand vision is now circulating through our creative engine. We've archived every detail to build your perfect digital presence.
        </p>
        <div className="flex flex-col items-center gap-6">
            <button onClick={() => navigate('/')} className="px-16 py-6 bg-slate-900 text-white font-black rounded-[2.5rem] shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all uppercase tracking-widest text-sm">
                Take me to Dashboard
            </button>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Estimated Review: 24-48 Hours</p>
        </div>
      </motion.div>
    );
  }

  const Section = ({ title, icon, phase, color, children }: any) => (
    <div className="bg-white rounded-[3rem] border-4 border-slate-50 shadow-xl overflow-hidden mb-10 group hover:border-indigo-100 transition-all">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${color} text-white flex items-center justify-center shadow-lg`}>
            {icon}
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
        </div>
        <button onClick={() => setPhase(phase)} className="w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-500 text-slate-400 hover:text-indigo-600 transition-all active:scale-95 flex items-center justify-center">
          <Edit2 className="w-5 h-5" />
        </button>
      </div>
      <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
        {children}
      </div>
    </div>
  );

  const Entry = ({ label, value, highlight }: any) => (
    <div className="space-y-2">
       <div className="flex items-center gap-2">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
         {highlight && <Star className="w-3 h-3 text-amber-500 fill-current" />}
       </div>
       <div className="font-bold text-slate-900 text-base leading-snug">
         {Array.isArray(value) ? (
           <div className="flex flex-wrap gap-2 mt-2">
             {value.length > 0 ? value.map((v, i) => (
               <span key={i} className="px-3 py-1.5 bg-indigo-50 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100">{v}</span>
             )) : <span className="text-slate-200 italic font-medium">None</span>}
           </div>
         ) : (
          value || <span className="text-slate-200 italic font-medium">Not Provided</span>
         )}
       </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
      className="pb-20"
    >
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">The Big Reveal</h2>
        <p className="text-lg text-slate-500 font-medium font-sans mx-auto max-w-md">Every detail is captured. Confirm your blueprint and let's bring it to life.</p>
      </div>

      <Section title="Foundation" icon={<Shield className="w-6 h-6"/>} phase={1} color="bg-blue-600">
        <Entry label="Venture Name" value={data.businessName} />
        <Entry label="Primary Mobile" value={data.phone} />
        <Entry label="Digital Mail" value={data.email} />
        <Entry label="Operation Hub" value={data.city} />
      </Section>

      <Section title="The Engine" icon={<Case className="w-6 h-6"/>} phase={5} color="bg-indigo-600">
        <Entry label="Sector" value={data.mainCategory} />
        <Entry label="Solutions" value={data.products} />
        <Entry label="High Magnitude" value={data.highImpactProducts} highlight />
        <Entry label="Differentiators" value={data.usps} />
      </Section>

      <Section title="Visual DNA" icon={<Web className="w-6 h-6"/>} phase={6} color="bg-emerald-600">
        <Entry label="Signature Style" value={data.websiteStyle} />
        <Entry label="Benchmarked Sites" value={[data.preferredWebsite, data.competitorWebsite].filter(Boolean)} />
        <Entry label="Visual Heritage" value={data.inspiredWebsite} />
      </Section>

      <Section title="Social Synergy" icon={<Photo className="w-6 h-6"/>} phase={7} color="bg-rose-500">
        <Entry label="The Team" value={data.teamMembersData.map(m => m.name)} />
        <Entry label="Social Footprint" value={data.socialAccounts.map(a => a.platform)} />
        <Entry label="Public Proof" value={data.includeReviews ? `${data.reviewsCount} Reviews` : 'No'} />
      </Section>

      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Wait, one tweak
        </button>
        <button 
          onClick={() => setShowChecklist(true)} 
          className="group flex items-center gap-8 px-12 py-7 bg-slate-900 text-white rounded-[3rem] font-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-indigo-500/30 hover:bg-indigo-600 hover:-translate-y-2 transition-all text-sm uppercase tracking-[0.2em]"
        >
          Sounds Perfect, Launch!
          <Rocket className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Final Safety Handshake */}
      <AnimatePresence>
        {showChecklist && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white w-full max-w-xl rounded-[4rem] shadow-2xl overflow-hidden p-12 text-center relative"
            >
                <button onClick={() => setShowChecklist(false)} className="absolute top-10 right-10 text-slate-300 hover:text-slate-900 transition-colors"><X className="w-8 h-8" /></button>
                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <ClipboardCheck className="w-12 h-12" />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Final Handshake</h3>
                <p className="text-slate-500 font-medium mb-12 leading-relaxed px-6">We've triple-checked the technical specs. You're one tap away from initiating production.</p>
                
                <div className="space-y-4 mb-12">
                    <CheckRow label="Infrastructure Ready" sub="Cloud endpoints synthesized" />
                    <CheckRow label="Brand Heritage Locked" sub="DNA mapping complete" />
                </div>

                <button 
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full py-7 bg-indigo-600 disabled:bg-slate-200 text-white rounded-[2.5rem] font-black text-base uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-6"
                >
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                    {isSubmitting ? 'ENGAGING ENGINES...' : 'INITIATE LAUNCH'}
                </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CheckRow = ({ label, sub }: any) => (
    <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-slate-50 text-left">
        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Check className="w-6 h-6" />
        </div>
        <div>
            <p className="font-black text-slate-900 text-sm">{label}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
        </div>
    </div>
);

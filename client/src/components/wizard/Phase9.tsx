import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { CheckCircle2, Rocket, ArrowLeft, Loader2, Edit2 } from 'lucide-react';
import { ShieldCheck as Shield, Briefcase as Case, Palette as Paint, Globe as Web, Zap as Fast, Camera as Photo } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/api';

export const Phase9 = () => {
  const { data, goToPrev, setPhase } = useWizard();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Prototype Mode Simulation
    const { IS_PROTOTYPE } = await import('../../config/prototype');

    if (IS_PROTOTYPE) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSubmitted(true);
        toast.success("Success! (Prototype Mode: Details encrypted and saved)");
        setIsSubmitting(false);
        return;
    }

    try {
      const startRes = await axios.post(`${API_BASE_URL}/guest/submissions`);
      const sessionId = startRes.data.session_id;

      await axios.put(`${API_BASE_URL}/guest/submissions/${sessionId}/answers`, {
        answers: [{ question_id: 999, answer_value: data }]
      });

      await axios.post(`${API_BASE_URL}/guest/submissions/${sessionId}/complete`, {
        contact_email: data.email,
        contact_phone: data.phone,
        business_name: data.businessName
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
        <div className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
          <Rocket className="w-12 h-12 text-emerald-600" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Success! 🚀</h2>
        <p className="text-lg text-slate-600 mb-12 font-medium font-sans">
          We've received your request! Our team will look at it and reach out to you soon.
        </p>
        <button onClick={() => navigate('/')} className="px-12 py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
          Back to Home Page
        </button>
      </motion.div>
    );
  }

  const Section = ({ title, icon, phase, children }: any) => (
    <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-sm overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
            {icon}
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
        </div>
        <button onClick={() => setPhase(phase)} className="p-3 bg-white border-2 border-slate-50 rounded-2xl hover:bg-slate-50 text-blue-600 transition-colors">
          <Edit2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        {children}
      </div>
    </div>
  );

  const Entry = ({ label, value }: any) => (
    <div className="space-y-1">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
       <p className="font-bold text-slate-700 text-sm leading-snug">
         {Array.isArray(value) ? (value.length > 0 ? value.join(', ') : <span className="text-slate-300 italic">None</span>) : 
          (value || <span className="text-slate-300 italic">Not Added</span>)}
       </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pb-20 px-4"
    >
      <div className="text-center md:text-left mb-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Review & Perfect</h2>
        <p className="text-base text-slate-500 font-medium font-sans">Look over your vision one last time before we bring it to life.</p>
      </div>

      <Section title="The Basics" icon={<Shield className="w-5 h-5"/>} phase={1}>
        <Entry label="Project Type" value={data.projectType} />
        <Entry label="Who is this for?" value={data.projectFor === 'self' ? 'My own business' : 'A client or friend'} />
      </Section>

      <Section title="Business Info" icon={<Case className="w-5 h-5"/>} phase={2}>
        <Entry label="Name of Business" value={data.businessName} />
        <Entry label="Owner / Manager" value={data.contactName} />
        <Entry label="Mobile" value={data.phone} />
        <Entry label="Area of Work" value={data.serviceAreas} />
      </Section>

      {data.projectType !== 'Website' && (
        <Section title="Look & Style" icon={<Paint className="w-5 h-5"/>} phase={3}>
          <Entry label="Logo Status" value={data.logoStatus === 'have' ? 'I have a logo' : data.logoStatus === 'improve' ? 'Update my logo' : 'Need new logo'} />
          {data.logoStatus !== 'have' && (
            <>
              <Entry label="Logo Vibe" value={data.brandPersonality} />
              <Entry label="Logo Style" value={data.designStyle} />
              <Entry label="Colors" value={data.preferredColors} />
            </>
          )}
        </Section>
      )}

      {data.projectType !== 'Logo Design' && (
        <>
          <Section title="Technical Details" icon={<Web className="w-5 h-5"/>} phase={4}>
            <Entry label="Website Name" value={data.hasDomain ? `Yes: ${data.preferredDomain}` : 'Need new name'} />
            <Entry label="Hosting" value={data.hasHosting ? 'I have my own' : 'You handle it'} />
            <Entry label="Features" value={[
              data.callNowToggle ? 'Call Button' : null,
              data.whatsappToggle ? 'WhatsApp' : null,
              data.contactFormToggle ? 'Email Form' : null,
              ...data.customFeatures
            ].filter(Boolean)} />
          </Section>

          <Section title="Talking & Vibe" icon={<Fast className="w-5 h-5"/>} phase={5}>
            <Entry label="Industry" value={data.mainCategory} />
            <Entry label="Specialty" value={data.subCategory} />
            <Entry label="Website Style" value={data.websiteStyle} />
            <Entry label="Brand Voice" value={data.preferredTone} />
          </Section>
        </>
      )}

      <Section title="Goals & Strategy" icon={<Fast className="w-5 h-5"/>} phase={6}>
        <Entry label="Website Goals" value={[...data.websiteGoals, ...data.customGoals]} />
        <Entry label="Start Action" value={data.userAction === 'custom' ? data.customActions : data.userAction} />
      </Section>

      {data.projectType !== 'Logo Design' && (
        <Section title="Photos & Links" icon={<Photo className="w-5 h-5"/>} phase={7}>
          <Entry label="Photos" value={data.businessPhotosStatus ? 'I provide my own' : 'Use generic ones'} />
          <Entry label="Social Links" value={Object.keys(data.socialLinks).filter(k => data.socialLinks[k])} />
          <Entry label="Add-ons" value={data.addons} />
        </Section>
      )}

      <Section title="References" icon={<Photo className="w-5 h-5"/>} phase={8}>
        <Entry label="Similar Sites" value={data.competitorWebsites} />
        <Entry label="Inspiration" value={data.inspirationWebsites} />
      </Section>

      <div className="flex justify-between items-center pt-10">
        <button onClick={goToPrev} className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-sm shadow-sm font-sans">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className="group flex items-center gap-4 px-10 py-5 bg-slate-900 disabled:bg-slate-400 text-white rounded-[2rem] font-black shadow-2xl hover:shadow-3xl hover:bg-black hover:-translate-y-1 transition-all text-sm font-sans"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          {isSubmitting ? 'Sending...' : 'Looks Good, Submit!'}
        </button>
      </div>
    </motion.div>
  );
};

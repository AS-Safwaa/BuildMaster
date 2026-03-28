import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { CheckCircle2, Loader2, Rocket, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const Phase5 = () => {
  const { data, setPhase } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success("Project brief successfully submitted!");
    }, 2000);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 max-w-xl mx-auto">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Rocket className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">You're All Set!</h2>
        <p className="text-lg text-slate-600 mb-10">
          Your project brief has been sent to our design pool. You will receive an email shortly with access to your tracking dashboard.
        </p>
        <button onClick={() => navigate('/')} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          Return Home
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Final Review</h2>
        <p className="text-slate-500">Review your choices before submitting to the design pool.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Review blocks mapped from data context */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Lead Source</p>
              <p className="text-sm font-bold text-slate-800 capitalize">{data.leadSource || <span className="text-red-400 italic">Not Selected</span>}</p>
            </div>
        </div>

        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Business Name</p>
              <p className="text-lg font-bold text-slate-800">{data.businessName || <span className="text-red-400 italic">Not Entered</span>}</p>
              <p className="text-sm border-t border-slate-200 pt-2 mt-2 font-medium text-slate-600">Contact: {data.contactName} ({data.phone})</p>
            </div>
            <button onClick={() => setPhase(1)} className="text-blue-600 text-sm font-semibold hover:underline">Edit</button>
        </div>

        <div className="p-6 border-b border-slate-100 grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Main Category</p>
              <p className="font-medium text-slate-800">{data.category || <span className="text-slate-400 italic">Not Selected</span>}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Theme Style</p>
              <p className="font-medium text-slate-800 capitalize">{data.websiteStyle || <span className="text-slate-400 italic">Not Selected</span>}</p>
            </div>
        </div>
        
        <div className="p-6 border-b border-slate-100">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Competitors</p>
            <p className="text-sm text-slate-600">{data.competitors.length > 0 ? data.competitors.join(', ') : 'None provided'}</p>
        </div>

        <div className="p-6">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Your USPs</p>
            <div className="flex flex-wrap gap-2">
              {data.usps.length > 0 ? data.usps.map(u => (
                <span key={u} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">{u}</span>
              )) : <span className="text-slate-400 italic text-sm">Not Selected</span>}
            </div>
        </div>
      </div>

      <div className="flex justify-between pt-10">
        <button onClick={() => setPhase(4)} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={handleSubmit} disabled={isSubmitting || !data.businessName} className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/30">
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          {isSubmitting ? 'Submitting...' : 'Submit Brief'}
        </button>
      </div>
    </motion.div>
  );
};

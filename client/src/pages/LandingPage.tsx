import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2, UserCircle, UserPlus, Send, X, Layers, Paintbrush, Rocket, CheckCircle2 } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [showSourceModal, setShowSourceModal] = useState(false);

  const startProject = (source: 'self' | 'referral') => {
    setShowSourceModal(false);
    navigate('/questionnaire', { state: { leadSource: source } });
  };

  const features = [
    { icon: <Layers className="text-blue-500" />, title: "Structured Briefs", desc: "No more endless email chains. Our 5-phase questionnaire captures everything needed." },
    { icon: <Paintbrush className="text-purple-500" />, title: "Visual Vibe Boards", desc: "Select aesthetic directions natively with curated design themes and mockups." },
    { icon: <Rocket className="text-green-500" />, title: "Instant Delivery", desc: "Your completed brief is securely routed directly to our developer pool." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
      <div className="absolute top-[10%] right-[-10%] w-[800px] h-[800px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-blob animation-delay-4000"></div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <span className="font-extrabold text-2xl tracking-tight text-slate-900">ProjectHub</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:block">Developer Portal</button>
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors hidden sm:block">Admin Portal</button>
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 bg-white/50 backdrop-blur-md border border-slate-200 text-slate-900 rounded-full text-sm font-bold shadow-sm hover:bg-white transition-all hover:shadow-md"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-32 px-6 max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Seamless Website Intake Platform
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.1]">
            Transform your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">vision</span> into reality.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            The world's most elegant onboarding experience for founders and agencies. Define your branding, aesthetic, and digital requirements in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSourceModal(true)}
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-full text-lg font-bold shadow-2xl shadow-blue-900/20 hover:shadow-blue-900/40 transition-all z-20"
            >
              Start New Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
          
          <p className="mt-6 text-sm font-medium text-slate-500">Takes less than 5 minutes to complete.</p>
        </motion.div>
      </main>

      {/* Feature Section */}
      <section className="relative z-10 bg-white/60 backdrop-blur-2xl border-t border-slate-200 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Built for Agency Scale</h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">ProjectHub bridges the gap between chaotic email briefs and stunning execution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <div className="relative z-10 py-20 bg-slate-900 text-white text-center">
        <p className="font-bold text-slate-400 tracking-widest uppercase text-sm mb-8">Trusted by 500+ Innovators</p>
        <div className="flex flex-wrap justify-center gap-12 sm:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Mock Logos */}
          <div className="font-black text-2xl tracking-tighter">ACME Corp</div>
          <div className="font-black text-2xl tracking-tighter">Globex</div>
          <div className="font-black text-2xl tracking-tighter">Soylent</div>
          <div className="font-black text-2xl tracking-tighter">Initech</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-50 py-12 border-t border-slate-200 text-center">
         <p className="text-slate-500 font-medium">© 2026 ProjectHub Platform. All rights reserved.</p>
      </footer>

      {/* Lead Source Modal */}
      <AnimatePresence>
        {showSourceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-10 max-w-xl w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSourceModal(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Let's get started</h3>
              <p className="text-lg text-slate-500 mb-10 font-medium">Are you initializing this project for your own business, or were you referred by our team?</p>

              <div className="space-y-4">
                <button 
                  onClick={() => startProject('self')}
                  className="w-full flex items-center gap-6 p-6 rounded-[1.5rem] border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-600/10 transition-all text-left group"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xl mb-1">Starting for myself</h4>
                    <p className="text-sm font-medium text-slate-500">I am the business owner / direct client</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-6 h-6 text-blue-600" />
                  </div>
                </button>

                <button 
                  onClick={() => startProject('referral')}
                  className="w-full flex items-center gap-6 p-6 rounded-[1.5rem] border-2 border-slate-200 hover:border-purple-600 hover:bg-purple-50 hover:shadow-lg hover:shadow-purple-600/10 transition-all text-left group"
                >
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                    <Send className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xl mb-1">I was referred</h4>
                    <p className="text-sm font-medium text-slate-500">A partner or team member sent me</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-6 h-6 text-purple-600" />
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

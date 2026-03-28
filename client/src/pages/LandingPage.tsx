import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, UserPlus, Send, X, Zap, Target, Globe, ChevronRight } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [showSourceModal, setShowSourceModal] = useState(false);

  const startProject = (source: 'self' | 'referral') => {
    setShowSourceModal(false);
    navigate('/questionnaire', { state: { leadSource: source } });
  };

  const steps = [
    { num: "01", title: "Initialize Request", desc: "Launch the dynamic brief generator. Tell us exactly who you are and what your market needs." },
    { num: "02", title: "Select Aesthetics", desc: "Interact with our stunning Vibe Boards to pinpoint the exact visual language of your brand." },
    { num: "03", title: "AI Tagline Generation", desc: "Let our system analyze your inputs to suggest powerful, market-ready business taglines." },
    { num: "04", title: "Developer Handoff", desc: "Hit submit. Your structured JSON brief is instantly routed to our elite Developer Pool." }
  ];

  const benefits = [
    { icon: <Target className="text-white" />, color: "bg-blue-600", title: "Eliminate Ambiguity", desc: "Stop guessing what the client wants. Our structured 16-phase forms extract the absolute truth." },
    { icon: <Zap className="text-white" />, color: "bg-purple-600", title: "Lightning Fast Intake", desc: "What used to take 3 weeks of email ping-pong now takes 5 minutes of focused clicking." },
    { icon: <Globe className="text-white" />, color: "bg-emerald-600", title: "Global Fulfillment", desc: "The second a brief is submitted, developers worldwide receive assignment notifications." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Intense Background Glows */}
      <div className="absolute top-[-30%] left-[-10%] w-[1000px] h-[1000px] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-20%] w-[800px] h-[800px] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-pulse animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[800px] h-[800px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse animation-delay-4000"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">ProjectHub</span>
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block">Developer Portal</button>
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block">Admin Engine</button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-white text-slate-950 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-40 px-6 max-w-6xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-200 text-sm font-bold mb-10 backdrop-blur-md">
            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-black uppercase tracking-wider mr-2">New</span>
            The Ultimate Intake Architecture
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black text-white mb-8 tracking-tighter leading-[1] drop-shadow-2xl">
            Design Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">
              Masterpiece.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
            ProjectHub is the world's most expressive client onboarding engine. Transform scattered thoughts into highly structured, actionable developer blueprints in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSourceModal(true)}
              className="group flex items-center justify-center gap-3 px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xl font-black shadow-[0_0_40px_rgba(59,130,246,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] transition-all z-20 border border-white/20"
            >
              Start Your Project
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
      </main>

      {/* What it helps us do */}
      <section className="relative z-10 py-32 bg-slate-950/50 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">Why ProjectHub?</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">We built this platform to obliterate the friction between a client's dream and a developer's execution context.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-all hover:-translate-y-2 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${b.color} flex items-center justify-center mb-8 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                  {b.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{b.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium text-lg">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Timeline) */}
      <section className="relative z-10 py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 relative inline-block">
              How It Works
              <div className="absolute -bottom-4 left-0 w-1/2 h-2 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="text-8xl font-black text-white/5 mb-6 -ml-4 select-none">{step.num}</div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  {step.title}
                  {idx < steps.length - 1 && <ChevronRight className="w-5 h-5 text-blue-500 hidden lg:block absolute -right-6 top-12" />}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 py-32 text-center relative z-20">
          <h2 className="text-5xl font-black text-white mb-8">Ready to revolutionize your workflow?</h2>
          <button onClick={() => setShowSourceModal(true)} className="px-10 py-5 bg-white text-slate-950 rounded-full text-lg font-bold shadow-xl hover:scale-105 transition-all">
            Launch Platform Now
          </button>
        </div>
        <div className="border-t border-white/5 py-8 text-center text-slate-500 font-medium text-sm">
          © {new Date().getFullYear()} ProjectHub SaaS Platform. Engineered for absolute perfection.
        </div>
      </footer>

      {/* Lead Source Modal */}
      <AnimatePresence>
        {showSourceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-white/10 rounded-[2rem] p-10 max-w-xl w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSourceModal(false)}
                className="absolute top-8 right-8 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors hidden sm:block"
              >
                <X className="w-6 h-6" />
              </button>

              <h3 className="text-4xl font-black text-white mb-3 tracking-tight">Let's get started</h3>
              <p className="text-lg text-slate-400 mb-10 font-medium">Are you initializing this project for your own business, or were you referred by our team?</p>

              <div className="space-y-4">
                <button 
                  onClick={() => startProject('self')}
                  className="w-full flex items-center gap-6 p-6 rounded-[1.5rem] bg-slate-800/50 border-2 border-slate-700 hover:border-blue-500 hover:bg-blue-900/20 transition-all text-left group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xl mb-1">Starting for myself</h4>
                    <p className="text-sm font-medium text-slate-400">I am the business owner / direct client</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-6 h-6 text-blue-400" />
                  </div>
                </button>

                <button 
                  onClick={() => startProject('referral')}
                  className="w-full flex items-center gap-6 p-6 rounded-[1.5rem] bg-slate-800/50 border-2 border-slate-700 hover:border-purple-500 hover:bg-purple-900/20 transition-all text-left group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                    <Send className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xl mb-1">I was referred</h4>
                    <p className="text-sm font-medium text-slate-400">A partner or team member sent me</p>
                  </div>
                  <div className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    <ArrowRight className="w-6 h-6 text-purple-400" />
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

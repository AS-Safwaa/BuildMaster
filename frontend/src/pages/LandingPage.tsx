// ─────────────────────────────────────────────────────────
// Landing Page — Hero + Role Cards + CTA
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Store, User, ArrowRight, Sparkles, Zap, Globe, X, Users, LogOut, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';

const roleCards = [
  {
    role: 'guest' as const,
    title: 'Guest / Client',
    description: 'Quickly submit your business project details without creating an account.',
    icon: Sparkles,
    gradient: 'from-amber-400 to-orange-500',
    shadowColor: 'shadow-amber-100',
    path: '/guest',
  },
  {
    role: 'admin' as const,
    title: 'Admin',
    description: 'Full system control. Manage users, oversee all projects, and configure platform settings.',
    icon: ShieldCheck,
    gradient: 'from-indigo-500 to-purple-600',
    shadowColor: 'shadow-indigo-200',
    path: '/admin',
  },
  {
    role: 'developer' as const,
    title: 'Developer',
    description: 'View assigned projects, submit build status, and track technical progress.',
    icon: User,
    gradient: 'from-emerald-500 to-teal-500',
    shadowColor: 'shadow-emerald-200',
    path: '/developer',
  },
];

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized performance with instant load times' },
  { icon: Globe, title: 'Scalable', desc: 'Built to grow from MVP to enterprise' },
  { icon: Sparkles, title: 'AI Powered', desc: 'Gemini AI integration for smart workflows' },
];

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<'type' | 'referral'>('type');
  const [entryData, setEntryData] = useState({
    type: 'self' as 'self' | 'referral',
    referrer: '',
    customerInfo: ''
  });

  const handleRoleClick = (path: string) => {
    if (path === '/guest') {
      setShowOnboarding(true);
    } else {
      navigate(path);
    }
  };

  const finalizeOnboarding = () => {
    setShowOnboarding(false);
    navigate('/guest', { state: { onboarding: entryData } });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white text-slate-800">
        {/* Onboarding Modal Overlay */}
        <AnimatePresence>
          {showOnboarding && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-xl rounded-[3rem] shadow-3xl overflow-hidden p-10 relative"
              >
                <button
                  onClick={() => setShowOnboarding(false)}
                  className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all"
                >
                  <X size={24} />
                </button>

                {onboardingStep === 'type' ? (
                  <div className="space-y-8 text-center">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">How did you find us?</h3>
                      <p className="text-sm text-gray-500 font-medium italic">Help us personalize your setup journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEntryData({ ...entryData, type: 'self' });
                          finalizeOnboarding();
                        }}
                        className="p-8 rounded-[2rem] border-2 border-gray-100 hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-50 transition-all text-left group bg-gray-50 hover:bg-white"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:bg-indigo-600 transition-colors">
                          <Zap size={24} className="group-hover:text-white text-indigo-600" />
                        </div>
                        <p className="font-black text-xl text-gray-900">Self</p>
                        <p className="text-sm text-gray-500 font-medium">I found you directly or through search</p>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEntryData({ ...entryData, type: 'referral' });
                          setOnboardingStep('referral');
                        }}
                        className="p-8 rounded-[2rem] border-2 border-gray-100 hover:border-emerald-600 hover:shadow-2xl hover:shadow-emerald-50 transition-all text-left group bg-gray-50 hover:bg-white"
                      >
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:bg-emerald-600 transition-colors">
                          <Users size={24} className="group-hover:text-white text-emerald-600" />
                        </div>
                        <p className="font-black text-xl text-gray-900">Referral</p>
                        <p className="text-sm text-gray-500 font-medium">A partner or client referred me</p>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2 text-center">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight">Referral Details</h3>
                      <p className="text-sm text-gray-500 font-medium">Who should we thank for this referral?</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Referrer Name / Agency</label>
                        <input
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                          placeholder="e.g. AspiraSys or John Doe"
                          value={entryData.referrer}
                          onChange={(e) => setEntryData({ ...entryData, referrer: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Additional Context (Optional)</label>
                        <textarea
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                          placeholder="e.g. Recommending for medical clinic build..."
                          rows={3}
                          value={entryData.customerInfo}
                          onChange={(e) => setEntryData({ ...entryData, customerInfo: e.target.value })}
                        />
                      </div>
                    </div>

                    <AnimatedButton className="w-full py-5 rounded-2xl bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700 font-black" onClick={finalizeOnboarding}>
                      Continue to Configurator <ArrowRight size={20} />
                    </AnimatedButton>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-lg tracking-tighter"
            >
              <span className="text-blue-600">BUILD</span>
              <span className="text-slate-900 border-l border-slate-200 ml-2 pl-2">MASTER</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">Welcome, <span className="text-slate-900 font-bold">{user?.name}</span></span>
                  <AnimatedButton size="sm" className="bg-blue-600 text-white" onClick={() => navigate(user?.role === 'admin' ? '/admin' : '/developer')}>
                    Dashboard <ArrowRight size={14} />
                  </AnimatedButton>
                  <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <AnimatedButton size="sm" className="bg-blue-600 text-white" onClick={() => navigate('/login')}>
                  Login <LogIn size={14} />
                </AnimatedButton>
              )}
            </motion.div>
          </div>
        </nav>

        <section className="max-w-7xl mx-auto px-6 pt-12 pb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={12} />
              AI Project Management v2.0
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Scale your agency <br /> with <span className="text-blue-600 italic">Precision.</span>
            </h1>

            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
              A high-precision configuration engine for modern agency workflows.
              Build, manage, and scale projects in a unified azure-themed workspace.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <AnimatedButton size="md" className="bg-blue-600 shadow-xl shadow-blue-500/20" onClick={() => setShowOnboarding(true)}>
                Launch Intake <ArrowRight size={16} />
              </AnimatedButton>
              <AnimatedButton variant="secondary" size="md" className="border-slate-200" onClick={() => {
                document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Role Matrix
              </AnimatedButton>
            </div>
          </motion.div>

          {/* ── Feature Pills ─────────────────────────── */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-16">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <f.icon size={20} className="text-indigo-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="roles" className="max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight underline adorn decoration-blue-500/30 underline-offset-8 decoration-4">Role Access Control</h2>
            <p className="text-slate-500 mt-4 text-sm font-medium">Precision-built dashboards for every stage of your build cycle</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roleCards.map((card, i) => (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                onClick={() => handleRoleClick(card.path)}
                className="group cursor-pointer bg-white rounded-3xl p-6 border border-slate-100 hover:border-blue-500/10 hover:shadow-2xl hover:shadow-blue-500/5 transition-all text-center"
              >
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-blue-600 transition-all flex items-center justify-center mx-auto mb-6`}>
                  <card.icon size={24} className="text-blue-600 group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 line-clamp-2">{card.description}</p>

                <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                  Access Portal <ArrowRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────── */}
        <footer className="border-t border-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2026 BuildMaster. Built with React, Express & Prisma.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="hover:text-gray-600 cursor-pointer transition-colors">Documentation</span>
              <span className="hover:text-gray-600 cursor-pointer transition-colors">API</span>
              <span className="hover:text-gray-600 cursor-pointer transition-colors">Support</span>
            </div>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}

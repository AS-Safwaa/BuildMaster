// ─────────────────────────────────────────────────────────
// Landing Page — Hero + Role Cards + CTA
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Store, User, ArrowRight, Sparkles, Zap, Globe, X, Users } from 'lucide-react';
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
  const { isAuthenticated, user } = useAuth();

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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
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
                      <h3 className="text-3xl font-black text-gray-900 tracking-tight">How did you find us?</h3>
                      <p className="text-gray-500 font-medium italic">Help us personalize your setup journey</p>
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
                      <h3 className="text-3xl font-black text-gray-900 tracking-tight">Referral Details</h3>
                      <p className="text-gray-500 font-medium">Who should we thank for this referral?</p>
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

        {/* ── Navbar ──────────────────────────────────── */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-black text-2xl tracking-tighter"
            >
              <span className="text-indigo-600">BUILD</span>
              <span className="text-gray-900">MASTER</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-500">Welcome, <span className="font-bold text-gray-900">{user?.name}</span></span>
                  <AnimatedButton size="sm" onClick={() => navigate(`/${user?.role}`)}>
                    Dashboard <ArrowRight size={14} />
                  </AnimatedButton>
                </>
              ) : (
                <AnimatedButton size="sm" onClick={() => setShowOnboarding(true)}>
                  Get Started <ArrowRight size={14} />
                </AnimatedButton>
              )}
            </motion.div>
          </div>
        </nav>

        {/* ── Hero Section ────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold">
              <Sparkles size={16} />
              AI-Powered Project Management
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
              Build Projects{' '}
              <motion.span
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Like a Pro
              </motion.span>
            </h1>

            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              The complete SaaS platform for agencies. Configure, build, and deploy client projects
              with role-based workflows and AI-powered automation.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <AnimatedButton size="lg" onClick={() => setShowOnboarding(true)}>
                Quick Intake <Sparkles size={18} className="ml-1 text-amber-400" />
              </AnimatedButton>
              <AnimatedButton variant="secondary" size="lg" onClick={() => {
                document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Roles
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

        {/* ── Role Cards ──────────────────────────────── */}
        <section id="roles" className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Choose Your Role</h2>
            <p className="text-gray-500 mt-3 text-lg">Each role unlocks a tailored dashboard experience</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roleCards.map((card, i) => (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleRoleClick(card.path)}
                className={`relative group cursor-pointer bg-white rounded-3xl p-8 border border-gray-100 shadow-lg ${card.shadowColor} hover:shadow-xl transition-shadow duration-300 overflow-hidden`}
              >
                {/* Gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />

                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <card.icon size={28} className="text-white" />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6">{card.description}</p>

                <div className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all`}>
                  Enter Dashboard <ArrowRight size={16} className="text-indigo-500" />
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

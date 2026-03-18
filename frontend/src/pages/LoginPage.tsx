import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn,
  Eye,
  EyeOff,
  ArrowLeft,
  Mail,
  Github,
  Facebook,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TESTIMONIALS = [
  {
    name: "Alex Sterling",
    role: "Agency Founder",
    text: "Building complex projects used to take weeks of back-and-forth. With BuildMaster, the intake and AI generation happened in minutes.",
  },
  {
    name: "Priya Sharma",
    role: "Solution Architect",
    text: "The developer workspace is game-changing. Having all client data side-by-side with AI-driven prompts is a professional dream.",
  }
];

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testIndex, setTestIndex] = useState(0);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/admin' : '/developer', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Identity Verified');

      // Definitively check role for redirection
      const userStr = localStorage.getItem('user');
      const role = userStr ? JSON.parse(userStr).role : 'developer';

      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/developer', { replace: true });
      }
    } catch (error: any) {
      toast.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (role: 'admin' | 'developer') => {
    setEmail(role === 'admin' ? 'admin@buildmaster.com' : 'developer@buildmaster.com');
    setPassword('password123');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">

        {/* Container: More compact, White/Blue theme */}
        <div className="w-full max-w-4xl bg-white rounded-[2rem] border border-slate-200 flex flex-col md:flex-row shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">

          {/* Left Section: FORM */}
          <div className="flex-[1.2] p-8 md:p-12 lg:p-14 flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <button onClick={() => navigate('/')} className="p-2 text-slate-400 hover:text-slate-900 transition-all border border-slate-100 rounded-full">
                  <ArrowLeft size={16} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <LogIn size={14} className="text-white" />
                  </div>
                  <span className="text-slate-900 font-bold text-xs tracking-tighter uppercase italic">BUILD<span className="text-blue-600">MASTER</span></span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Welcome back</h1>
                  {email.includes('admin') && <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-black uppercase rounded-lg tracking-widest border border-blue-200">Admin</span>}
                  {email.includes('developer') && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase rounded-lg tracking-widest border border-emerald-200">Engineer</span>}
                </div>
                <p className="text-slate-400 text-[11px] font-medium">Verify your identity to access the build matrix.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">Identity Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all placeholder:text-slate-300"
                    placeholder="e.g. dev@buildmaster.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Secure Pin</label>
                    <button type="button" className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">Forgot?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-slate-900 text-xs outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] py-3.5 rounded-xl shadow-lg shadow-blue-500/10 hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  Access Workspace
                </button>
              </form>

              <div className="flex items-center gap-3 pt-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Quick Access</p>
                <div className="flex gap-2">
                  <button onClick={() => quickLogin('admin')} className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all group relative">
                    <Mail size={14} />
                    <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-slate-900 text-white px-1.5 py-0.5 rounded text-[8px] font-bold transition-all">ADMIN</div>
                  </button>
                  <button onClick={() => quickLogin('developer')} className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all group relative">
                    <Github size={14} />
                    <div className="absolute -top-7 scale-0 group-hover:scale-100 bg-slate-900 text-white px-1.5 py-0.5 rounded text-[8px] font-bold transition-all">DEV</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: BLUE THEME TESTIMONIALS */}
          <div className="hidden md:flex flex-[0.8] p-4">
            <div className="w-full h-full bg-blue-600 rounded-[1.5rem] p-8 flex flex-col justify-center relative overflow-hidden">
              {/* Abstract BG */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full -ml-16 -mb-16 blur-3xl opacity-50" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={testIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 relative z-10"
                >
                  <Quote className="text-blue-200/40" size={32} />
                  <p className="text-sm text-white font-medium leading-relaxed italic">
                    "{TESTIMONIALS[testIndex].text}"
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-xs font-bold text-white">{TESTIMONIALS[testIndex].name}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-100/50 mt-1">{TESTIMONIALS[testIndex].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2 mt-8 relative z-10">
                <button onClick={() => setTestIndex(prev => prev === 0 ? 1 : 0)} className="w-8 h-8 rounded-lg bg-white/10 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setTestIndex(prev => prev === 0 ? 1 : 0)} className="w-8 h-8 rounded-lg bg-white/20 border border-white/10 flex items-center justify-center text-white hover:bg-white/30 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

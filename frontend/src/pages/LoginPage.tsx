import React, { useState } from 'react';
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
  Quote,
  ExternalLink
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

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Access Granted');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = storedUser.role || 'developer';
      navigate(userRole === 'admin' ? '/admin' : '/developer', { replace: true });
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
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden">

        {/* Container: Slightly smaller overall width */}
        <div className="w-full max-w-5xl bg-[#1A1A1A]/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">

          {/* Left Section: FORM */}
          <div className="flex-1 p-10 md:p-14 lg:p-16 flex flex-col justify-between">

            <div className="space-y-10">
              {/* Back & Logo Row */}
              <div className="flex items-center justify-between">
                <button onClick={() => navigate('/')} className="p-2 text-white/20 hover:text-white transition-all ring-1 ring-white/10 rounded-full">
                  <ArrowLeft size={16} />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#EF715C] rounded-lg flex items-center justify-center -rotate-6">
                    <LogIn size={16} className="text-white" />
                  </div>
                  <span className="text-white font-bold text-sm tracking-tighter uppercase italic">BUILD<span className="text-white/20">MASTER</span></span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-3xl font-black text-white tracking-tight leading-none">Welcome back</h1>
                <p className="text-white/30 text-xs font-medium">Please enter your account details to continue.</p>
              </div>

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white text-xs outline-none focus:ring-1 focus:ring-[#EF715C]/50 focus:bg-white/10 transition-all placeholder:text-white/10"
                    placeholder="john.doe@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/30">Password</label>
                    <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-[#EF715C]/60 hover:text-[#EF715C]">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-3.5 text-white text-xs outline-none focus:ring-1 focus:ring-[#EF715C]/50 focus:bg-white/10 transition-all"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded bg-white/5 border-white/10 text-[#EF715C] focus:ring-0" />
                  <label className="text-[11px] text-white/20 font-medium">Keep me logged in</label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#EF715C] text-white font-bold uppercase tracking-widest text-[11px] py-4 rounded-2xl shadow-xl shadow-[#EF715C]/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Decrypting...' : 'Sign In'}
                </button>
              </form>

              {/* QUICK PROTOTYPE ACCESS */}
              <div className="space-y-4 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/10 px-1">Social Gateway</p>
                <div className="flex gap-2">
                  <button onClick={() => quickLogin('admin')} className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-all group relative border border-black">
                    <Mail size={16} />
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-white text-black px-1.5 py-0.5 rounded text-[8px] font-bold pointer-events-none transition-all">ADMIN</div>
                  </button>
                  <button onClick={() => quickLogin('developer')} className="w-9 h-9 bg-[#222] rounded-full flex items-center justify-center text-white hover:scale-110 transition-all group relative border border-white/10">
                    <Github size={16} />
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-black text-white px-1.5 py-0.5 rounded text-[8px] font-bold pointer-events-none transition-all">DEV</div>
                  </button>
                  <button className="w-9 h-9 bg-[#1877F2]/20 rounded-full flex items-center justify-center text-[#1877F2] opacity-40 grayscale pointer-events-none">
                    <Facebook size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: TESTIMONIALS */}
          <div className="hidden md:flex flex-1 p-6 relative">
            <div className="w-full h-full bg-[#090909] rounded-[2rem] p-12 flex flex-col justify-center relative overflow-hidden ring-1 ring-white/5">

              {/* Abstract BG */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <svg viewBox="0 0 100 100" className="w-[150%] h-[150%] fill-none stroke-white" strokeWidth="0.1">
                  <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                </svg>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={testIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="space-y-8 relative z-10"
                >
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-white leading-tight tracking-tight">What our <br /> Partners say.</h2>
                    <Quote className="text-[#EF715C]" size={28} />
                  </div>

                  <p className="text-base text-white/40 leading-relaxed italic font-medium">
                    "{TESTIMONIALS[testIndex].text}"
                  </p>

                  <div>
                    <h4 className="text-sm font-bold text-white">{TESTIMONIALS[testIndex].name}</h4>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#EF715C]/80 mt-0.5">{TESTIMONIALS[testIndex].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2 mt-10 relative z-10">
                <button onClick={() => setTestIndex(prev => prev === 0 ? 1 : 0)} className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center text-white/20 hover:text-white transition-all bg-white/5">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setTestIndex(prev => prev === 0 ? 1 : 0)} className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/20 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Promo Card: Rotated and scaled down */}
              <div className="absolute bottom-8 right-8 w-60 bg-white rounded-3xl p-5 shadow-2xl rotate-[-3deg] hover:rotate-0 transition-all cursor-default group border-[8px] border-black">
                <h5 className="text-slate-900 font-bold text-sm mb-2">Build your agency tonight. <ExternalLink size={10} className="inline ml-1" /></h5>
                <p className="text-slate-400 text-[9px] leading-relaxed mb-4">Experience the easiest way to generate codebases at scale.</p>
                <div className="flex items-center -space-x-1.5 grayscale group-hover:grayscale-0 transition-all">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full ring-2 ring-white overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                    </div>
                  ))}
                  <span className="ml-3 text-[9px] font-bold text-slate-300 uppercase tracking-tighter tracking-widest">+2.4k People</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

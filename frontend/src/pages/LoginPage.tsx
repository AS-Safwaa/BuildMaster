import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogIn,
  Eye,
  EyeOff,
  ArrowLeft,
  Github,
  Mail,
  Facebook,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { useAuth, UserRole } from '../context/AuthContext';
import toast from 'react-hot-toast';

const TESTIMONIALS = [
  {
    name: "Alex Sterling",
    role: "Agency Founder",
    text: "Building complex projects used to take weeks of back-and-forth. With BuildMaster, the intake and AI generation happened in minutes.",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    name: "Priya Sharma",
    role: "Solution Architect",
    text: "The developer workspace is game-changing. Having all client data side-by-side with AI-driven prompts is a professional dream.",
    color: "from-emerald-500/20 to-teal-500/20"
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
  const location = useLocation();

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
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-orange-500/30">

        {/* Main Glass Container */}
        <div className="w-full max-w-6xl aspect-[16/10] bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.5)]">

          {/* Left Section: LOGIN FORM */}
          <div className="flex-1 p-12 md:p-20 flex flex-col justify-between relative">
            {/* Back Button */}
            <button onClick={() => navigate('/')} className="absolute top-8 left-8 p-3 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all">
              <ArrowLeft size={20} />
            </button>

            <div className="space-y-12">
              {/* Brand Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-orange-400 to-rose-500 rounded-xl flex items-center justify-center rotate-12">
                  <LogIn size={20} className="text-white" />
                </div>
                <span className="text-white font-black text-xl tracking-tighter uppercase italic">BUILD<span className="text-white/30">MASTER</span></span>
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Welcome back</h1>
                <p className="text-white/40 font-medium">Please enter your account details to continue.</p>
              </div>

              {/* LOGIN FORM */}
              <form onSubmit={handleSubmit} className="space-y-6 max-w-sm">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40 px-4">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-full px-6 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white/10 transition-all placeholder:text-white/10"
                    placeholder="john.doe@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Password</label>
                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-orange-400/70 hover:text-orange-400 transition-colors">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-full px-6 py-4 text-white text-sm outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white/10 transition-all"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4">
                  <input type="checkbox" className="rounded-md border-white/10 bg-white/5 text-orange-500 focus:ring-orange-500/50" />
                  <label className="text-xs text-white/30 font-medium">Keep me logged in</label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-400 to-rose-500 text-white font-black uppercase tracking-[0.2em] py-5 rounded-full shadow-2xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Decrypting...' : 'Sign In'}
                </button>
              </form>

              {/* QUICK PROTOTYPE ACCESS */}
              <div className="space-y-4 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/20 px-4">Instant Account Access</p>
                <div className="flex gap-3">
                  <button onClick={() => quickLogin('admin')} className="w-10 h-10 bg-white border border-white/10 rounded-full flex items-center justify-center text-slate-900 shadow-xl shadow-black/20 hover:scale-110 transition-all group relative">
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-white text-black px-2 py-1 rounded text-[10px] font-black transition-all">ADMIN</div>
                    <Mail size={18} />
                  </button>
                  <button onClick={() => quickLogin('developer')} className="w-10 h-10 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-white shadow-xl shadow-black/20 hover:scale-110 transition-all group relative">
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-white text-black px-2 py-1 rounded text-[10px] font-black transition-all">DEV</div>
                    <Github size={18} />
                  </button>
                  <button className="w-10 h-10 bg-[#1877F2] border border-white/10 rounded-full flex items-center justify-center text-white shadow-xl shadow-black/20 hover:scale-110 transition-all opacity-40 grayscale">
                    <Facebook size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: TESTIMONIAL CARD */}
          <div className="hidden md:flex flex-1 p-8">
            <div className="w-full h-full bg-[#090909] rounded-[2.5rem] relative overflow-hidden flex flex-col p-16 justify-center">

              {/* Background Decorative Shape (Star) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-[120%] rotate-45">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-orange-400" strokeWidth="0.5">
                  <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                </svg>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={testIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 relative z-10"
                >
                  <div className="space-y-4">
                    <h2 className="text-6xl font-black text-white leading-none tracking-tighter">What our <br /> Partners say.</h2>
                    <Quote className="text-orange-400 rotate-180" size={40} />
                  </div>

                  <p className="text-2xl text-white/50 font-medium leading-relaxed italic">
                    "{TESTIMONIALS[testIndex].text}"
                  </p>

                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-white">{TESTIMONIALS[testIndex].name}</h4>
                    <p className="text-sm font-black uppercase tracking-widest text-orange-400/60">{TESTIMONIALS[testIndex].role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Pagination */}
              <div className="mt-12 flex gap-4 relative z-10">
                <button
                  onClick={() => setTestIndex((prev) => (prev > 0 ? prev - 1 : TESTIMONIALS.length - 1))}
                  className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => setTestIndex((prev) => (prev < TESTIMONIALS.length - 1 ? prev + 1 : 0))}
                  className="w-14 h-14 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all border-emerald-500/40"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Floating Content Card (Promo) */}
              <div className="absolute bottom-10 right-10 w-80 bg-white rounded-3xl p-8 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform hidden lg:block border-[12px] border-black">
                <h5 className="text-slate-900 font-black text-xl leading-tight mb-4">Start your agency empire tonight.</h5>
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">Join the first 500 founders to experience the easiest way to scale code generation.</p>
                <div className="flex items-center -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="avatar" />
                    </div>
                  ))}
                  <span className="ml-4 text-[10px] font-black text-slate-300 uppercase">+2.4k People</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

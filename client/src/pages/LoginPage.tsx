import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/v1/admin/auth/login', { email, password });
      
      const userData = res.data.admin; // Currently mapped as 'admin' in backend response
      login(res.data.token, userData);

      if (userData.role === 'admin') {
          toast.success('Welcome to the Admin Engine.');
          navigate('/admin');
      } else {
          toast.success('Welcome to the Developer Portal.');
          navigate('/developer');
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Network error.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500 selection:text-white">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium cursor-pointer z-20"
      >
        <ArrowLeft className="w-5 h-5" /> Back to ProjectHub
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-white/10 max-w-md w-full rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-center border-b border-white/10">
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">System Authentication</h2>
          <p className="text-blue-400 text-sm font-medium">Restricted Workspace Access</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Platform Identity</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="name@demo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Secret Key</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-black text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all disabled:opacity-70 disabled:hover:bg-blue-600"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Live Engineering Credentials</p>
            <div className="text-xs text-slate-400 space-y-2 font-mono">
               <p className="flex justify-between px-4"><span>Admin:</span> <span>admin@demo.com</span></p>
               <p className="flex justify-between px-4"><span>Dev:</span> <span>developer@demo.com</span></p>
               <p className="text-center text-slate-600 mt-2">Pass: Developer@123 / Admin@123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// Login Page — shared across all roles
// ─────────────────────────────────────────────────────────

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'developer'>('developer');

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which role dashboard to redirect to
  const from = (location.state as any)?.from || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password, role);
        toast.success('Account created successfully!');
      } else {
        await login(email, password);
        toast.success('Welcome back!');
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      const message = error?.response?.data?.error || error.message || 'Authentication failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = (demoRole: string) => {
    setEmail(`${demoRole}@buildmaster.com`);
    setPassword('password123');
    setIsRegister(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 left-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-white">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-white/70 mt-1 text-sm">
              {isRegister ? 'Join BuildMaster today' : 'Sign in to your dashboard'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="developer">Developer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatedButton type="submit" isLoading={isLoading} className="w-full" size="lg">
              {isRegister ? 'Create Account' : 'Sign In'}
            </AnimatedButton>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-bold"
              >
                {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
              </button>
            </div>

            {/* Demo Credentials Quick Fill */}
            {!isRegister && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center mb-3">Quick Demo Login</p>
                <div className="flex gap-2">
                  {['admin', 'developer'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => fillDemo(r)}
                      className="flex-1 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 capitalize transition-all"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </PageTransition>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2, UserCircle, UserPlus, Send, X } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [showSourceModal, setShowSourceModal] = useState(false);

  const startProject = (source: 'self' | 'referral') => {
    setShowSourceModal(false);
    navigate('/questionnaire', { state: { leadSource: source } });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#1a1a2e] mb-6 tracking-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ProjectHub</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          The ultimate platform for defining, managing, and delivering world-class branding and web experiences.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSourceModal(true)}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#1a1a2e] text-white rounded-2xl text-lg font-semibold shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all z-20"
          >
            <Sparkles className="w-6 h-6 text-purple-400 group-hover:rotate-12 transition-transform" />
            Start New Project
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

        </div>

        {/* Portal Logins */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-10 border-t border-slate-200"
        >
          <p className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-widest">Team Portals</p>
          <div className="flex justify-center gap-8">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
            >
              <UserCircle className="w-5 h-5" />
              Developer Login
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-slate-600 hover:text-purple-600 font-medium transition-colors"
            >
              <Building2 className="w-5 h-5" />
              Admin Portal
            </button>
          </div>
        </motion.div>

      </motion.div>

      {/* Lead Source Modal */}
      <AnimatePresence>
        {showSourceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowSourceModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold text-slate-900 mb-2">Let's get started!</h3>
              <p className="text-slate-500 mb-8">Are you initializing this project for your own business, or were you referred by our team?</p>

              <div className="space-y-4">
                <button 
                  onClick={() => startProject('self')}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <UserPlus className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">Starting for myself</h4>
                    <p className="text-sm text-slate-500">I am the business owner / direct client</p>
                  </div>
                </button>

                <button 
                  onClick={() => startProject('referral')}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Send className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">I was referred</h4>
                    <p className="text-sm text-slate-500">A partner or team member sent me</p>
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

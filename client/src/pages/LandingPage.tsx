import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Building2, UserCircle } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

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
          
          {/* Guest Action */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/questionnaire')}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#1a1a2e] text-white rounded-2xl text-lg font-semibold shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:shadow-blue-900/30 transition-all"
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
    </div>
  );
};

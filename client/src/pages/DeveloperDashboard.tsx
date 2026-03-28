import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LayoutDashboard, LogOut, CodeSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DeveloperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-projects');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <CodeSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">ProjectHub</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">Developer Module</p>
          
          <button 
            onClick={() => setActiveTab('my-projects')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'my-projects' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Briefcase className="w-5 h-5" /> My Projects
          </button>
          
          <button 
            onClick={() => setActiveTab('pool')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pool' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Project Pool
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">Developer ({user?.role})</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 border border-slate-300 flex items-center justify-center font-bold">
              {user?.name.charAt(0)}
            </div>
            <button onClick={handleLogout} className="ml-4 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            {activeTab === 'my-projects' && (
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-6">My Assigned Projects</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Mock Project Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">In Progress</span>
                      <span className="text-xs text-slate-400">PRJ-001</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-1">Nova Tech Labs</h3>
                    <p className="text-sm text-slate-500 mb-4">Website + Logo Design</p>
                    <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                      View Client Brief
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'pool' && (
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Available Projects</h1>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                   <p>Claim projects initialized by the Guest Questionnaire here.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

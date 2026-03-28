import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, FolderKanban, Settings, LogOut, CodeSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pool');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
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
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">Admin Module</p>
          
          <button 
            onClick={() => setActiveTab('pool')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pool' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <FolderKanban className="w-5 h-5" /> Project Pool
          </button>
          
          <button 
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'students' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Users className="w-5 h-5" /> Student Management
          </button>
          
          <button 
            onClick={() => setActiveTab('masters')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'masters' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Settings className="w-5 h-5" /> Master Configurations
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              {user?.name.charAt(0)}
            </div>
            <button onClick={handleLogout} className="ml-4 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 p-8 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            {activeTab === 'pool' && (
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Global Project Pool</h1>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                  <FolderKanban className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>In this high-quality prototype, the Project Pool lists all guest submissions.</p>
                  <p className="text-sm mt-2">Connecting to the live MySQL DB will hydrate this module.</p>
                </div>
              </div>
            )}
            {activeTab === 'students' && (
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Student Management</h1>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                   <p>Manage designer access and track claim limits.</p>
                </div>
              </div>
            )}
            {activeTab === 'masters' && (
              <div>
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Master Configurations</h1>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                   <p>As per the requirements, this is where the Admin dynamically configures categories natively injected into the Guest Questionnaire.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

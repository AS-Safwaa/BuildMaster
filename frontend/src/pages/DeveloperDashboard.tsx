// ─────────────────────────────────────────────────────────
// User Dashboard — view assigned projects + submit forms
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, FolderOpen, FileText, LogOut, Clock, CheckCircle2 } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { GuestForm } from '../components/GuestForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MasterConfig, Project } from '../types';
import { INITIAL_MASTER_CONFIG, MOCK_PROJECTS } from '../constants';
import toast from 'react-hot-toast';

export function DeveloperDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [masterConfig] = useState<MasterConfig>(INITIAL_MASTER_CONFIG);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SkeletonDashboard />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <h1 className="font-black text-xl tracking-tighter">
              <span className="text-emerald-600">BUILD</span>MASTER
            </h1>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Developer</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.name || 'Developer'}</p>
              <p className="text-xs text-gray-500">Developer Account</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
              {(user?.name || 'U')[0]}
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </nav>

        {showForm ? (
          <GuestForm
            masterConfig={masterConfig}
            project={projects[0]}
            setProject={(updater) => {
              const newProject = typeof updater === 'function' ? updater(projects[0]) : updater;
              setProjects((prev) => [newProject, ...prev.slice(1)]);
            }}
            onSubmit={() => {
              const submittedProject = { ...projects[0], status: 'Submitted' as const };
              setProjects((prev) => [submittedProject, ...prev.slice(1)]);
              toast.success('Project submitted successfully!');
              setShowForm(false);
            }}
          />
        ) : (
          <main className="max-w-7xl mx-auto p-6 space-y-8 pb-16">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-black text-gray-900">Welcome, {user?.name || 'Developer'}</h2>
              <p className="text-gray-500 mt-1">View your projects and submit forms</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedCard
                delay={0}
                onClick={() => setShowForm(true)}
                className="p-8 hover:border-emerald-200 transition-colors"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
                  <FileText size={24} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Submit New Project</h3>
                <p className="text-gray-500 text-sm">Fill out the project intake form to submit a new website project for development.</p>
              </AnimatedCard>

              <AnimatedCard delay={0.1} className="p-8">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <FolderOpen size={24} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">My Projects</h3>
                <p className="text-gray-500 text-sm">Track the progress of your submitted projects and view their current status.</p>
              </AnimatedCard>
            </div>

            {/* Assigned Projects */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Projects</h3>
              <div className="space-y-4">
                {projects.map((project, i) => (
                  <AnimatedCard key={project.id} delay={0.2 + i * 0.1} className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${project.status === 'Completed' ? 'bg-emerald-100' :
                          project.status === 'In Development' ? 'bg-blue-100' :
                            'bg-amber-100'
                          }`}>
                          {project.status === 'Completed' ? (
                            <CheckCircle2 size={20} className="text-emerald-600" />
                          ) : (
                            <Clock size={20} className={project.status === 'In Development' ? 'text-blue-600' : 'text-amber-600'} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{project.businessName}</p>
                          <p className="text-sm text-gray-500">{project.id}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        project.status === 'In Development' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                        {project.status}
                      </span>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>
    </PageTransition>
  );
}

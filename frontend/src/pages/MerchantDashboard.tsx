// ─────────────────────────────────────────────────────────
// Merchant Dashboard — create/manage own projects + analytics
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Store, Plus, BarChart3, FolderOpen, LogOut, ArrowRight, TrendingUp } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { Modal } from '../components/ui/Modal';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface MerchantProject {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export function MerchantDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [projects, setProjects] = useState<MerchantProject[]>([
    { id: 'mp-1', title: 'Client Website Redesign', description: 'Modern responsive redesign for retail client', status: 'active', createdAt: '2026-03-01' },
    { id: 'mp-2', title: 'E-Commerce Platform', description: 'Full e-commerce solution with payment gateway', status: 'draft', createdAt: '2026-03-10' },
    { id: 'mp-3', title: 'Landing Page Campaign', description: 'Marketing campaign landing page', status: 'completed', createdAt: '2026-02-15' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCreate = () => {
    if (!newTitle.trim()) {
      toast.error('Title is required');
      return;
    }
    const newProject: MerchantProject = {
      id: `mp-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProject, ...prev]);
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
    toast.success('Project created!');
  };

  const stats = [
    { label: 'My Projects', value: projects.length, color: 'bg-blue-50 text-blue-600', icon: FolderOpen },
    { label: 'Active', value: projects.filter((p) => p.status === 'active').length, color: 'bg-emerald-50 text-emerald-600', icon: TrendingUp },
    { label: 'Drafts', value: projects.filter((p) => p.status === 'draft').length, color: 'bg-amber-50 text-amber-600', icon: BarChart3 },
  ];

  if (isLoading) return <SkeletonDashboard />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-lg tracking-tighter uppercase">
              <span className="text-blue-600">BUILD</span>MASTER
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Merchant</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.name || 'Merchant'}</p>
              <p className="text-xs text-gray-500">Merchant Account</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {(user?.name || 'M')[0]}
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 space-y-8 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Merchant Dashboard</h2>
              <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">Manage your projects and view analytics</p>
            </div>
            <AnimatedButton onClick={() => setShowCreateModal(true)}>
              <Plus size={18} /> New Project
            </AnimatedButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <AnimatedCard key={stat.label} delay={i * 0.1} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={22} />
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Analytics Placeholder */}
          <AnimatedCard delay={0.3} className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Project Analytics</h3>
            <div className="grid grid-cols-7 gap-2 h-40 items-end">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const height = [60, 45, 80, 35, 90, 55, 70][i];
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                    />
                    <span className="text-xs text-gray-500 font-medium">{day}</span>
                  </div>
                );
              })}
            </div>
          </AnimatedCard>

          {/* Projects List */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">My Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <AnimatedCard key={project.id} delay={i * 0.1} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      project.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                      {project.status}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                  <p className="text-xs text-gray-400">Created {project.createdAt}</p>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </main>

        {/* Create Project Modal */}
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Project">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Project Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter project title"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Describe the project"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <AnimatedButton variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</AnimatedButton>
              <AnimatedButton onClick={handleCreate}>Create Project</AnimatedButton>
            </div>
          </div>
        </Modal>
      </div>
    </PageTransition>
  );
}

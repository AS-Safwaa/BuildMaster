// ─────────────────────────────────────────────────────────
// Admin Dashboard — manage users, all projects, system config
// Integrates existing AdminConfig and AdminPanel components
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Settings, Users, LayoutGrid, LogOut, Briefcase } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { AdminConfig } from '../components/AdminConfig';
import { AdminPanel } from '../components/AdminPanel';
import { ProjectPool } from '../components/ProjectPool';
import { ProjectDetail } from '../components/ProjectDetail';
import { UserManagement } from '../components/UserManagement';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../services/projects.service';
import { MasterConfig, Project, Developer } from '../types';
import { INITIAL_MASTER_CONFIG, MOCK_PROJECTS, DEVELOPERS } from '../constants';
import toast from 'react-hot-toast';

type AdminView = 'overview' | 'config' | 'pool' | 'detail' | 'users';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState<AdminView>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [masterConfig, setMasterConfig] = useState<MasterConfig>(INITIAL_MASTER_CONFIG);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  // ── Fetch real projects from DB ──────────────────────
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const { data: res } = await projectsApi.getAll();
        if (res.success && res.data.length > 0) {
          setProjects(res.data);
        }
      } catch (error) {
        console.warn('Backend API not available. Using prototype data.');
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };

    fetchProjects();
  }, []; // Only fetch on mount

  const handleViewChange = (newView: AdminView) => {
    setIsLoading(true);
    setView(newView);
    setTimeout(() => setIsLoading(false), 400);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects((prev: Project[]) => prev.map((p: Project) => (p.id === projectId ? { ...p, ...updates } : p)));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  if (isLoading && view === 'overview') return <SkeletonDashboard />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <h1 className="font-bold text-lg tracking-tighter uppercase">
              <span className="text-blue-600">BUILD</span>MASTER
            </h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleViewChange('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <LayoutGrid size={18} /> Overview
              </button>
              <button
                onClick={() => handleViewChange('config')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'config' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Settings size={18} /> Master Config
              </button>
              <button
                onClick={() => handleViewChange('users')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'users' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Users size={18} /> Users
              </button>
              <button
                onClick={() => handleViewChange('pool')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'pool' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Users size={18} /> Project Pool
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
              {(user?.name || 'A')[0]}
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </nav>

        <main className="pb-12">
          {view === 'overview' && (
            <AdminPanel
              projects={projects}
              developers={DEVELOPERS}
              onUpdateProject={updateProject}
              onViewProject={(id) => { setActiveProjectId(id); handleViewChange('detail'); }}
            />
          )}

          {view === 'config' && (
            <AdminConfig config={masterConfig} setConfig={setMasterConfig} />
          )}


          {view === 'pool' && (
            <ProjectPool
              projects={projects}
              onClaim={(id: string) => {
                updateProject(id, { assignedDeveloperId: 'dev1', status: 'In Development' });
              }}
              onView={(id: string) => { setActiveProjectId(id); handleViewChange('detail'); }}
            />
          )}

          {view === 'detail' && activeProject && (
            <ProjectDetail
              project={activeProject}
              role="admin"
              onUpdate={(updates: Partial<Project>) => updateProject(activeProject.id, updates)}
              onBack={() => handleViewChange('overview')}
            />
          )}

          {view === 'users' && (
            <UserManagement />
          )}
        </main>
      </div>
    </PageTransition>
  );
}

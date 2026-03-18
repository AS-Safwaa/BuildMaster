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

type AdminView = 'overview' | 'config' | 'admin-panel' | 'pool' | 'detail' | 'users';

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
          // In a real app, we'd map the DB data to the FE type, 
          // but for this demo, we'll keep the mock data for UI completeness
          // and just demonstrate the API call capability.
          console.log('Successfully fetched projects from backend:', res.data);
          // setProjects(res.data); // Uncomment this to use real DB projects
        }
      } catch (error) {
        console.error('API Error:', error);
        toast.error('Failed to connect to backend API');
      } finally {
        // Just show a small deliberate loading delay for UX feel
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    fetchProjects();
  }, [view]); // Refetch when view changes to show dynamic data

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

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: Briefcase, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Active', value: projects.filter((p: Project) => p.status === 'Submitted' || p.status === 'In Development').length, icon: LayoutGrid, color: 'bg-blue-50 text-blue-600' },
    { label: 'Completed', value: projects.filter((p: Project) => p.status === 'Completed').length, icon: Settings, color: 'bg-emerald-50 text-emerald-600' },
  ];

  if (isLoading && view === 'overview') return <SkeletonDashboard />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Nav */}
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-8">
            <h1 className="font-bold text-lg tracking-tighter uppercase">
              <span className="text-indigo-600">BUILD</span>MASTER
            </h1>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleViewChange('overview')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <LayoutGrid size={18} /> Overview
              </button>
              <button
                onClick={() => handleViewChange('config')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'config' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Settings size={18} /> Master Config
              </button>
              <button
                onClick={() => handleViewChange('users')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Users size={18} /> Users
              </button>
              <button
                onClick={() => handleViewChange('admin-panel')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'admin-panel' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <ShieldCheck size={18} /> Admin Panel
              </button>
              <button
                onClick={() => handleViewChange('pool')}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'pool' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Users size={18} /> All Projects
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
              {(user?.name || 'A')[0]}
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </nav>

        <main className="pb-16">
          {view === 'overview' && (
            <div className="max-w-7xl mx-auto p-6 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h2>
                <p className="text-sm text-gray-500 mt-1">System overview and management</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                  <AnimatedCard key={stat.label} delay={i * 0.1} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon size={22} />
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>

              {/* Recent Projects */}
              <AnimatedCard delay={0.3} className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Projects</h3>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project: Project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                      onClick={() => { setActiveProjectId(project.id); handleViewChange('detail'); }}
                    >
                      <div>
                        <p className="font-bold text-gray-900">{project.businessName}</p>
                        <p className="text-sm text-gray-500">{project.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        project.status === 'In Development' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                        {project.status}
                      </span>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>
          )}

          {view === 'config' && (
            <AdminConfig config={masterConfig} setConfig={setMasterConfig} />
          )}

          {view === 'admin-panel' && (
            <AdminPanel
              projects={projects}
              developers={DEVELOPERS}
              onUpdateProject={updateProject}
              onViewProject={(id) => { setActiveProjectId(id); handleViewChange('detail'); }}
            />
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
              onBack={() => handleViewChange('admin-panel')}
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

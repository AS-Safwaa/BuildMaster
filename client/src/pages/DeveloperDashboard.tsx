import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, LayoutDashboard, LogOut, Activity, 
  UserCircle, CheckCircle2, Globe, X, ClipboardList, Zap, ArrowUpRight, Menu,
  RotateCcw, Clock, Shield, Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IS_PROTOTYPE } from '../config/prototype';
import API_BASE_URL from '../config/api';
import { MOCK_PROJECTS } from '../data/mockProjects';

// --- Prototype Fallback Data ---
const FALLBACK_POOL = MOCK_PROJECTS.filter(p => p.status === 'unassigned');
const FALLBACK_MINE = MOCK_PROJECTS.filter(p => p.status === 'assigned');

export const DeveloperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [metrics, setMetrics] = useState<any>({ 
    poolSize: FALLBACK_POOL.length, 
    myProjects: FALLBACK_MINE.length, 
    completedProjects: 2,
    pendingTasks: 4,
    avgCompletionTime: '4.2 days',
    productivityScore: 94
  });
  const [pool, setPool] = useState<any[]>(FALLBACK_POOL);
  const [myProjects, setMyProjects] = useState<any[]>(FALLBACK_MINE);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchMetrics = async () => {
    if (IS_PROTOTYPE) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/developer/dashboard/overview`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      setMetrics(res.data);
    } catch(err) { console.error(err); }
  };

  const fetchPool = async () => {
    if (IS_PROTOTYPE) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/developer/projects/pool`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      const formatted = res.data.map((p: any) => ({
        ...p,
        answers: typeof p.answers === 'string' ? JSON.parse(p.answers) : (p.answers || {})
      }));
      if (formatted.length > 0) setPool(formatted);
    } catch(err) { 
        // keep fallback
    }
  };

  const fetchMine = async () => {
    if (IS_PROTOTYPE) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/developer/projects/mine`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      const formatted = res.data.map((p: any) => ({
        ...p,
        answers: typeof p.answers === 'string' ? JSON.parse(p.answers) : (p.answers || {})
      }));
      if (formatted.length > 0) setMyProjects(formatted);
    } catch(err) { 
        // keep fallback
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'pool', 'my-projects', 'profile'].includes(tabParam)) {
        setActiveTab(tabParam);
    }
  }, []);

  useEffect(() => {
    if (!IS_PROTOTYPE) {
        fetchMetrics();
        fetchPool();
        fetchMine();
    }
  }, [activeTab]);

  const handleClaim = async (id: number) => {
    if (IS_PROTOTYPE) {
      toast.success('Project Claimed Successfully!');
      const projectToClaim = pool.find(p => p.id === id);
      if (projectToClaim) {
          setMyProjects((prev: any) => [...prev, { ...projectToClaim, assigned_developer_id: 'DEV-001', status: 'assigned' }]);
          setPool((prev: any) => prev.filter((p: any) => p.id !== id));
          setMetrics((prev: any) => ({ 
            ...prev, 
            poolSize: Math.max(0, prev.poolSize - 1), 
            myProjects: prev.myProjects + 1,
            pendingTasks: prev.pendingTasks + 1
          }));
      }
      navigate(`/project/${id}?mode=active`);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/developer/projects/${id}/claim`, {}, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      toast.success('Project Claimed Successfully!');
      navigate(`/project/${id}?mode=active`);
    } catch(err) { toast.error('Failed to claim project'); }
  };

  const handleUnclaim = async (id: number) => {
    if (IS_PROTOTYPE) {
      toast.success('Project returned to pool');
      const projectToUnclaim = myProjects.find(p => p.id === id);
      if (projectToUnclaim) {
          setPool((prev: any) => [...prev, { ...projectToUnclaim, assigned_developer_id: null, status: 'unassigned' }]);
          setMyProjects((prev: any) => prev.filter((p: any) => p.id !== id));
          setMetrics((prev: any) => ({ 
            ...prev, 
            poolSize: prev.poolSize + 1, 
            myProjects: Math.max(0, prev.myProjects - 1),
            pendingTasks: Math.max(0, prev.pendingTasks - 1)
          }));
      }
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/developer/projects/${id}/unclaim`, {}, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      toast.success('Project released to pool');
      fetchMine();
      fetchMetrics();
      fetchPool();
    } catch(err) { toast.error('Failed to release'); }
  };

  const switchTab = (tab: string) => {
      setActiveTab(tab);
      navigate(`/developer?tab=${tab}`, { replace: true });
      setMobileMenuOpen(false);
  };

  const openProject = (id: number, mode: 'preview' | 'active' = 'active') => {
    navigate(`/project/${id}?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row relative font-sans text-slate-600">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-[110] shadow-2xl flex flex-col md:hidden"
            >
                <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-indigo-500 fill-current" />
                    <span className="font-extrabold text-xl text-white">ProjectHub</span>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)} className="ml-auto p-2 text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="flex-1 p-5 space-y-2">
                    <TabNavItem icon={<LayoutDashboard />} label="Performance" active={activeTab === 'overview'} onClick={() => switchTab('overview')} />
                    <TabNavItem icon={<Activity />} label="Global Pool" active={activeTab === 'pool'} onClick={() => switchTab('pool')} />
                    <TabNavItem icon={<Briefcase />} label="My Assignments" active={activeTab === 'my-projects'} onClick={() => switchTab('my-projects')} />
                    <TabNavItem icon={<UserCircle />} label="Profile CMS" active={activeTab === 'profile'} onClick={() => switchTab('profile')} />
                </nav>
                <div className="p-5 border-t border-slate-800">
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition-all">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col z-20 shadow-xl overflow-y-auto shrink-0 hidden md:flex">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">ProjectHub</span>
          </div>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Workspace</p>
          <TabNavItem icon={<LayoutDashboard />} label="Performance" active={activeTab === 'overview'} onClick={() => switchTab('overview')} />
          <TabNavItem icon={<Activity />} label="Global Pool" active={activeTab === 'pool'} onClick={() => switchTab('pool')} />
          <TabNavItem icon={<Briefcase />} label="My Assignments" active={activeTab === 'my-projects'} onClick={() => switchTab('my-projects')} />
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 mt-8">Account</p>
          <TabNavItem icon={<UserCircle />} label="Profile CMS" active={activeTab === 'profile'} onClick={() => switchTab('profile')} />
        </nav>

        <div className="p-5 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all group">
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative w-full overflow-hidden min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg transition-colors">
                <Menu className="w-6 h-6" />
            </button>
            <div className="px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100 text-[8px] md:text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                <span>Dev Ops {IS_PROTOTYPE && '(Mock)'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-xs md:text-sm font-semibold text-slate-800 tracking-tight">{user?.name}</p>
              <p className="text-[8px] md:text-xs text-slate-500 font-medium uppercase tracking-widest">{user?.role}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-100 border border-slate-200 shadow-sm text-slate-900 flex items-center justify-center font-bold text-sm md:text-base">
               {user?.name?.charAt(0)}
            </div>
            <button 
              onClick={handleLogout} 
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
                <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-auto pb-40 z-10 custom-scrollbar bg-[#f8fafc]">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full">
            {activeTab === 'overview' && (
              <div className="space-y-6 md:space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Execution Analytics</h1>
                    <p className="text-slate-500 font-medium text-xs md:text-base leading-relaxed">Personal performance tracking and pipeline metrics.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm self-start">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                       {metrics.productivityScore}%
                    </div>
                    <div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Productivity</p>
                      <p className="text-xs font-bold text-slate-900">High Efficiency</p>
                    </div>
                  </div>
                </header>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <KPICard 
                    label="Unassigned Pool" 
                    value={metrics.poolSize} 
                    unit="Projects"
                    color="indigo" 
                    icon={<Activity />}
                    onClick={() => setActiveTab('pool')}
                  />
                  <KPICard 
                    label="Active Workspace" 
                    value={metrics.myProjects} 
                    unit="Active"
                    color="blue" 
                    icon={<Briefcase />}
                    onClick={() => setActiveTab('my-projects')}
                  />
                  <KPICard 
                    label="Archived Ops" 
                    value={metrics.completedProjects} 
                    unit="Done"
                    color="emerald" 
                    icon={<CheckCircle2 />}
                  />
                  <KPICard 
                    label="Pending Tasks" 
                    value={metrics.pendingTasks} 
                    unit="Tasks"
                    color="amber" 
                    icon={<ClipboardList />}
                  />
                  <KPICard 
                    label="Avg Completion" 
                    value="4.2" 
                    unit="Days"
                    color="purple" 
                    icon={<Clock />}
                  />
                  <KPICard 
                    label="Total Processed" 
                    value={metrics.poolSize + metrics.myProjects + metrics.completedProjects} 
                    unit="Total"
                    color="slate" 
                    icon={<Globe />}
                  />
                </div>

                <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm overflow-hidden relative group transition-all hover:shadow-xl">
                   <div className="absolute top-0 right-0 p-10 opacity-[0.03] scale-[3] pointer-events-none group-hover:scale-[3.5] group-hover:rotate-6 transition-all">
                      <Zap className="w-20 h-20 text-indigo-600" />
                   </div>
                   <div className="relative z-10">
                     <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-600" /> Throughput Summary
                     </h3>
                     <div className="space-y-6">
                        <ProgressBar label="Pipeline Stability" progress={88} color="indigo" />
                        <ProgressBar label="Quality Index" progress={92} color="emerald" />
                        <ProgressBar label="Uptime Consistency" progress={99} color="blue" />
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'pool' && (
              <div className="space-y-6 md:space-y-8">
                <header>
                  <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Global Project Pool</h1>
                  <p className="text-slate-500 font-medium text-xs md:text-base leading-relaxed">Claim unassigned tasks to begin execution.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {pool.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-200">
                      <p className="text-slate-400 font-bold uppercase tracking-widest italic">No Projects in Pool</p>
                    </div>
                  ) : pool.map((project: any) => (
                    <div key={project.id} className="group relative bg-white border border-slate-200 rounded-[2.5rem] p-8 transition-all hover:bg-slate-50/50 hover:border-indigo-500/50 hover:shadow-xl">
                      <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                              {project.businessName || 'Unnamed Business'}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{project.mainCategory || 'New Intake'}</span>
                              <span>•</span>
                              <span>Ref #{project.id}</span>
                            </div>
                          </div>
                          <div className="bg-emerald-500/10 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black border border-emerald-500/20 uppercase">
                            Available
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Contact Access</p>
                            <p className="text-slate-700 text-sm font-bold truncate">{project.contact_phone || project.contact_email || 'Verified'}</p>
                          </div>
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Ingestion</p>
                            <p className="text-slate-700 text-sm font-bold">{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Active'}</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button 
                            onClick={() => openProject(project.id, 'preview')}
                            className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 shadow-sm"
                          >
                            View Brief
                          </button>
                          <button 
                            onClick={() => handleClaim(project.id)}
                            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2"
                          >
                            Claim Task
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'my-projects' && (
              <div className="space-y-6 md:space-y-8">
                <header>
                  <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">My Active Workspace</h1>
                  <p className="text-slate-500 font-medium text-xs md:text-base leading-relaxed">Ongoing executions assigned to your node.</p>
                </header>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                  {myProjects.length === 0 ? (
                    <div className="col-span-full py-12 md:py-20 text-center bg-white rounded-2xl md:rounded-[1.5rem] border-2 border-dashed border-slate-200">
                       <p className="text-slate-400 font-bold text-sm md:text-base uppercase tracking-widest italic">No Active Projects Found</p>
                    </div>
                  ) : myProjects.map((p: any) => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-2xl md:rounded-[1.5rem] p-6 md:p-8 shadow-sm flex flex-col group hover:shadow-xl hover:border-indigo-200 transition-all relative overflow-hidden">
                       <div className="flex justify-between items-start mb-4 md:mb-6 border-b border-slate-50 pb-4 md:pb-6">
                          <span className="px-3 py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                            <Activity className="w-3 h-3" /> {p.status.replace('_', ' ')}
                          </span>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleUnclaim(p.id); }} 
                            className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1.5 p-1"
                          >
                             <RotateCcw className="w-3 h-3" /> Release
                          </button>
                       </div>
                       <div className="mb-6 md:mb-8">
                         <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg md:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase">{p.businessName}</h3>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ID: {p.id}</p>
                            </div>
                         </div>
                         <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200 uppercase">{p.answers?.projectType || 'Standard Execution'}</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100 flex items-center gap-1">
                               <Phone className="w-3 h-3" /> {p.answers?.phone || 'Not Shared'}
                            </span>
                         </div>
                       </div>
                       <div className="flex gap-3">
                          <button onClick={() => openProject(p.id, 'active')} className="flex-1 py-3 md:py-4 bg-white border border-slate-900 text-slate-900 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm">
                             <ClipboardList className="w-4 h-4 md:w-5 h-5" /> Detailed Workspace
                          </button>
                          <button onClick={() => openProject(p.id, 'active')} className="w-12 md:w-16 h-12 md:h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-md group-hover:scale-105 active:scale-95">
                             <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto py-6 md:py-10 text-center">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-2xl text-white flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl relative">
                    <UserCircle className="w-10 h-10 md:w-10 md:h-10" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center">
                       <Shield className="w-3 h-3 text-white" />
                    </div>
                 </div>
                 <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4 md:mb-8">Node Identity</h1>
                 <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[1.5rem] border border-slate-200 shadow-sm space-y-6 md:space-y-8 text-left">
                    <InputPiece label="System Node" value={user?.name} icon={<CheckCircle2 />} />
                    <InputPiece label="Global Email" value={user?.email} icon={<Globe />} />
                    <InputPiece label="Assigned Role" value={user?.role} icon={<Zap />} />
                 </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

    </div>
  );
};

// --- Helpers ---

const TabNavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {React.cloneElement(icon, { className: 'w-5 h-5' })} {label}
  </button>
);

const KPICard = ({ label, value, color, unit, icon, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    onClick={onClick}
    className={`bg-white border border-slate-200 rounded-3xl p-5 md:p-8 shadow-sm hover:shadow-xl transition-all h-full flex flex-col justify-between ${onClick ? 'cursor-pointer border-opacity-50 hover:border-' + color + '-400' : ''}`}
  >
    <div>
        <div className="flex justify-between items-start mb-4 md:mb-6">
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-${color === 'blue' ? 'blue' : color === 'indigo' ? 'indigo' : color === 'emerald' ? 'emerald' : color === 'amber' ? 'amber' : color === 'purple' ? 'purple' : 'slate'}-50 flex items-center justify-center text-${color === 'blue' ? 'blue' : color === 'indigo' ? 'indigo' : color === 'emerald' ? 'emerald' : color === 'amber' ? 'amber' : color === 'purple' ? 'purple' : 'slate'}-600 border border-${color === 'blue' ? 'blue' : color === 'indigo' ? 'indigo' : color === 'emerald' ? 'emerald' : color === 'amber' ? 'amber' : color === 'purple' ? 'purple' : 'slate'}-100`}>
               {React.cloneElement(icon, { className: 'w-5 h-5 md:w-7 md:h-7' })}
            </div>
            {onClick && <ArrowUpRight className="w-5 h-5 text-slate-300" />}
        </div>
        <div className="flex items-baseline gap-1.5 overflow-hidden">
            <p className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight truncate">{value}</p>
            {unit && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{unit}</p>}
        </div>
    </div>
    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-4 block">{label}</p>
  </motion.div>
);

const ProgressBar = ({ label, progress, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] md:text-xs font-bold uppercase tracking-widest">
       <span className="text-slate-500">{label}</span>
       <span className={`text-${color}-600`}>{progress}%</span>
    </div>
    <div className="w-full h-2 md:h-3 bg-slate-100 rounded-full overflow-hidden">
       <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-${color}-600 rounded-full`}
       />
    </div>
  </div>
);

const InputPiece = ({ label, value, icon }: any) => (
  <div className="space-y-1 md:space-y-2">
    <div className="flex items-center gap-2 opacity-50 px-1">
       {React.cloneElement(icon, { className: 'w-3 h-3 md:w-4 md:h-4 text-indigo-600' })}
       <p className="text-[7px] md:text-[9px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
    <div className="w-full px-5 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs md:text-base">
      {value || 'Synchronizing...'}
    </div>
  </div>
);

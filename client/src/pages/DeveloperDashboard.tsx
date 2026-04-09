import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, LayoutDashboard, LogOut, Activity, 
  UserCircle, CheckCircle2, Globe, X, ClipboardList, Zap, ArrowUpRight, Menu,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IS_PROTOTYPE } from '../config/prototype';
import API_BASE_URL from '../config/api';

// --- Prototype Fallback Data ---
const FALLBACK_POOL = [
  { 
    id: 101, businessName: "Skyline Realty Group", createdAt: new Date().toISOString(), status: "unassigned", 
    answers: {
      businessName: "Skyline Realty Group", projectType: "Both Logo & Site", contactName: "Michael West",
      brandPersonality: ["Minimalist", "Modern"], preferredTone: "Professional",
      websiteGoals: ["Showcase Properties", "Direct Booking"],
      preferredColors: ["#1E293B", "#64748B"], logoStatus: "improve"
    }
  },
  { id: 102, businessName: "Organic Perk Coffee", createdAt: new Date().toISOString(), status: "unassigned", answers: { businessName: "Organic Perk Coffee", projectType: "Logo Design" } },
  { id: 103, businessName: "Nexus Logistics", createdAt: new Date().toISOString(), status: "unassigned", answers: { businessName: "Nexus Logistics", projectType: "Website" } }
];

const FALLBACK_MINE = [
  { 
    id: 7, businessName: "Royal Mart", email: "royal@mart.com", status: "assigned", 
    answers: {
      businessName: "Royal Mart", projectType: "Both Logo & Site", contactName: "Aditya Shah",
      brandPersonality: ["Elegant", "Authoritative"], preferredTone: "Bold Professional",
      websiteGoals: ["Increase Local Sales", "Online Catalog"], 
      preferredColors: ["#0F172A", "#F59E0B"], logoStatus: "improve"
    }
  }
];

export const DeveloperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [metrics, setMetrics] = useState<any>({ poolSize: 3, myProjects: 1, completedProjects: 0 });
  const [pool, setPool] = useState<any[]>(FALLBACK_POOL);
  const [myProjects, setMyProjects] = useState<any[]>(FALLBACK_MINE);
  const [isFetching, setIsFetching] = useState(false);

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
    setIsFetching(true);
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
    } finally { setIsFetching(false); }
  };

  const fetchMine = async () => {
    if (IS_PROTOTYPE) return;
    setIsFetching(true);
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
    } finally { setIsFetching(false); }
  };

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
          setMyProjects(prev => [...prev, { ...projectToClaim, assigned_developer_id: 'DEV-001', status: 'assigned' }]);
          setPool(prev => prev.filter(p => p.id !== id));
          setMetrics(prev => ({ ...prev, poolSize: Math.max(0, prev.poolSize - 1), myProjects: prev.myProjects + 1 }));
      }
      setActiveTab('my-projects');
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/developer/projects/${id}/claim`, {}, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      toast.success('Project Claimed Successfully!');
      fetchPool();
      fetchMetrics();
      fetchMine();
      setActiveTab('my-projects');
    } catch(err) { toast.error('Failed to claim project'); }
  };

  const handleUnclaim = async (id: number) => {
    if (IS_PROTOTYPE) {
      toast.success('Project returned to pool');
      const projectToUnclaim = myProjects.find(p => p.id === id);
      if (projectToUnclaim) {
          setPool(prev => [...prev, { ...projectToUnclaim, assigned_developer_id: null, status: 'unassigned' }]);
          setMyProjects(prev => prev.filter(p => p.id !== id));
          setMetrics(prev => ({ ...prev, poolSize: prev.poolSize + 1, myProjects: Math.max(0, prev.myProjects - 1) }));
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
      setMobileMenuOpen(false);
  };

  const openProject = (id: number) => {
    navigate(`/project/${id}`);
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
                <header>
                  <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Execution Analytics</h1>
                  <p className="text-slate-500 font-medium text-xs md:text-base leading-relaxed">System-wide overview of project ingestion and current throughput.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                  <KPICard 
                    label="Unassigned Pool" 
                    value={metrics?.poolSize || 0} 
                    color="indigo" 
                    onClick={() => setActiveTab('pool')}
                  />
                  <KPICard 
                    label="Active Workspace" 
                    value={metrics?.myProjects || 0} 
                    color="blue" 
                    onClick={() => setActiveTab('my-projects')}
                  />
                  <KPICard 
                    label="Archived Ops" 
                    value={metrics?.completedProjects || 0} 
                    color="emerald" 
                  />
                </div>
              </div>
            )}

            {activeTab === 'pool' && (
              <div className="space-y-6 md:space-y-8">
                <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Global Project Pool</h1>
                <div className="bg-white rounded-2xl md:rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm text-slate-600 min-w-[600px]">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Identity</th>
                          <th className="px-6 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ingestion Date</th>
                          <th className="px-6 md:px-10 py-4 md:py-6 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Execution</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pool.length === 0 ? (
                           <tr>
                               <td colSpan={3} className="px-10 py-20 text-center text-slate-400 font-medium italic uppercase tracking-widest">No Projects in Pool</td>
                           </tr>
                        ) : pool.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 md:px-10 py-4 md:py-6">
                               <p className="font-semibold text-slate-900 text-sm md:text-base group-hover:text-indigo-600 transition-colors">{p.businessName}</p>
                               <p className="text-[8px] md:text-xs text-slate-400 font-medium tracking-tight uppercase">Ref-{p.id}</p>
                            </td>
                            <td className="px-6 md:px-10 py-4 md:py-6 font-medium text-slate-500 font-mono text-[10px] md:text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 md:px-10 py-4 md:py-6 text-center space-x-2 md:space-x-3 whitespace-nowrap">
                               <button onClick={() => openProject(p.id)} className="px-3 md:px-5 py-2 md:py-2.5 border border-slate-900 text-slate-900 rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                  View Brief
                               </button>
                               <button onClick={() => handleClaim(p.id)} className="px-3 md:px-5 py-2 md:py-2.5 bg-indigo-600 text-white rounded-lg text-[8px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                                  Claim Task
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'my-projects' && (
              <div className="space-y-6 md:space-y-8">
                <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">My Active Workspace</h1>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                  {myProjects.length === 0 ? (
                    <div className="col-span-full py-12 md:py-20 text-center bg-white rounded-2xl md:rounded-[1.5rem] border-2 border-dashed border-slate-200">
                       <p className="text-slate-400 font-bold text-sm md:text-base uppercase tracking-widest italic">No Active Projects Found</p>
                    </div>
                  ) : myProjects.map((p: any) => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-2xl md:rounded-[1.5rem] p-6 md:p-8 shadow-sm flex flex-col group hover:shadow-md hover:border-indigo-100 transition-all relative overflow-hidden">
                       <div className="flex justify-between items-start mb-4 md:mb-6 border-b border-slate-50 pb-4 md:pb-6">
                          <span className="px-3 py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {p.status.replace('_', ' ')}
                          </span>
                          <button 
                            onClick={() => handleUnclaim(p.id)} 
                            className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1.5"
                          >
                             <RotateCcw className="w-3 h-3" /> Release
                          </button>
                       </div>
                       <h3 className="text-lg md:text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{p.businessName}</h3>
                       <p className="text-[10px] md:text-sm font-medium text-slate-400 mb-6 md:mb-8 font-mono">{p.email || 'guest@system.node'}</p>
                       <div className="flex gap-3">
                          <button onClick={() => openProject(p.id)} className="flex-1 py-3 md:py-4 bg-white border border-slate-900 text-slate-900 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2">
                             <ClipboardList className="w-4 h-4 md:w-5 h-5" /> Detailed Brief
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto py-6 md:py-10 text-center">
                 <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-xl md:rounded-2xl text-white flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-2xl">
                    <UserCircle className="w-10 h-10 md:w-10 md:h-10" />
                 </div>
                 <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight mb-4 md:mb-8">Node Identity</h1>
                 <div className="bg-white p-6 md:p-10 rounded-2xl md:rounded-[1.5rem] border border-slate-200 shadow-sm space-y-6 md:space-y-8 text-left">
                    <InputPiece label="System Name" value={user?.name} icon={<CheckCircle2 />} />
                    <InputPiece label="Global Email" value={user?.email} icon={<Globe />} />
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

const KPICard = ({ label, value, color, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    onClick={onClick}
    className={`bg-white border border-slate-200 rounded-2xl md:rounded-[1.5rem] p-5 md:p-8 shadow-sm hover:shadow-xl transition-all ${onClick ? 'cursor-pointer border-opacity-50 hover:border-' + color + '-400' : ''}`}
  >
    <div className="flex justify-between items-start mb-2 md:mb-4">
        <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        {onClick && <ArrowUpRight className={`w-3 h-3 text-${color === 'blue' ? 'blue' : color === 'indigo' ? 'indigo' : 'emerald'}-400`} />}
    </div>
    <div className="flex items-baseline gap-2">
        <p className={`text-3xl md:text-5xl font-bold text-${color === 'blue' ? 'blue' : color === 'indigo' ? 'indigo' : 'emerald'}-600 tracking-tight`}>{value}</p>
        <p className="text-[10px] text-slate-400 font-medium lowercase tracking-tight">records</p>
    </div>
  </motion.div>
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

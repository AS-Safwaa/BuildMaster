import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, LayoutDashboard, LogOut, CodeSquare, Activity, 
  UserCircle, CheckCircle2, Globe, Plus, X, ClipboardList, Zap, ArrowUpRight, Clock, Copy, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

// --- Prototype Fallback Data ---
const FALLBACK_POOL = [
  { 
    id: 101, businessName: "Skyline Realty Group", createdAt: new Date().toISOString(), status: "unassigned", 
    answers: {
      businessName: "Skyline Realty Group", projectType: "Both Logo & Site", contactName: "Michael West",
      brandPersonality: "Minimalist & Modern", brandTone: "Clean Professional",
      websiteGoals: ["Showcase Properties", "Direct Booking"],
      preferredColors: ["#1E293B", "#64748B"], logoStatus: "Needs Modern Refresh"
    }
  },
  { id: 102, businessName: "Organic Perk Coffee", createdAt: new Date().toISOString(), status: "unassigned", answers: { businessName: "Organic Perk Coffee", projectType: "Design a Logo" } },
  { id: 103, businessName: "Nexus Logistics", createdAt: new Date().toISOString(), status: "unassigned", answers: { businessName: "Nexus Logistics", projectType: "Build a Website" } }
];

const FALLBACK_MINE = [
  { 
    id: 7, businessName: "Royal Mart", email: "royal@mart.com", status: "assigned", 
    answers: {
      businessName: "Royal Mart", projectType: "Both Logo & Site", contactName: "Aditya Shah",
      brandPersonality: "Elegant & Authoritative", brandTone: "Bold Professional",
      websiteGoals: ["Increase Local Sales", "Online Catalog"], 
      preferredColors: ["#0F172A", "#F59E0B"], logoStatus: "Needs Rebranding"
    }
  }
];

export const DeveloperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewProject, setViewProject] = useState<any>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<any>(null);
  const [pool, setPool] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchMetrics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/developer/dashboard/overview`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setMetrics(res.data);
    } catch(err) { console.error(err); }
  };

  const fetchPool = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/developer/projects/pool`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const formatted = res.data.map((p: any) => ({
        ...p,
        answers: typeof p.answers === 'string' ? JSON.parse(p.answers) : (p.answers || {})
      }));
      setPool(formatted.length > 0 ? formatted : FALLBACK_POOL);
    } catch(err) { 
      setPool(FALLBACK_POOL); 
    } finally { setIsFetching(false); }
  };

  const fetchMine = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/developer/projects/mine`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const formatted = res.data.map((p: any) => ({
        ...p,
        answers: typeof p.answers === 'string' ? JSON.parse(p.answers) : (p.answers || {})
      }));
      setMyProjects(formatted.length > 0 ? formatted : FALLBACK_MINE);
    } catch(err) { 
      setMyProjects(FALLBACK_MINE);
    } finally { setIsFetching(false); }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchMetrics();
    if (activeTab === 'pool') fetchPool();
    if (activeTab === 'my-projects') fetchMine();
  }, [activeTab]);

  const handleClaim = async (id: number) => {
    try {
      await axios.post(`${API_BASE_URL}/developer/projects/${id}/claim`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      toast.success('Project Claimed Successfully!');
      setViewProject(null);
      setActiveTab('my-projects');
    } catch(err) { toast.error('Failed to claim project'); }
  };

  const handleUnclaim = async (id: number) => {
    try {
      await axios.post(`${API_BASE_URL}/developer/projects/${id}/unclaim`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      toast.success('Project returned to pool');
      setViewProject(null);
      fetchMine();
    } catch(err) { toast.error('Failed to unclaim'); }
  };

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(section);
    toast.success(`Copied ${section} details!`);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans text-slate-600">
      <aside className="w-64 bg-slate-900 flex flex-col z-20 shadow-xl overflow-y-auto shrink-0">
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
          <TabNavItem icon={<LayoutDashboard />} label="Performance" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabNavItem icon={<Activity />} label="Global Pool" active={activeTab === 'pool'} onClick={() => setActiveTab('pool')} />
          <TabNavItem icon={<Briefcase />} label="My Assignments" active={activeTab === 'my-projects'} onClick={() => setActiveTab('my-projects')} />
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 mt-8">Account</p>
          <TabNavItem icon={<UserCircle />} label="Profile CMS" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="p-5 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all group">
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10 shadow-sm shrink-0">
          <div className="px-4 py-2 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-indigo-500" />
            Developer Workspace
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800 tracking-tight">{user?.name}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{user?.role}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-100 shadow-md text-white flex items-center justify-center font-black text-lg">
               {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-auto pb-40 z-10 custom-scrollbar bg-[#f8fafc]">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto h-full">
            {activeTab === 'overview' && (
              <div className="space-y-12">
                <header>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Execution Analytics</h1>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed">System-wide overview of project ingestion and current throughput.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <KPICard label="Unassigned Pool" value={metrics?.poolSize || 3} color="indigo" />
                  <KPICard label="Active Workspace" value={metrics?.myProjects || 1} color="blue" />
                  <KPICard label="Archived Ops" value={metrics?.completedProjects || 0} color="emerald" />
                </div>
              </div>
            )}

            {activeTab === 'pool' && (
              <div className="space-y-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Global Project Pool</h1>
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Identity</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ingestion Date</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Execution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pool.map((p: any) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-10 py-6">
                             <p className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{p.businessName}</p>
                             <p className="text-xs text-slate-400 font-bold tracking-tight uppercase">Ref-{p.id}</p>
                          </td>
                          <td className="px-10 py-6 font-bold text-slate-500 font-mono text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                          <td className="px-10 py-6 text-center space-x-3">
                             <button onClick={() => setViewProject(p)} className="px-6 py-3 border-2 border-slate-900 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                View Brief
                             </button>
                             <button onClick={() => handleClaim(p.id)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md active:scale-95">
                                Claim Task
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'my-projects' && (
              <div className="space-y-8">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Active Workspace</h1>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {myProjects.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                       <p className="text-slate-400 font-black text-xl uppercase tracking-widest italic">No Active Projects Found</p>
                    </div>
                  ) : myProjects.map((p: any) => (
                    <div key={p.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col group hover:shadow-xl hover:border-indigo-100 transition-all relative overflow-hidden">
                       <div className="flex justify-between items-start mb-8 border-b border-slate-50 pb-6">
                          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-100 text-indigo-700">
                            {p.status.replace('_', ' ')}
                          </span>
                          <button onClick={() => handleUnclaim(p.id)} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600">Mistaken Claim? (Unclaim)</button>
                       </div>
                       <h3 className="text-3xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{p.businessName}</h3>
                       <p className="text-sm font-bold text-slate-400 mb-8 font-mono">{p.email || 'guest@system.node'}</p>
                       <div className="flex gap-4">
                          <button onClick={() => setViewProject(p)} className="flex-1 py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-3">
                             <ClipboardList className="w-5 h-5" /> Detailed Brief
                          </button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto py-10 text-center">
                 <div className="w-24 h-24 bg-slate-900 rounded-[2.5rem] text-white flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <UserCircle className="w-12 h-12" />
                 </div>
                 <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-8">Node Identity</h1>
                 <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-8 text-left">
                    <InputPiece label="System Name" value={user?.name} icon={<CheckCircle2 />} />
                    <InputPiece label="Global Email" value={user?.email} icon={<Globe />} />
                 </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {viewProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[4rem] w-full max-w-6xl h-[90vh] shadow-2xl border border-white flex flex-col overflow-hidden">
               {/* Modal Header */}
               <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-[1.75rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl">
                        <ClipboardList className="w-8 h-8" />
                     </div>
                     <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter capitalize">{viewProject.businessName} Brief</h2>
                        <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px]">Client Ingestion Payload (ID: {viewProject.id})</p>
                     </div>
                  </div>
                  <button onClick={() => setViewProject(null)} className="p-5 bg-white hover:bg-slate-50 rounded-[2rem] border border-slate-100 transition-all shadow-sm">
                    <X className="w-8 h-8 text-slate-400" />
                  </button>
               </div>

               {/* Modal Body */}
               <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar">
                  {/* Dynamic Section Renderer */}
                  {Object.entries(groupBySection(viewProject.answers)).map(([section, items]: any) => (
                    <div key={section} className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden group">
                       <div className="bg-slate-50/80 px-10 py-6 border-b border-slate-100 flex justify-between items-center group-hover:bg-slate-100 transition-colors">
                          <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-0 pr-4">{section}</p>
                          <button 
                            onClick={() => handleCopy(formatSectionText(section, items), section)} 
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
                          >
                            {copyStatus === section ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            {copyStatus === section ? 'Copied' : `Copy ${section}`}
                          </button>
                       </div>
                       <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {items.map((item: any) => (
                            <AnalyticField key={item.key} label={item.key.replace(/([A-Z])/g, ' $1')} value={item.value} />
                          ))}
                       </div>
                    </div>
                  ))}
               </div>

               {/* Modal Footer */}
               <div className="p-10 bg-white border-t border-slate-100 flex justify-end gap-5">
                  <button onClick={() => setViewProject(null)} className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Close Viewer</button>
                  {viewProject.assigned_developer_id ? (
                    <button onClick={() => handleUnclaim(viewProject.id)} className="px-10 py-5 border-2 border-red-500 text-red-500 rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-50 transition-all">Unclaim Task</button>
                  ) : (
                    <button onClick={() => handleClaim(viewProject.id)} className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">Claim & Start Work</button>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Helpers ---

const groupBySection = (answers: any) => {
  const sections: any = {
    "Venture Basics": [],
    "Design Archetype": [],
    "Functional Requirements": [],
    "Strategic Goals": [],
    "Technical Specifications": [],
    "Others / Miscellaneous": []
  };

  Object.entries(answers).forEach(([key, value]) => {
    const k = key.toLowerCase();
    if (k.includes('business') || k.includes('name') || k.includes('contact')) sections["Venture Basics"].push({ key, value });
    else if (k.includes('logo') || k.includes('brand') || k.includes('color') || k.includes('tone') || k.includes('personality')) sections["Design Archetype"].push({ key, value });
    else if (k.includes('website') || k.includes('site') || k.includes('feature')) sections["Functional Requirements"].push({ key, value });
    else if (k.includes('goal') || k.includes('target') || k.includes('purpose')) sections["Strategic Goals"].push({ key, value });
    else if (k.includes('domain') || k.includes('hosting') || k.includes('server')) sections["Technical Specifications"].push({ key, value });
    else sections["Others / Miscellaneous"].push({ key, value });
  });

  // Filter out empty sections
  return Object.fromEntries(Object.entries(sections).filter(([_, v]: any) => v.length > 0));
};

const formatSectionText = (title: string, items: any[]) => {
  return `--- ${title.toUpperCase()} ---\n` + items.map(i => `${i.key.replace(/([A-Z])/g, ' $1').toUpperCase()}: ${Array.isArray(i.value) ? i.value.join(', ') : i.value}`).join('\n');
};

const TabNavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {React.cloneElement(icon, { className: 'w-5 h-5' })} {label}
  </button>
);

const KPICard = ({ label, value, color }: any) => (
  <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{label}</p>
    <p className={`text-6xl font-black text-${color === 'blue' ? 'blue' : color === 'indigo' ? 'indigo' : 'emerald'}-600 tracking-tighter`}>{value}</p>
  </div>
);

const MiniAnalytic = ({ field, value }: any) => (
  <div className="space-y-1">
     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{field}</p>
     <p className="text-lg font-black text-slate-800 tracking-tight truncate">{Array.isArray(value) ? value[0] : value || 'N/A'}</p>
  </div>
);

const AnalyticField = ({ label, value }: any) => (
  <div className="space-y-2">
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
     <p className="text-xl font-black text-slate-900 tracking-tight leading-tight">{Array.isArray(value) ? value.join(', ') : (String(value) || 'N/A')}</p>
  </div>
);

const InputPiece = ({ label, value, icon }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 opacity-50 px-1">
       {React.cloneElement(icon, { className: 'w-4 h-4 text-indigo-600' })}
       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
    <div className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-extrabold text-lg">
      {value || 'Synchronizing...'}
    </div>
  </div>
);

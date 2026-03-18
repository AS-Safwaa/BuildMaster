import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  FolderOpen,
  FileText,
  LogOut,
  Clock,
  CheckCircle2,
  Search,
  Layout,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  X,
  Info,
  Eye,
  Trash2,
  Terminal,
  Layers,
  Globe,
  Briefcase
} from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectStatus } from '../types';
import { MOCK_PROJECTS } from '../constants';
import toast from 'react-hot-toast';

const STATUS_FLOW: ProjectStatus[] = ['Submitted', 'In Development', 'In Review', 'Under Client Review', 'Approved', 'Completed'];

const AI_TEMPLATES = [
  { id: '1', title: 'Home Page Copy', prompt: 'Develop a high-converting homepage copy for [BUSINESS_NAME]. Include hero section with a strong headline about [USP_LIST].' },
  { id: '2', title: 'Service Details', prompt: 'Write detailed descriptions for these services: [SERVICES]. Focus on professionalism and expertise.' },
  { id: '3', title: 'SEO Optimized Tags', prompt: 'Generate meta titles and descriptions for a [NICHE] business in [ADDRESS].' }
];

export function DeveloperDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewOnlyProject, setViewOnlyProject] = useState<Project | null>(null);
  const [promptInput, setPromptInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- Filtering ---
  const myProjects = useMemo(() =>
    projects.filter(p => p.assignedDeveloperId === user?.id),
    [projects, user]
  );

  const projectPool = useMemo(() =>
    projects.filter(p => p.status === 'Submitted' && !p.assignedDeveloperId),
    [projects]
  );

  // --- Actions ---
  const handleClaim = (projectId: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, assignedDeveloperId: user?.id, status: 'In Development' } : p
    ));
    toast.success('Project added to your workspace');
  };

  const handleUnclaim = (projectId: string) => {
    if (!confirm('Are you sure you want to remove this project from your workspace?')) return;
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, assignedDeveloperId: undefined, status: 'Submitted' } : p
    ));
    setSelectedProject(null);
    toast.error('Project returned to pool');
  };

  const updateProject = (updates: Partial<Project>) => {
    if (!selectedProject) return;
    const updated = { ...selectedProject, ...updates };
    setSelectedProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const toggleChecklist = (key: keyof Project['checklist']) => {
    if (!selectedProject) return;
    updateProject({
      checklist: { ...selectedProject.checklist, [key]: !selectedProject.checklist[key] }
    });
  };

  if (isLoading) return <SkeletonDashboard />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans">
        {/* --- Header & Dev Profile --- */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-white" size={20} />
            </div>
            <h1 className="font-bold text-lg tracking-tight">BUILD<span className="text-indigo-600">MASTER</span> <span className="text-slate-300 font-medium ml-2 text-sm">DEV_WORKSPACE</span></h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Standard Developer</p>
              </div>
              <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center font-black text-xs text-slate-600">
                {user?.name?.[0] || 'D'}
              </div>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto p-6 lg:p-10 space-y-12 pb-32">

          <AnimatePresence mode="wait">
            {/* --- 1. Workspace (My Projects) Detail View --- */}
            {selectedProject ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-all">
                    <ChevronLeft size={18} /> Back to Dashboard
                  </button>
                  <div className="flex items-center gap-3">
                    <select
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                      value={selectedProject.status}
                      onChange={(e) => updateProject({ status: e.target.value as ProjectStatus })}
                    >
                      {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button onClick={() => handleUnclaim(selectedProject.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors tooltip" title="Remove from Workspace">
                      <Trash2 size={18} />
                    </button>
                    <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">Update Status</button>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  {/* Left Sidebar: Checklist */}
                  <aside className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <CheckSquare size={14} /> Checklist
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(selectedProject.checklist).map(([key, val]) => (
                          <button
                            key={key}
                            onClick={() => toggleChecklist(key as any)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${val ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'}`}
                          >
                            <span className="text-[11px] font-bold uppercase tracking-tight">{key.replace(/([A-Z])/g, ' $1')}</span>
                            {val ? <CheckCircle2 size={16} /> : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-200" />}
                          </button>
                        ))}
                      </div>
                      <div className="pt-2">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${(Object.values(selectedProject.checklist).filter(v => v).length / Object.keys(selectedProject.checklist).length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* AI Prompts Area */}
                    <div className="bg-slate-900 rounded-2xl p-6 space-y-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <Sparkles size={14} /> AI Builder
                      </h3>
                      <div className="space-y-3">
                        {AI_TEMPLATES.map(t => (
                          <button
                            key={t.id}
                            onClick={() => setPromptInput(t.prompt)}
                            className="w-full text-left p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-400 transition-colors truncate"
                          >
                            {t.title}
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="w-full h-32 bg-slate-800 border-none rounded-xl p-3 text-[11px] font-mono text-emerald-400 focus:ring-1 focus:ring-emerald-500/50 outline-none placeholder:text-slate-600"
                        placeholder="Type build prompt..."
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                      />
                    </div>
                  </aside>

                  {/* Main Console: Content & Links */}
                  <div className="col-span-12 lg:col-span-9 space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-50 pb-8">
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">{selectedProject.businessName}</h2>
                          <p className="text-xs text-slate-400 font-medium mt-1">Niche: <span className="text-indigo-600 font-bold uppercase tracking-tight">Professional Service</span> | ID: {selectedProject.id}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Draft Link</p>
                            <input
                              className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs font-medium w-48 focus:ring-1 focus:ring-indigo-500 outline-none"
                              value={selectedProject.draftLink || ''}
                              placeholder="Enter Vercel URL..."
                              onChange={(e) => updateProject({ draftLink: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Final URL</p>
                            <input
                              className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-xs font-medium w-48 focus:ring-1 focus:ring-emerald-500 outline-none"
                              value={selectedProject.liveUrl || ''}
                              placeholder="Enter Client Domain..."
                              onChange={(e) => updateProject({ liveUrl: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Detailed Guest Data - Split into sections */}
                      <div className="space-y-10 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                        {/* 1. Contact Info */}
                        <section className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 border-b border-indigo-50 pb-2">1. Personal & Contact Details</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Name</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">{selectedProject.contactPersonName || 'Mark Taylor'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Phone</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">{selectedProject.contactPersonPhone || '+91 99001 22334'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">{selectedProject.email}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</p>
                              <p className="text-sm font-bold text-slate-900 mt-1 truncate">{selectedProject.address}</p>
                            </div>
                          </div>
                        </section>

                        {/* 2. Business Details */}
                        <section className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 border-b border-indigo-50 pb-2">2. Business Environment</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Name</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">{selectedProject.businessName}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Established</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">{selectedProject.yearsOfEstablishment || '2018'}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Areas</p>
                              <p className="text-sm font-bold text-slate-900 mt-1">{selectedProject.serviceAreas || 'Global'}</p>
                            </div>
                          </div>
                        </section>

                        {/* 3. Website Goals & Style */}
                        <section className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 border-b border-indigo-50 pb-2">3. Digital Strategy & Goals</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Goals</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedProject.websiteGoals.map(g => (
                                  <span key={g} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">{g}</span>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Required CTAs</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedProject.ctaSelections.map(c => (
                                  <span key={c} className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-100">{c}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* 4. Branding & Logo */}
                        <section className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 border-b border-indigo-50 pb-2">4. Branding & Asset Pipeline</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo Status</p>
                              <p className="text-xs font-bold text-slate-900">{selectedProject.hasLogo ? 'Supplied by Client' : 'To be Designed'}</p>
                              {selectedProject.logoDriveLink && (
                                <a href={selectedProject.logoDriveLink} target="_blank" className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1">Open Assets <ExternalLink size={10} /></a>
                              )}
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand Personality</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedProject.logoPreferences.brandPersonality.map(p => (
                                  <span key={p} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg uppercase tracking-tight">{p}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* 5. Team & Navigation */}
                        <section className="space-y-4">
                          <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 border-b border-indigo-50 pb-2">5. Structure & Human Capital</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Site Menu (Navigation)</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedProject.selectedNavigation.map(n => (
                                  <span key={n} className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg">{n}</span>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team Display</p>
                              <p className="text-xs font-bold text-slate-900">{selectedProject.showTeam ? `Showcasing ${selectedProject.team.length} Member(s)` : 'Hide Team Section'}</p>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-16">
                {/* --- SECTION 1: MY WORKSPACE --- */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Layers className="text-indigo-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Active Workspace</h2>
                      <p className="text-xs text-slate-400 font-medium">Projects you've claimed and are currently building</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* In Progress */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">🔨 In Progress</h3>
                      <div className="space-y-4">
                        {myProjects.filter(p => p.status === 'In Development').map(p => (
                          <ProjectMiniCard key={p.id} project={p} onClick={() => setSelectedProject(p)} isWorkspace />
                        ))}
                        {myProjects.filter(p => p.status === 'In Development').length === 0 && <EmptyState type="workspace" />}
                      </div>
                    </div>

                    {/* Review */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">👀 Review / Completed</h3>
                      <div className="space-y-4">
                        {myProjects.filter(p => ['In Review', 'Under Client Review', 'Completed'].includes(p.status)).map(p => (
                          <ProjectMiniCard key={p.id} project={p} onClick={() => setSelectedProject(p)} isWorkspace />
                        ))}
                        {myProjects.filter(p => ['In Review', 'Under Client Review', 'Completed'].includes(p.status)).length === 0 && <EmptyState type="workspace" />}
                      </div>
                    </div>

                    {/* Approved */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">✨ Approved / Live</h3>
                      <div className="space-y-4">
                        {myProjects.filter(p => p.status === 'Approved').map(p => (
                          <ProjectMiniCard key={p.id} project={p} onClick={() => setSelectedProject(p)} isWorkspace />
                        ))}
                        {myProjects.filter(p => p.status === 'Approved').length === 0 && <EmptyState type="workspace" />}
                      </div>
                    </div>
                  </div>
                </section>

                {/* --- SECTION 2: PROJECT POOL --- */}
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Briefcase className="text-amber-600" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Project Pool</h2>
                      <p className="text-xs text-slate-400 font-medium">New submissions waiting for a developer</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projectPool.map(p => (
                      <motion.div
                        key={p.id}
                        whileHover={{ y: -5 }}
                        className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group"
                      >
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                            <Terminal size={24} />
                          </div>
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">New Intake</span>
                        </div>

                        <div className="space-y-1 mb-8">
                          <h3 className="text-lg font-bold text-slate-900">{p.businessName}</h3>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">Client: {p.contactPersonName || 'Guest User'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Niche</p>
                            <p className="text-[11px] font-bold text-slate-600 truncate uppercase">Professional</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Logo Req.</p>
                            <p className="text-[11px] font-bold text-slate-600 truncate uppercase">{p.hasLogo ? 'Supplied' : 'Required'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Specialization</p>
                            <p className="text-[11px] font-bold text-slate-600 truncate uppercase italic">Cardiology</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => setViewOnlyProject(p)} className="flex-1 bg-slate-50 text-slate-600 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all">View Info</button>
                          <button onClick={() => handleClaim(p.id)} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">Claim</button>
                        </div>
                      </motion.div>
                    ))}
                    {projectPool.length === 0 && (
                      <div className="col-span-full py-20 text-center">
                        <p className="text-slate-400 font-medium italic">All quiet in the pool. Check back later for new submissions.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </AnimatePresence>

          {/* --- VIEW ONLY MODAL (Project Details Preview) --- */}
          <AnimatePresence>
            {viewOnlyProject && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                        <Eye className="text-indigo-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 leading-none">{viewOnlyProject.businessName}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Intake Data Preview</p>
                      </div>
                    </div>
                    <button onClick={() => setViewOnlyProject(null)} className="p-3 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-10 overflow-y-auto custom-scrollbar flex-1 space-y-10">
                    <ProjectDataGrid project={viewOnlyProject} />

                    <div className="bg-slate-900 p-8 rounded-[2rem] space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">AI Prompt Logic</h4>
                      <textarea
                        className="w-full h-24 bg-slate-800 border-none rounded-xl p-4 text-[11px] font-mono text-emerald-400 outline-none"
                        readOnly
                        value={`Develop architecture for ${viewOnlyProject.businessName}. Goals: ${viewOnlyProject.websiteGoals.join(', ')}.`}
                      />
                    </div>
                  </div>

                  <div className="p-8 border-t border-slate-50 bg-white flex justify-end">
                    <button
                      onClick={() => { handleClaim(viewOnlyProject.id); setViewOnlyProject(null); }}
                      className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                    >
                      Claim & Start Build
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
}

// --- SUBCOMPONENTS ---

function ProjectMiniCard({ project, onClick, isWorkspace }: { project: Project, onClick: () => void, isWorkspace?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group bg-white ${isWorkspace ? 'border-slate-100 hover:border-indigo-100 hover:shadow-lg' : 'border-emerald-50 hover:border-emerald-100 shadow-sm'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${project.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
          <Globe size={14} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 leading-tight truncate w-32">{project.businessName}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-0.5">{project.status}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500" />
    </motion.div>
  );
}

function EmptyState({ type }: { type: 'workspace' | 'pool' }) {
  return (
    <div className="py-8 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No projects found</p>
    </div>
  );
}

function ProjectDataGrid({ project }: { project: Project }) {
  return (
    <div className="space-y-12">
      {/* Contact Section */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 pb-2 border-b border-indigo-50">1. Personal Details</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6">
          <DataItem title="Name" value={project.contactPersonName || 'Guest User'} />
          <DataItem title="Phone" value={project.contactPersonPhone || 'Not Specified'} />
          <DataItem title="Email" value={project.email} />
          <DataItem title="Address" value={project.address} />
        </div>
      </section>

      {/* Business Section */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 pb-2 border-b border-indigo-50">2. Business Details</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6">
          <DataItem title="Business Name" value={project.businessName} />
          <DataItem title="Establishment" value={project.yearsOfEstablishment || 'N/A'} />
          <DataItem title="Areas" value={project.serviceAreas || 'Global'} />
          <DataItem title="Tagline" value={project.tagline || 'No tagline set'} />
        </div>
      </section>

      {/* Website Section */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 pb-2 border-b border-indigo-50">3. Website & Design</h4>
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Main Goals</p>
            <div className="flex flex-wrap gap-2">
              {project.websiteGoals.map(g => <span key={g} className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded border border-slate-100">{g}</span>)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Selected Navigation</p>
            <div className="flex flex-wrap gap-2">
              {project.selectedNavigation.map(n => <span key={n} className="px-2 py-1 bg-slate-900 text-[10px] font-bold text-white rounded">{n}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* Assets Section */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 pb-2 border-b border-indigo-50">4. Branding & Logo Related</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <DataItem title="Logo Status" value={project.hasLogo ? 'Logo Provided' : 'Needs Design'} />
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Brand Personality</p>
            <div className="flex flex-wrap gap-2">
              {project.logoPreferences.brandPersonality.map(p => <span key={p} className="px-3 py-1 bg-white border border-slate-200 text-[9px] font-black uppercase rounded-lg text-slate-400">{p}</span>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DataItem({ title, value }: { title: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{title}</p>
      <p className="text-xs font-bold text-slate-800 leading-relaxed">{value}</p>
    </div>
  );
}

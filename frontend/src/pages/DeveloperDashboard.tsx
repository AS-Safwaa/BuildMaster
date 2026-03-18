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
  { id: '3', title: 'SEO Optimized Tags', prompt: 'Generate meta titles and descriptions for a [NICHE] business in [ADDRESS].' },
  { id: '4', title: 'Technical Architecture', prompt: 'Analyze the client brief for [BUSINESS_NAME] and suggest a modern 7-section single page structure focuses on [GOALS].' }
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

                      {/* Detailed Guest Data */}
                      <div className="space-y-10 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
                        <ProjectDataGrid project={selectedProject} />

                        {/* AI Hub Integration */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl">
                          <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-[#50fa7b] flex items-center gap-2">
                              <Terminal size={14} /> AI Builder
                            </h3>
                            <textarea
                              className="w-full h-44 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-[11px] font-mono text-emerald-400 focus:ring-1 focus:ring-emerald-500/50 outline-none placeholder:text-slate-600"
                              placeholder="Type or click a template..."
                              value={promptInput}
                              onChange={(e) => setPromptInput(e.target.value)}
                            />
                            <div className="flex justify-between items-center bg-slate-800/20 p-3 rounded-xl">
                              <span className="text-[9px] text-slate-600 font-black uppercase tracking-widest italic">Terminal Ready</span>
                              <button onClick={() => { navigator.clipboard.writeText(promptInput); toast.success('Copied!'); }} className="text-[10px] text-emerald-400 font-black uppercase flex items-center gap-2">Copy Command <ExternalLink size={10} /></button>
                            </div>
                          </div>

                          <div className="space-y-4 border-l border-slate-800/50 pl-0 md:pl-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                              <Layers size={14} /> Prompt Library
                            </h3>
                            <div className="space-y-3 overflow-y-auto max-h-56 pr-2 custom-scrollbar-slate">
                              {AI_TEMPLATES.map(t => (
                                <button
                                  key={t.id}
                                  onClick={() => setPromptInput(t.prompt)}
                                  className="w-full text-left p-3.5 rounded-xl bg-slate-800/30 hover:bg-indigo-600/10 border border-slate-700/30 hover:border-indigo-500/20 transition-all group"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-white">{t.title}</span>
                                    <ChevronRight size={12} className="text-slate-700 group-hover:text-indigo-400" />
                                  </div>
                                  <p className="text-[9px] text-slate-600 leading-normal line-clamp-1 italic group-hover:text-slate-400">"{t.prompt}"</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
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
                      <h2 className="text-lg font-bold text-slate-900">Project Pool</h2>
                      <p className="text-[11px] text-slate-400 font-medium">New submissions waiting for a developer</p>
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
                  </div>
                </section>
              </div>
            )}
          </AnimatePresence>

          {/* --- VIEW ONLY MODAL --- */}
          <AnimatePresence>
            {viewOnlyProject && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="bg-slate-50 px-10 py-8 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm">
                        <Eye className="text-indigo-600" size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">{viewOnlyProject.businessName}</h3>
                    </div>
                    <button onClick={() => setViewOnlyProject(null)} className="p-3 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-10 overflow-y-auto custom-scrollbar flex-1 space-y-12">
                    <ProjectDataGrid project={viewOnlyProject} />

                    {/* Prompt Logic in View Mode */}
                    <div className="bg-slate-900 p-8 rounded-[2rem] space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">AI Prompt Library (Preview)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {AI_TEMPLATES.map(t => (
                          <div key={t.id} className="p-4 bg-slate-800 rounded-xl border border-slate-700/50">
                            <p className="text-[10px] font-black text-slate-300 uppercase mb-2">{t.title}</p>
                            <p className="text-[11px] text-slate-500 italic leading-relaxed">"{t.prompt}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-8 border-t border-slate-50 bg-white flex justify-end gap-4">
                    <button onClick={() => setViewOnlyProject(null)} className="px-8 py-4 text-slate-400 font-bold text-xs uppercase">Close Preview</button>
                    <button
                      onClick={() => { handleClaim(viewOnlyProject.id); setViewOnlyProject(null); }}
                      className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                    >
                      Claim Project
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
      {/* 1. Contact Info */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 border-b border-indigo-50 pb-2">1. Personal & Contact Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <DataItem title="Client Name" value={project.contactPersonName || 'Guest User'} />
          <DataItem title="Client Phone" value={project.contactPersonPhone || 'Not Specified'} />
          <DataItem title="Email Address" value={project.email} />
          <DataItem title="Physical Address" value={project.address} />
        </div>
      </section>

      {/* 2. Business Details */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 border-b border-indigo-50 pb-2">2. Business Environment</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <DataItem title="Business" value={project.businessName} />
          <DataItem title="Established" value={project.yearsOfEstablishment || '2020'} />
          <DataItem title="Service Areas" value={project.serviceAreas || 'Local'} />
          <DataItem title="Business Phone" value={project.businessPhone || 'N/A'} />
        </div>
      </section>

      {/* 3. Website Goals & Structure */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 border-b border-indigo-50 pb-2">3. Site structure & Goals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Selected Goals</p>
            <div className="flex flex-wrap gap-2">
              {project.websiteGoals.map(g => <span key={g} className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg">{g}</span>)}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Navigation Builder</p>
            <div className="flex flex-wrap gap-2">
              {project.selectedNavigation.map(n => <span key={n} className="px-3 py-1 bg-slate-900 text-[10px] font-bold text-white rounded-lg">{n}</span>)}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Branding & Logo */}
      <section className="space-y-4">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-500 border-b border-indigo-50 pb-2">4. Branding & Assets</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DataItem title="Logo Requirement" value={project.hasLogo ? 'Logo Supplied' : 'Needs Design'} />
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Brand Personality</p>
            <div className="flex flex-wrap gap-2">
              {project.logoPreferences.brandPersonality.map(p => <span key={p} className="px-3 py-1 bg-white border border-slate-200 text-[9px] font-black uppercase text-slate-400 rounded-lg">{p}</span>)}
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

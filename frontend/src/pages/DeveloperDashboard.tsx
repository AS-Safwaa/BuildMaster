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
  PlusCircle,
  Target,
  ShieldCheck,
  Settings,
  ExternalLink,
  Code2,
  Sparkles,
  CheckSquare,
  ChevronRight,
  ChevronLeft,
  X,
  Info
} from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectStatus } from '../types';
import { MOCK_PROJECTS } from '../constants';
import toast from 'react-hot-toast';

const AI_TEMPLATES = [
  { id: 'content', title: 'Content Outline', prompt: "Generate a professional 5-page content outline for a website in the [NICHE] niche. Focus on conversion and trust." },
  { id: 'seo', title: 'SEO Bundle', prompt: "Create SEO title tags and meta descriptions for a [BUSINESS_NAME] website. Target primary keywords like [SERVICES]." },
  { id: 'usp', title: 'USP Refiner', prompt: "Rewrite these USPs into high-converting headlines for a hero section: [USP_LIST]" }
];

const STATUS_FLOW: ProjectStatus[] = ['Submitted', 'In Development', 'In Review', 'Under Client Review', 'Approved', 'Completed'];

export function DeveloperDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'pool'>('my');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [promptInput, setPromptInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const myProjects = useMemo(() =>
    projects.filter(p => p.assignedDeveloperId === user?.id),
    [projects, user]
  );

  const availablePool = useMemo(() =>
    projects.filter(p => p.status === 'Submitted' && !p.assignedDeveloperId),
    [projects]
  );

  const handleClaim = (projectId: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, assignedDeveloperId: user?.id, status: 'In Development' } : p
    ));
    toast.success('Project claimed! It is now in your workspace.');
  };

  const updateSelectedProject = (updates: Partial<Project>) => {
    if (!selectedProject) return;
    const updated = { ...selectedProject, ...updates };
    setSelectedProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const toggleChecklist = (key: keyof Project['checklist']) => {
    if (!selectedProject) return;
    updateSelectedProject({
      checklist: { ...selectedProject.checklist, [key]: !selectedProject.checklist[key] }
    });
  };

  if (isLoading) return <SkeletonDashboard />;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFC]">
        {/* Navigation */}
        <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-6">
            <h1 className="font-black text-2xl tracking-tighter uppercase italic">
              <span className="text-emerald-600">BUILD</span>MASTER
            </h1>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('my')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'my' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400'}`}
              >
                My Workspace
              </button>
              <button
                onClick={() => setActiveTab('pool')}
                className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pool' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400'}`}
              >
                Project Pool
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Dev Account</span>
              <span className="text-sm font-bold text-slate-900">{user?.name}</span>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center rounded-2xl text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-12">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-10"
              >
                {/* DETAIL VIEW HEADER */}
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedProject(null)} className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-900 transition-all">
                    <ChevronLeft size={20} /> Back to Dashboard
                  </button>
                  <div className="flex items-center gap-4">
                    <select
                      className="bg-white border-2 border-slate-200 p-3 rounded-2xl font-black text-xs uppercase tracking-widest outline-none focus:border-emerald-500"
                      value={selectedProject.status}
                      onChange={(e) => updateSelectedProject({ status: e.target.value as ProjectStatus })}
                    >
                      {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-100">Save Build Status</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* LEFT COLUMN: PROJECT INFO */}
                  <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedProject.businessName}</h2>
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2"><Target size={14} /> Internal ID: {selectedProject.id}</p>
                        </div>
                        <span className="px-6 py-2 bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest rounded-full">{selectedProject.status}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-8">
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-50 space-y-2">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Niche</span>
                          <span className="block text-sm font-black text-slate-900 text-center truncate italic">Professional</span>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-50 space-y-2">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Logo Assets</span>
                          <span className="block text-sm font-black text-slate-900 text-center truncate">{selectedProject.hasLogo ? 'Supplied' : 'Request Needed'}</span>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-50 space-y-2">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Goal Count</span>
                          <span className="block text-sm font-black text-slate-900 text-center truncate italic">{selectedProject.websiteGoals.length} Selection(s)</span>
                        </div>
                      </div>
                    </div>

                    {/* WORK AREA: LINKS & PROMPTS */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-10">
                      <div className="space-y-6">
                        <h3 className="flex items-center gap-3 font-black text-xl text-slate-900"><ExternalLink size={24} className="text-blue-600" /> Build Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Draft / Preview Link</label>
                            <input
                              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-sm"
                              placeholder="https://dev-preview.vercel.app/..."
                              value={selectedProject.draftLink || ''}
                              onChange={(e) => updateSelectedProject({ draftLink: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Live Link</label>
                            <input
                              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                              placeholder="https://client-domain.com"
                              value={selectedProject.liveUrl || ''}
                              onChange={(e) => updateSelectedProject({ liveUrl: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h3 className="flex items-center gap-3 font-black text-xl text-slate-900"><Sparkles size={24} className="text-amber-500" /> AI Build Assist</h3>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                          {AI_TEMPLATES.map(temp => (
                            <button
                              key={temp.id}
                              onClick={() => setPromptInput(temp.prompt)}
                              className="whitespace-nowrap px-4 py-2 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                            >
                              {temp.title}
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="w-full h-40 p-6 bg-slate-900 text-emerald-400 font-mono text-sm rounded-[2rem] border-4 border-slate-800 focus:border-emerald-900 focus:outline-none placeholder:text-slate-700"
                          placeholder="Paste or type prompts for AI models here..."
                          value={promptInput}
                          onChange={(e) => setPromptInput(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: CHECKLIST */}
                  <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl sticky top-28 h-fit space-y-10 group">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Build Checklist</h3>
                      <CheckSquare size={32} className="text-emerald-500 group-hover:scale-125 transition-transform" />
                    </div>

                    <div className="space-y-4">
                      {Object.entries(selectedProject.checklist).map(([key, val]) => (
                        <button
                          key={key}
                          onClick={() => toggleChecklist(key as any)}
                          className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${val ? 'bg-emerald-600/10 border-emerald-600 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                        >
                          <span className="text-xs font-black uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                          {val ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-slate-700" />}
                        </button>
                      ))}
                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(Object.values(selectedProject.checklist).filter(v => v).length / Object.keys(selectedProject.checklist).length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-4">
                    <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic">
                      {activeTab === 'my' ? 'OPERATIONS CENTRE' : 'OPEN REQUISITIONS'}
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm flex items-center gap-3">
                      {activeTab === 'my' ? <FolderOpen size={18} /> : <Layout size={18} />}
                      {activeTab === 'my' ? `${myProjects.length} Assigned Project(s) Active` : `${availablePool.length} New Submission(s) Found`}
                    </p>
                  </div>
                </div>

                {activeTab === 'my' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myProjects.map(p => (
                      <AnimatedCard
                        key={p.id}
                        onClick={() => setSelectedProject(p)}
                        className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl hover:shadow-2xl hover:border-emerald-200 transition-all group flex flex-col justify-between min-h-[400px]"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-10">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                              <Code2 size={28} />
                            </div>
                            <span className="px-4 py-2 bg-slate-50 text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-full">{p.status}</span>
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight mb-4">{p.businessName}</h3>
                          <p className="text-slate-400 text-sm font-medium line-clamp-2 italic mb-8">"{p.tagline || 'No tagline defined for this business'}"</p>
                        </div>
                        <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Workspace View</span>
                          <ChevronRight size={24} className="text-emerald-500" />
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {availablePool.map(p => (
                      <motion.div
                        key={p.id}
                        whileHover={{ x: 10 }}
                        className="bg-white p-8 md:p-12 rounded-[3.5rem] border-2 border-slate-50 shadow-lg flex flex-col md:flex-row items-center gap-10 group transition-all hover:border-indigo-100"
                      >
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                          <Target size={40} />
                        </div>
                        <div className="flex-1 space-y-2 text-center md:text-left">
                          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-2">
                            <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-black text-slate-500 uppercase tracking-widest">ID: {p.id}</span>
                            <span className="text-[10px] bg-indigo-100 px-3 py-1 rounded-full font-black text-indigo-600 uppercase tracking-widest">Submitted Form</span>
                          </div>
                          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{p.businessName}</h3>
                          <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-2 pt-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Info size={14} /> Logo Prep: {p.hasLogo ? 'Supply' : 'Design'}</div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Layout size={14} /> Page Goals: {p.websiteGoals.length}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleClaim(p.id)}
                          className="px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 hover:shadow-2xl transition-all shadow-xl"
                        >
                          Claim Project
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </PageTransition>
  );
}

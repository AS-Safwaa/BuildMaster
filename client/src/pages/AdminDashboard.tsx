import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Settings, LogOut, CodeSquare, Plus, Edit2, Trash2, X, 
  CheckSquare, ClipboardList, UserCircle, Key, Activity, Palette, Globe, Layout,
  ArrowUpRight, Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IS_PROTOTYPE } from '../config/prototype';
import API_BASE_URL from '../config/api';

// --- Admin Prototype Mock Data ---
const MOCK_OVERVIEW = {
  kpis: {
    totalProjects: 12,
    totalQuestions: 48,
    totalCategories: 14,
    roles: { developers: 4 }
  },
  recentProjects: [
    { id: 1, businessName: "Elite Fitness Center", email: "contact@elitefitness.com", createdAt: new Date().toISOString() },
    { id: 2, businessName: "Green Leaf Cafe", email: "info@greenleaf.cafe", createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, businessName: "Skyline Realty Group", email: "michael@skylinerealty.com", createdAt: new Date(Date.now() - 172800000).toISOString() }
  ]
};

const MOCK_PROJECTS = [
  { id: 1, businessName: "Elite Fitness Center", email: "contact@elitefitness.com", status: "unassigned", assigned_developer_id: null },
  { id: 2, businessName: "Green Leaf Cafe", email: "info@greenleaf.cafe", status: "assigned", assigned_developer_id: 101 },
  { id: 3, businessName: "Skyline Realty Group", email: "michael@skylinerealty.com", status: "unassigned", assigned_developer_id: null },
  { id: 4, businessName: "Nexus Logistics", email: "ops@nexuslogistics.com", status: "completed", assigned_developer_id: 102 }
];

const MOCK_DEVELOPERS = [
  { id: 101, name: "Arjun Sharma", email: "arjun.dev@buildmaster.com" },
  { id: 102, name: "Sarah Chen", email: "sarah.c@buildmaster.com" },
  { id: 103, name: "Michael West", email: "m.west@buildmaster.com" }
];

const MOCK_STEPS = [
  { id: 1, title: 'Venture Basics', step_order: 1 },
  { id: 2, title: 'Design Archetype', step_order: 2 },
  { id: 3, title: 'Functional Strategy', step_order: 3 }
];

const MOCK_QUESTIONS = [
  { id: 1, step_id: 1, question_text: 'What is your legal business name?', input_type: 'text', question_order: 1, is_required: true },
  { id: 2, step_id: 1, question_text: 'Year of establishment?', input_type: 'number', question_order: 2, is_required: false },
  { id: 3, step_id: 2, question_text: 'Preferred Brand Personality?', input_type: 'multi_select', question_order: 1, is_required: true, master_type_id: 5 }
];

const MOCK_MASTERS = [
  { id: 1, name: 'Business Categories', description: 'Primary industry classification' },
  { id: 5, name: 'Brand Personas', description: 'Visual and tonal archetypes' },
  { id: 8, name: 'Design Styles', description: 'Clean, Bold, Grid-based, etc.' }
];

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [overviewData, setOverviewData] = useState<any>(IS_PROTOTYPE ? MOCK_OVERVIEW : null);
  const [projects, setProjects] = useState<any[]>(IS_PROTOTYPE ? MOCK_PROJECTS : []);
  const [developers, setDevelopers] = useState<any[]>(IS_PROTOTYPE ? MOCK_DEVELOPERS : []);
  const [steps, setSteps] = useState<any[]>(IS_PROTOTYPE ? MOCK_STEPS : []);
  const [questions, setQuestions] = useState<any[]>(IS_PROTOTYPE ? MOCK_QUESTIONS : []);
  const [masterTypes, setMasterTypes] = useState<any[]>(IS_PROTOTYPE ? MOCK_MASTERS : []);

  // Profile CMS
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');

  // Modals state
  const [showAddStep, setShowAddStep] = useState(false);
  const [showAddMaster, setShowAddMaster] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState<number | null>(null);
  const [manageMasterId, setManageMasterId] = useState<any | null>(null);
  const [viewProjectDetails, setViewProjectDetails] = useState<any | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  
  // Create definitions
  const [newStep, setNewStep] = useState({ title: '', step_order: '' });
  const [newMaster, setNewMaster] = useState({ name: '', description: '' });
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'text', order: '' });
  
  const [masterValues, setMasterValues] = useState<any[]>([]);
  const [newValueLabel, setNewValueLabel] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchOverview = async () => {
    if (IS_PROTOTYPE) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/dashboard/overview`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOverviewData(res.data);
    } catch (err) { 
        // fallback to mock on error silently in prototype mode
        if (IS_PROTOTYPE) setOverviewData(MOCK_OVERVIEW);
        else toast.error('Failed to load Metrics'); 
    }
  };

  const fetchProjectsData = async () => {
    if (IS_PROTOTYPE) return;
    try {
      const [projRes, devRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/dashboard/projects`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get(`${API_BASE_URL}/admin/dashboard/developers`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setProjects(projRes.data);
      setDevelopers(devRes.data);
    } catch (err) { 
        if (IS_PROTOTYPE) { setProjects(MOCK_PROJECTS); setDevelopers(MOCK_DEVELOPERS); }
        else toast.error('Failed to load Pipeline data'); 
    }
  };

  const fetchForms = async () => {
    if (IS_PROTOTYPE) return;
    try {
      const [stepsRes, qsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/forms/steps`),
        axios.get(`${API_BASE_URL}/admin/forms/questions`)
      ]);
      setSteps(stepsRes.data);
      setQuestions(qsRes.data);
    } catch (err) { if (IS_PROTOTYPE) { setSteps(MOCK_STEPS); setQuestions(MOCK_QUESTIONS); } }
  };

  const fetchMasters = async () => {
    if (IS_PROTOTYPE) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/masters/types`);
      setMasterTypes(res.data);
    } catch (err) { if (IS_PROTOTYPE) setMasterTypes(MOCK_MASTERS); }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'pipeline') fetchProjectsData();
    if (activeTab === 'forms') fetchForms();
    if (activeTab === 'masters') fetchMasters();
  }, [activeTab]);

  useEffect(() => {
    if (manageMasterId && !IS_PROTOTYPE) {
      axios.get(`${API_BASE_URL}/admin/masters/values?type_id=${manageMasterId.id}`)
        .then(res => setMasterValues(res.data))
        .catch(err => console.error(err));
    } else if (manageMasterId && IS_PROTOTYPE) {
        setMasterValues([
            { id: 1, label: 'E-commerce', value: 'ecommerce' },
            { id: 2, label: 'SaaS / Tech', value: 'saas' },
            { id: 3, label: 'Health / Fitness', value: 'health' }
        ]);
    }
  }, [manageMasterId]);

  // Assignment Handlers
  const handleAssign = async (projectId: number, developerId: string) => {
    if (IS_PROTOTYPE) {
        toast.success(developerId ? 'Project Assigned!' : 'Project Unassigned');
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, assigned_developer_id: developerId ? parseInt(developerId) : null, status: developerId ? 'assigned' : 'unassigned' } : p));
        return;
    }
    try {
      await axios.post(`${API_BASE_URL}/admin/dashboard/assign-project`, 
        { project_id: projectId, developer_id: developerId ? parseInt(developerId) : null },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      toast.success(developerId ? 'Project Assigned!' : 'Project Unassigned');
      fetchProjectsData();
    } catch (err) { toast.error('Failed to update assignment'); }
  };

  const fetchProjectDetails = async (projectId: number) => {
    setIsFetchingDetails(true);
    if (IS_PROTOTYPE) {
        const found = projects.find(p => p.id === projectId);
        setTimeout(() => {
            setViewProjectDetails({
                businessName: found?.businessName,
                email: found?.email,
                contactName: "Michael West",
                phone: "+1 234 567 890",
                projectType: "Full Website & Branding",
                details: found?.answers || { "Goal": "Launch new brand UI", "Tech": "React/Nextjs" }
            });
            setIsFetchingDetails(false);
        }, 500);
        return;
    }
    try {
      const url = `${API_BASE_URL}/admin/dashboard/view-project/${projectId}`;
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setViewProjectDetails(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Could not load project details');
    } finally { setIsFetchingDetails(false); }
  };

  // Profile CMS Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_PROTOTYPE) { toast.success('Profile CMS Updated Successfully (Prototype)'); return; }
    try {
      await axios.post(`${API_BASE_URL}/admin/auth/profile`, { id: user?.id, name: profileName, email: profileEmail });
      toast.success('Profile CMS Updated Successfully');
    } catch (err) { toast.error('Failed to update profile'); }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_PROTOTYPE) { toast.success('Password changed securely (Prototype)'); setNewPassword(''); return; }
    try {
      await axios.post(`${API_BASE_URL}/admin/auth/update-password`, { id: user?.id, newPassword });
      toast.success('Password changed securely.'); setNewPassword('');
    } catch (err) { toast.error('Failed to update password'); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans text-slate-600">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col z-10 shadow-xl overflow-y-auto shrink-0 transition-all">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
              <Database className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">ProjectHub</span>
          </div>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Command Center</p>
          <TabNavItem icon={<LayoutDashboard />} label="Analytics Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <TabNavItem icon={<ClipboardList />} label="Project Pipeline" active={activeTab === 'pipeline'} onClick={() => setActiveTab('pipeline')} />

          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 mt-8">Configuration</p>
          <TabNavItem icon={<CheckSquare />} label="Form Engine" active={activeTab === 'forms'} onClick={() => setActiveTab('forms')} />
          <TabNavItem icon={<Settings />} label="Master Taxonomies" active={activeTab === 'masters'} onClick={() => setActiveTab('masters')} />

          <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 mt-8">Identity</p>
          <TabNavItem icon={<UserCircle />} label="Profile CMS" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>

        <div className="p-5 border-t border-slate-800">
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all group">
             <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Logout
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-blue-50 rounded-full border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                 <Activity className="w-3 h-3 text-blue-500" />
                 <span>Admin Privileges {IS_PROTOTYPE && '(Mock)'}</span>
             </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 tracking-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest font-sans">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shadow-sm text-slate-800 flex items-center justify-center font-bold text-base">
              {user?.name?.charAt(0) || 'A'}
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

        <div className="flex-1 p-10 overflow-auto pb-40 w-full bg-[#f8fafc] custom-scrollbar">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="h-full max-w-7xl mx-auto">
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && overviewData && (
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">System Overview</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg leading-relaxed">Real-time aggregate analytics across ProjectHub architecture.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <KPICard 
                    label="Total Project Briefs" 
                    value={overviewData.kpis?.totalProjects || 0} 
                    color="blue" 
                    onClick={() => setActiveTab('pipeline')}
                  />
                  <KPICard 
                    label="Configured Questions" 
                    value={overviewData.kpis?.totalQuestions || 0} 
                    color="indigo" 
                    onClick={() => setActiveTab('forms')}
                  />
                  <KPICard 
                    label="Master Categories" 
                    value={overviewData.kpis?.totalCategories || 0} 
                    color="emerald" 
                    onClick={() => setActiveTab('masters')}
                  />
                  <KPICard 
                    label="Assigned Developers" 
                    value={overviewData.kpis?.roles?.developers || 0} 
                    color="violet" 
                  />
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Recent Guest Ingestions</h2>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Project Ref</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Identity</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Email</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {!overviewData.recentProjects || overviewData.recentProjects.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-medium uppercase tracking-widest italic">No projects in queue.</td></tr>
                      ) : (
                        overviewData.recentProjects.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-5 font-mono text-xs font-medium text-slate-500">PRJ-{(p.id || 0).toString().padStart(4, '0')}</td>
                            <td className="px-8 py-5 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.businessName}</td>
                            <td className="px-8 py-5 font-medium">{p.email}</td>
                            <td className="px-8 py-5 font-medium text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PIPELINE */}
            {activeTab === 'pipeline' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Project Pipeline</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg">Global dispatch interface. Assign projects to integrated developers.</p>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Developer Context</th>
                        <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projects.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-medium uppercase tracking-widest italic">Pipeline is empty.</td></tr>
                      ) : (
                        projects.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-8 py-5">
                                <span className="block font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{p.businessName}</span>
                                <span className="block text-[10px] font-medium text-slate-400 font-mono">{p.email}</span>
                            </td>
                            <td className="px-8 py-5">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                  p.status === 'unassigned' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                  p.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                  'bg-blue-50 text-blue-700 border-blue-100'
                                }`}>
                                  {p.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-8 py-5">
                               <select 
                                 className="block w-full bg-white border border-slate-200 text-slate-700 rounded-lg px-4 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer hover:border-slate-300 transition-all"
                                 value={p.assigned_developer_id || ''}
                                 onChange={(e) => handleAssign(p.id, e.target.value)}
                               >
                                 <option value="">Unassigned</option>
                                 {developers.map(d => (
                                   <option key={d.id} value={d.id}>{d.name}</option>
                                 ))}
                               </select>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-4">
                                 <button 
                                   onClick={() => fetchProjectDetails(p.id)}
                                   className="text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all"
                                 >
                                    <ClipboardList className="w-3.5 h-3.5" /> Brief
                                 </button>
                                 {p.assigned_developer_id && (
                                   <button onClick={() => handleAssign(p.id, "")} className="text-slate-400 hover:text-red-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all">
                                      <RotateCcw icon={<X className="w-3.5 h-3.5" />} /> Release
                                   </button>
                                 )}
                               </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'forms' && (
              <div>
                <div className="flex justify-between items-center mb-10">
                  <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Form Engine</h1>
                      <p className="text-slate-500 text-lg font-medium">Dynamically map steps and questions.</p>
                  </div>
                  <button onClick={() => setShowAddStep(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-md transition-all">
                    <Plus className="w-4 h-4" /> Add Step
                  </button>
                </div>
                
                <div className="space-y-6">
                  {steps.map(step => (
                    <div key={step.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-400">
                             {step.step_order}
                           </div>
                           <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                        </div>
                        <div className="flex gap-1.5">
                           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                           <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="space-y-3">
                          {questions.filter(q => q.step_id === step.id).map(q => (
                            <div key={q.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-300 transition-all shadow-sm group">
                               <div className="flex items-center gap-4">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
                                  <div>
                                    <p className="font-semibold text-slate-800 text-sm">{q.question_text}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Type: {q.input_type} {q.is_required && '• Required'}</p>
                                  </div>
                               </div>
                               <button className="text-slate-300 hover:text-blue-600 p-1.5 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setShowAddQuestion(step.id)} className="mt-6 flex items-center gap-2 text-[10px] text-blue-600 font-bold hover:text-blue-800 w-full justify-center py-3 border border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest">
                          <Plus className="w-3.5 h-3.5" /> Append Question Block
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'masters' && (
              <div>
                <div className="flex justify-between items-center mb-10">
                  <div>
                      <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Master Taxonomies</h1>
                      <p className="text-slate-500 text-lg font-medium">Global dropdown options for the questionnaire.</p>
                  </div>
                  <button onClick={() => setShowAddMaster(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 shadow-md transition-all">
                    <Plus className="w-4 h-4" /> New Category
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {masterTypes.map(m => (
                    <motion.div 
                        key={m.id} 
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center hover:shadow-md transition-all group"
                    >
                       <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 mb-4 group-hover:bg-blue-50 transition-colors">
                           <Database className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                       </div>
                       <h3 className="font-bold text-slate-900 text-lg tracking-tight">{m.name}</h3>
                       <p className="text-xs text-slate-400 mt-2 font-medium line-clamp-2">{m.description || 'Configurable Master List'}</p>
                       <button onClick={() => setManageMasterId(m)} className="mt-6 text-[10px] font-bold text-blue-700 bg-blue-50/50 px-6 py-3 rounded-xl hover:bg-blue-50 w-full transition-all border border-blue-100 uppercase tracking-widest">
                         Manage Options
                       </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-xl mx-auto py-10">
                 <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight text-center">Admin Profile CMS</h1>
                 <div className="bg-white mt-10 rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    <div className="p-8">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Identity Specification</label>
                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <input type="text" value={profileName} onChange={e=>setProfileName(e.target.value)} placeholder="Full Name" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" />
                            <input type="email" value={profileEmail} onChange={e=>setProfileEmail(e.target.value)} placeholder="Email" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" />
                            <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">Save Changes</button>
                        </form>
                    </div>
                    <div className="p-8 bg-slate-50/50">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Security Override</label>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="New Password" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                            <button type="submit" className="w-full py-3.5 bg-white border border-slate-900 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm">Update Password</button>
                        </form>
                    </div>
                 </div>
              </div>
            )}
            
          </motion.div>
        </div>
      </main>

      {/* Project Brief Modal Side-panel / Modal */}
      <AnimatePresence>
        {viewProjectDetails && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                         <ClipboardList className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">{viewProjectDetails.businessName}</h2>
                        <p className="text-xs text-slate-400 font-medium">Ref: Payload System Ingestion</p>
                      </div>
                   </div>
                   <button onClick={() => setViewProjectDetails(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-8">
                        <DetailPiece label="Contact" value={viewProjectDetails.contactName} />
                        <DetailPiece label="Email" value={viewProjectDetails.email} />
                        <DetailPiece label="Phone" value={viewProjectDetails.phone} />
                        <DetailPiece label="Type" value={viewProjectDetails.projectType} />
                    </div>
                    <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Extended Brief Data</p>
                        <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                            {Object.entries(viewProjectDetails.details || {}).map(([k, v]: any) => (
                                <div key={k} className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-xs font-bold text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="text-xs font-semibold text-slate-900">{typeof v === 'string' ? v : JSON.stringify(v)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-100 flex justify-end">
                    <button onClick={() => setViewProjectDetails(null)} className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">Close Pipeline View</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

// --- Specific Components ---

const TabNavItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    {React.cloneElement(icon, { className: 'w-5 h-5' })} {label}
  </button>
);

const KPICard = ({ label, value, color, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    onClick={onClick}
    className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all ${onClick ? 'cursor-pointer border-opacity-50 hover:border-' + color + '-400' : ''}`}
  >
    <div className="flex justify-between items-start mb-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        {onClick && <ArrowUpRight className={`w-4 h-4 text-${color}-400`} />}
    </div>
    <p className={`text-4xl font-bold text-${color}-600 tracking-tight`}>{value}</p>
  </motion.div>
);

const DetailPiece = ({ label, value }: { label: string, value: string }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-base font-semibold text-slate-900">{value || 'Not provided'}</p>
    </div>
);

const RotateCcw = ({ icon }: any) => <span className="flex items-center gap-1">{icon}</span>;

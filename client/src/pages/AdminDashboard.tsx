import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Settings, LogOut, CodeSquare, Plus, Edit2, Trash2, X, CheckSquare, ClipboardList, UserCircle, Key, Activity, Palette, Globe, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [masterTypes, setMasterTypes] = useState<any[]>([]);

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
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/dashboard/overview`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOverviewData(res.data);
    } catch (err) { toast.error('Failed to load Metrics'); }
  };

  const fetchProjectsData = async () => {
    try {
      const [projRes, devRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/dashboard/projects`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
          axios.get(`${API_BASE_URL}/admin/dashboard/developers`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);
      setProjects(projRes.data);
      setDevelopers(devRes.data);
    } catch (err) { toast.error('Failed to load Pipeline data'); }
  };

  const fetchForms = async () => {
    try {
      const [stepsRes, qsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/forms/steps`),
        axios.get(`${API_BASE_URL}/admin/forms/questions`)
      ]);
      setSteps(stepsRes.data);
      setQuestions(qsRes.data);
    } catch (err) { console.error(err); }
  };

  const fetchMasters = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/masters/types`);
      setMasterTypes(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchOverview();
    if (activeTab === 'pipeline') fetchProjectsData();
    if (activeTab === 'forms') fetchForms();
    if (activeTab === 'masters') fetchMasters();
  }, [activeTab]);

  useEffect(() => {
    if (manageMasterId) {
      axios.get(`${API_BASE_URL}/admin/masters/values?type_id=${manageMasterId.id}`)
        .then(res => setMasterValues(res.data))
        .catch(err => console.error(err));
    }
  }, [manageMasterId]);

  // Assignment Handlers
  const handleAssign = async (projectId: number, developerId: string) => {
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
    console.log('Fetching details for project ID:', projectId);
    try {
      const url = `${API_BASE_URL}/admin/dashboard/view-project/${projectId}`;
      console.log('Hitting URL:', url);
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Details loaded:', res.data);
      setViewProjectDetails(res.data);
    } catch (err: any) {
      console.error('Fetch Details Error Object:', err);
      if (err.response) {
         console.error('Response status:', err.response.status);
         console.error('Response data:', err.response.data);
      }
      toast.error(err.response?.data?.message || 'Could not load project details');
    } finally {
      setIsFetchingDetails(false);
    }
  };

  // Profile CMS Handlers
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/admin/auth/profile`, 
        { id: user?.id, name: profileName, email: profileEmail }
      );
      toast.success('Profile CMS Updated Successfully');
    } catch (err) { toast.error('Failed to update profile'); }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/admin/auth/update-password`, 
        { id: user?.id, newPassword }
      );
      toast.success('Password changed securely.');
      setNewPassword('');
    } catch (err) { toast.error('Failed to update password'); }
  };

  // Master Handlers
  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/admin/forms/steps`, { title: newStep.title, step_order: parseInt(newStep.step_order, 10), is_active: true });
      toast.success('Form Step Created!');
      setShowAddStep(false); setNewStep({ title: '', step_order: '' }); fetchForms();
    } catch (err) { toast.error('Failed to create step.'); }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddQuestion) return;
    try {
      await axios.post(`${API_BASE_URL}/admin/forms/questions`, { step_id: showAddQuestion, question_text: newQuestion.text, input_type: newQuestion.type, question_order: parseInt(newQuestion.order, 10), is_required: false });
      toast.success('Question Added!');
      setShowAddQuestion(null); setNewQuestion({ text: '', type: 'text', order: '' }); fetchForms();
    } catch (err) { toast.error('Failed to add question. Check order number.'); }
  };

  const handleAddMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/admin/masters/types`, { name: newMaster.name, description: newMaster.description });
      toast.success('Category Created!');
      setShowAddMaster(false); setNewMaster({ name: '', description: '' }); fetchMasters();
    } catch (err) { toast.error('Failed to create category.'); }
  };

  const handleAddMasterValue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageMasterId) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/masters/values`, { master_type_id: manageMasterId.id, label: newValueLabel, value: newValueLabel.replace(/\s+/g, '_').toLowerCase() });
      toast.success('Option Added!');
      setMasterValues([...masterValues, res.data]); setNewValueLabel('');
    } catch (err) { toast.error('Failed to add master option.'); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans">
      <aside className="w-64 bg-slate-900 flex flex-col z-10 shadow-xl overflow-y-auto">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CodeSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">ProjectHub</span>
          </div>
        </div>

        <nav className="flex-1 p-5 space-y-2">
          <p className="px-3 text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Command Center</p>
          
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" /> Analytics Overview
          </button>
          
          <button onClick={() => setActiveTab('pipeline')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'pipeline' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <ClipboardList className="w-5 h-5" /> Project Pipeline
          </button>

          <p className="px-3 text-xs font-black text-slate-500 uppercase tracking-widest mb-4 mt-8">Configuration</p>
          
          <button onClick={() => setActiveTab('forms')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'forms' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <CheckSquare className="w-5 h-5" /> Form Engine
          </button>
          
          <button onClick={() => setActiveTab('masters')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'masters' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Settings className="w-5 h-5" /> Master Taxonomies
          </button>

          <p className="px-3 text-xs font-black text-slate-500 uppercase tracking-widest mb-4 mt-8">Identity</p>

          <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <UserCircle className="w-5 h-5" /> Profile
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 z-10 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-slate-100 rounded-full border border-slate-200 text-xs font-black text-slate-600 uppercase tracking-wider flex items-center gap-2">
                 <Activity className="w-3 h-3 text-emerald-500" />
                 Admin Privileges Active
             </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{user?.role}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-100 shadow-md text-white flex items-center justify-center font-black text-lg">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button onClick={handleLogout} className="ml-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-auto pb-40 w-full">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full max-w-7xl mx-auto">
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && overviewData && (
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">System Overview</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg">Real-time aggregate analytics across ProjectHub architecture.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Total Project Briefs</p>
                    <p className="text-5xl font-black text-slate-900">{overviewData.kpis?.totalProjects || 0}</p>
                  </div>
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Configured Questions</p>
                    <p className="text-5xl font-black text-slate-900">{overviewData.kpis?.totalQuestions || 0}</p>
                  </div>
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Master Categories</p>
                    <p className="text-5xl font-black text-slate-900">{overviewData.kpis?.totalCategories || 0}</p>
                  </div>
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Assigned Developers</p>
                    <p className="text-5xl font-black text-slate-900">{overviewData.kpis?.roles?.developers || 0}</p>
                  </div>
                </div>

                <h2 className="text-xl font-black text-slate-900 mb-6">Recent Guest Ingestions</h2>
                <div className="bg-white justify-center items-center rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Project Ref</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Business Identity</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Client Email</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {!overviewData.recentProjects || overviewData.recentProjects.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-medium">No projects pushed to queue yet.</td></tr>
                      ) : (
                        overviewData.recentProjects.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-mono text-xs font-bold text-slate-500">PRJ-{(p.id || 0).toString().padStart(4, '0')}</td>
                            <td className="px-8 py-5 font-bold text-slate-900 text-base">{p.businessName}</td>
                            <td className="px-8 py-5 font-medium">{p.email}</td>
                            <td className="px-8 py-5 font-medium">{new Date(p.createdAt).toLocaleDateString()}</td>
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
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Project Pipeline</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg">Global dispatch interface. Assign projects to integrated developers.</p>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Business</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Developer Context</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projects.length === 0 ? (
                        <tr><td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-medium">Pipeline is empty.</td></tr>
                      ) : (
                        projects.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5">
                                <span className="block font-black text-slate-900 text-lg mb-1">{p.businessName}</span>
                                <span className="block text-slate-500">{p.email}</span>
                            </td>
                            <td className="px-8 py-5">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                  p.status === 'unassigned' ? 'bg-orange-100 text-orange-700' :
                                  p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {p.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-8 py-5">
                               <select 
                                 className="block w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer"
                                 value={p.assigned_developer_id || ''}
                                 onChange={(e) => handleAssign(p.id, e.target.value)}
                               >
                                 <option value="">Unassigned</option>
                                 {developers.map(d => (
                                   <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                                 ))}
                               </select>
                            </td>
                            <td className="px-8 py-5">
                               <div className="flex flex-col gap-2">
                                 <button 
                                   onClick={() => fetchProjectDetails(p.id)}
                                   className="text-blue-600 hover:text-blue-800 font-black text-xs uppercase tracking-wider flex items-center gap-1"
                                 >
                                    <ClipboardList className="w-4 h-4" /> View Details
                                 </button>
                                 {p.assigned_developer_id ? (
                                   <button onClick={() => handleAssign(p.id, "")} className="text-red-600 hover:text-red-800 font-black text-xs uppercase tracking-wider flex items-center gap-1">
                                      <X className="w-4 h-4" /> Unassign
                                   </button>
                                 ) : (
                                   <span className="text-slate-400 text-xs font-medium">Needs Assignment</span>
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

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Profile</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg">Manage your Admin Profile settings.</p>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                  <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center gap-4">
                     <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex justify-center items-center shadow-inner">
                         <UserCircle className="w-8 h-8" />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-slate-900">Basic Information</h3>
                         <p className="text-slate-500 text-sm">Update your system display name and contact email.</p>
                     </div>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                       <input type="text" value={profileName} onChange={e=>setProfileName(e.target.value)} required className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" />
                     </div>
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">Primary Email</label>
                       <input type="email" value={profileEmail} onChange={e=>setProfileEmail(e.target.value)} required className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium" />
                     </div>
                     <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors">Update Profile</button>
                  </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-red-50 p-6 border-b border-red-100 flex items-center gap-4">
                     <div className="w-12 h-12 bg-red-100 rounded-2xl text-red-600 flex justify-center items-center">
                         <Key className="w-6 h-6" />
                     </div>
                     <div>
                         <h3 className="text-lg font-bold text-slate-900">Security / Forgot Password</h3>
                         <p className="text-slate-500 text-sm">Force reset your Administrative password here.</p>
                     </div>
                  </div>
                  <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                     <div>
                       <label className="block text-sm font-bold text-slate-700 mb-2">New Password Key</label>
                       <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required className="w-full px-5 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 outline-none transition-all font-medium" placeholder="••••••••" />
                     </div>
                     <button type="submit" className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-md hover:bg-red-700 transition-colors">Force Reset Password</button>
                  </form>
                </div>
              </div>
            )}

            {/* FORMS & MASTERS (Simplified wrappers for brevity in rendering) */}
            {activeTab === 'forms' && (
              <div>
                <div className="flex justify-between items-center mb-10">
                  <div>
                      <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Form Architecture</h1>
                      <p className="text-slate-500 text-lg">Dynamically map steps and questions.</p>
                  </div>
                  <button onClick={() => setShowAddStep(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg">
                    <Plus className="w-5 h-5" /> Add Step
                  </button>
                </div>
                
                <div className="space-y-6">
                  {steps.map(step => (
                    <div key={step.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                        <div>
                           <p className="text-xs text-blue-600 font-black tracking-widest uppercase mb-1">Sector {step.step_order}</p>
                           <h3 className="text-xl font-black text-slate-900">{step.title}</h3>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-5 h-5" /></button>
                           <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="space-y-4">
                          {questions.filter(q => q.step_id === step.id).map(q => (
                            <div key={q.id} className="flex items-start justify-between p-5 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm">
                               <div>
                                  <p className="font-bold text-slate-800 text-lg flex items-center gap-3">
                                    {q.question_text} 
                                    {q.is_required ? <span className="text-[10px] bg-red-100 text-red-700 px-3 py-1 rounded-full font-black uppercase tracking-wider">Required</span> : null}
                                  </p>
                                  <div className="flex gap-3 text-xs text-slate-600 mt-3 font-semibold">
                                    <span className="bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">Type: {q.input_type}</span>
                                    {q.master_type_id && <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md border border-blue-100">Linked Master: {q.master_type_id}</span>}
                                  </div>
                               </div>
                               <button className="text-slate-400 hover:text-blue-600 p-2"><Edit2 className="w-4 h-4" /></button>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setShowAddQuestion(step.id)} className="mt-6 flex items-center gap-2 text-sm text-blue-600 font-black hover:text-blue-800 w-full justify-center py-4 border-2 border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-all">
                          <Plus className="w-5 h-5" /> Append Question Block
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
                      <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Master Taxonomies</h1>
                      <p className="text-slate-500 text-lg">Global dropdown options for the questionnaire.</p>
                  </div>
                  <button onClick={() => setShowAddMaster(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg">
                    <Plus className="w-5 h-5" /> Deploy Master Array
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {masterTypes.map(m => (
                    <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                       <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 mb-4">
                           <Settings className="w-8 h-8 text-slate-400" />
                       </div>
                       <h3 className="font-black text-slate-900 text-xl">{m.name}</h3>
                       <p className="text-sm text-slate-500 mt-2 font-medium">{m.description || 'Configurable Master List'}</p>
                       <button onClick={() => setManageMasterId(m)} className="mt-6 text-sm font-bold text-blue-700 bg-blue-50 px-6 py-3 rounded-xl hover:bg-blue-100 w-full transition-colors border border-blue-200">
                         Manage Options
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {viewProjectDetails && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/70 backdrop-blur-md shadow-inner overflow-hidden">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[3rem] w-full max-w-5xl h-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20">
                
                {/* Premium Header */}
                <div className="relative p-10 flex justify-between items-center bg-slate-50/80 border-b border-slate-100 backdrop-blur-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.75rem] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/30 ring-4 ring-indigo-50">
                      <ClipboardList className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">Project Blueprint</h2>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                           <Activity className="w-3 h-3" /> Live Brief
                        </span>
                        <p className="text-sm text-slate-400 font-bold tracking-tight">Verified Guest Ingestion</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setViewProjectDetails(null)} className="group p-4 bg-white border border-slate-200 rounded-[1.5rem] text-slate-400 hover:text-slate-900 transition-all hover:shadow-lg hover:scale-105 active:scale-95 shadow-sm">
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar bg-slate-50/20">
                   
                   {viewProjectDetails.noData ? (
                     <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-32 h-32 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-dashed border-slate-200">
                           <X className="w-16 h-16 text-slate-200" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">No Details Found</h3>
                        <p className="text-slate-500 max-w-sm font-bold text-lg leading-relaxed">{viewProjectDetails.message}</p>
                     </div>
                   ) : viewProjectDetails.isLegacy ? (
                     <div className="space-y-10">
                       <div className="p-10 bg-amber-50/50 border border-amber-100 rounded-[2.5rem] flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[1.25rem] bg-amber-100 flex items-center justify-center text-amber-600 shadow-sm border border-amber-200">
                            <Activity className="w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-amber-900 uppercase tracking-widest mb-1">Legacy Ingestion</p>
                            <p className="text-sm text-amber-700 font-bold leading-relaxed">This brief was captured under a previous questionnaire architecture. Information is presented in raw field mapping.</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {Object.entries(viewProjectDetails.details).map(([q, a]: any) => (
                           <div key={q} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                             <div className="flex items-center justify-between mb-4">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] group-hover:text-indigo-500 transition-colors">{q}</p>
                             </div>
                             <div className="text-slate-900 font-black text-xl leading-relaxed">
                               {typeof a === 'object' ? (
                                 <code className="text-xs font-mono bg-slate-900 text-slate-300 p-4 rounded-xl block leading-normal mt-2">
                                   {JSON.stringify(a, null, 2)}
                                 </code>
                               ) : a}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ) : (
                     <>
                      {/* Identity Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sticky top-0 bg-white/40 backdrop-blur-xl pb-10 border-b border-slate-100/50 z-20">
                          <div className="space-y-1">
                            <p className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">Target Venture</p>
                            <p className="text-5xl font-black text-slate-900 tracking-tighter leading-tight drop-shadow-sm">{viewProjectDetails.businessName || 'Unnamed Entity'}</p>
                          </div>
                          <div className="flex flex-col items-center md:items-end justify-center">
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Service Scope</p>
                            <span className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-lg font-black tracking-tight shadow-xl shadow-slate-900/20 ring-4 ring-slate-50">
                              {viewProjectDetails.projectType || 'Full Development'}
                            </span>
                          </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-16">
                          <DetailBlock label="Point of Contact" value={viewProjectDetails.contactName} icon={<UserCircle className="w-5 h-5" />} />
                          <DetailBlock label="Direct Phone" value={viewProjectDetails.phone} icon={<Activity className="w-5 h-5 text-emerald-500" />} />
                          <DetailBlock label="System Email" value={viewProjectDetails.email} icon={<Settings className="w-5 h-5 text-blue-500" />} />
                          <DetailBlock label="Office Location" value={`${viewProjectDetails.addressLine1 || ''} ${viewProjectDetails.city || ''}`} icon={<Settings className="w-5 h-5 text-rose-500" />} />
                          <DetailBlock label="Service Areas" value={viewProjectDetails.serviceAreas} isArray />
                          <DetailBlock label="Business Intent" value={viewProjectDetails.projectFor === 'self' ? 'Own Project' : 'Client Ingestion'} />
                      </div>

                      {/* Brand Aesthetics Block */}
                      <div className="space-y-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                              <Palette className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Brand Identity & Visuals</p>
                            <div className="flex-1 h-[1px] bg-slate-100"></div>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                             <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <DetailBlock label="Logo Configuration" value={viewProjectDetails.logoStatus} />
                             <DetailBlock label="Brand Personality" value={viewProjectDetails.brandPersonality} />
                             <DetailBlock label="Design Architecture" value={viewProjectDetails.designStyle} />
                             <DetailBlock label="Visual Archetypes" value={viewProjectDetails.preferredColors} isArray />
                             <div className="lg:col-span-2 pt-4">
                                <DetailBlock label="Constraint Palette (Avoid)" value={viewProjectDetails.avoidColors} isArray />
                             </div>
                          </div>
                      </div>

                      {/* Technical Architecture */}
                      <div className="space-y-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg text-emerald-500 bg-emerald-50 border border-emerald-100">
                              <Globe className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Site Architecture & Technicals</p>
                            <div className="flex-1 h-[1px] bg-slate-100"></div>
                          </div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                             <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <DetailBlock label="Domain Specification" value={viewProjectDetails.hasDomain ? `Dedicated: ${viewProjectDetails.preferredDomain}` : 'System Managed'} />
                             <DetailBlock label="Infrastructure Choice" value={viewProjectDetails.hasHosting ? 'Client Environment' : 'ProjectHub Managed'} />
                             <DetailBlock label="Composition Style" value={viewProjectDetails.websiteStyle} />
                             <DetailBlock label="Brand Tone" value={viewProjectDetails.preferredTone} />
                          </div>
                      </div>

                      {/* Project Deliverables */}
                      <div className="space-y-6">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                              <Plus className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Goals & Features</p>
                            <div className="flex-1 h-[1px] bg-slate-100"></div>
                          </div>
                          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10 group relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <DetailBlock label="Primary Objectives" value={viewProjectDetails.websiteGoals} isArray />
                             <DetailBlock label="Custom Specifications" value={viewProjectDetails.customGoals} isArray />
                             <DetailBlock label="Active Integrated Features" value={[viewProjectDetails.callNowToggle ? 'Quick Dial' : null, viewProjectDetails.whatsappToggle ? 'WhatsApp Chat' : null, viewProjectDetails.contactFormToggle ? 'Lead Generator' : null].filter(Boolean)} isArray />
                             <DetailBlock label="Bespoke Micro-features" value={viewProjectDetails.customFeatures} isArray />
                             <div className="p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100 mt-6">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Primary User Interaction (CTA)</p>
                               <p className="text-2xl font-black text-slate-800">{viewProjectDetails.userAction === 'custom' ? viewProjectDetails.customActions : viewProjectDetails.userAction}</p>
                             </div>
                          </div>
                      </div>

                      {/* Assets Section */}
                      <div className="space-y-6 pb-12">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg text-rose-500 bg-rose-50 border border-rose-100">
                              <Layout className="w-5 h-5" />
                            </div>
                            <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Content & Media</p>
                            <div className="flex-1 h-[1px] bg-slate-100"></div>
                          </div>
                          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm group relative overflow-hidden">
                             <div className="absolute top-0 left-0 w-2 h-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                               <DetailBlock label="Strategic Value Props (USPs)" value={viewProjectDetails.usps} isArray />
                               <DetailBlock label="Creative Asset Status" value={viewProjectDetails.businessPhotosStatus ? 'Customer Assets Ready' : 'Stock Library Required'} />
                             </div>
                             <div className="mt-10 pt-10 border-t border-slate-50">
                               <DetailBlock label="Integrated Ecosystem (Add-ons)" value={viewProjectDetails.addons} isArray />
                             </div>
                          </div>
                      </div>
                     </>
                   )}
                </div>
                
                {/* Visual Footer */}
                <div className="p-10 border-t border-slate-100 bg-white flex justify-end gap-4 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] z-30">
                   <button onClick={() => setViewProjectDetails(null)} className="px-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-95 ring-4 ring-slate-50">Release Brief</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Form Creation Modals (No change to rest of component logic) */}
      </main>
    </div>
  );
};

const DetailBlock = ({ label, value, isArray, icon }: { label: string, value: any, isArray?: boolean, icon?: any }) => {
  const displayValue = isArray 
    ? (Array.isArray(value) && value.length > 0 ? value.filter(Boolean).join(', ') : 'Not selected')
    : (value || 'Not provided');

  return (
    <div className="space-y-2">
       <div className="flex items-center gap-2">
          {icon && <span className="opacity-50">{icon}</span>}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{label}</p>
       </div>
       <p className="text-slate-800 font-extrabold text-lg leading-relaxed">{displayValue}</p>
    </div>
  );
};

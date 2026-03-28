import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LayoutDashboard, LogOut, CodeSquare, Activity, UserCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export const DeveloperDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Datasets
  const [metrics, setMetrics] = useState<any>(null);
  const [pool, setPool] = useState<any[]>([]);
  const [myProjects, setMyProjects] = useState<any[]>([]);

  // Profile CMS
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/developer/dashboard/overview', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setMetrics(res.data);
    } catch(err) { console.error(err); }
  };

  const fetchPool = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/developer/projects/pool', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setPool(res.data);
    } catch(err) { console.error(err); }
  };

  const fetchMine = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/developer/projects/mine', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setMyProjects(res.data);
    } catch(err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'overview') fetchMetrics();
    if (activeTab === 'pool') fetchPool();
    if (activeTab === 'my-projects') fetchMine();
  }, [activeTab]);

  const handleClaim = async (id: number) => {
    try {
      await axios.post(`http://localhost:5000/api/v1/developer/projects/${id}/claim`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      toast.success('Project Claimed!');
      fetchPool();
    } catch(err) { toast.error('Failed to claim project'); }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await axios.post(`http://localhost:5000/api/v1/developer/projects/${id}/status`, { status }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      toast.success('Project Status Updated!');
      fetchMine();
    } catch(err) { toast.error('Failed to update status'); }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/admin/auth/profile', 
        { id: user?.id, name: profileName, email: profileEmail }
      );
      toast.success('Developer Profile CMS Updated Successfully');
    } catch (err) { toast.error('Failed to update profile'); }
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
          <p className="px-3 text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Workspace</p>
          
          <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" /> Analytics Overview
          </button>
          
          <button onClick={() => setActiveTab('pool')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'pool' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Activity className="w-5 h-5" /> Project Pool
          </button>

          <button onClick={() => setActiveTab('my-projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-projects' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Briefcase className="w-5 h-5" /> My Assignments
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
                 <CheckCircle2 className="w-3 h-3 text-blue-500" />
                 Developer Workspace
             </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-slate-800">{user?.name}</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{user?.role}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-100 shadow-md text-white flex items-center justify-center font-black text-lg">
              {user?.name?.charAt(0) || 'D'}
            </div>
            <button onClick={handleLogout} className="ml-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-10 overflow-auto pb-40 w-full">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full max-w-7xl mx-auto">
            
            {/* OVERVIEW */}
            {activeTab === 'overview' && metrics && (
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Developer Overview</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg">Your execution performance and available global projects.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Unassigned Pool</p>
                    <p className="text-5xl font-black text-blue-600">{metrics.poolSize || 0}</p>
                  </div>
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">My Active Projects</p>
                    <p className="text-5xl font-black text-slate-900">{metrics.myProjects || 0}</p>
                  </div>
                  <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Completed Deployments</p>
                    <p className="text-5xl font-black text-emerald-600">{metrics.completedProjects || 0}</p>
                  </div>
                </div>
              </div>
            )}

            {/* PIPELINE / POOL */}
            {activeTab === 'pool' && (
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Project Pool</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg">Unassigned client ingestion briefs waiting for execution.</p>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Project Identity</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                        <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pool.length === 0 ? (
                        <tr><td colSpan={3} className="px-8 py-10 text-center text-slate-400 font-medium">Pool is currently empty.</td></tr>
                      ) : (
                        pool.map((p: any) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-black text-slate-900 text-lg">{p.businessName}</td>
                            <td className="px-8 py-5 font-medium">{new Date(p.createdAt).toLocaleDateString()}</td>
                            <td className="px-8 py-5">
                               <button onClick={() => handleClaim(p.id)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors shadow-md">
                                  Claim Project
                               </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MY ASSIGNMENTS */}
            {activeTab === 'my-projects' && (
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">My Assignments</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg">Manage your claimed briefs and update lifecycle status.</p>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {myProjects.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-400 font-medium">No projects assigned to you. Claim one from the pool!</div>
                  ) : (
                    myProjects.map((p: any) => (
                      <div key={p.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                             p.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {p.status}
                          </span>
                          <span className="text-xs text-slate-400 font-mono font-bold">PRJ-{(p.id || 0).toString().padStart(4, '0')}</span>
                        </div>
                        <h3 className="font-black text-2xl text-slate-900 mb-1">{p.businessName}</h3>
                        <p className="text-sm font-medium text-blue-600 mb-4">{p.email}</p>
                        
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 max-h-40 overflow-auto">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Guest Brief Data Payload</p>
                          <pre className="text-xs text-slate-600 font-mono">
                            {JSON.stringify(p.answers, null, 2)}
                          </pre>
                        </div>
                        
                        <div className="flex items-center gap-3">
                           <select 
                             value={p.status}
                             onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                             className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                           >
                             <option value="assigned">Assigned</option>
                             <option value="in_progress">In Progress</option>
                             <option value="completed">Completed</option>
                           </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PROFILE */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Profile</h1>
                <p className="text-slate-500 mb-10 font-medium text-lg">Manage your parameter settings.</p>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                  <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center gap-4">
                     <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex justify-center items-center shadow-inner">
                         <UserCircle className="w-8 h-8" />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-slate-900">Basic Information</h3>
                         <p className="text-slate-500 text-sm">Update your developer display name and contact email.</p>
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
                     <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-md hover:bg-blue-700 transition-colors">Save Developer Identity</button>
                  </form>
                </div>
              </div>
            )}

          </motion.div>
        </div>
      </main>
    </div>
  );
};

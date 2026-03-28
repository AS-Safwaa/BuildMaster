import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Settings, LogOut, CodeSquare, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('forms');
  
  const [steps, setSteps] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [masterTypes, setMasterTypes] = useState<any[]>([]);

  // Modals state
  const [showAddStep, setShowAddStep] = useState(false);
  const [showAddMaster, setShowAddMaster] = useState(false);
  
  // Form definitions
  const [newStep, setNewStep] = useState({ title: '', step_order: '' });
  const [newMaster, setNewMaster] = useState({ name: '', description: '' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchForms = async () => {
    try {
      const [stepsRes, qsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/admin/forms/steps'),
        axios.get('http://localhost:5000/api/v1/admin/forms/questions')
      ]);
      setSteps(stepsRes.data);
      setQuestions(qsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMasters = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/admin/masters/types');
      setMasterTypes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'forms') fetchForms();
    if (activeTab === 'masters') fetchMasters();
  }, [activeTab]);

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/admin/forms/steps', {
        title: newStep.title,
        step_order: parseInt(newStep.step_order, 10),
        is_active: true
      });
      toast.success('Form Step Created!');
      setShowAddStep(false);
      setNewStep({ title: '', step_order: '' });
      fetchForms();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create step. Check order number.');
    }
  };

  const handleAddMaster = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/admin/masters/types', {
        name: newMaster.name,
        description: newMaster.description
      });
      toast.success('Master Category Created!');
      setShowAddMaster(false);
      setNewMaster({ name: '', description: '' });
      fetchMasters();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create master type.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex relative">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <CodeSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">ProjectHub</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-4">Admin Engine</p>
          <button onClick={() => setActiveTab('forms')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'forms' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            <LayoutDashboard className="w-5 h-5" /> Form Builder
          </button>
          <button onClick={() => setActiveTab('masters')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'masters' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
            <Settings className="w-5 h-5" /> Master Configs
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8 z-10">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-700">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <button onClick={handleLogout} className="ml-4 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-auto pb-32">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
            
            {activeTab === 'forms' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-slate-800">Guest Form Builder</h1>
                  <button onClick={() => setShowAddStep(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Add Step
                  </button>
                </div>
                
                <div className="space-y-6">
                  {steps.map(step => (
                    <div key={step.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                        <div>
                           <p className="text-xs text-blue-600 font-bold tracking-widest uppercase mb-1">Step {step.step_order}</p>
                           <h3 className="text-lg font-bold text-slate-800">{step.title}</h3>
                        </div>
                        <div className="flex gap-2">
                           <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                           <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {questions.filter(q => q.step_id === step.id).map(q => (
                            <div key={q.id} className="flex items-start justify-between p-4 bg-white border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
                               <div>
                                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                                    {q.question_text} 
                                    {q.is_required ? <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Required</span> : null}
                                  </p>
                                  <div className="flex gap-3 text-xs text-slate-500 mt-2 font-medium">
                                    <span className="bg-slate-100 px-2 py-1 rounded">Type: {q.input_type}</span>
                                    {q.master_type_id && <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded">Linked Master ID: {q.master_type_id}</span>}
                                  </div>
                               </div>
                               <button className="text-blue-600 text-xs font-bold hover:underline">Edit</button>
                            </div>
                          ))}
                        </div>
                        <button className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-bold hover:underline">
                          <Plus className="w-4 h-4" /> Add Question
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'masters' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-slate-800">Master Configurations</h1>
                  <button onClick={() => setShowAddMaster(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Add Master Category
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {masterTypes.map(m => (
                    <div key={m.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
                       <Settings className="w-10 h-10 text-slate-300 mb-3" />
                       <h3 className="font-bold text-slate-800">{m.name}</h3>
                       <p className="text-xs text-slate-500 mt-1">{m.description || 'Configurable Master List'}</p>
                       <button className="mt-4 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 w-full transition-colors">
                         Manage Options
                       </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showAddStep && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Add New Form Step</h2>
                  <button onClick={() => setShowAddStep(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleAddStep} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Step Title</label>
                    <input type="text" required value={newStep.title} onChange={e => setNewStep({...newStep, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g., PAYMENT INFO" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Step Order (Number)</label>
                    <input type="number" required value={newStep.step_order} onChange={e => setNewStep({...newStep, step_order: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="17" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mt-4 hover:bg-blue-700">Save Step</button>
                </form>
              </motion.div>
            </motion.div>
          )}

          {showAddMaster && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Add Master Category</h2>
                  <button onClick={() => setShowAddMaster(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleAddMaster} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">System Name</label>
                    <input type="text" required value={newMaster.name} onChange={e => setNewMaster({...newMaster, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="e.g., TargetDemographics" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <input type="text" value={newMaster.description} onChange={e => setNewMaster({...newMaster, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" placeholder="A list of target user demographics" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mt-4 hover:bg-blue-700">Save Master Category</button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { Project, BuildChecklist } from '../types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Send,
  Lock,
  Unlock,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { BuildGuide } from './BuildGuide';

interface ProjectDetailProps {
  project: Project;
  role: 'admin' | 'developer';
  onUpdate: (updates: Partial<Project>) => void;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, role, onUpdate, onBack }) => {
  const [draftLink, setDraftLink] = useState(project.draftLink || '');
  const [liveUrl, setLiveUrl] = useState(project.liveUrl || '');
  const [notes, setNotes] = useState(project.developerNotes || '');
  const [showClientEmail, setShowClientEmail] = useState(false);

  if (!project) return <div className="p-20 text-center">Project not found.</div>;

  const isLocked = project.status === 'Completed';

  const toggleChecklist = (item: keyof BuildChecklist) => {
    if (isLocked) return;
    onUpdate({
      checklist: {
        ...project.checklist,
        [item]: !project.checklist[item]
      }
    });
  };

  const allChecked = Object.values(project.checklist).every(Boolean);

  const handleStatusChange = (newStatus: Project['status']) => {
    onUpdate({ status: newStatus });
  };

  const handleSaveDraft = () => {
    onUpdate({ 
      draftLink, 
      developerNotes: notes,
      status: 'In Review'
    });
    alert('Draft submitted for review!');
  };

  const handleSaveLive = () => {
    onUpdate({ liveUrl });
    alert('Live URL updated!');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          {isLocked && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-xl text-sm font-bold">
              <Lock size={16} /> Project Locked
            </div>
          )}
          <span className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest border ${
            project.status === 'Completed' ? 'bg-gray-100 text-gray-500 border-gray-200' :
            project.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            'bg-indigo-50 text-indigo-600 border-indigo-100'
          }`}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Project Info */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{project.businessName}</h2>
                <p className="text-gray-500 font-medium">Project ID: {project.id}</p>
              </div>
              {project.liveUrl && (
                <a 
                  href={project.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                >
                  View Live Site <ExternalLink size={16} />
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail size={16} className="text-gray-400" /> {project.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone size={16} className="text-gray-400" /> {project.businessPhone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MapPin size={16} className="text-gray-400" /> {project.address}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Website Requirements</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Globe size={16} className="text-gray-400" /> Style: {project.selectedStyleId || 'Modern'}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.websiteGoals.map(goal => (
                      <span key={goal} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase">{goal}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Services & USPs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map(s => <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{s}</span>)}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-500">USPs</p>
                  <div className="flex flex-wrap gap-2">
                    {project.usp.map(u => <span key={u} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">{u}</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Development Controls */}
          {!isLocked && (
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Development Progress</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Draft Link (Preview)</label>
                  <input 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://netlify-site-123.netlify.app"
                    value={draftLink}
                    onChange={(e) => setDraftLink(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Live URL (Final)</label>
                  <input 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://www.businessname.com"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Developer Notes</label>
                <textarea 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  placeholder="Any specific instructions or notes for the reviewer..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  disabled={!allChecked}
                  onClick={handleSaveDraft}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    allChecked 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={18} /> Submit for Review
                </button>
                <button 
                  onClick={handleSaveLive}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
                >
                  <Save size={18} /> Update Live URL
                </button>
              </div>
              {!allChecked && (
                <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                  <AlertCircle size={14} /> Complete the checklist on the right to submit for review.
                </p>
              )}
            </div>
          )}

          {/* Build Guide */}
          <BuildGuide project={project} />
        </div>

        {/* Right Column: Checklist & Tools */}
        <div className="lg:col-span-4 space-y-8">
          {/* Build Checklist */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Build Checklist</h3>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                {Object.values(project.checklist).filter(Boolean).length}/8
              </span>
            </div>
            
            <div className="space-y-3">
              {(Object.keys(project.checklist) as Array<keyof BuildChecklist>).map((item) => (
                <button 
                  key={item}
                  disabled={isLocked}
                  onClick={() => toggleChecklist(item)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    project.checklist[item] 
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                      : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    project.checklist[item] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200'
                  }`}>
                    {project.checklist[item] && <CheckCircle2 size={12} />}
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {item.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Tool Tracking</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Website Builder</label>
                  <select 
                    disabled={isLocked}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    value={project.builderUsed || ''}
                    onChange={(e) => onUpdate({ builderUsed: e.target.value })}
                  >
                    <option value="">Select Tool...</option>
                    <option value="Antigravity">Antigravity</option>
                    <option value="Google AI Studio">Google AI Studio</option>
                    <option value="Webflow">Webflow</option>
                    <option value="Custom">Custom</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Logo Tool</label>
                  <select 
                    disabled={isLocked}
                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none"
                    value={project.logoToolUsed || ''}
                    onChange={(e) => onUpdate({ logoToolUsed: e.target.value })}
                  >
                    <option value="">Select Tool...</option>
                    <option value="Canva">Canva</option>
                    <option value="Figma">Figma</option>
                    <option value="AI Generator">AI Generator</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {role === 'admin' && (
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Admin Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  {project.status === 'In Review' && (
                    <button 
                      onClick={() => setShowClientEmail(true)}
                      className="w-full py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition-all active:scale-95"
                    >
                      Send to Client
                    </button>
                  )}
                  {project.status === 'Under Client Review' && (
                    <button 
                      onClick={() => handleStatusChange('Approved')}
                      className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all"
                    >
                      Mark Approved
                    </button>
                  )}
                  {project.status === 'Approved' && (
                    <button 
                      onClick={() => handleStatusChange('Completed')}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all"
                    >
                      Mark Completed & Lock
                    </button>
                  )}
                  <button 
                    onClick={() => handleStatusChange('In Development')}
                    className="w-full py-2 border border-gray-200 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-all"
                  >
                    Revert to Development
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Client Email Preview Modal */}
      {showClientEmail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
          >
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Mail size={20} /> Preview: Send to Client</h3>
              <button onClick={() => setShowClientEmail(false)} className="p-2 hover:bg-gray-200 rounded-full"><X size={20} /></button>
            </div>
            <div className="p-8 bg-gray-100 overflow-y-auto max-h-[70vh]">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-xl mx-auto">
                <div className="bg-purple-600 p-8 text-white text-center">
                  <h1 className="text-2xl font-black">Your Website Draft is Ready!</h1>
                </div>
                <div className="p-8 space-y-6 text-gray-700">
                  <p>Hi <strong>{project.contactPersonName}</strong>,</p>
                  <p>Great news! We've completed the first draft of your website for <strong>{project.businessName}</strong>.</p>
                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-center space-y-4">
                    <p className="text-sm font-bold text-purple-700">Review your website here:</p>
                    <a href={project.draftLink} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all">
                      View Website Draft
                    </a>
                  </div>
                  <p>Please take a look and let us know if you have any feedback. We're excited to hear what you think!</p>
                  <p className="pt-4 border-t border-gray-100 text-sm text-gray-500 italic">Best regards,<br/>The Development Team</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => {
                  handleStatusChange('Under Client Review');
                  setShowClientEmail(false);
                  alert('Email simulation: Sent to client!');
                }}
                className="flex-1 py-4 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all"
              >
                Send Email & Update Status
              </button>
              <button 
                onClick={() => setShowClientEmail(false)}
                className="px-8 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Project } from '../types';
import { Briefcase, Clock, ExternalLink, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface MyProjectsProps {
  projects: Project[];
  onView: (id: string) => void;
}

export const MyProjects: React.FC<MyProjectsProps> = ({ projects, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Development': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'In Review': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Under Client Review': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Completed': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Projects</h2>
        <p className="text-gray-500 font-medium">Projects currently assigned to you.</p>
      </div>

      {projects.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">You haven't claimed any projects yet.</p>
          <button className="mt-4 text-indigo-600 font-bold hover:underline">Browse Project Pool</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {project.id}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {project.businessName}
                  </h3>
                  <p className="text-sm text-gray-500">{project.email}</p>
                </div>

                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-500" 
                      style={{ width: `${Object.values(project.checklist).filter(Boolean).length * 12.5}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-400">
                    {Object.values(project.checklist).filter(Boolean).length}/8
                  </span>
                </div>

                <div className="pt-4 flex gap-2">
                  <button 
                    onClick={() => onView(project.id)}
                    className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    Manage Project <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

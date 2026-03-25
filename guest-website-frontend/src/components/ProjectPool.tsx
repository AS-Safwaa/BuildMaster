import React from 'react';
import { Project } from '../types';
import { Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectPoolProps {
  projects: Project[];
  onClaim: (id: string) => void;
  onView: (id: string) => void;
}

export const ProjectPool: React.FC<ProjectPoolProps> = ({ projects, onClaim, onView }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Project Pool</h2>
        <p className="text-gray-500 font-medium">Available projects waiting for a developer.</p>
      </div>

      {projects.length === 0 ? (
        <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No unassigned projects available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {project.id}
                  </span>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {project.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {project.businessName}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{project.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin size={14} className="text-gray-400" />
                    {project.address}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    Est. {project.yearsOfEstablishment}
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                  <button
                    onClick={() => onClaim(project.id)}
                    className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    Claim Project
                  </button>
                  <button
                    onClick={() => onView(project.id)}
                    className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <ArrowRight size={20} />
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

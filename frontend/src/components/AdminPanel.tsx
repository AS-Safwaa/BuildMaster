import React, { useState } from 'react';
import { Project, Developer } from '../types';
import { 
  Users, 
  LayoutGrid, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  UserPlus,
  Filter,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPanelProps {
  projects: Project[];
  developers: Developer[];
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
  onViewProject: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ projects, developers, onUpdateProject, onViewProject }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Project['status'] | 'All'>('All');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.businessName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-gray-100 text-gray-500';
      case 'In Development': return 'bg-blue-100 text-blue-600';
      case 'In Review': return 'bg-amber-100 text-amber-600';
      case 'Under Client Review': return 'bg-purple-100 text-purple-600';
      case 'Approved': return 'bg-emerald-100 text-emerald-600';
      case 'Completed': return 'bg-gray-900 text-white';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Panel</h2>
        <p className="text-gray-500 font-medium">Manage project assignments and track overall progress.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Projects</p>
          <p className="text-3xl font-black text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Unassigned</p>
          <p className="text-3xl font-black text-indigo-600">{projects.filter(p => !p.assignedDeveloperId).length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">In Development</p>
          <p className="text-3xl font-black text-blue-600">{projects.filter(p => p.status === 'In Development').length}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Completed</p>
          <p className="text-3xl font-black text-emerald-600">{projects.filter(p => p.status === 'Completed').length}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="flex-1 md:flex-none p-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="In Development">In Development</option>
            <option value="In Review">In Review</option>
            <option value="Under Client Review">Under Client Review</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Project</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Assigned Developer</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Progress</th>
              <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProjects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900">{project.businessName}</span>
                    <span className="text-xs text-gray-400 font-mono">{project.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select 
                      className="p-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                      value={project.assignedDeveloperId || ''}
                      onChange={(e) => {
                        const devId = e.target.value;
                        onUpdateProject(project.id, { 
                          assignedDeveloperId: devId || undefined,
                          status: devId ? 'In Development' : 'Submitted'
                        });
                      }}
                    >
                      <option value="">Unassigned</option>
                      {developers.map(dev => (
                        <option key={dev.id} value={dev.id}>{dev.name}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600" 
                        style={{ width: `${Object.values(project.checklist).filter(Boolean).length * 12.5}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-400">
                      {Object.values(project.checklist).filter(Boolean).length}/8
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onViewProject(project.id)}
                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <ArrowRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

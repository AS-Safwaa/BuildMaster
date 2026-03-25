// ─────────────────────────────────────────────────────────
// User Management Component (Backend UI for Admin)
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  Search,
  Mail,
  Calendar,
  MoreVertical,
  UserCheck,
  UserX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from './ui/AnimatedButton';
import { AnimatedCard } from './ui/AnimatedCard';
import { Modal } from './ui/Modal';
import { usersApi } from '../services/users.service';
import { User } from '../types';
import toast from 'react-hot-toast';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 'usr_admin_001', name: 'Admin User', email: 'admin@buildmaster.com', role: 'admin', createdAt: '2026-03-01' },
    { id: 'usr_dev_001', name: 'Alex Chen', email: 'developer@buildmaster.com', role: 'developer', createdAt: '2026-03-10' },
  ]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<{ name: string; email: string; role: 'admin' | 'developer' }>({ name: '', email: '', role: 'developer' });

  // ── Fetch users from API ───────────────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Note: This matches the API we built in Backend
        const { data: res } = await usersApi.getAll();
        if (res.success) {
          setUsers(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Fallback to demo data if API is not running
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error('Name and email are required');
      return;
    }
    const user: User = {
      ...newUser,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [user, ...prev]);
    setShowAddModal(false);
    setNewUser({ name: '', email: '', role: 'developer' });
    toast.success('User added successfully (Demo mode)');
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('User deleted (Demo mode)');
    }
  };

  const updateRole = (id: string, role: User['role']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
    toast.success(`Role updated to ${role}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Users</h2>
          <p className="text-gray-500 font-medium">Manage all platform roles and authentication.</p>
        </div>
        <AnimatedButton onClick={() => setShowAddModal(true)} className="w-full md:w-auto">
          <UserPlus size={18} /> Add New User
        </AnimatedButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard className="p-6 bg-gradient-to-br from-indigo-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Users</p>
              <p className="text-2xl font-black text-gray-900">{users.length}</p>
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard className="p-6 bg-gradient-to-br from-blue-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Developers</p>
              <p className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'developer').length}</p>
            </div>
          </div>
        </AnimatedCard>
        <AnimatedCard className="p-6 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <UserCheck size={22} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Admins</p>
              <p className="text-2xl font-black text-gray-900">{users.filter(u => u.role === 'admin').length}</p>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filteredUsers.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-gray-50/80 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                          {user.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{user.name}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className={`text-xs font-black px-3 py-1.5 rounded-lg outline-none border transition-all ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                          'bg-emerald-50 text-emerald-700 border-emerald-100'
                          }`}
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value as any)}
                      >
                        <option value="admin">ADMIN</option>
                        <option value="developer">DEVELOPER</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-600">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add System User">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <input
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="e.g. Michael Jordan"
              value={newUser.name}
              onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <input
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="user@example.com"
              value={newUser.email}
              onChange={e => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(['developer', 'admin'] as const).map(role => (
                <button
                  key={role}
                  className={`py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${newUser.role === role ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
                    }`}
                  onClick={() => setNewUser(prev => ({ ...prev, role }))}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <AnimatedButton variant="secondary" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</AnimatedButton>
            <AnimatedButton className="flex-1" onClick={handleAddUser}>Create User</AnimatedButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

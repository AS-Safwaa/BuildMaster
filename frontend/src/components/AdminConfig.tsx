import React, { useState, useCallback } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  RotateCcw, 
  Code, 
  Settings2, 
  Layers, 
  Navigation, 
  Palette, 
  Target, 
  MousePointer2,
  X,
  GripVertical,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MasterConfig } from '../types';
import { INITIAL_MASTER_CONFIG } from '../constants';

// --- Components ---

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  variant?: 'danger' | 'primary';
}> = ({ isOpen, onClose, title, children, onConfirm, confirmLabel = 'Confirm', variant = 'primary' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {onConfirm && (
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Chip: React.FC<{ 
  label: string; 
  onDelete?: () => void; 
  onEdit?: (val: string) => void;
}> = ({ label, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(label);

  const handleBlur = () => {
    setIsEditing(false);
    if (onEdit && value !== label) onEdit(value);
  };

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium group transition-all hover:bg-indigo-100">
      {isEditing ? (
        <input 
          autoFocus
          className="bg-transparent outline-none w-24"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        />
      ) : (
        <span onClick={() => onEdit && setIsEditing(true)} className="cursor-pointer">{label}</span>
      )}
      {onDelete && (
        <button onClick={onDelete} className="text-indigo-400 hover:text-indigo-600 transition-colors">
          <X size={14} />
        </button>
      )}
    </div>
  );
};

const SectionHeader: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  isOpen: boolean; 
  onToggle: () => void;
  actions?: React.ReactNode;
}> = ({ icon, title, isOpen, onToggle, actions }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm mb-2">
    <button 
      onClick={onToggle}
      className="flex items-center gap-3 flex-1 text-left"
    >
      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
        {icon}
      </div>
      <span className="font-semibold text-gray-900">{title}</span>
      {isOpen ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
    </button>
    {actions}
  </div>
);

interface AdminConfigProps {
  config: MasterConfig;
  setConfig: React.Dispatch<React.SetStateAction<MasterConfig>>;
}

export const AdminConfig: React.FC<AdminConfigProps> = ({ config, setConfig }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    navigation: false,
    styles: false,
    goals: false,
    cta: false
  });
  const [showJson, setShowJson] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ type: string; id: string; parentId?: string; subParentId?: string } | null>(null);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const resetConfig = () => {
    if (confirm('Are you sure you want to reset all configurations to default?')) {
      setConfig(INITIAL_MASTER_CONFIG);
    }
  };

  const updateConfig = useCallback((updater: (prev: MasterConfig) => MasterConfig) => {
    setConfig(prev => updater(prev));
  }, [setConfig]);

  // Categories
  const addCategory = () => {
    const name = prompt('Enter Category Name:');
    if (name) {
      updateConfig(prev => ({
        ...prev,
        mainCategories: [...prev.mainCategories, { id: Date.now().toString(), name, subCategories: [] }]
      }));
    }
  };

  const deleteCategory = (id: string) => {
    updateConfig(prev => ({
      ...prev,
      mainCategories: prev.mainCategories.filter(c => c.id !== id)
    }));
  };

  const addSubCategory = (catId: string) => {
    const name = prompt('Enter Subcategory Name:');
    if (name) {
      updateConfig(prev => ({
        ...prev,
        mainCategories: prev.mainCategories.map(c => c.id === catId ? {
          ...c,
          subCategories: [...c.subCategories, { id: Date.now().toString(), name, specialisations: [] }]
        } : c)
      }));
    }
  };

  const addSpecialisation = (catId: string, subId: string) => {
    const name = prompt('Enter Specialisation Name:');
    if (name) {
      updateConfig(prev => ({
        ...prev,
        mainCategories: prev.mainCategories.map(c => c.id === catId ? {
          ...c,
          subCategories: c.subCategories.map(s => s.id === subId ? {
            ...s,
            specialisations: [...s.specialisations, { id: Date.now().toString(), name, services: [], usp: [] }]
          } : s)
        } : c)
      }));
    }
  };

  const updateSpecialisationItems = (catId: string, subId: string, specId: string, field: 'services' | 'usp', items: string[]) => {
    updateConfig(prev => ({
      ...prev,
      mainCategories: prev.mainCategories.map(c => c.id === catId ? {
        ...c,
        subCategories: c.subCategories.map(s => s.id === subId ? {
          ...s,
          specialisations: s.specialisations.map(sp => sp.id === specId ? { ...sp, [field]: items } : sp)
        } : s)
      } : c)
    }));
  };

  // Generic List Handlers
  const addListItem = (field: keyof MasterConfig) => {
    const val = prompt(`Enter new ${field.toString().replace('Options', '')}:`);
    if (val) {
      updateConfig(prev => ({
        ...prev,
        [field]: Array.isArray(prev[field]) ? [...(prev[field] as string[]), val] : prev[field]
      }));
    }
  };

  const removeListItem = (field: keyof MasterConfig, index: number) => {
    updateConfig(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const editListItem = (field: keyof MasterConfig, index: number, newVal: string) => {
    updateConfig(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((v, i) => i === index ? newVal : v)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
            <Settings2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Master Configuration</h1>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">In-Memory Data Editor</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowJson(!showJson)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              showJson ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Code size={18} />
            {showJson ? 'Hide JSON' : 'Preview JSON'}
          </button>
          <button 
            onClick={resetConfig}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all"
          >
            <RotateCcw size={18} />
            Reset to Defaults
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Side */}
        <div className={`${showJson ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>
          
          {/* Main Categories Section */}
          <section>
            <SectionHeader 
              icon={<Layers size={20} />} 
              title="Main Categories & Hierarchy" 
              isOpen={openSections.categories}
              onToggle={() => toggleSection('categories')}
              actions={
                <button 
                  onClick={(e) => { e.stopPropagation(); addCategory(); }}
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              }
            />
            <AnimatePresence>
              {openSections.categories && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-4 pl-4"
                >
                  {config.mainCategories.map((cat) => (
                    <div key={cat.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical size={16} className="text-gray-300 cursor-grab" />
                          <span className="font-bold text-gray-800">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => addSubCategory(cat.id)} className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-md transition-colors" title="Add Subcategory">
                            <Plus size={16} />
                          </button>
                          <button onClick={() => deleteCategory(cat.id)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {cat.subCategories.map((sub) => (
                          <div key={sub.id} className="pl-4 border-l-2 border-indigo-100 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <ChevronRight size={14} className="text-indigo-400" />
                                {sub.name}
                              </h4>
                              <button onClick={() => addSpecialisation(cat.id, sub.id)} className="text-xs font-medium text-indigo-600 hover:underline">
                                + Add Specialisation
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {sub.specialisations.map((spec) => (
                                <div key={spec.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-900">{spec.name}</span>
                                    <button 
                                      onClick={() => {
                                        updateConfig(prev => ({
                                          ...prev,
                                          mainCategories: prev.mainCategories.map(c => c.id === cat.id ? {
                                            ...c,
                                            subCategories: c.subCategories.map(s => s.id === sub.id ? {
                                              ...s,
                                              specialisations: s.specialisations.filter(sp => sp.id !== spec.id)
                                            } : s)
                                          } : c)
                                        }));
                                      }}
                                      className="text-red-400 hover:text-red-600"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                  
                                  {/* Services */}
                                  <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Services</p>
                                    <div className="flex flex-wrap gap-2">
                                      {spec.services.map((svc, idx) => (
                                        <Chip 
                                          key={idx} 
                                          label={svc} 
                                          onDelete={() => updateSpecialisationItems(cat.id, sub.id, spec.id, 'services', spec.services.filter((_, i) => i !== idx))}
                                          onEdit={(val) => updateSpecialisationItems(cat.id, sub.id, spec.id, 'services', spec.services.map((v, i) => i === idx ? val : v))}
                                        />
                                      ))}
                                      <button 
                                        onClick={() => {
                                          const val = prompt('New Service:');
                                          if (val) updateSpecialisationItems(cat.id, sub.id, spec.id, 'services', [...spec.services, val]);
                                        }}
                                        className="w-7 h-7 flex items-center justify-center bg-white border border-dashed border-indigo-300 text-indigo-500 rounded-full hover:bg-indigo-50 transition-colors"
                                      >
                                        <Plus size={14} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* USPs */}
                                  <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">USPs</p>
                                    <div className="flex flex-wrap gap-2">
                                      {spec.usp.map((u, idx) => (
                                        <Chip 
                                          key={idx} 
                                          label={u} 
                                          onDelete={() => updateSpecialisationItems(cat.id, sub.id, spec.id, 'usp', spec.usp.filter((_, i) => i !== idx))}
                                          onEdit={(val) => updateSpecialisationItems(cat.id, sub.id, spec.id, 'usp', spec.usp.map((v, i) => i === idx ? val : v))}
                                        />
                                      ))}
                                      <button 
                                        onClick={() => {
                                          const val = prompt('New USP:');
                                          if (val) updateSpecialisationItems(cat.id, sub.id, spec.id, 'usp', [...spec.usp, val]);
                                        }}
                                        className="w-7 h-7 flex items-center justify-center bg-white border border-dashed border-indigo-300 text-indigo-500 rounded-full hover:bg-indigo-50 transition-colors"
                                      >
                                        <Plus size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Navigation Options */}
          <section>
            <SectionHeader 
              icon={<Navigation size={20} />} 
              title="Navigation Options" 
              isOpen={openSections.navigation}
              onToggle={() => toggleSection('navigation')}
              actions={
                <button onClick={(e) => { e.stopPropagation(); addListItem('navigationOptions'); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Plus size={20} />
                </button>
              }
            />
            <AnimatePresence>
              {openSections.navigation && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-2"
                >
                  {config.navigationOptions.map((opt, idx) => (
                    <Chip 
                      key={idx} 
                      label={opt} 
                      onDelete={() => removeListItem('navigationOptions', idx)}
                      onEdit={(val) => editListItem('navigationOptions', idx, val)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Website Styles */}
          <section>
            <SectionHeader 
              icon={<Palette size={20} />} 
              title="Website Styles" 
              isOpen={openSections.styles}
              onToggle={() => toggleSection('styles')}
              actions={
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    const name = prompt('Style Name:');
                    if (name) {
                      updateConfig(prev => ({
                        ...prev,
                        websiteStyles: [...prev.websiteStyles, { id: Date.now().toString(), name, description: '', sample: '' }]
                      }));
                    }
                  }} 
                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Plus size={20} />
                </button>
              }
            />
            <AnimatePresence>
              {openSections.styles && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {config.websiteStyles.map((style) => (
                    <div key={style.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <input 
                          className="font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full"
                          value={style.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig(prev => ({
                              ...prev,
                              websiteStyles: prev.websiteStyles.map(s => s.id === style.id ? { ...s, name: val } : s)
                            }));
                          }}
                        />
                        <button 
                          onClick={() => updateConfig(prev => ({ ...prev, websiteStyles: prev.websiteStyles.filter(s => s.id !== style.id) }))}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <textarea 
                        className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                        placeholder="Description..."
                        rows={2}
                        value={style.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          updateConfig(prev => ({
                            ...prev,
                            websiteStyles: prev.websiteStyles.map(s => s.id === style.id ? { ...s, description: val } : s)
                          }));
                        }}
                      />
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                        <ExternalLink size={14} className="text-gray-400" />
                        <input 
                          className="text-xs text-indigo-600 bg-transparent border-none focus:ring-0 p-0 w-full"
                          placeholder="Sample URL..."
                          value={style.sample}
                          onChange={(e) => {
                            const val = e.target.value;
                            updateConfig(prev => ({
                              ...prev,
                              websiteStyles: prev.websiteStyles.map(s => s.id === style.id ? { ...s, sample: val } : s)
                            }));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Website Goals */}
          <section>
            <SectionHeader 
              icon={<Target size={20} />} 
              title="Website Goals" 
              isOpen={openSections.goals}
              onToggle={() => toggleSection('goals')}
            />
            <AnimatePresence>
              {openSections.goals && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-6 space-y-6"
                >
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div>
                      <h4 className="font-bold text-indigo-900">Maximum Goal Selection</h4>
                      <p className="text-sm text-indigo-700">Limit how many goals a user can pick.</p>
                    </div>
                    <input 
                      type="number"
                      className="w-16 h-10 bg-white border border-indigo-200 rounded-lg text-center font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={config.maxGoalSelection}
                      onChange={(e) => updateConfig(prev => ({ ...prev, maxGoalSelection: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Available Goals</h4>
                      <button onClick={() => addListItem('websiteGoals')} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors">+ Add Goal</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {config.websiteGoals.map((goal, idx) => (
                        <Chip 
                          key={idx} 
                          label={goal} 
                          onDelete={() => removeListItem('websiteGoals', idx)}
                          onEdit={(val) => editListItem('websiteGoals', idx, val)}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* CTA Options */}
          <section>
            <SectionHeader 
              icon={<MousePointer2 size={20} />} 
              title="CTA Options" 
              isOpen={openSections.cta}
              onToggle={() => toggleSection('cta')}
              actions={
                <button onClick={(e) => { e.stopPropagation(); addListItem('ctaOptions'); }} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Plus size={20} />
                </button>
              }
            />
            <AnimatePresence>
              {openSections.cta && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-2"
                >
                  {config.ctaOptions.map((cta, idx) => (
                    <Chip 
                      key={idx} 
                      label={cta} 
                      onDelete={() => removeListItem('ctaOptions', idx)}
                      onEdit={(val) => editListItem('ctaOptions', idx, val)}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

        {/* JSON Preview Side */}
        {showJson && (
          <aside className="lg:col-span-5 sticky top-24 h-[calc(100vh-8rem)]">
            <div className="bg-gray-900 rounded-2xl h-full flex flex-col overflow-hidden shadow-2xl border border-gray-800">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs font-mono text-gray-400 uppercase tracking-widest">masterConfig.json</span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                    alert('Copied to clipboard!');
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Copy JSON
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 font-mono text-sm text-indigo-300 custom-scrollbar">
                <pre>{JSON.stringify(config, null, 2)}</pre>
              </div>
            </div>
          </aside>
        )}
      </main>

      {/* Global Modals */}
      <Modal 
        isOpen={!!deleteModal} 
        onClose={() => setDeleteModal(null)}
        title="Confirm Deletion"
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          // Handled inline for simplicity in this demo
        }}
      >
        <p className="text-gray-600">Are you sure you want to delete this item? This action cannot be undone.</p>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111827;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
}

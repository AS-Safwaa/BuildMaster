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
  ExternalLink,
  Sparkles,
  MessageSquare,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
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
    <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-bold group transition-all hover:bg-blue-100">
      {isEditing ? (
        <input
          autoFocus
          className="bg-transparent outline-none w-20"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
        />
      ) : (
        <span onClick={() => onEdit && setIsEditing(true)} className="cursor-pointer">{label}</span>
      )}
      {onDelete && (
        <button onClick={onDelete} className="text-blue-400 hover:text-blue-600 transition-colors">
          <X size={12} />
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
  <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl shadow-sm mb-2 hover:border-blue-100 transition-all">
    <button
      onClick={onToggle}
      className="flex items-center gap-3 flex-1 text-left"
    >
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
        {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      </div>
      <span className="text-sm font-bold text-gray-900">{title}</span>
      {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
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
    branding: false,
    goals: false,
    cta: false,
    testimonials: false,
    social: false
  });
  const [showJson, setShowJson] = useState(false);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
            <Settings2 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Master Workflow Config</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sync intake form steps and options</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowJson(!showJson)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showJson ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
          >
            <Code size={16} />
            {showJson ? 'Hide JSON' : 'JSON Engine'}
          </button>
          <button
            onClick={resetConfig}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-red-500 rounded-lg text-xs font-bold hover:bg-red-50 transition-all"
          >
            <RotateCcw size={16} />
            Factory Reset
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Side */}
        <div className={`${showJson ? 'lg:col-span-12 xl:col-span-7' : 'lg:col-span-12'} space-y-4 transition-all duration-300`}>

          {/* 1. SECTOR HIERARCHY */}
          <section>
            <SectionHeader
              icon={<Layers />}
              title="1. Sector Hierarchy (Specialisations)"
              isOpen={openSections.categories}
              onToggle={() => toggleSection('categories')}
              actions={
                <button onClick={(e) => {
                  e.stopPropagation();
                  const name = prompt('Category Name:');
                  if (name) updateConfig(p => ({ ...p, mainCategories: [...p.mainCategories, { id: Date.now().toString(), name, subCategories: [] }] }));
                }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Plus size={18} />
                </button>
              }
            />
            <AnimatePresence>
              {openSections.categories && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3 pl-4">
                  {config.mainCategories.map((cat) => (
                    <div key={cat.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-800 uppercase tracking-tight">{cat.name}</span>
                        <div className="flex gap-1">
                          <button onClick={() => {
                            const name = prompt('Subcategory:');
                            if (name) updateConfig(p => ({ ...p, mainCategories: p.mainCategories.map(c => c.id === cat.id ? { ...c, subCategories: [...c.subCategories, { id: Date.now().toString(), name, specialisations: [] }] } : c) }));
                          }} className="p-1 text-blue-600 hover:bg-blue-100 rounded-md"><Plus size={14} /></button>
                          <button onClick={() => updateConfig(p => ({ ...p, mainCategories: p.mainCategories.filter(c => c.id !== cat.id) }))} className="p-1 text-red-400 hover:bg-red-50 rounded-md"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="p-3 space-y-3">
                        {cat.subCategories.map((sub) => (
                          <div key={sub.id} className="pl-3 border-l-2 border-slate-100 flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <ChevronRight size={12} className="text-blue-400" />
                              <span className="text-xs font-bold text-slate-600">{sub.name}</span>
                            </div>
                            <button onClick={() => {
                              const name = prompt('Specialisation:');
                              if (name) updateConfig(p => ({ ...p, mainCategories: p.mainCategories.map(c => c.id === cat.id ? { ...c, subCategories: c.subCategories.map(s => s.id === sub.id ? { ...s, specialisations: [...s.specialisations, { id: Date.now().toString(), name, services: [], usp: [] }] } : s) } : c) }));
                            }} className="text-[10px] font-bold text-blue-600 hover:underline uppercase">+ Specialisation</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 2. NAVIGATION OPTIONS */}
          <section>
            <SectionHeader icon={<Navigation />} title="2. Navigation (Website Menu)" isOpen={openSections.navigation} onToggle={() => toggleSection('navigation')}
              actions={<button onClick={(e) => { e.stopPropagation(); addListItem('navigationOptions'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Plus size={18} /></button>}
            />
            <AnimatePresence>
              {openSections.navigation && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2">
                  {config.navigationOptions.map((opt, idx) => (
                    <Chip key={idx} label={opt} onDelete={() => removeListItem('navigationOptions', idx)} onEdit={(val) => editListItem('navigationOptions', idx, val)} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 3. BRANDING PERSONALITIES */}
          <section>
            <SectionHeader icon={<Sparkles />} title="3. Branding Personality (Brand Vibe)" isOpen={openSections.branding} onToggle={() => toggleSection('branding')}
              actions={<button onClick={(e) => { e.stopPropagation(); addListItem('brandPersonalities'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Plus size={18} /></button>}
            />
            <AnimatePresence>
              {openSections.branding && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2">
                  {config.brandPersonalities.map((opt, idx) => (
                    <Chip key={idx} label={opt} onDelete={() => removeListItem('brandPersonalities', idx)} onEdit={(val) => editListItem('brandPersonalities', idx, val)} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 4. WEBSITE GOALS */}
          <section>
            <SectionHeader icon={<Target />} title="4. Project Goals (Intake Step 3)" isOpen={openSections.goals} onToggle={() => toggleSection('goals')} />
            <AnimatePresence>
              {openSections.goals && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Max Goal Selection per Project</span>
                    <input type="number" className="w-12 h-8 bg-white border border-slate-200 rounded text-center font-bold text-blue-600 text-xs" value={config.maxGoalSelection} onChange={(e) => updateConfig(p => ({ ...p, maxGoalSelection: parseInt(e.target.value) || 1 }))} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {config.websiteGoals.map((g, idx) => (
                      <Chip key={idx} label={g} onDelete={() => removeListItem('websiteGoals', idx)} onEdit={(v) => editListItem('websiteGoals', idx, v)} />
                    ))}
                    <button onClick={() => addListItem('websiteGoals')} className="w-7 h-7 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><Plus size={14} /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 5. CTA OPTIONS */}
          <section>
            <SectionHeader icon={<MousePointer2 />} title="5. CTA Options (Calls to Action)" isOpen={openSections.cta} onToggle={() => toggleSection('cta')}
              actions={<button onClick={(e) => { e.stopPropagation(); addListItem('ctaOptions'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Plus size={18} /></button>}
            />
            <AnimatePresence>
              {openSections.cta && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2">
                  {config.ctaOptions.map((opt, idx) => (
                    <Chip key={idx} label={opt} onDelete={() => removeListItem('ctaOptions', idx)} onEdit={(val) => editListItem('ctaOptions', idx, val)} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 6. TESTIMONIAL FLOW */}
          <section>
            <SectionHeader icon={<MessageSquare />} title="6. Testimonial Handling" isOpen={openSections.testimonials} onToggle={() => toggleSection('testimonials')} />
            <AnimatePresence>
              {openSections.testimonials && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {config.testimonialOptions.map((opt) => (
                    <div key={opt.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                      <span className="text-lg">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">{opt.id}</p>
                        <p className="text-xs font-bold text-slate-700">{opt.label}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 7. SOCIAL PLATFORMS */}
          <section>
            <SectionHeader icon={<Share2 />} title="7. Social Platforms" isOpen={openSections.social} onToggle={() => toggleSection('social')}
              actions={<button onClick={(e) => { e.stopPropagation(); addListItem('socialPlatforms'); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Plus size={18} /></button>}
            />
            <AnimatePresence>
              {openSections.social && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-2">
                  {config.socialPlatforms.map((opt, idx) => (
                    <Chip key={idx} label={opt} onDelete={() => removeListItem('socialPlatforms', idx)} onEdit={(val) => editListItem('socialPlatforms', idx, val)} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* 8. WEBSITE STYLES (PRESETS) */}
          <section>
            <SectionHeader icon={<Palette />} title="8. Design Style Presets" isOpen={openSections.styles} onToggle={() => toggleSection('styles')} />
            <AnimatePresence>
              {openSections.styles && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {config.websiteStyles.map((style) => (
                    <div key={style.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm relative group">
                      <button onClick={() => updateConfig(p => ({ ...p, websiteStyles: p.websiteStyles.filter(s => s.id !== style.id) }))} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                      <h4 className="text-xs font-bold text-slate-900">{style.name}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-2">{style.description}</p>
                      <div className="flex items-center gap-2 pt-2 text-[9px] font-bold text-blue-600 uppercase tracking-tighter">
                        <ExternalLink size={10} /> {style.sample.replace('https://', '')}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

        {/* JSON Preview Side */}
        {showJson && (
          <aside className="lg:col-span-12 xl:col-span-5 sticky top-24 h-auto xl:h-[calc(100vh-8rem)]">
            <div className="bg-slate-900 rounded-2xl h-full flex flex-col overflow-hidden shadow-2xl border border-slate-800">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  <span className="ml-2 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em]">workflow.manifest.json</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                    alert('Copied to clipboard!');
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                >
                  Copy Engine Data
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6 font-mono text-xs text-blue-300/80 custom-scrollbar leading-relaxed">
                <pre>{JSON.stringify(config, null, 2)}</pre>
              </div>
            </div>
          </aside>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0f172a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
}

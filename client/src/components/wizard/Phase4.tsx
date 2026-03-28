import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export const Phase4 = () => {
  const { data, updateData, setPhase } = useWizard();

  const vibeBoards = [
    { id: 'dark', title: 'Dark Premium', desc: 'Bold, immersive, tech-focused' },
    { id: 'light', title: 'Bright & Airy', desc: 'Trustworthy, clean, clinical' },
    { id: 'minimal', title: 'Modern Minimal', desc: 'Less is more, typography focused' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl space-y-8"
    >
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Visual Aesthetic</h2>
        <p className="text-slate-500">Define the visual language of your brand and website.</p>
      </div>

      <div className="space-y-8">
        
        {/* Vibe Boards (Website Style) */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-slate-700 block">Website Theme Vibe</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vibeBoards.map((vibe) => (
              <button
                key={vibe.id}
                onClick={() => updateData({ websiteStyle: vibe.id })}
                className={`relative overflow-hidden group border-2 rounded-2xl text-left transition-all ${
                  data.websiteStyle === vibe.id 
                  ? 'border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]' 
                  : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`h-32 w-full flex items-center justify-center ${
                  vibe.id === 'dark' ? 'bg-slate-900 pattern-isometric pattern-slate-800 pattern-size-4' :
                  vibe.id === 'light' ? 'bg-blue-50 pattern-dots pattern-blue-200 pattern-size-4' :
                  'bg-white pattern-wavy pattern-slate-100 pattern-size-6'
                }`}>
                  <ImageIcon className={`w-8 h-8 ${vibe.id === 'dark' ? 'text-slate-600' : 'text-slate-300'}`} />
                </div>
                <div className="p-5 bg-white">
                  <h4 className="font-bold text-slate-800 text-lg">{vibe.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{vibe.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />

        {/* Logo Section */}
        <div className="space-y-6">
          <label className="text-sm font-semibold text-slate-700 block">Logo Preferences</label>
          
          <label className="flex items-start gap-4 p-5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="radio" name="logo" className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500" 
              onChange={() => updateData({ logoPreference: 'existing' })} 
              checked={data.logoPreference === 'existing'} />
            <div>
              <span className="font-bold text-slate-800 block">I have an existing logo</span>
              <span className="text-sm text-slate-500 block">I will provide a Google Drive link to my assets.</span>
            </div>
          </label>

          <label className="flex items-start gap-4 p-5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="radio" name="logo" className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500" 
              onChange={() => updateData({ logoPreference: 'redesign' })} 
              checked={data.logoPreference === 'redesign'} />
            <div>
              <span className="font-bold text-slate-800 block">I have a logo, but it needs an upgrade</span>
              <span className="text-sm text-slate-500 block">Help me modernize and clean up my identity.</span>
            </div>
          </label>
          
          <label className="flex items-start gap-4 p-5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <input type="radio" name="logo" className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500" 
              onChange={() => updateData({ logoPreference: 'new' })} 
              checked={data.logoPreference === 'new'} />
             <div>
              <span className="font-bold text-slate-800 block">I need a completely new logo</span>
              <span className="text-sm text-slate-500 block">Start from scratch and design my brand.</span>
            </div>
          </label>
        </div>

        <hr className="border-slate-200" />

        {/* Competitors & Assets */}
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Top Competitors (URLs)</label>
            <p className="text-xs text-slate-500 mb-3">Who do you admire or compete with? (Comma separated links)</p>
            <input 
              type="text" placeholder="e.g. www.competitor1.com, www.competitor2.com"
              value={data.competitors.join(', ')} 
              onChange={(e) => updateData({ competitors: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 block mb-1">Social Media Links</label>
            <input 
              type="text" placeholder="Instagram, LinkedIn, Facebook profiles (comma separated)"
              value={data.socialLinks['general'] || ''} 
              onChange={(e) => updateData({ socialLinks: { general: e.target.value } })}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
            />
          </div>

          <label className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
            <input type="checkbox" className="w-5 h-5 text-blue-600 focus:ring-blue-500 rounded" 
              onChange={(e) => updateData({ hasPhotos: e.target.checked })} 
              checked={data.hasPhotos} />
            <div>
              <span className="font-bold text-slate-800 block">I have professional photos/assets</span>
              <span className="text-sm text-slate-500 block">Check if you will be providing a gallery link.</span>
            </div>
          </label>
        </div>

      </div>

      <div className="flex justify-between pt-10 border-t border-slate-100">
        <button 
          onClick={() => setPhase(3)}
          className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button 
          onClick={() => setPhase(5)}
          className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Review & Submit <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </motion.div>
  );
};

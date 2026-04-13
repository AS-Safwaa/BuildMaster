import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { Palette, ArrowRight, ArrowLeft, Link as LinkIcon, ExternalLink, Check } from 'lucide-react';

// --- Static Style References ---
const STYLE_REFERENCES: Record<string, string[]> = {
  'Simple & Clean': ['https://apple.com', 'https://stripe.com'],
  'Bold & Dark': ['https://linear.app', 'https://vercel.com'],
  'Classic/Trustworthy': ['https://goldmansachs.com', 'https://mercedes-benz.com'],
  'Modern/Techy': ['https://tesla.com', 'https://openai.com']
};

export const Phase6 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();
  const styles = ['Simple & Clean', 'Bold & Dark', 'Classic/Trustworthy', 'Modern/Techy'];

  const UrlInput = ({ label, sub, value, onChange, icon }: any) => (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-1 px-1">
        <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
           {icon}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none">{label}</p>
          <p className="text-[9px] font-bold text-slate-400 mt-0.5">{sub}</p>
        </div>
      </div>
      <input 
        type="text" placeholder="https://..." value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 bg-slate-50 border-0 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-100 font-bold text-sm transition-all"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-12 pb-20 px-4"
    >
      <div className="text-center md:text-left">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight leading-none text-balance font-sans">Step {getStepNumber(6)}: Benchmarks & Vibes</h2>
        <p className="text-base text-slate-500 font-medium opacity-90 leading-relaxed">
           Analyze competitors and define the aesthetic anchor for your digital presence.
        </p>
      </div>

      {/* Website References Section */}
      <div className="space-y-10">
        <div className="space-y-6 p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <LinkIcon className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-slate-900">Digital Benchmarks</h3>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-8">Share examples of websites that match your vision or belong to your competitors.</p>
          
          <div className="space-y-6">
            <UrlInput 
              label="Preferred Website Layout" 
              sub="A site that feels exactly like you want yours to be"
              value={data.preferredWebsite || ''} 
              onChange={(v: string) => updateData({ preferredWebsite: v })} 
              icon={<ExternalLink className="w-4 h-4" />}
            />
            <UrlInput 
              label="Competitor Reference" 
              sub="A direct player in your market we should analyze"
              value={data.competitorWebsite || ''} 
              onChange={(v: string) => updateData({ competitorWebsite: v })} 
              icon={<LinkIcon className="w-4 h-4" />}
            />
            <UrlInput 
              label="Style Inspiration" 
              sub="Any site with a vibe, colors, or motion you love"
              value={data.inspiredWebsite || ''} 
              onChange={(v: string) => updateData({ inspiredWebsite: v })} 
              icon={<Palette className="w-4 h-4" />}
            />
          </div>
        </div>
      </div>

      {/* Website Look Section */}
      <div className="space-y-10 pt-10 border-t border-slate-100">
         <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                    <Palette className="w-5 h-5 text-pink-600" /> Standard Theme Presets
                </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {styles.map(s => (
                <button
                  key={s} onClick={() => updateData({ websiteStyle: s })}
                  className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${
                    data.websiteStyle === s ? 'border-pink-600 bg-pink-50 shadow-md ring-4 ring-pink-50/30' : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'
                  }`}
                >
                  <p className="font-bold text-slate-800 text-sm mb-1">{s}</p>
                  {data.websiteStyle === s && <Check className="absolute top-6 right-6 w-4 h-4 text-pink-600" />}
                </button>
              ))}
            </div>
         </div>

         <AnimatePresence>
            {data.websiteStyle && STYLE_REFERENCES[data.websiteStyle] && (
               <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-6 overflow-hidden">
                  <div className="p-6 bg-pink-50/30 border border-pink-100 rounded-[2rem] space-y-4">
                     <p className="text-xs font-black text-pink-600 uppercase tracking-[0.2em] mb-4">Admin Reference Links for {data.websiteStyle}</p>
                     <div className="flex flex-wrap gap-3">
                        {STYLE_REFERENCES[data.websiteStyle].map(link => (
                           <a key={link} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white border border-pink-100 text-pink-700 rounded-xl font-bold text-[10px] hover:shadow-md transition-all group">
                              {link.replace('https://', '')}
                              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                           </a>
                        ))}
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest leading-none">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          className="group flex items-center gap-6 px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest leading-none"
        >
          Final Integration!
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

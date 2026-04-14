import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft, Star, Layers, Zap, Heart } from 'lucide-react';
import { useState } from 'react';

const BUSINESS_HIERARCHY: any = {
  'Real Estate': {
    icon: <Layers className="w-10 h-10" />,
    color: 'bg-blue-500',
    subCategories: [
      {
        name: 'Residential Sales',
        products: [
            { name: 'Luxury Villas', highImpact: true },
            { name: 'Studio Apartments', highImpact: false },
            { name: 'Gated Communities', highImpact: true }
        ],
        usps: ['24/7 Concierge', 'Prime Locations', 'Eco-Friendly Design']
      },
      {
        name: 'Commercial Leasing',
        products: [
            { name: 'Tech Parks', highImpact: true },
            { name: 'Retail Spaces', highImpact: true },
            { name: 'Co-working Hubs', highImpact: false }
        ],
        usps: ['High Footfall', 'Central Business District', 'Modern Amenities']
      }
    ]
  },
  'Technology': {
    icon: <Zap className="w-10 h-10" />,
    color: 'bg-indigo-500',
    subCategories: [
      {
        name: 'SaaS Platform',
        products: [
          { name: 'Analytics Dashboards', highImpact: true },
          { name: 'CRM Modules', highImpact: false },
          { name: 'Integration Hubs', highImpact: true }
        ],
        usps: ['99.9% Uptime', 'AI-Powered Extraction', 'Zero-Code Setup']
      }
    ]
  },
  'Food & Beverages': {
    icon: <Heart className="w-10 h-10" />,
    color: 'bg-rose-500',
    subCategories: [
      {
        name: 'Cloud Kitchen',
        products: [
            { name: 'Meal Subscriptions', highImpact: true },
            { name: 'Boutique Bakery', highImpact: false },
            { name: 'Gourmet Packs', highImpact: true }
        ],
        usps: ['Farm-to-Fork', 'Hygiene First', 'Flash Delivery']
      }
    ]
  }
};

export const Phase5 = () => {
  const { data, updateData, goToNext, goToPrev } = useWizard();
  const [customItem, setCustomItem] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const currentCategory = BUSINESS_HIERARCHY[data.mainCategory] || null;
  const subCategories = currentCategory?.subCategories || [];
  const activeSub = subCategories.find((s: any) => s.name === data.subCategory);

  const toggleItem = (field: 'products' | 'services' | 'usps', item: string) => {
    const current = [...(data[field] || [])];
    if (current.includes(item)) {
      updateData({ [field]: current.filter((i: string) => i !== item) });
    } else {
      updateData({ [field]: [...current, item] });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
      className="space-y-20 pb-20"
    >
      {/* 1. Main Category Selection */}
      <section className="space-y-12">
        <div className="text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Focus & Sector</h2>
            <p className="text-lg text-slate-500 font-medium font-sans mx-auto max-w-md">What's the playground for your brand today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(BUSINESS_HIERARCHY).map(([name, meta]: any) => (
                <button
                    key={name}
                    onClick={() => updateData({ mainCategory: name, subCategory: '', products: [], usps: [], highImpactProducts: [] })}
                    className={`p-10 rounded-[3rem] border-4 transition-all duration-500 text-center relative overflow-hidden group ${
                        data.mainCategory === name 
                            ? 'border-indigo-600 bg-white shadow-2xl scale-105' 
                            : 'border-white bg-white hover:border-slate-100 shadow-xl'
                    }`}
                >
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${
                        data.mainCategory === name ? meta.color + ' text-white scale-110 shadow-xl' : 'bg-slate-50 text-slate-300'
                    }`}>
                        {meta.icon}
                    </div>
                    <span className="text-xl font-black text-slate-900">{name}</span>
                </button>
            ))}
        </div>
      </section>

      {/* 2. Sub-Category Visual Cards */}
      <AnimatePresence mode="wait">
        {data.mainCategory && (
            <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12 pt-12 border-t border-slate-100">
                <div className="text-center">
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">The Specifics</h3>
                    <p className="text-slate-500 font-medium">Narrow down your niche for precision.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    {subCategories.map((sub: any) => (
                        <button
                            key={sub.name}
                            onClick={() => updateData({ subCategory: sub.name, products: [], usps: [], highImpactProducts: [] })}
                            className={`px-10 py-5 rounded-[2rem] border-4 font-black text-sm uppercase tracking-widest transition-all ${
                                data.subCategory === sub.name 
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-2xl scale-110' 
                                    : 'bg-white border-white text-slate-400 hover:border-slate-100 shadow-xl'
                            }`}
                        >
                            {sub.name}
                        </button>
                    ))}
                </div>
            </motion.section>
        )}
      </AnimatePresence>

      {/* 3. Product & USP Matrix */}
      <AnimatePresence>
        {data.subCategory && activeSub && (
            <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 pt-16 border-t border-slate-100">
                <div className="bg-white p-12 rounded-[4rem] border-4 border-slate-50 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                            <Zap className="w-8 h-8"/>
                        </div>
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Offerings Matrix</h3>
                    <p className="text-slate-500 font-medium mb-12">Select what we'll be showcasing on your new site.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        {/* Column 1: Core Offerings */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Products / Services</h4>
                            <div className="space-y-4">
                                {activeSub.products.map((p: any) => {
                                    const selected = data.products.includes(p.name);
                                    return (
                                        <button 
                                            key={p.name} onClick={() => toggleItem('products', p.name)}
                                            className={`w-full p-6 rounded-[2rem] border-4 text-left flex justify-between items-center transition-all ${
                                                selected ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl translate-x-3' : 'bg-slate-50 border-slate-50 text-slate-600 hover:border-slate-100'
                                            }`}
                                        >
                                            <span className="font-black text-sm tracking-tight">{p.name}</span>
                                            {p.highImpact && <Star className={`w-5 h-5 ${selected ? 'fill-white' : 'text-indigo-200'}`} />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Column 2: Value Props */}
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Differentiators (USPs)</h4>
                            <div className="grid grid-cols-1 gap-4">
                                {activeSub.usps.map((u: string) => {
                                    const selected = data.usps.includes(u);
                                    return (
                                        <button 
                                            key={u} onClick={() => toggleItem('usps', u)}
                                            className={`p-6 rounded-[2rem] border-4 text-center transition-all ${
                                                selected ? 'bg-purple-600 border-purple-600 text-white shadow-xl scale-105' : 'bg-slate-50 border-slate-50 text-slate-500'
                                            }`}
                                        >
                                            <span className="font-bold text-xs uppercase tracking-widest">{u}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {/* Custom Injection */}
                            <div className="pt-6">
                                {!showCustom ? (
                                    <button onClick={() => setShowCustom(true)} className="w-full py-5 border-4 border-dashed border-slate-100 text-slate-300 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-400 transition-all">+ Add Something Custom</button>
                                ) : (
                                    <div className="flex gap-3">
                                        <input autoFocus placeholder="e.g. 100% Organic" value={customItem} onChange={e => setCustomItem(e.target.value)} className="flex-1 px-8 py-4 bg-indigo-50 border-4 border-indigo-100 rounded-[2rem] text-sm font-bold text-indigo-900 outline-none focus:border-indigo-500" />
                                        <button onClick={() => { if(customItem) { toggleItem('usps', customItem); setCustomItem(''); setShowCustom(false); } }} className="px-8 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest">Add</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          disabled={!data.subCategory}
          className={`group flex items-center gap-6 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all ${
            data.subCategory ? 'bg-slate-900 text-white shadow-2xl hover:bg-emerald-600 hover:-translate-y-1' : 'bg-slate-100 text-slate-300 pointer-events-none'
          }`}
        >
          Capture Strategy
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

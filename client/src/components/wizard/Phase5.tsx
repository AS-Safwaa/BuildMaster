import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';

// --- Mock Admin-Controlled Master Data ---
const MASTER_OFFERINGS: Record<string, { products: string[], services: string[], usps: string[] }> = {
  'Food': {
    products: ['Fresh Meals', 'Bakery Items', 'Beverages', 'Catering Trays'],
    services: ['Home Delivery', 'Dine-in Reservation', 'Event Catering', 'Party Planning'],
    usps: ['Organic Ingredients', '24/7 Delivery', 'Chef Special Recipes', 'Eco-friendly Packaging']
  },
  'Healthcare': {
    products: ['Medicines', 'Health Supplements', 'First Aid Kits', 'Diagnostic Tools'],
    services: ['Doctor Consultation', 'Lab Tests', 'Home Nursing', 'Physiotherapy'],
    usps: ['Certified Specialists', 'Instant Reports', 'Emergency Care', 'Affordable Pricing']
  },
  'RealEstate': {
    products: ['Residential Flats', 'Commercial Shops', 'Luxury Villas', 'Plots'],
    services: ['Property Valuation', 'Legal Documentation', 'Home Loans', 'Interior Design'],
    usps: ['Transparent Pricing', 'Prime Locations', 'Zero Brokerage', 'Fast Possession']
  },
  'Education': {
    products: ['E-books', 'Stationery Kits', 'Recorded Lessons', 'Practice Tests'],
    services: ['Live Classes', '1-on-1 Mentorship', 'Career Guidance', 'Language Training'],
    usps: ['Expert Faculty', 'Flexible Timings', 'Result Oriented', 'Scholarship Support']
  },
  'Retail': {
    products: ['Fashion Apparel', 'Electronic Gadgets', 'Home Decor', 'Personal Care'],
    services: ['Style Consultation', 'Device Repair', 'Gift Wrapping', 'Membership Program'],
    usps: ['Exclusive Designs', 'Same Day Delivery', 'Easy Returns', 'Quality Guaranteed']
  },
  'Service': {
    products: ['Custom Software', 'Legal Kits', 'Design Assets', 'Marketing Guides'],
    services: ['IT Consulting', 'Tax Filing', 'Brand Audits', 'SEO Management'],
    usps: ['Industry Experts', 'Custom Solutions', 'Data Privacy', 'Scalable Delivery']
  },
  'Custom': {
    products: [], services: [], usps: []
  }
};

export const Phase5 = () => {
  const { data, updateData, goToNext, goToPrev, getStepNumber } = useWizard();

  const businessCategories = [
    { id: 'Food', name: 'Food / Catering', sub: 'Cafe, Restaurant, Bakers' },
    { id: 'Healthcare', name: 'Healthcare', sub: 'Clinics, Doctors, Pharmacy' },
    { id: 'RealEstate', name: 'Real Estate', sub: 'Builders, Agents, Interior' },
    { id: 'Education', name: 'Education', sub: 'Tutors, Schools, Coaches' },
    { id: 'Retail', name: 'Retail / Shop', sub: 'Stores, Fashion, Gifts' },
    { id: 'Service', name: 'Other Services', sub: 'Legal, IT, CA, Beauty' },
    { id: 'Custom', name: 'Custom Industry', sub: "Can't find yours? Add it here" }
  ];

  const currentMaster = MASTER_OFFERINGS[data.mainCategory as keyof typeof MASTER_OFFERINGS] || MASTER_OFFERINGS['Custom'];

  const toggleItem = (field: 'products' | 'services' | 'usps', item: string) => {
    const current = [...(data[field] || [])];
    if (current.includes(item)) {
      updateData({ [field]: current.filter(i => i !== item) });
    } else {
      updateData({ [field]: [...current, item] });
    }
  };

  const SelectionGroup = ({ title, field, options }: { title: string, field: 'products' | 'services' | 'usps', options: string[] }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Select {field}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggleItem(field, opt)}
            className={`px-4 py-2.5 rounded-xl border-2 font-bold text-xs transition-all ${
              data[field].includes(opt) 
                ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'border-slate-50 bg-white text-slate-500 hover:border-slate-200 shadow-sm'
            }`}
          >
            {opt}
          </button>
        ))}
        {/* Custom Input Trigger */}
        <button 
          type="button"
          onClick={() => {
            const next = [...data[field], ''];
            updateData({ [field]: next });
          }}
          className="px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-xs hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center gap-2"
        >
          <Plus className="w-3 h-3" /> Add Custom
        </button>
      </div>

      <AnimatePresence>
        {data[field].some(i => !options.includes(i)) && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-2 overflow-hidden pt-2">
             {data[field].map((item, idx) => {
                if (options.includes(item)) return null;
                return (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={`Enter custom ${field.slice(0,-1)}...`} 
                      value={item}
                      onChange={(e) => {
                         const next = [...data[field]];
                         next[idx] = e.target.value;
                         updateData({ [field]: next });
                      }}
                      className="flex-1 p-3.5 bg-white border-2 border-slate-50 rounded-xl outline-none focus:border-blue-500 font-bold text-xs shadow-sm"
                    />
                    <button type="button" onClick={() => {
                       const next = [...data[field]];
                       next.splice(idx, 1);
                       updateData({ [field]: next });
                    }} className="p-3.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">
                       <X className="w-4 h-4" />
                    </button>
                  </div>
                );
             })}
          </motion.div>
        )}
      </AnimatePresence>
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
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight leading-none text-balance font-sans">Step {getStepNumber(5)}: What do you do?</h2>
        <p className="text-base text-slate-500 font-medium font-sans opacity-90 leading-relaxed">Please pick your industry and offerings so we can set the right vibe.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Which Industry do you work in?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {businessCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                // Clear selections when industry changes
                if (data.mainCategory !== cat.id) {
                    updateData({ 
                        mainCategory: cat.id,
                        products: [],
                        services: [],
                        usps: []
                    });
                }
              }}
              className={`p-6 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${
                data.mainCategory === cat.id 
                  ? 'border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-50/30' 
                  : 'border-slate-50 bg-white hover:border-slate-200 shadow-sm'
              }`}
            >
              <h4 className="font-bold text-slate-800 text-sm mb-1">{cat.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{cat.sub}</p>
              {data.mainCategory === cat.id && (
                <div className="absolute top-4 right-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {data.mainCategory === 'Custom' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-2 overflow-hidden">
               <input 
                 type="text" placeholder="Enter your custom industry name" value={data.subCategory}
                 onChange={(e) => updateData({ subCategory: e.target.value })}
                 className="w-full p-4 bg-white border-2 border-slate-50 rounded-2xl outline-none focus:border-blue-500 font-bold transition-all text-sm shadow-sm"
               />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {data.mainCategory && (
        <div className="space-y-10 pt-6 border-t border-slate-100">
           <SelectionGroup title="High-Impact Products" field="products" options={currentMaster.products} />
           <SelectionGroup title="Core Services" field="services" options={currentMaster.services} />
           <SelectionGroup title="Unique Selling Points (USPs)" field="usps" options={currentMaster.usps} />
        </div>
      )}

      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button type="button" onClick={goToPrev} className="flex items-center gap-2 px-8 py-4 bg-white border-2 border-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          type="button"
          onClick={goToNext}
          disabled={!data.mainCategory}
          className="group flex items-center gap-4 px-12 py-5 bg-blue-600 disabled:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-3xl font-bold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 hover:bg-blue-700 hover:-translate-y-0.5 transition-all text-sm uppercase tracking-widest"
        >
          Almost Done!
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

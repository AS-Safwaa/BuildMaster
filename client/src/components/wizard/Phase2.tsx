import { motion } from 'framer-motion';
import { useWizard } from '../../context/WizardContext';
import { MapPin, ArrowRight, ArrowLeft, Contact } from 'lucide-react';

export const Phase2 = () => {
  const { data, updateData, goToNext, goToPrev } = useWizard();

  const isFormValid = data.businessName && data.contactName && data.phone;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="space-y-16 pb-20 px-4"
    >
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">The Essentials</h2>
        <p className="text-lg text-slate-500 font-medium font-sans mx-auto max-w-md">Just the basics to get your project anchored in reality.</p>
      </div>

      <div className="space-y-12">
        {/* Core Identity Section */}
        <section className="space-y-8">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Contact className="w-4 h-4" /></div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <ZenInput 
                    label="What is your business called?" 
                    placeholder="e.g. Skyline Realty" 
                    value={data.businessName} 
                    onChange={(v:string) => updateData({ businessName: v })} 
                    required 
                />
                <ZenInput 
                    label="Who should we address?" 
                    placeholder="Your Full Name" 
                    value={data.contactName} 
                    onChange={(v:string) => updateData({ contactName: v })} 
                    required 
                />
                <ZenInput 
                    label="A mobile number for WA?" 
                    placeholder="10-digit number" 
                    value={data.phone} 
                    onChange={(v:string) => updateData({ phone: v })} 
                    required 
                    type="tel"
                />
                <ZenInput 
                    label="When did the journey start?" 
                    placeholder="Year (e.g. 2022)" 
                    value={data.establishmentYear} 
                    onChange={(v:string) => updateData({ establishmentYear: v })} 
                />
            </div>
        </section>

        {/* Presence Section */}
        <section className="space-y-8 border-t border-slate-100 pt-12">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><MapPin className="w-4 h-4" /></div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Presence & Location</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                   <ZenInput label="Where is your shop or office located?" placeholder="Street address, building, etc." value={data.addressLine1} onChange={(v:string) => updateData({ addressLine1: v })} />
                </div>
                <ZenInput label="City" placeholder="Mumbai" value={data.city} onChange={(v:string) => updateData({ city: v })} />
                <ZenInput label="State" placeholder="Maharashtra" value={data.state} onChange={(v:string) => updateData({ state: v })} />
                <ZenInput label="Pincode" placeholder="400XXX" value={data.pincode} onChange={(v:string) => updateData({ pincode: v })} />
            </div>
        </section>
      </div>

      <div className="flex justify-between items-center pt-10 border-t border-slate-100">
        <button onClick={goToPrev} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        <button 
          onClick={goToNext}
          disabled={!isFormValid}
          className={`group flex items-center gap-6 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all ${
            isFormValid ? 'bg-slate-900 text-white shadow-2xl hover:bg-indigo-600 hover:-translate-y-1' : 'bg-slate-100 text-slate-300 pointer-events-none'
          }`}
        >
          Sounds Perfect
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const ZenInput = ({ label, placeholder, value, onChange, required, type = "text" }: any) => (
    <div className="space-y-3 group">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 block transition-colors group-focus-within:text-indigo-600">
            {label} {required && <span className="text-indigo-400">*</span>}
        </label>
        <input 
            type={type} placeholder={placeholder}
            value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full px-6 py-5 bg-white border-4 border-slate-50/50 rounded-[2rem] outline-none focus:border-indigo-500 focus:bg-white text-slate-900 font-bold transition-all text-sm md:text-base hover:border-slate-100 shadow-sm focus:shadow-xl focus:shadow-indigo-500/10" 
        />
    </div>
);

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ClipboardList, Clock, Globe, Link as LinkIcon, 
  Save, User, CheckCircle2, 
  ExternalLink, Plus, Shield, Hammer, RotateCcw, 
  Copy, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { IS_PROTOTYPE } from '../config/prototype';
import API_BASE_URL from '../config/api';

const PROJECT_BRIEF_SCHEMA = {
  "Main Info": [
    { key: 'businessName', label: 'Business' },
    { key: 'contactName', label: 'Client' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'city', label: 'Location' },
    { key: 'establishmentYear', label: 'Built In' },
    { key: 'mainCategory', label: 'Industry' },
    { key: 'subCategory', label: 'Specialised In' },
    { key: 'callNowNumber', label: 'Call Action' },
    { key: 'whatsappNumber', label: 'WA Action' },
    { key: 'enquiryEmail', label: 'Lead Email' }
  ],
  "Logo Info": [
    { key: 'logoStatus', label: 'Status' },
    { key: 'brandPersonality', label: 'Vibe' },
    { key: 'designStyle', label: 'Style Preference' },
    { key: 'logoType', label: 'Logo Type' },
    { key: 'preferredColors', label: 'Palette' },
    { key: 'avoidColors', label: 'Avoid Colors' },
    { key: 'logoInspirations', label: 'References' },
    { key: 'logoStylePreference', label: 'Improvement Goal' }
  ],
  "Website Info": [
    { key: 'websiteGoals', label: 'Primary Goals' },
    { key: 'userAction', label: 'Main CTA' },
    { key: 'websiteStyle', label: 'Look/Style' },
    { key: 'competitorWebsites', label: 'Competitor URLs' },
    { key: 'referenceLinks', label: 'Design Inspo' },
    { key: 'hasDomain', label: 'Has Domain' },
    { key: 'preferredDomain', label: 'Domain Name' },
    { key: 'hasHosting', label: 'Has Hosting' },
    { key: 'customFeatures', label: 'Special Features' }
  ],
  "Tagline Info": [
    { key: 'products', label: 'Products' },
    { key: 'services', label: 'Services' },
    { key: 'usps', label: 'Unique Sell Points' },
    { key: 'tagline', label: 'Slogan' },
    { key: 'brandMission', label: 'Mission' },
    { key: 'targetMarket', label: 'Market' },
    { key: 'audience', label: 'Audience Type' }
  ]
};

const MOCK_PROJECT = {
    id: 7,
    businessName: "SR FoodKraft",
    email: "rahul@foodkraft.com",
    status: "in_progress",
    assigned_developer_id: 101,
    demo_link: "https://foodkraft-demo.vercel.app",
    final_link: "",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    answers: {
        businessName: "SR FoodKraft", 
        projectType: "Website + Logo", 
        contactName: "Rahul Sharma",
        brandPersonality: ["Professional", "Simple", "Friendly"], 
        designStyle: "Clean & Simple",
        logoType: "Combination Mark",
        preferredColors: ["#3B82F6", "#111827"],
        avoidColors: ["#EF4444"],
        establishmentYear: "2020", 
        phone: "+91 98765 43210", 
        email: "rahul@foodkraft.com",
        city: "Mumbai", 
        mainCategory: "Food",
        subCategory: "Cloud Kitchen",
        websiteStyle: "Simple & Clean",
        hasDomain: true, 
        preferredDomain: "srfoodkraft.com", 
        hasHosting: false,
        callNowNumber: "+91 98765 43210",
        whatsappNumber: "+91 98765 43210",
        enquiryEmail: "orders@foodkraft.com",
        products: ["Ready Meals", "Spice Kits", "Bakery Goods"],
        services: ["Home Delivery", "Subscription Box", "Event Catering"],
        usps: ["No Preservatives", "Chef Authenticated", "30-min Delivery"],
        tagline: "Authentic Indian, Delivered Fresh",
        brandMission: "To bring high-quality Indian home-style food to every urban doorstep.",
        targetMarket: "National",
        audience: "Working professionals (25-45) and families.",
        customFeatures: ["Subscription Management", "Loyalty Points System"]
    },
    updates: [
        { id: 1, text: "Initial brief ingested from guest wizard", time: "2 days ago", type: 'system' },
        { id: 2, text: "Project assigned to NODE-101", time: "1 day ago", type: 'assignment' },
        { id: 3, text: "Designing initial logo concepts (Scratch flow)", time: "4 hours ago", type: 'dev' }
    ]
};

export const ProjectWorkspace = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin';
    
    const [project, setProject] = useState<any>(IS_PROTOTYPE ? MOCK_PROJECT : null);
    const [loading, setLoading] = useState(!IS_PROTOTYPE);
    const [activeSection, setActiveSection] = useState('brief');
    const [copyStatus, setCopyStatus] = useState<string | null>(null);

    const [status, setStatus] = useState(project?.status || 'assigned');
    const [demoLink, setDemoLink] = useState(project?.demo_link || '');
    const [finalLink, setFinalLink] = useState(project?.final_link || '');
    const [newUpdate, setNewUpdate] = useState('');

    useEffect(() => {
        if (!IS_PROTOTYPE) fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/${isAdmin ? 'admin/dashboard/view-project' : 'developer/projects'}/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = res.data;
            if (data.answers && typeof data.answers === 'string') data.answers = JSON.parse(data.answers);
            setProject(data);
            setStatus(data.status);
            setDemoLink(data.demo_link || '');
            setFinalLink(data.final_link || '');
        } catch (err) { 
            if (IS_PROTOTYPE) setProject(MOCK_PROJECT);
            else toast.error('Failed to load workspace payload'); 
        } finally { setLoading(false); }
    };

    const handleSave = async () => {
        if (IS_PROTOTYPE) {
            toast.success('Project Workspace Updated (Mock)');
            return;
        }
        try {
            await axios.put(`${API_BASE_URL}/developer/projects/${id}/update`, {
                status, demo_link: demoLink, final_link: finalLink
            }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            toast.success('Changes Synchronized');
        } catch (err) { toast.error('Failed to update project'); }
    };

    const handleAddUpdate = () => {
        if (!newUpdate.trim()) return;
        const up = { id: Date.now(), text: newUpdate, time: "Just now", type: 'dev' };
        setProject((prev: any) => ({ ...prev, updates: [up, ...(prev.updates || [])] }));
        setNewUpdate('');
        toast.success('Update Logged');
    };

    const handleCopy = (text: string, section: string) => {
        navigator.clipboard.writeText(text);
        setCopyStatus(section);
        toast.success(`Copied ${section} details!`);
        setTimeout(() => setCopyStatus(null), 2000);
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Hydrating Workspace...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-600 pb-20">
            <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-[100] px-4 md:px-10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 md:gap-6">
                    <button 
                        onClick={() => navigate(isAdmin ? '/admin' : '/developer')}
                        className="p-2 md:p-3 hover:bg-slate-100 rounded-xl transition-all group"
                    >
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-slate-900" />
                    </button>
                    <div className="h-10 w-px bg-slate-200 hidden md:block" />
                    <div>
                        <h1 className="text-sm md:text-xl font-bold text-slate-900 tracking-tight leading-tight">{project?.businessName}</h1>
                        <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3" /> Ingested {new Date(project?.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                        status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                        <Shield className="w-3 h-3" /> {status.replace('_', ' ')}
                    </div>
                    {!isAdmin && (
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-slate-900 text-white rounded-xl text-[10px] md:text-xs font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                        >
                            <Save className="w-4 h-4" /> <span className="hidden sm:inline">Synchronize</span>
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-6 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                    <div className="lg:col-span-8 space-y-6 md:space-y-10">
                        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 flex shadow-sm w-fit">
                            <TabTrigger label="Detailed Brief" id="brief" active={activeSection === 'brief'} onClick={setActiveSection} icon={<ClipboardList className="w-4 h-4" />} />
                            <TabTrigger label="Execution & Links" id="execution" active={activeSection === 'execution'} onClick={setActiveSection} icon={<Hammer className="w-4 h-4" />} />
                            <TabTrigger label="Timeline" id="timeline" active={activeSection === 'timeline'} onClick={setActiveSection} icon={<Clock className="w-4 h-4" />} />
                        </div>

                        <AnimatePresence mode="wait">
                            {activeSection === 'brief' && (
                                <motion.div key="brief" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                                    {Object.entries(PROJECT_BRIEF_SCHEMA).map(([section, fields]) => (
                                        <section key={section} className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group hover:border-indigo-100 transition-all shadow-sm">
                                            <div className="bg-slate-50/50 px-6 md:px-10 py-4 md:py-6 border-b border-slate-100 flex justify-between items-center group-hover:bg-slate-50 transition-colors">
                                                <h3 className="text-[10px] md:text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">{section}</h3>
                                                <button 
                                                    onClick={() => {
                                                        const detailText = `--- ${section.toUpperCase()} ---\n` + 
                                                            fields.map(f => `${f.label.toUpperCase()}: ${project.answers?.[f.key] || 'Not Provided'}`).join('\n');
                                                        handleCopy(detailText, section);
                                                    }}
                                                    className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-white border border-slate-200 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
                                                >
                                                    {copyStatus === section ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                    {copyStatus === section ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-8">
                                                {fields.map(field => (
                                                    <AnalyticField key={field.key} label={field.label} value={project.answers?.[field.key]} />
                                                ))}
                                            </div>
                                        </section>
                                    ))}
                                </motion.div>
                            )}

                            {activeSection === 'execution' && (
                                <motion.div key="execution" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                                    <section className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm">
                                        <h3 className="text-sm md:text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                            <Globe className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" /> Accessible Artifacts
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                            <LinkInput label="Demo URL" value={demoLink} onChange={setDemoLink} readOnly={isAdmin} icon={<LinkIcon className="w-4 h-4 md:w-5 h-5" />} />
                                            <LinkInput label="Final Production URL" value={finalLink} onChange={setFinalLink} readOnly={isAdmin} icon={<CheckCircle2 className="w-4 h-4 md:w-5 h-5" />} />
                                        </div>
                                    </section>

                                    {!isAdmin && (
                                        <section className="bg-slate-900 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] text-white shadow-xl shadow-slate-900/20">
                                            <h3 className="text-sm md:text-xl font-bold mb-6">Execution Status Control</h3>
                                            <div className="flex flex-wrap gap-4">
                                                {['assigned', 'in_progress', 'submitted', 'completed'].map(s => (
                                                    <button key={s} onClick={() => setStatus(s)} className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${status === s ? 'bg-white text-slate-900 shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                                                        {s.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                </motion.div>
                            )}

                            {activeSection === 'timeline' && (
                                <motion.div key="timeline" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                                    <section className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm">
                                        <h3 className="text-sm md:text-xl font-bold text-slate-900 mb-8">Activity Feed</h3>
                                        {!isAdmin && (
                                            <div className="mb-10 flex gap-4">
                                                <input type="text" value={newUpdate} onChange={e => setNewUpdate(e.target.value)} placeholder="Log a progress update..." className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" />
                                                <button onClick={handleAddUpdate} className="px-6 py-3 md:py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                                                    <Plus className="w-5 h-5 md:w-6 md:h-6" />
                                                </button>
                                            </div>
                                        )}
                                        <div className="space-y-6">
                                            {(project?.updates || []).map((up: any) => (
                                                <div key={up.id} className="flex gap-4 md:gap-6 group">
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mt-1.5 ${up.type === 'system' ? 'bg-slate-300' : up.type === 'assignment' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                                        <div className="w-0.5 flex-1 bg-slate-100 mt-2" />
                                                    </div>
                                                    <div className="pb-8">
                                                        <p className="text-xs md:text-[15px] font-semibold text-slate-800 leading-relaxed mb-1">{up.text}</p>
                                                        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 font-mono uppercase tracking-tight">{up.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="lg:col-span-4 space-y-6 md:space-y-8">
                        <section className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-200 shadow-sm text-center md:text-left">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Client Identity</h4>
                            <div className="flex flex-col items-center md:items-start gap-4">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-inner">
                                    <User className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                                <div>
                                    <p className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">{project.answers?.contactName}</p>
                                    <p className="text-xs md:text-sm font-medium text-slate-500 font-mono">{project.email}</p>
                                </div>
                                <div className="w-full h-px bg-slate-50 my-2" />
                                <div className="space-y-3 w-full">
                                    <QuickDetail label="Location" value={project.answers?.city} />
                                    <QuickDetail label="Venture Type" value={project.answers?.projectType} />
                                </div>
                            </div>
                        </section>

                        {!isAdmin && (
                            <div className="p-1 group">
                                <button onClick={() => navigate('/developer')} className="w-full py-4 md:py-5 border-2 border-dashed border-red-200 text-red-400 rounded-3xl font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center gap-3">
                                    <RotateCcw className="w-4 h-4" /> Release Task
                                </button>
                                <p className="text-[9px] text-center text-slate-400 mt-4 px-6 md:px-10 leading-relaxed font-medium">Releasing a task will return it to the global pool.</p>
                            </div>
                        )}

                        {isAdmin && (
                            <section className="bg-slate-900 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-slate-800 shadow-xl text-white">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Assignment Control</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Assigned DevID</p>
                                        <p className="font-bold text-sm md:text-base">NODE-{project.assigned_developer_id || 'NONE'}</p>
                                    </div>
                                    <button className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg active:scale-95">Reassign Pipeline</button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

const TabTrigger = ({ label, id, active, onClick, icon }: any) => (
    <button onClick={() => onClick(id)} className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3.5 rounded-xl text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
        {icon} {label}
    </button>
);

const AnalyticField = ({ label, value }: any) => (
    <div className="space-y-1.5 md:space-y-2">
       <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
       <p className="text-sm md:text-[15px] font-bold text-slate-900 tracking-tight leading-snug">{
         Array.isArray(value) ? (value.length > 0 ? value.join(', ') : 'Not Provided') : 
         (value === true ? 'Yes' : value === false ? 'No' : String(value || 'Not Provided'))
       }</p>
    </div>
);

const QuickDetail = ({ label, value }: any) => (
    <div className="flex justify-between items-center text-[10px] md:text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-widest">{label}</span>
        <span className="text-slate-900 font-bold tracking-tight">{value || 'N/A'}</span>
    </div>
);

const LinkInput = ({ label, value, onChange, readOnly, icon }: any) => (
    <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">{icon} {label}</p>
        <div className="group relative">
            <input type="text" value={value} onChange={e => onChange(e.target.value)} readOnly={readOnly} placeholder={readOnly ? 'No link provided' : 'https://...'} className={`w-full px-4 md:px-5 py-3 md:py-4 border rounded-xl text-xs md:text-sm font-semibold outline-none transition-all ${readOnly ? 'bg-slate-50 border-slate-100 text-slate-500 cursor-default' : 'bg-white border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900'}`} />
            {value && (
                <a href={value} target="_blank" rel="noopener noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-50 text-indigo-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            )}
        </div>
    </div>
);

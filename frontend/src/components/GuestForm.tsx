import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Mail,
  Download,
  Send,
  Info,
  X,
  Edit2,
  Globe,
  Users,
  Layout,
  MessageSquare,
  Share2,
  Share2,
  Settings,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MasterConfig, Project, TeamMember, Testimonial } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface GuestFormProps {
  masterConfig: MasterConfig;
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  onSubmit?: () => void;
}

const STEPS = [
  'Personal Details',
  'Specialization',
  'Goals & CTA',
  'Branding',
  'Domain & Hosting',
  'Team',
  'Navigation',
  'Testimonials',
  'Social Media',
  'Preview & Edit',
  'Confirmation'
];

export const GuestForm: React.FC<GuestFormProps> = ({ masterConfig, project, setProject, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHelper, setShowHelper] = useState<string | null>(null);

  // --- Helpers ---
  const updateProject = (updates: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const completeness = useMemo(() => {
    const weights = {
      personal: 10,
      businessName: 10,
      specialisation: 15,
      goals: 10,
      cta: 10,
      branding: 10,
      domain: 5,
      team: 10,
      navigation: 5,
      testimonials: 5,
      social: 10
    };

    let score = 0;
    if (project.contactPersonName && project.contactPersonPhone) score += weights.personal;
    if (project.businessName && project.email) score += weights.businessName;
    if (project.specialisationId) score += weights.specialisation;
    if (project.websiteGoals.length > 0) score += weights.goals;
    if (project.ctaSelections.length > 0) score += weights.cta;
    if (project.hasLogo || project.logoPreferences.brandPersonality.length > 0) score += weights.branding;
    if (project.hasDomain) score += weights.domain;
    if (project.showTeam ? project.team.length > 0 : true) score += weights.team;
    if (project.selectedNavigation.length > 0) score += weights.navigation;
    if (project.testimonialOption !== 'not-required' ? project.testimonials.length > 0 || project.testimonialOption === 'generate' : true) score += weights.testimonials;
    if (project.showSocial ? Object.values(project.socialLinks).some(link => !!link) : true) score += weights.social;

    return Math.min(100, score);
  }, [project]);

  const downloadPDF = () => {
    if (!project) return;
    const doc = new jsPDF();
    const primaryColor = [79, 70, 229]; // Indigo-600

    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Project Intake Brief', 20, 25);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 160, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text(project.businessName || 'Untitled Project', 20, 55);

    const specialisation = masterConfig.mainCategories
      .find(c => c.id === project.mainCategoryId)?.subCategories
      .find(s => s.id === project.subCategoryId)?.specialisations
      .find(sp => sp.id === project.specialisationId)?.name || 'N/A';

    // @ts-ignore
    doc.autoTable({
      startY: 70,
      head: [['Field', 'Details']],
      body: [
        ['Contact Person', project.contactPersonName || 'N/A'],
        ['Contact Phone', project.contactPersonPhone || 'N/A'],
        ['Business Name', project.businessName || 'N/A'],
        ['Business Email', project.email || 'N/A'],
        ['Specialization', specialisation],
        ['Website Goals', project.websiteGoals.join(', ') || 'N/A'],
        ['CTA Choices', project.ctaSelections.join(', ') || 'N/A'],
        ['Domain Status', project.hasDomain || 'N/A'],
        ['Logo Status', project.hasLogo ? 'Supplying' : 'Designing'],
        ['Navigation', project.selectedNavigation.join(', ') || 'N/A'],
      ],
      headStyles: { fillColor: primaryColor }
    });

    doc.save(`${project.businessName || 'Project'}_Brief.pdf`);
  };

  // --- Render Steps ---
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Step 1: Personal & Business Details
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact Person Name *</label>
                <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-blue-600 outline-none transition-all text-xs"
                  value={project.contactPersonName}
                  onChange={(e) => updateProject({ contactPersonName: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Contact Phone *</label>
                <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-blue-600 outline-none transition-all text-xs"
                  value={project.contactPersonPhone}
                  onChange={(e) => updateProject({ contactPersonPhone: e.target.value })}
                  placeholder="Primary phone number"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Business Name *</label>
                <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-blue-600 outline-none transition-all text-xs"
                  value={project.businessName}
                  onChange={(e) => updateProject({ businessName: e.target.value })}
                  placeholder="Brand name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Business Email *</label>
                <input
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-blue-600 outline-none transition-all text-xs"
                  value={project.email}
                  onChange={(e) => updateProject({ email: e.target.value })}
                  placeholder="e.g. info@business.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Physical Address</label>
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-1 focus:ring-blue-600 outline-none transition-all text-xs"
                value={project.address}
                onChange={(e) => updateProject({ address: e.target.value })}
                rows={2}
                placeholder="Complete address for local SEO..."
              />
            </div>
          </div>
        );

      case 1: // Step 2: Specialization
        const currentCat = masterConfig.mainCategories.find(c => c.id === project.mainCategoryId);
        const currentSub = currentCat?.subCategories.find(s => s.id === project.subCategoryId);
        const currentSpec = currentSub?.specialisations.find(sp => sp.id === project.specialisationId);

        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sector</label>
                <select
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 text-xs"
                  value={project.mainCategoryId}
                  onChange={(e) => updateProject({ mainCategoryId: e.target.value, subCategoryId: '', specialisationId: '' })}
                >
                  <option value="">Select Category</option>
                  {masterConfig.mainCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Business Type</label>
                <select
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 text-xs"
                  value={project.subCategoryId}
                  onChange={(e) => updateProject({ subCategoryId: e.target.value, specialisationId: '' })}
                  disabled={!project.mainCategoryId}
                >
                  <option value="">Select Subcategory</option>
                  {currentCat?.subCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Exact Niche</label>
                <select
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 text-xs shadow-sm"
                  value={project.specialisationId}
                  onChange={(e) => updateProject({ specialisationId: e.target.value })}
                  disabled={!project.subCategoryId}
                >
                  <option value="">Select Specialization</option>
                  {currentSub?.specialisations.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
                </select>
              </div>
            </div>
            {currentSpec && (
              <div className="p-6 bg-blue-50 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-blue-900">Recommended Services</h4>
                <div className="flex flex-wrap gap-2">
                  {currentSpec.services.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        const exists = project.services.includes(s);
                        updateProject({ services: exists ? project.services.filter(i => i !== s) : [...project.services, s] });
                      }}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${project.services.includes(s) ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-200'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Step 3: Goals & CTA & Style
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-6">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Website Goals (Max 3)</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {masterConfig.websiteGoals.map(goal => (
                  <button
                    key={goal}
                    onClick={() => {
                      const exists = project.websiteGoals.includes(goal);
                      if (exists) updateProject({ websiteGoals: project.websiteGoals.filter(g => g !== goal) });
                      else if (project.websiteGoals.length < 3) updateProject({ websiteGoals: [...project.websiteGoals, goal] });
                    }}
                    className={`p-5 rounded-2xl border-2 text-sm font-black transition-all ${project.websiteGoals.includes(goal) ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-300'}`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Primary Call to Action (Max 2)</label>
              <div className="flex flex-wrap gap-3">
                {masterConfig.ctaOptions.map(cta => (
                  <button
                    key={cta}
                    onClick={() => {
                      const exists = project.ctaSelections.includes(cta);
                      if (exists) updateProject({ ctaSelections: project.ctaSelections.filter(c => c !== cta) });
                      else if (project.ctaSelections.length < 2) updateProject({ ctaSelections: [...project.ctaSelections, cta] });
                    }}
                    className={`px-8 py-4 rounded-2xl border-2 text-sm font-black transition-all ${project.ctaSelections.includes(cta) ? 'bg-gray-900 border-gray-900 text-white shadow-xl' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-400'}`}
                  >
                    {cta}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Step 4: Branding
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Logo Direction</h3>
                <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                  {['have', 'need', 'improve'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => updateProject({ hasLogo: opt === 'have' })}
                      className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${(project.hasLogo && opt === 'have') || (!project.hasLogo && opt === 'need') ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {project.hasLogo ? (
                <input
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-blue-600 outline-none text-xs"
                  placeholder="Paste Google Drive/Dropbox/Cloud link..."
                  value={project.logoDriveLink}
                  onChange={(e) => updateProject({ logoDriveLink: e.target.value })}
                />
              ) : (
                <p className="text-xs text-slate-500 italic">No worries! We'll design a high-quality logo as part of your build.</p>
              )}
            </div>
            <div className="space-y-4">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Brand Vibe (Select Choices)</label>
              <div className="flex flex-wrap gap-2">
                {masterConfig.brandPersonalities.map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      const exists = project.logoPreferences.brandPersonality.includes(p);
                      if (exists) updateProject({ logoPreferences: { ...project.logoPreferences, brandPersonality: project.logoPreferences.brandPersonality.filter(i => i !== p) } });
                      else if (project.logoPreferences.brandPersonality.length < 3) updateProject({ logoPreferences: { ...project.logoPreferences, brandPersonality: [...project.logoPreferences.brandPersonality, p] } });
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${project.logoPreferences.brandPersonality.includes(p) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-500'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Business Tagline</label>
              <input
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-1 focus:ring-blue-600 transition-all text-xs font-medium"
                placeholder="e.g. For a healthier tomorrow"
                value={project.tagline || ''}
                onChange={(e) => updateProject({ tagline: e.target.value })}
              />
            </div>
          </div>
        );

      case 4: // Step 5: Domain & Hosting
        return (
          <div className="space-y-12 animate-in fade-in zoom-in-95 py-10">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Globe size={40} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Domain & Hosting</h3>
              <p className="text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">Do you already have a domain name or a hosting plan for your website?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'yes', label: 'Yes, Secured', icon: '✓' },
                { id: 'no', label: 'No, Need it', icon: '✕' },
                { id: 'not-sure', label: 'Not Sure', icon: '?' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateProject({ hasDomain: opt.id as any })}
                  className={`p-8 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all ${project.hasDomain === opt.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl scale-105' : 'bg-white border-gray-100 hover:border-indigo-200'}`}
                >
                  <span className="text-4xl">{opt.icon}</span>
                  <span className="font-black tracking-widest uppercase text-xs">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5: // Step 6: Team
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 text-center space-y-6">
              <Users size={48} className="mx-auto text-indigo-600" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-indigo-900">Brand Team</h3>
                <p className="text-indigo-700 italic">Include individual members or describe your team style.</p>
              </div>
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={() => updateProject({ showTeam: true })}
                  className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${project.showTeam ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-indigo-600 border border-indigo-100'}`}
                >
                  Yes, List Them
                </button>
                <button
                  onClick={() => updateProject({ showTeam: false })}
                  className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${!project.showTeam ? 'bg-indigo-600 text-white shadow-xl' : 'bg-white text-indigo-600 border border-indigo-100'}`}
                >
                  No, Skip This
                </button>
              </div>
            </div>
            {project.showTeam && (
              <div className="space-y-4">
                {project.team.map((member, i) => (
                  <div key={i} className="flex gap-4 items-center bg-white p-6 border border-gray-200 rounded-3xl shadow-sm">
                    <input
                      className="flex-1 p-3 bg-gray-50 rounded-xl outline-none"
                      placeholder="Team member name and role"
                      value={member.name}
                      onChange={(e) => {
                        const newTeam = [...project.team];
                        newTeam[i].name = e.target.value;
                        updateProject({ team: newTeam });
                      }}
                    />
                    <button onClick={() => updateProject({ team: project.team.filter((_, idx) => idx !== i) })} className="p-3 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
                  </div>
                ))}
                <button
                  onClick={() => updateProject({ team: [...project.team, { name: '', role: '', bio: '', linkedIn: '' }] })}
                  className="w-full py-5 border-2 border-dashed border-indigo-200 text-indigo-600 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-indigo-50 transition-all"
                >
                  + Add Member Details
                </button>
              </div>
            )}
          </div>
        );

      case 6: // Step 7: Navigation
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="space-y-4">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Website Menu / Navigation</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {masterConfig.navigationOptions.map(nav => (
                  <button
                    key={nav}
                    onClick={() => {
                      const exists = project.selectedNavigation.includes(nav);
                      updateProject({ selectedNavigation: exists ? project.selectedNavigation.filter(n => n !== nav) : [...project.selectedNavigation, nav] });
                    }}
                    className={`p-4 rounded-xl border-2 text-xs font-bold transition-all ${project.selectedNavigation.includes(nav) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-300'}`}
                  >
                    {nav}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 7: // Step 8: Testimonials
        return (
          <div className="space-y-8 animate-in fade-in zoom-in-95 py-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Client Testimonials</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium leading-normal">Select how you want to handle reviews on your site.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {masterConfig.testimonialOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateProject({ testimonialOption: opt.id as any })}
                  className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${project.testimonialOption === opt.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 hover:border-blue-300'}`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span className="font-bold text-[10px] uppercase tracking-wider">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 8: // Step 9: Social Media
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-4">
              <Share2 size={32} className="mx-auto text-slate-400" />
              <h3 className="text-lg font-bold text-slate-900">Connect Social Media?</h3>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => updateProject({ showSocial: true })}
                  className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${project.showSocial ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-200'}`}
                >
                  Yes, Add Links
                </button>
                <button
                  onClick={() => updateProject({ showSocial: false })}
                  className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${!project.showSocial ? 'bg-blue-600 text-white shadow-lg' : 'bg-white border border-slate-200'}`}
                >
                  Skip
                </button>
              </div>
            </div>
            {project.showSocial && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {masterConfig.socialPlatforms.map(plat => (
                  <div key={plat} className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm flex items-center gap-3">
                    <span className="font-bold text-[9px] uppercase tracking-wider text-slate-400 w-20">{plat}</span>
                    <input
                      className="flex-1 p-2 bg-slate-50 rounded-lg outline-none text-xs"
                      placeholder={`https://${plat.toLowerCase()}.com/...`}
                      value={(project.socialLinks as any)[plat.toLowerCase()] || ''}
                      onChange={(e) => updateProject({ socialLinks: { ...project.socialLinks, [plat.toLowerCase()]: e.target.value } })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 9: // Step 10: Preview & Edit
        const renderReviewValue = (val: any) => val || <span className="text-gray-400 italic">No entry provided</span>;
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white border-2 border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl p-10 space-y-12">
              <div className="flex justify-between items-center pb-8 border-b border-gray-50">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Final Review</h3>
                  <p className="text-sm text-gray-500 font-medium">Verify all details before final build submission</p>
                </div>
                <button onClick={downloadPDF} className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all">
                  <Download size={20} /> PDF
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
                <div className="space-y-6">
                  <h4 className="flex items-center gap-3 text-xs font-black text-indigo-600 uppercase tracking-[0.2em]"><ShieldCheck size={18} /> Contact Matrix</h4>
                  <div className="space-y-3 font-bold text-gray-800">
                    <p className="text-sm flex justify-between"><span>Owner</span> <span className="text-indigo-900">{renderReviewValue(project.contactPersonName)}</span></p>
                    <p className="text-sm flex justify-between"><span>Direct Phone</span> <span className="text-indigo-900">{renderReviewValue(project.contactPersonPhone)}</span></p>
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="flex items-center gap-3 text-xs font-black text-emerald-600 uppercase tracking-[0.2em]"><Globe size={18} /> Business Core</h4>
                  <div className="space-y-3 font-bold text-gray-800">
                    <p className="text-sm flex justify-between"><span>Brand Name</span> <span className="text-emerald-900">{renderReviewValue(project.businessName)}</span></p>
                    <p className="text-sm flex justify-between"><span>Domain Status</span> <span className="uppercase text-[10px] bg-emerald-100 px-2 py-1 rounded text-emerald-700">{project.hasDomain}</span></p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-gray-50 text-center">
                <p className="text-gray-400 text-xs font-medium italic">“Accuracy at this stage ensures a faster deployment. Switch back to any step if corrections are needed.”</p>
              </div>
            </div>
          </div>
        );

      case 10: // Step 11: Confirmation
        return (
          <div className="text-center py-20 animate-in zoom-in-95 duration-700">
            <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-50">
              <ShieldCheck size={64} />
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">Perfect Submission!</h2>
            <p className="text-gray-600 max-w-lg mx-auto mb-12 text-lg leading-relaxed font-medium">
              We've locked in your requirements. A detailed confirmation brief has been dispatched to your email address: <span className="text-indigo-600 font-bold underline">{project.email}</span>
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => window.location.reload()} className="px-12 py-5 bg-gray-950 text-white rounded-[2rem] font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-black transition-all">Go to Home</button>
              <button onClick={downloadPDF} className="px-12 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-[2rem] font-black uppercase text-sm tracking-widest hover:bg-gray-50 transition-all flex items-center gap-2">Brief PDF <Download size={18} /></button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* Progress Header */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 w-full space-y-3">
            <div className="flex justify-between items-end">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">{STEPS[currentStep]}</h3>
              <span className="text-3xl font-bold text-blue-600/20">{completeness}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${completeness}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
            {STEPS.map((step, idx) => (
              <div
                key={step}
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all border-2 ${idx === currentStep ? 'bg-blue-600 text-white border-blue-100 scale-110 shadow-md z-10' :
                  idx < currentStep ? 'bg-emerald-500 text-white border-emerald-50' :
                    'bg-slate-100 text-slate-400 border-slate-50'
                  }`}
              >
                {idx < currentStep ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Content Surface */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 min-h-[500px] flex flex-col overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Settings size={80} />
          </div>

          <div className="flex-1 p-8 md:p-12 relative z-10">
            {renderStepContent()}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center rounded-b-3xl">
            <button
              onClick={prevStep}
              disabled={currentStep === 0 || currentStep === STEPS.length - 1}
              className="flex items-center gap-2 px-6 py-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:bg-slate-200 rounded-xl transition-all disabled:opacity-0"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {currentStep < STEPS.length - 1 && (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold uppercase text-[11px] tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg ring-4 ring-blue-50"
              >
                Continue <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

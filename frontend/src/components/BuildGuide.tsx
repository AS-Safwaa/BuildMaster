import React, { useState } from 'react';
import { Project } from '../types';
import { Copy, Check, Terminal, ExternalLink, FileText, Image as ImageIcon, Box } from 'lucide-react';
import { motion } from 'framer-motion';

interface BuildGuideProps {
  project: Project;
}

export const BuildGuide: React.FC<BuildGuideProps> = ({ project }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const templates = [
    {
      id: 'content',
      title: 'Content Generation Prompt',
      icon: <FileText size={18} />,
      template: `Generate website content for a {{specialisation}} business named "{{businessName}}". 
They are located in {{address}} and have been established since {{yearsOfEstablishment}}.
Key Services: {{services}}
Unique Selling Points: {{usp}}
Website Goals: {{goals}}
Tone: Professional, trustworthy, and approachable.`,
    },
    {
      id: 'logo',
      title: 'Logo Creation Prompt',
      icon: <ImageIcon size={18} />,
      template: `Create a professional logo for "{{businessName}}", a {{specialisation}} business. 
The brand values are {{usp}}. 
Style preference: {{style}}. 
The logo should be clean, modern, and suitable for a website header.`,
    },
    {
      id: 'build',
      title: 'Website Build Instructions',
      icon: <Box size={18} />,
      template: `Build a responsive website for "{{businessName}}" using the following requirements:
- Layout: {{style}}
- Primary CTA: {{cta}}
- Navigation: Home, About, Services, Team, Testimonials, Contact
- Features: Appointment booking integration, responsive service grid, team showcase.`,
    }
  ];

  const fillTemplate = (template: string) => {
    return template
      .replace('{{businessName}}', project.businessName)
      .replace('{{specialisation}}', project.specialisationId)
      .replace('{{address}}', project.address)
      .replace('{{yearsOfEstablishment}}', project.yearsOfEstablishment)
      .replace('{{services}}', project.services.join(', '))
      .replace('{{usp}}', project.usp.join(', '))
      .replace('{{goals}}', project.websiteGoals.join(', '))
      .replace('{{style}}', project.selectedStyleId || 'Modern')
      .replace('{{cta}}', project.ctaSelections.join(', '));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Build Guide & Prompt Templates</h3>
        <p className="text-gray-500 font-medium">Use these pre-filled templates to speed up your development process.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {templates.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm flex flex-col"
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                  {t.icon}
                </div>
                {t.title}
              </div>
              <button
                onClick={() => copyToClipboard(fillTemplate(t.template), t.id)}
                className={`p-2 rounded-lg transition-all ${copied === t.id ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-gray-200 text-gray-400'}`}
              >
                {copied === t.id ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
            <div className="p-5 flex-1 bg-gray-900 text-indigo-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
              {fillTemplate(t.template)}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
            <Terminal size={24} />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Netlify Quick-Host Steps</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <h5 className="font-bold text-gray-900">Build Locally</h5>
            <p className="text-sm text-gray-500">Run <code className="bg-gray-100 px-1 rounded">npm run build</code> to generate the production-ready <code className="bg-gray-100 px-1 rounded">dist/</code> folder.</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <h5 className="font-bold text-gray-900">Drag & Drop</h5>
            <p className="text-sm text-gray-500">Log in to Netlify and drag the <code className="bg-gray-100 px-1 rounded">dist/</code> folder directly into the "Sites" drop zone.</p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
            <h5 className="font-bold text-gray-900">Verify & Link</h5>
            <p className="text-sm text-gray-500">Once deployed, copy the generated URL and paste it into the "Live URL" field in this dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

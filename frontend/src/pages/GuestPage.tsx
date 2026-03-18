// ─────────────────────────────────────────────────────────
// Guest Page — Public intake form (No login required)
// ─────────────────────────────────────────────────────────

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { GuestForm } from '../components/GuestForm';
import { MasterConfig, Project, OnboardingData } from '../types';
import { INITIAL_MASTER_CONFIG, EMPTY_PROJECT } from '../constants';
import toast from 'react-hot-toast';

export function GuestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [masterConfig] = useState<MasterConfig>(INITIAL_MASTER_CONFIG);
  const [project, setProject] = useState<Project>(EMPTY_PROJECT);

  useEffect(() => {
    const onboarding = location.state?.onboarding as OnboardingData;
    if (onboarding) {
      setProject(prev => ({
        ...prev,
        onboarding: onboarding
      }));
    }
  }, [location.state]);

  const handleSubmit = () => {
    toast.success('Thank you! Your project request has been submitted.', {
      duration: 5000,
      icon: '🚀',
    });
    // Redirect to landing after success
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Simple Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-bold text-sm"
            >
              <ArrowLeft size={18} /> Back to Home
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="font-black text-lg tracking-tight">BUILD<span className="text-indigo-600">MASTER</span></span>
            </div>

            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              Guest Mode
            </div>
          </div>
        </header>

        <main className="py-8">
          <div className="max-w-7xl mx-auto px-6 mb-8">
            <h1 className="text-3xl font-black text-gray-900">Project Intake Form</h1>
            <p className="text-gray-500 mt-1">Tell us about your business and we'll start building your presence.</p>
          </div>

          <GuestForm
            masterConfig={masterConfig}
            project={project}
            setProject={setProject}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </PageTransition>
  );
}

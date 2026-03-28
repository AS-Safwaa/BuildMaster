import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '../context/WizardContext';
import { ArrowRight, ArrowLeft, Sparkles, Loader2, Edit3 } from 'lucide-react';

export const Phase3 = () => {
  const { data, updateData, setPhase } = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI API call
    setTimeout(() => {
      setAiSuggestions([
        "Innovating the future, locally.",
        "Your trusted partner in quality.",
        "Precision in every detail.",
        "Empowering businesses to scale."
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl space-y-8"
    >
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Brand Voice & Tagline</h2>
        <p className="text-slate-500">How should your business sound to the world?</p>
      </div>

      <div className="space-y-6">
        <label className="text-sm font-semibold text-slate-700 block mb-4">Select or Create a Tagline</label>
        
        {/* Custom Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Edit3 className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="I already have a tagline: e.g. Healthy Hearts, Happy Lives"
            value={data.taglineCustom} 
            onChange={(e) => updateData({ taglineCustom: e.target.value })}
            className="w-full p-4 pl-12 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" 
          />
        </div>

        <div className="relative flex items-center py-5">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* AI Generator */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">AI Tagline Assistant</h3>
              <p className="text-slate-600 text-sm mb-4">Stuck? Let our AI generate taglines based on your selected Category and Single Selling Points.</p>
              
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-70 shadow-md shadow-indigo-600/20"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? 'Generating...' : 'Generate Ideas'}
              </button>
            </div>
          </div>

          {aiSuggestions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 space-y-3"
            >
              {aiSuggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => updateData({ taglineCustom: sug })}
                  className="w-full text-left p-4 bg-white rounded-xl border border-indigo-100 hover:border-indigo-400 hover:shadow-md transition-all text-slate-700 font-medium"
                >
                  "{sug}"
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="space-y-4 pt-6">
          <label className="text-sm font-semibold text-slate-700 block">Preferred Tone</label>
          <div className="flex flex-wrap gap-3">
            {['Professional', 'Friendly', 'Minimal', 'Bold', 'Playful'].map(tone => (
              <button
                key={tone}
                onClick={() => updateData({ taglineStyle: tone })}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  data.taglineStyle === tone 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="flex justify-between pt-10 border-t border-slate-100">
        <button 
          onClick={() => setPhase(2)}
          className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button 
          onClick={() => setPhase(4)}
          className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Aesthetics & Style <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </motion.div>
  );
};


import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { OutputArea } from './components/OutputArea';
import { TABS } from './constants';
import { TabType, PromptInput, AIResult } from './types';
import { generateContent } from './services/geminiService';
import { 
  Sparkles, Youtube, Image, Video, BookOpen, Cpu, Presentation, PenTool, 
  Send, Upload, HelpCircle, AlertCircle, Wand2
} from 'lucide-react';

const iconMap: any = {
  Sparkles, Youtube, Image, Video, BookOpen, Cpu, Presentation, PenTool
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.UNIVERSAL);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formInput, setFormInput] = useState<PromptInput>({
    goal: '', context: '', audience: '', format: '', constraints: '',
    depth: 'beginner', platform: 'studio', image: '', imagePrompt: ''
  });

  const handleInputChange = (field: keyof PromptInput, value: string) => {
    setFormInput(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await generateContent(activeTab, formInput);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const renderInputs = () => {
    switch (activeTab) {
      case TabType.IMAGE_EDIT:
        return (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Source Image to Analyze</label>
              <div className="relative group cursor-pointer border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center py-6">
                  {formInput.image ? (
                    <img src={formInput.image} alt="Preview" className="h-32 rounded-lg shadow-md mb-2" />
                  ) : (
                    <Upload className="w-10 h-10 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                  )}
                  <p className="text-sm text-slate-500 font-medium">
                    {formInput.image ? 'Click to replace image' : 'Click or drag image to upload'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Desired Edit Logic</label>
              <textarea
                placeholder="Describe the transformation you want a prompt for..."
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-24"
                value={formInput.imagePrompt}
                onChange={(e) => handleInputChange('imagePrompt', e.target.value)}
              />
            </div>
          </div>
        );

      case TabType.EDUCATION:
        return (
          <div className="space-y-4">
             <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Topic or Subject</label>
              <input
                type="text"
                placeholder="What should the engineered prompt teach?"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formInput.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Target Level</label>
                <select
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formInput.depth}
                  onChange={(e) => handleInputChange('depth', e.target.value as any)}
                >
                  <option value="beginner">Beginner</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Desired Output Style</label>
                <input
                  type="text"
                  placeholder="Notes, Q&A, Syllabus..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formInput.format}
                  onChange={(e) => handleInputChange('format', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case TabType.PLATFORM:
        return (
          <div className="space-y-4">
             <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Prompt Objective</label>
              <textarea
                placeholder="What is the final AI supposed to do?"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                value={formInput.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">Optimization Architecture</label>
              <select
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formInput.platform}
                onChange={(e) => handleInputChange('platform', e.target.value as any)}
              >
                <option value="studio">Google AI Studio (System Instruct Focus)</option>
                <option value="long_context">Long Context Models (Token Efficiency)</option>
                <option value="code">Code Models (Structural & Typed Logic)</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Final Objective</label>
                <input
                  type="text"
                  placeholder="The goal of the prompt you're building"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formInput.goal}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Project Context</label>
                <textarea
                  placeholder="Relevant background for the AI to understand..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
                  value={formInput.context}
                  onChange={(e) => handleInputChange('context', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">End-User Audience</label>
                <input
                  type="text"
                  placeholder="Who will read the final output?"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={formInput.audience}
                  onChange={(e) => handleInputChange('audience', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Output Structure</label>
                  <input
                    type="text"
                    placeholder="Markdown, Table, etc."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formInput.format}
                    onChange={(e) => handleInputChange('format', e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Hard Constraints</label>
                  <input
                    type="text"
                    placeholder="Keywords, length limits..."
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formInput.constraints}
                    onChange={(e) => handleInputChange('constraints', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          {/* Navigation Bar */}
          <div className="bg-slate-100/50 p-2 flex overflow-x-auto scrollbar-hide border-b border-slate-200 no-scrollbar">
            {TABS.map((tab) => {
              const Icon = iconMap[tab.icon];
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as TabType); setResult(null); setError(null); }}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all font-semibold text-sm
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                      : 'text-slate-600 hover:bg-slate-200/70'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Section */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {TABS.find(t => t.id === activeTab)?.label} Prompt Engineer
                </h2>
                <p className="text-slate-500 mt-1">Provide the parameters to engineer a high-fidelity prompt.</p>
              </div>
              <div className="hidden md:flex items-center gap-2 text-slate-400">
                <Wand2 className="w-5 h-5 text-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Meta-Prompting Active</span>
              </div>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              {renderInputs()}
            </div>

            {error && (
              <div className="mt-6 flex items-center gap-3 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`
                mt-8 w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-xl
                ${loading 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white hover:scale-[1.01] hover:shadow-blue-200/50 active:scale-95'}
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  Engineering Prompt...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Engineer My Prompt
                </>
              )}
            </button>

            <OutputArea result={result} loading={loading} />
          </div>
        </div>

        {/* Info Section */}
        <section className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Architectural Logic</h4>
            <p className="text-sm text-slate-600">We don't just generate answers; we build the technical scaffolding that makes other AI models perform at their peak.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Role-Based Framing</h4>
            <p className="text-sm text-slate-600">Our outputs automatically include expert personas, context anchors, and quality checks required for professional workflows.</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-cyan-600" />
            </div>
            <h4 className="font-bold text-slate-800 mb-2">Multi-Agent Ready</h4>
            <p className="text-sm text-slate-600">All prompts are engineered to be compatible with advanced reasoning models like Gemini 2.0 Pro and GPT-4o.</p>
          </div>
        </section>

        {/* Documentation / Instructions Footer Area */}
        <div className="mt-20 border-t border-slate-200 pt-10">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Prompt Engineering Guide</h3>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100">
                <h5 className="font-bold text-slate-700 mb-2">Why Engineer Prompts?</h5>
                <p className="text-sm text-slate-600">The quality of an AI's output is directly proportional to the quality of its instructions. PromptEngineer builds the bridge between your raw idea and a professional result.</p>
              </div>
              <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100">
                <h5 className="font-bold text-slate-700 mb-2">How to Use the Output</h5>
                <p className="text-sm text-slate-600">Once generated, click "Copy Prompt". Open your preferred AI tool (like ChatGPT, Claude, or a Google AI Studio session) and paste the entire block. You'll see an immediate jump in response quality.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100">
                <h5 className="font-bold text-slate-700 mb-2">The Universal Framework</h5>
                <p className="text-sm text-slate-600">Our primary generator uses the RTF (Role-Task-Format) framework combined with Chain-of-Thought reasoning to ensure the destination AI "thinks" before it acts.</p>
              </div>
              <div className="p-5 bg-white rounded-xl shadow-sm border border-slate-100">
                <h5 className="font-bold text-slate-700 mb-2">Optimization Rules</h5>
                <p className="text-sm text-slate-600">To maintain free-tier stability, we use high-density, low-token meta-instructions that compress complex logic into concise but powerful prompt templates.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 text-center text-slate-400 text-xs font-medium uppercase tracking-widest border-t border-slate-200 bg-white">
        &copy; 2024 PromptEngineer. Meta-AI Engine for Professionals.
      </footer>
    </div>
  );
};

export default App;

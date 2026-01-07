
import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Terminal } from 'lucide-react';
import { AIResult } from '../types';

interface OutputAreaProps {
  result: AIResult | null;
  loading: boolean;
}

export const OutputArea: React.FC<OutputAreaProps> = ({ result, loading }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 p-12 glass-panel rounded-2xl flex flex-col items-center justify-center animate-pulse border-2 border-dashed border-blue-200">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-blue-600 font-semibold text-lg">Engineering Your Prompt...</p>
        <p className="text-slate-500 text-sm mt-2">Our AI is structuring the perfect instructions for your next model.</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="mt-8 space-y-6">
      <div className="glass-panel rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Generated Prompt Template</h3>
              <p className="text-xs text-slate-500">Copy this into ChatGPT, Claude, or Gemini</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium border
              ${copied ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'}
            `}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>

        {result.imageUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-2xl mx-auto">
             <img src={result.imageUrl} alt="AI Preview" className="w-full h-auto object-cover" />
             <div className="p-3 bg-slate-50 flex items-center gap-2 text-slate-500 text-xs italic">
               Note: This is an AI-generated visualization of your prompt structure.
             </div>
          </div>
        )}

        <div className="relative group">
          <div className="prose max-w-none text-slate-900 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-white p-8 rounded-2xl border border-slate-200 overflow-x-auto shadow-sm">
            {result.text}
          </div>
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">Prompt Logic Output</span>
          </div>
        </div>

        {result.sources && result.sources.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Research Grounding for Prompt</h4>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-600 rounded-lg text-[10px] font-bold hover:text-blue-600 transition-colors border border-slate-200 shadow-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  {source.title.substring(0, 30)}{source.title.length > 30 ? '...' : ''}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

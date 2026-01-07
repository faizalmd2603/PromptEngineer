
import React from 'react';
import { APP_NAME, TAGLINE } from '../constants';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-700 via-purple-700 to-cyan-600 text-white py-8 px-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full -ml-24 -mb-24 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center md:items-start">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">{APP_NAME}</h1>
        </div>
        <p className="text-blue-100 text-lg font-medium ml-1">
          {TAGLINE}
        </p>
      </div>
    </header>
  );
};

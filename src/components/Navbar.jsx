import React from 'react';
import { MessageSquare, SplitSquareVertical, Compass, Settings, Sparkles, ShieldCheck, Key } from 'lucide-react';
import { getStoredKeys } from '../services/aiService';

export default function Navbar({ currentView, setCurrentView, onOpenSettings }) {
  const keys = getStoredKeys();
  const configuredKeysCount = Object.values(keys).filter(k => Boolean(k && k.trim())).length;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                OmniAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 to-pink-500/20 border border-indigo-500/40 text-indigo-300">
                Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">All AI Chatbots in One Unified Platform</p>
          </div>
        </div>

        {/* View Navigation Switcher */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => setCurrentView('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentView === 'chat'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>

          <button
            onClick={() => setCurrentView('arena')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentView === 'arena'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SplitSquareVertical className="w-4 h-4" />
            <span className="flex items-center gap-1">
              Arena
              <span className="hidden md:inline-block text-[9px] uppercase px-1 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-semibold">
                VS
              </span>
            </span>
          </button>

          <button
            onClick={() => setCurrentView('directory')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentView === 'directory'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Directory</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Key status badge */}
          <button
            onClick={onOpenSettings}
            className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-colors"
            title="Configure API Keys"
          >
            {configuredKeysCount > 0 ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">{configuredKeysCount} Key{configuredKeysCount > 1 ? 's' : ''} Active</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300">Demo Mode</span>
              </>
            )}
          </button>

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
            title="API Settings & Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors hidden xs:block"
            title="GitHub Repository"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}

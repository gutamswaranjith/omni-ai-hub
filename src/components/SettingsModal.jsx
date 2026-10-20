import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Eye, EyeOff, Save, Trash2, Info } from 'lucide-react';
import { AI_PROVIDERS } from '../config/models';
import { getStoredKeys, saveStoredKeys } from '../services/aiService';
import ProviderIcon from './ProviderIcon';

export default function SettingsModal({ isOpen, onClose }) {
  const [keys, setKeys] = useState({});
  const [showKeys, setShowKeys] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeys(getStoredKeys());
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (providerId, value) => {
    setKeys(prev => ({
      ...prev,
      [providerId]: value
    }));
  };

  const toggleShow = (providerId) => {
    setShowKeys(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const handleSave = () => {
    saveStoredKeys(keys);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    if (confirm('Clear all stored API keys from this browser?')) {
      saveStoredKeys({});
      setKeys({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">API Keys & Provider Configuration</h2>
              <p className="text-xs text-slate-400">Add your own API keys for live model responses or use Demo Mode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Free Tier Notice */}
        <div className="px-5 py-3 bg-indigo-950/30 border-b border-indigo-900/30 flex items-start gap-2.5 text-xs text-indigo-200">
          <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-white">100% Client-Side Privacy:</span> Keys are stored solely in your browser's <code className="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">localStorage</code> and transmitted directly to the respective AI provider endpoints. No backend or intermediate proxy is used.
          </div>
        </div>

        {/* Provider Keys Form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {Object.values(AI_PROVIDERS).map((provider) => {
            const hasKey = Boolean(keys[provider.id] && keys[provider.id].trim());
            const isVisible = showKeys[provider.id];

            return (
              <div
                key={provider.id}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ProviderIcon provider={provider.id} className="w-4 h-4" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">{provider.name}</span>
                    {hasKey ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                        Demo Mode
                      </span>
                    )}
                  </div>

                  <a
                    href={provider.keyHelpUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                  >
                    <span>Get Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Input with Show/Hide toggle */}
                <div className="relative flex items-center">
                  <input
                    type={isVisible ? 'text' : 'password'}
                    value={keys[provider.id] || ''}
                    onChange={(e) => handleChange(provider.id, e.target.value)}
                    placeholder={`Enter ${provider.name} API Key (${provider.keyPlaceholder})`}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 pr-10 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShow(provider.id)}
                    className="absolute right-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                    title={isVisible ? 'Hide Key' : 'Show Key'}
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Keys</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveSuccess ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

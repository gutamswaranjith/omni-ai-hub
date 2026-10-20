import React, { useState } from 'react';
import { Send, Trophy, Copy, Check, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { CHATBOT_MODELS } from '../config/models';
import { sendChatMessage } from '../services/aiService';
import ProviderIcon from './ProviderIcon';
import MarkdownRenderer from './MarkdownRenderer';

export default function ArenaView({ onOpenSettings }) {
  // Default selected models to compare: Gemini 2.0 Flash vs GPT-4o vs Claude 3.5 Sonnet
  const [selectedModelIds, setSelectedModelIds] = useState([
    'gemini-2.0-flash',
    'gpt-4o',
    'claude-3-5-sonnet'
  ]);
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [votedWinner, setVotedWinner] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const toggleModel = (id) => {
    if (selectedModelIds.includes(id)) {
      if (selectedModelIds.length > 2) {
        setSelectedModelIds(selectedModelIds.filter(m => m !== id));
      }
    } else {
      if (selectedModelIds.length < 4) {
        setSelectedModelIds([...selectedModelIds, id]);
      }
    }
  };

  const handleRunArena = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setVotedWinner(null);
    const newResults = {};
    const newLoading = {};

    selectedModelIds.forEach(id => {
      newResults[id] = null;
      newLoading[id] = true;
    });

    setResults(newResults);
    setLoadingMap(newLoading);

    // Broadcast prompt to all selected models in parallel
    selectedModelIds.forEach(async (id) => {
      const model = CHATBOT_MODELS.find(m => m.id === id);
      const startTime = performance.now();
      try {
        const reply = await sendChatMessage({
          model,
          messages: [{ role: 'user', content: prompt.trim() }],
          systemPrompt: 'You are an expert AI model competing in a benchmark arena. Provide a thorough, well-reasoned, high quality answer.'
        });
        const duration = Math.round(performance.now() - startTime);
        setResults(prev => ({
          ...prev,
          [id]: { text: reply, durationMs: duration, success: true }
        }));
      } catch (err) {
        setResults(prev => ({
          ...prev,
          [id]: { text: `Error: ${err.message}`, durationMs: 0, success: false }
        }));
      } finally {
        setLoadingMap(prev => ({ ...prev, [id]: false }));
      }
    });
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const arenaPresets = [
    "Write a Python script to scrape top Hacker News stories and send a Discord webhook.",
    "Explain the difference between Pointers and References in C++ with memory diagrams.",
    "Draft a cold email to pitch a B2B SaaS analytics tool to CTOs.",
    "Solve this riddle: A man pushes his car to a hotel and tells the owner he's bankrupt. Why?"
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-950">
      {/* Arena Header & Controls */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                Multi-AI Model Arena
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Compare Side-by-Side
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select 2 to 4 models and send one prompt to benchmark speed, accuracy, and reasoning.
            </p>
          </div>

          {/* Model Selection Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CHATBOT_MODELS.map(m => {
              const isSelected = selectedModelIds.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleModel(m.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 border border-indigo-500'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  <ProviderIcon provider={m.provider} className="w-3.5 h-3.5" />
                  <span>{m.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Bar */}
        <div className="max-w-7xl mx-auto flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunArena()}
            placeholder="Enter a prompt to compare all selected models simultaneously..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none shadow-inner"
          />
          <button
            onClick={handleRunArena}
            disabled={!prompt.trim() || Object.values(loadingMap).some(Boolean)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {Object.values(loadingMap).some(Boolean) ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Battle</span>
              </>
            )}
          </button>
        </div>

        {/* Quick prompt suggestions */}
        {Object.keys(results).length === 0 && (
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1 text-[11px] text-slate-400">
            <span className="flex-shrink-0 font-medium text-slate-500">Quick test:</span>
            {arenaPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(preset)}
                className="flex-shrink-0 px-2.5 py-1 rounded-md bg-slate-800/60 hover:bg-slate-800 hover:text-indigo-300 border border-slate-700/40 truncate max-w-xs transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      <div className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto w-full">
        {Object.keys(results).length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 shadow-lg">
              <Zap className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-300">Ready for AI Arena Battle</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select your contender models above, type your prompt, and see how Gemini, ChatGPT, Claude, and DeepSeek handle the exact same task.
              </p>
            </div>
          </div>
        ) : (
          <div
            className={`grid gap-4 h-full ${
              selectedModelIds.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : selectedModelIds.length === 3
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}
          >
            {selectedModelIds.map(id => {
              const model = CHATBOT_MODELS.find(m => m.id === id);
              const result = results[id];
              const isLoading = loadingMap[id];
              const isWinner = votedWinner === id;

              return (
                <div
                  key={id}
                  className={`flex flex-col rounded-2xl border transition-all ${
                    isWinner
                      ? 'border-amber-500/80 bg-slate-900/90 shadow-xl shadow-amber-500/10 ring-2 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-900/70 shadow-md'
                  }`}
                >
                  {/* Model Header */}
                  <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-850/50 rounded-t-2xl">
                    <div className="flex items-center gap-2 truncate">
                      <ProviderIcon provider={model.provider} className="w-4 h-4 flex-shrink-0" />
                      <div className="truncate">
                        <div className="font-semibold text-xs sm:text-sm text-slate-100 truncate">
                          {model.name}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {model.provider}
                        </div>
                      </div>
                    </div>

                    {result?.durationMs ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                        {result.durationMs}ms
                      </span>
                    ) : null}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-4 overflow-y-auto text-xs sm:text-sm leading-relaxed">
                    {isLoading ? (
                      <div className="h-full flex flex-col items-center justify-center py-12 space-y-3">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-slate-400 font-medium animate-pulse">
                          Generating response...
                        </span>
                      </div>
                    ) : result ? (
                      <div>
                        <MarkdownRenderer content={result.text} />
                      </div>
                    ) : (
                      <div className="text-slate-500 text-xs italic text-center py-8">
                        Waiting to run...
                      </div>
                    )}
                  </div>

                  {/* Column Footer: Vote & Copy */}
                  {result && !isLoading && (
                    <div className="p-2.5 border-t border-slate-800/80 bg-slate-900/60 rounded-b-2xl flex items-center justify-between gap-2">
                      <button
                        onClick={() => setVotedWinner(id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isWinner
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300'
                        }`}
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{isWinner ? 'Winner! 🏆' : 'Vote Best'}</span>
                      </button>

                      <button
                        onClick={() => handleCopy(result.text, id)}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
                        title="Copy this response"
                      >
                        {copiedId === id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

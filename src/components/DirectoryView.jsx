import React, { useState } from 'react';
import { ExternalLink, Search, Sparkles, Filter, CheckCircle2, Star } from 'lucide-react';
import { AI_DIRECTORY } from '../config/models';

export default function DirectoryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'General & Multimodal', 'Coding & Analysis', 'Research & Search', 'Reasoning & Open Weights', 'European Open AI'];

  const filteredBots = AI_DIRECTORY.filter((bot) => {
    const matchesSearch =
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || bot.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner / Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Global AI Directory & Portals</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore All Leading AI Chatbots
          </h1>
          <p className="text-sm text-slate-400">
            A comprehensive catalog of the world's most capable AI chatbots, answer engines, and reasoning models. Launch any portal directly.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-sm">
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, or capability..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-750'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Chatbots Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBots.map((bot) => (
            <div
              key={bot.id}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-slate-700 transition-all duration-200 p-5 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5"
            >
              <div>
                {/* Header: Name, Company, Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-base"
                      style={{ backgroundColor: bot.iconColor }}
                    >
                      {bot.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {bot.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{bot.company}</p>
                    </div>
                  </div>

                  {bot.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {bot.badge}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {bot.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {bot.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-slate-400 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer info & Direct Launch */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-medium">{bot.freeTier}</span>
                </div>

                <a
                  href={bot.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-500 text-xs font-semibold transition-all shadow-sm"
                >
                  <span>Launch Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {filteredBots.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No chatbots found matching "{searchTerm}". Try another keyword or category.
          </div>
        )}
      </div>
    </div>
  );
}

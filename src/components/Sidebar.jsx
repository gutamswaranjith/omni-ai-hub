import React from 'react';
import { Plus, MessageSquare, Trash2, Download, Bot, ChevronDown, Check, X } from 'lucide-react';
import { CHATBOT_MODELS } from '../config/models';
import ProviderIcon from './ProviderIcon';

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAllSessions,
  selectedModel,
  onSelectModel,
  isOpen,
  onToggle
}) {
  const [modelDropdownOpen, setModelDropdownOpen] = React.useState(false);

  const handleExportChats = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `omni-ai-conversations-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-30 w-72 bg-slate-900/95 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Actions: New Chat & Model Selector */}
        <div className="p-3 border-b border-slate-800/80 space-y-2">
          <button
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 1024) onToggle();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>

          {/* Quick Model Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-left text-xs transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <ProviderIcon provider={selectedModel.provider} className="w-4 h-4 flex-shrink-0" />
                <div className="truncate">
                  <div className="font-semibold text-slate-100 truncate">{selectedModel.name}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{selectedModel.provider}</div>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
            </button>

            {modelDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-40 p-1 space-y-0.5">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select AI Chatbot
                </div>
                {CHATBOT_MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                      selectedModel.id === m.id
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30'
                        : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <ProviderIcon provider={m.provider} className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{m.name}</span>
                    </div>
                    {selectedModel.id === m.id && <Check className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Conversation Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Recent Chats
          </div>

          {sessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-slate-500">
              No chats yet. Start asking a question!
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-slate-100 font-medium border border-slate-700/60'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-1">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-slate-500 group-hover:text-slate-300" />
                    <span className="truncate">{session.title || 'Untitled Conversation'}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 text-slate-500 rounded transition-opacity"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions: Clear & Export */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportChats}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors border border-slate-700/40"
              title="Download conversation data"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={onClearAllSessions}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 transition-colors border border-slate-800"
              title="Clear all chats"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

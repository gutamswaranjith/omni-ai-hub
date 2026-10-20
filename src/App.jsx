import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import ArenaView from './components/ArenaView';
import DirectoryView from './components/DirectoryView';
import SettingsModal from './components/SettingsModal';
import { CHATBOT_MODELS, SYSTEM_PROMPTS } from './config/models';
import { sendChatMessage } from './services/aiService';
import { Menu, Sparkles } from 'lucide-react';

const SESSIONS_STORAGE_KEY = 'omni_ai_sessions';

export default function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' | 'arena' | 'directory'
  const [selectedModel, setSelectedModel] = useState(CHATBOT_MODELS[0]);
  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPTS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Chat sessions state
  const [sessions, setSessions] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load sessions', e);
    }
    const initialId = 'session_' + Date.now();
    return [{
      id: initialId,
      title: 'New Conversation',
      modelId: CHATBOT_MODELS[0].id,
      messages: [],
      createdAt: new Date().toISOString()
    }];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return sessions[0]?.id || 'session_' + Date.now();
  });

  // Sync sessions with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save sessions', e);
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Update selected model when session changes
  useEffect(() => {
    if (activeSession?.modelId) {
      const found = CHATBOT_MODELS.find(m => m.id === activeSession.modelId);
      if (found) setSelectedModel(found);
    }
  }, [activeSessionId]);

  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setSessions(prev =>
      prev.map(s => (s.id === activeSessionId ? { ...s, modelId: model.id } : s))
    );
  };

  const handleNewSession = () => {
    const newId = 'session_' + Date.now();
    const newSession = {
      id: newId,
      title: 'New Conversation',
      modelId: selectedModel.id,
      messages: [],
      createdAt: new Date().toISOString()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setErrorMessage('');
  };

  const handleDeleteSession = (id) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        const newId = 'session_' + Date.now();
        const fallback = {
          id: newId,
          title: 'New Conversation',
          modelId: selectedModel.id,
          messages: [],
          createdAt: new Date().toISOString()
        };
        setActiveSessionId(newId);
        return [fallback];
      }
      if (activeSessionId === id) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleClearAllSessions = () => {
    if (confirm('Are you sure you want to delete all conversation history?')) {
      const newId = 'session_' + Date.now();
      const fresh = [{
        id: newId,
        title: 'New Conversation',
        modelId: selectedModel.id,
        messages: [],
        createdAt: new Date().toISOString()
      }];
      setSessions(fresh);
      setActiveSessionId(newId);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;
    setErrorMessage('');

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentMessages = activeSession?.messages || [];
    const updatedMessages = [...currentMessages, userMessage];

    // Auto-generate title from first user prompt
    let updatedTitle = activeSession.title;
    if (currentMessages.length === 0) {
      updatedTitle = text.slice(0, 32) + (text.length > 32 ? '...' : '');
    }

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { ...s, title: updatedTitle, messages: updatedMessages }
          : s
      )
    );

    setIsLoading(true);

    try {
      const reply = await sendChatMessage({
        model: selectedModel,
        messages: updatedMessages,
        systemPrompt: systemPrompt.prompt,
      });

      const assistantMessage = {
        role: 'assistant',
        content: reply,
        modelName: selectedModel.name,
        modelProvider: selectedModel.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? { ...s, messages: [...updatedMessages, assistantMessage] }
            : s
        )
      );
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to generate response. Please check your network or API keys in Settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const currentMessages = activeSession?.messages || [];
    if (currentMessages.length === 0 || isLoading) return;

    // Find the last user message
    let lastUserIndex = -1;
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }
    if (lastUserIndex === -1) return;

    const trimmedMessages = currentMessages.slice(0, lastUserIndex + 1);

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? { ...s, messages: trimmedMessages }
          : s
      )
    );

    setIsLoading(true);
    setErrorMessage('');

    try {
      const reply = await sendChatMessage({
        model: selectedModel,
        messages: trimmedMessages,
        systemPrompt: systemPrompt.prompt,
      });

      const assistantMessage = {
        role: 'assistant',
        content: reply,
        modelName: selectedModel.name,
        modelProvider: selectedModel.provider,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? { ...s, messages: [...trimmedMessages, assistantMessage] }
            : s
        )
      );
    } catch (err) {
      setErrorMessage(err.message || 'Failed to regenerate response.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {/* Main View Router */}
      <div className="flex-1 flex overflow-hidden">
        {currentView === 'chat' && (
          <>
            {/* Sidebar toggle button for mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden fixed bottom-4 left-4 z-40 p-3 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/40"
              title="Toggle Chat History"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Sidebar with Sessions & Model Picker */}
            <Sidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              onClearAllSessions={handleClearAllSessions}
              selectedModel={selectedModel}
              onSelectModel={handleSelectModel}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            {/* Central Chat Interface */}
            <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] bg-slate-950 relative overflow-hidden">
              <ChatArea
                messages={activeSession?.messages || []}
                selectedModel={selectedModel}
                isLoading={isLoading}
                onSendMessage={handleSendMessage}
                onRegenerate={handleRegenerate}
                errorMessage={errorMessage}
              />

              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onStop={() => setIsLoading(false)}
                systemPrompt={systemPrompt}
                onSelectSystemPrompt={setSystemPrompt}
              />
            </main>
          </>
        )}

        {currentView === 'arena' && (
          <ArenaView onOpenSettings={() => setSettingsOpen(true)} />
        )}

        {currentView === 'directory' && (
          <DirectoryView />
        )}
      </div>

      {/* API Keys & Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

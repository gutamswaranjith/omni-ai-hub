import React, { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX, Copy, Check, RotateCcw, Sparkles, User, AlertCircle } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import ProviderIcon from './ProviderIcon';

export default function ChatArea({
  messages,
  selectedModel,
  isLoading,
  onSendMessage,
  onRegenerate,
  errorMessage
}) {
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [speakingIndex, setSpeakingIndex] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text, index) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[`*#_\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const samplePrompts = [
    { title: "Code Helper", text: "Write a high-performance debounce function in JavaScript with TypeScript types." },
    { title: "AI Comparison", text: "Explain the architectural difference between Google Gemini 2.0 Flash, Claude 3.5 Sonnet, and GPT-4o." },
    { title: "Creative Story", text: "Write a short sci-fi story about an autonomous AI agent exploring Europa's deep oceans." },
    { title: "System Architecture", text: "Design a fault-tolerant distributed cache system with Redis and write the trade-offs." }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Welcome Hero when no messages */}
      {messages.length === 0 && (
        <div className="max-w-2xl mx-auto py-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center shadow-xl">
            <ProviderIcon provider={selectedModel.provider} className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              <span>{selectedModel.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedModel.tagColor}`}>
                {selectedModel.tag}
              </span>
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              {selectedModel.description}
            </p>
          </div>

          {/* Model Strengths Badges */}
          <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
            {selectedModel.strengths.map((str, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium"
              >
                ✓ {str}
              </span>
            ))}
          </div>

          {/* Quick Prompt Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-left">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => onSendMessage(p.text)}
                className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 transition-all text-xs group"
              >
                <div className="font-semibold text-slate-200 group-hover:text-indigo-300 flex items-center justify-between mb-1">
                  <span>{p.title}</span>
                  <Sparkles className="w-3 h-3 text-slate-500 group-hover:text-indigo-400" />
                </div>
                <div className="text-slate-400 line-clamp-2 leading-relaxed">
                  {p.text}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message History */}
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* AI Avatar */}
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                  <ProviderIcon provider={msg.modelProvider || selectedModel.provider} className="w-4 h-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md'
                }`}
              >
                {/* Header for AI message */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {msg.modelName || selectedModel.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {msg.timestamp || 'Just now'}
                    </span>
                  </div>
                )}

                {/* Content */}
                {isUser ? (
                  <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                    {msg.content}
                  </div>
                ) : (
                  <MarkdownRenderer content={msg.content} />
                )}

                {/* AI Message Action Buttons */}
                {!isUser && (
                  <div className="flex items-center gap-1.5 pt-2 mt-2 border-t border-slate-800/60 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(msg.content, index)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                      title="Copy message"
                    >
                      {copiedIndex === index ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSpeak(msg.content, index)}
                      className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                        speakingIndex === index ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
                      }`}
                      title={speakingIndex === index ? 'Stop audio' : 'Listen with text-to-speech'}
                    >
                      {speakingIndex === index ? (
                        <VolumeX className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {index === messages.length - 1 && (
                      <button
                        onClick={onRegenerate}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Regenerate response"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-700 flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 justify-start">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
              <ProviderIcon provider={selectedModel.provider} className="w-4 h-4" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {selectedModel.name} is thinking...
              </span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-rose-300">Request Note</div>
              <div>{errorMessage}</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

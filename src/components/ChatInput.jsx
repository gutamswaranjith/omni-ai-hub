import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Square, Sparkles, SlidersHorizontal, ChevronUp } from 'lucide-react';
import { SYSTEM_PROMPTS } from '../config/models';

export default function ChatInput({
  onSendMessage,
  isLoading,
  onStop,
  systemPrompt,
  onSelectSystemPrompt
}) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showPromptMenu, setShowPromptMenu] = useState(false);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API for voice dictation
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(res => res[0].transcript)
          .join('');
        setText(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Try Chrome or Edge!');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setText('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-4">
      {/* System Persona selector */}
      <div className="flex items-center justify-between mb-2 px-1 text-xs text-slate-400">
        <div className="relative">
          <button
            onClick={() => setShowPromptMenu(!showPromptMenu)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-750 text-slate-300 border border-slate-700/60 transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3 text-indigo-400" />
            <span>Persona: <span className="font-semibold text-slate-200">{systemPrompt.name}</span></span>
            <ChevronUp className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>

          {showPromptMenu && (
            <div className="absolute bottom-full left-0 mb-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-30 space-y-0.5">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                AI Behavior Persona
              </div>
              {SYSTEM_PROMPTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectSystemPrompt(p);
                    setShowPromptMenu(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-colors ${
                    systemPrompt.id === p.id
                      ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="font-medium text-slate-200">{p.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{p.prompt}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Shift + Enter for new line • Enter to send
        </span>
      </div>

      {/* Main Input Box */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 focus-within:border-indigo-500/80 shadow-xl focus-within:shadow-indigo-500/10 transition-all p-2 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything or request code (e.g. 'Write a React hook for dark mode')..."
          rows={1}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm md:text-base px-2 py-1 focus:outline-none resize-none max-h-48"
        />

        {/* Input Footer Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-1">
          {/* Voice Input button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-xl transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={isRecording ? 'Listening... click to stop' : 'Dictate with Voice'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            {isRecording && (
              <span className="text-xs text-rose-400 font-medium animate-pulse">
                Listening...
              </span>
            )}
          </div>

          {/* Send / Stop button */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all"
                title="Stop generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim()}
                className={`flex items-center justify-center p-2 rounded-xl transition-all ${
                  text.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

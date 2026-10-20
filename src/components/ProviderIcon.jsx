import React from 'react';
import { Sparkles, Bot, Brain, Cpu, Zap, Layers, Globe } from 'lucide-react';

export default function ProviderIcon({ provider, className = "w-5 h-5", size }) {
  const iconProps = { className, size };

  switch (provider) {
    case 'gemini':
      return (
        <span className="inline-flex items-center justify-center text-blue-400" title="Google Gemini">
          <Sparkles {...iconProps} />
        </span>
      );
    case 'openai':
      return (
        <span className="inline-flex items-center justify-center text-emerald-400" title="OpenAI ChatGPT">
          <Bot {...iconProps} />
        </span>
      );
    case 'claude':
      return (
        <span className="inline-flex items-center justify-center text-amber-400" title="Anthropic Claude">
          <Brain {...iconProps} />
        </span>
      );
    case 'deepseek':
      return (
        <span className="inline-flex items-center justify-center text-indigo-400" title="DeepSeek AI">
          <Cpu {...iconProps} />
        </span>
      );
    case 'groq':
      return (
        <span className="inline-flex items-center justify-center text-orange-400" title="Groq LPU">
          <Zap {...iconProps} />
        </span>
      );
    case 'openrouter':
      return (
        <span className="inline-flex items-center justify-center text-purple-400" title="OpenRouter">
          <Layers {...iconProps} />
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center justify-center text-slate-400">
          <Globe {...iconProps} />
        </span>
      );
  }
}

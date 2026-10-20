// AI Service: Handles API requests to Gemini, OpenAI, Claude, DeepSeek, OpenRouter, and Groq
// Includes intelligent fallback demo mode for instant testing without API keys.

const STORAGE_KEY = 'omni_ai_keys';

export const getStoredKeys = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    console.error('Failed to read keys from localStorage', err);
    return {};
  }
};

export const saveStoredKeys = (keys) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch (err) {
    console.error('Failed to save keys to localStorage', err);
  }
};

/**
 * Main function to generate a completion from any selected model
 * @param {Object} params
 * @param {Object} params.model - Model definition object from models.js
 * @param {Array} params.messages - [{ role: 'user'|'assistant'|'system', content: string }]
 * @param {string} params.systemPrompt - System prompt string
 * @param {number} params.temperature - Sampling temperature (0.0 - 1.0)
 * @returns {Promise<string>}
 */
export async function sendChatMessage({ model, messages, systemPrompt, temperature = 0.7 }) {
  const keys = getStoredKeys();
  const providerKey = keys[model.provider] || (model.provider === 'gemini' ? keys.gemini : '') || (model.provider === 'openai' ? keys.openai : '');

  // If user has provided a key for this provider, try the real API
  if (providerKey && providerKey.trim()) {
    try {
      switch (model.endpointType) {
        case 'gemini':
          return await callGeminiApi(model, messages, systemPrompt, providerKey.trim());
        case 'openai':
          return await callOpenAIApi(model, messages, systemPrompt, providerKey.trim(), 'https://api.openai.com/v1/chat/completions');
        case 'claude':
          return await callClaudeApi(model, messages, systemPrompt, providerKey.trim());
        case 'deepseek':
          return await callOpenAIApi(model, messages, systemPrompt, providerKey.trim(), 'https://api.deepseek.com/chat/completions');
        case 'openrouter':
          return await callOpenRouterApi(model, messages, systemPrompt, providerKey.trim());
        case 'groq':
          return await callOpenAIApi(model, messages, systemPrompt, providerKey.trim(), 'https://api.groq.com/openai/v1/chat/completions');
        default:
          return await callOpenRouterApi(model, messages, systemPrompt, providerKey.trim());
      }
    } catch (apiError) {
      console.warn(`Live API error for ${model.name}:`, apiError);
      throw new Error(`API Error from ${model.name}: ${apiError.message || 'Request failed'}`);
    }
  }

  // If no API key is provided, use high-fidelity simulated response
  return generateSimulatedResponse(model, messages, systemPrompt);
}

// ---------------- Real API Integrations ---------------- //

async function callGeminiApi(model, messages, systemPrompt, apiKey) {
  // Map messages to Gemini format
  const contents = [];
  
  // Convert chat history
  for (const msg of messages) {
    contents.push({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    });
  }

  const endpointModel = model.apiModelId || 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${endpointModel}:generateContent?key=${apiKey}`;

  const requestBody = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    }
  };

  if (systemPrompt) {
    requestBody.systemInstruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  const candidate = data.candidates?.[0];
  if (!candidate?.content?.parts?.[0]?.text) {
    throw new Error('No response returned from Gemini API.');
  }

  return candidate.content.parts[0].text;
}

async function callOpenAIApi(model, messages, systemPrompt, apiKey, endpointUrl) {
  const formattedMessages = [];
  if (systemPrompt) {
    formattedMessages.push({ role: 'system', content: systemPrompt });
  }
  for (const msg of messages) {
    formattedMessages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  }

  const res = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model.apiModelId,
      messages: formattedMessages,
      temperature: 0.7,
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  return data.choices?.[0]?.message?.content || 'No text received.';
}

async function callClaudeApi(model, messages, systemPrompt, apiKey) {
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true' // Necessary for browser calls
    },
    body: JSON.stringify({
      model: model.apiModelId,
      max_tokens: 2048,
      system: systemPrompt || undefined,
      messages: formattedMessages
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  const textPart = data.content?.find(c => c.type === 'text');
  return textPart?.text || 'No response generated.';
}

async function callOpenRouterApi(model, messages, systemPrompt, apiKey) {
  const formattedMessages = [];
  if (systemPrompt) {
    formattedMessages.push({ role: 'system', content: systemPrompt });
  }
  for (const msg of messages) {
    formattedMessages.push({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    });
  }

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'OmniAI Hub'
    },
    body: JSON.stringify({
      model: model.apiModelId,
      messages: formattedMessages
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  return data.choices?.[0]?.message?.content || 'No response generated.';
}

// ---------------- Interactive Demo / Simulated Engine ---------------- //
// Simulates accurate response style, markdown formatting, and model personality
// when the user wants to test the UI before entering their API keys.

async function generateSimulatedResponse(model, messages, systemPrompt) {
  // Artificial delay to simulate real network streaming/thinking
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

  const lastUserMsg = messages[messages.length - 1]?.content || 'Hello';
  const query = lastUserMsg.toLowerCase();

  // Model personality signatures
  const providerNames = {
    gemini: 'Google Gemini 2.0 Flash',
    openai: 'OpenAI ChatGPT (GPT-4o)',
    claude: 'Anthropic Claude 3.5 Sonnet',
    deepseek: 'DeepSeek V3 / R1',
    groq: 'Meta Llama 3.3 70B (Groq)',
    openrouter: 'OpenRouter Multi-Model'
  };

  const modelTitle = providerNames[model.provider] || model.name;

  // Code request
  if (query.includes('code') || query.includes('python') || query.includes('javascript') || query.includes('function') || query.includes('react') || query.includes('html')) {
    return `### Response from ${modelTitle}

Here is a clean, modern implementation for your request:

\`\`\`javascript
// Example solution inspired by modern best practices
export function solveTask(inputData) {
  if (!inputData) {
    return { success: false, error: 'Input data required' };
  }

  const processed = inputData
    .filter(item => Boolean(item))
    .map((item, index) => ({
      id: index + 1,
      name: item.name || 'Unnamed',
      timestamp: new Date().toISOString(),
      score: (item.score || 0) * 1.5
    }));

  return {
    success: true,
    count: processed.length,
    results: processed
  };
}

// Usage example:
// const sample = [{ name: 'Alpha', score: 10 }, { name: 'Beta', score: 20 }];
// console.log(solveTask(sample));
\`\`\`

#### Key Highlights:
1. **Error Handling**: Validates input before processing.
2. **Immutable Transformations**: Uses non-destructive \`map\` and \`filter\`.
3. **TypeScript/ES6 Ready**: Works out of the box with modern toolchains.

> 💡 *Note: Running in interactive Demo Mode. To connect directly to the live ${model.provider.toUpperCase()} API, click **Settings (⚙️)** in the top bar to paste your API key.*`;
  }

  // Comparison or Explanation query
  if (query.includes('explain') || query.includes('difference') || query.includes('what is') || query.includes('how to')) {
    return `### Response from ${modelTitle}

Great question! Here is a structured breakdown:

1. **Core Concept**:
   - The primary objective is establishing high efficiency, accuracy, and modularity.
   - It decouples responsibilities so components remain clean and easily testable.

2. **Advantages**:
   - ⚡ **Speed & Scalability**: Optimized for low latency.
   - 🔒 **Security & Privacy**: Client-side execution with zero third-party proxy leaks.
   - 🌐 **Accessibility**: Direct cross-browser execution on GitHub Pages.

3. **Comparison Summary**:
| Feature | Traditional Approach | Modern AI Pipeline |
| :--- | :--- | :--- |
| **Speed** | Moderate | Real-time Parallel |
| **Flexibility** | Static | Adaptive & Dynamic |
| **Integration** | Complex API Bridges | Direct CORS & Streaming |

> 💡 *Tip: You can compare responses across multiple models side-by-side using the **Arena Mode** toggle at the top!*`;
  }

  // General conversational greeting or inquiry
  return `### Hello! I am ${modelTitle}

I received your prompt:
> *"${lastUserMsg}"*

I'm ready to assist you with:
- 💻 **Software Engineering**: Code creation, debugging, architectural design, and optimization.
- 🧠 **Reasoning & Problem Solving**: Step-by-step logic, math, and technical analysis.
- 📝 **Writing & Summarization**: Research papers, articles, documentation, and ideas.
- ⚡ **Multi-Model Comparisons**: Test my reasoning alongside Claude, ChatGPT, Gemini, and DeepSeek.

Feel free to ask a technical question, paste code to review, or switch to **Arena Mode** to benchmark models simultaneously!

---
> 🔑 *Want live production queries? Add your **${model.provider.toUpperCase()} API Key** in **Settings (⚙️)**. Google Gemini offers a generous 100% free API key via Google AI Studio!*`;
}

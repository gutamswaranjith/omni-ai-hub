# 🌟 OmniAI Hub — All-in-One AI Chatbot Arena & Directory

An all-in-one conversational AI web platform featuring **Google Gemini**, **OpenAI ChatGPT**, **Anthropic Claude**, **DeepSeek**, **Groq Llama 3**, and **OpenRouter**. Designed to run 100% client-side and deploy directly to **GitHub Pages** with automated GitHub Actions.

![OmniAI Hub Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🚀 Features

### 1. 💬 Unified Single Chat Interface
- Switch seamlessly between **Google Gemini (2.0 Flash & 1.5 Pro)**, **OpenAI ChatGPT (GPT-4o & mini)**, **Anthropic Claude (3.5 Sonnet & Haiku)**, **DeepSeek (V3 & R1)**, and **Groq (Llama 3.3 70B)**.
- **Markdown & Code Syntax Highlighting**: Clean rendering of code blocks, tables, lists, and one-click copy buttons.
- **Voice Dictation**: Built-in speech-to-text using the Web Speech API.
- **Text-to-Speech (TTS)**: Listen to any AI response read aloud.
- **AI Persona Switcher**: Switch behavior on the fly (Senior Software Engineer, Academic Tutor, Creative Writer, Ultra-Concise).
- **Local Storage History**: All your conversations are saved locally in your browser. Export anytime to JSON or Markdown.

### 2. ⚔️ Multi-AI Arena (Side-by-Side Comparison)
- Broadcast a single prompt to **2, 3, or 4 AI models simultaneously**.
- Benchmark response quality, token speed, and reasoning depth in real time.
- Vote for the winning answer with the **🏆 Vote Best** system.

### 3. 🌐 Global AI Directory & Launcher
- Curated catalog of the world's most capable AI chatbots (ChatGPT, Gemini, Claude, Copilot, DeepSeek, Perplexity, Mistral Le Chat, Grok, Poe, HuggingChat, Meta AI, Phind).
- Search and filter by category (Coding, Reasoning, Research, Open Source).
- Direct one-click launcher buttons to open official portals.

### 4. 🔒 100% Client-Side Privacy
- No middleman server.
- API keys are stored solely in your browser's `localStorage` and sent directly to provider APIs.
- **Interactive Demo Mode**: Explore and test the interface immediately without needing an API key!

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm)
- **Deployment**: [GitHub Pages](https://pages.github.com/) + [GitHub Actions](https://github.com/features/actions)

---

## 💻 Local Development

To run the application locally on your computer:

```bash
# 1. Clone or open the project directory
cd P3

# 2. Install dependencies (if not already installed)
npm install

# 3. Start local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🌐 Deploy to GitHub & GitHub Pages (Step-by-Step)

The project includes an automated GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and deploys your website automatically whenever you push code!

### Step 1: Create a New GitHub Repository
1. Go to [GitHub New Repository](https://github.com/new).
2. Name your repository (e.g. `omniai-hub` or `ai-chatbot-hub`).
3. Set the repository to **Public** (required for free GitHub Pages).
4. Click **Create repository** (do NOT check "Initialize with README").

### Step 2: Push Your Code to GitHub
In your project terminal (`c:\Users\gutam\OneDrive\Desktop\P3`), run:

```bash
# Initialize git if needed
git init

# Stage all files
git add .

# Create initial commit
git commit -m "feat: initialize OmniAI Hub all-in-one AI platform"

# Rename branch to main
git branch -M main

# Link your GitHub repository (replace USERNAME and REPO with your details)
git remote add origin https://github.com/USERNAME/REPO.git

# Push code to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages in Repository Settings
1. On GitHub, navigate to your repository.
2. Click on the **Settings** tab.
3. On the left sidebar, click **Pages** (under "Code and automation").
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.
5. Wait ~1 to 2 minutes. GitHub Actions will automatically run the build and publish your site!
6. Your live website URL will be displayed at the top:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

---

## 🔑 Getting API Keys (Free & Paid Options)

You can use the website in **Demo Mode** with zero keys, or add your own API keys in **Settings (⚙️)**:

| Provider | Free Tier Available? | Where to get key |
| :--- | :--- | :--- |
| **Google Gemini** | **Yes (Generous 100% Free Tier)** | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **OpenRouter** | **Yes (Includes Free Models)** | [OpenRouter Keys](https://openrouter.ai/keys) |
| **Groq (Llama 3)** | **Yes (Generous Free Tier)** | [Groq Console](https://console.groq.com/keys) |
| **DeepSeek** | **Very Low Cost / Free Web** | [DeepSeek Platform](https://platform.deepseek.com/api_keys) |
| **OpenAI (ChatGPT)**| Pay-as-you-go | [OpenAI Platform](https://platform.openai.com/api-keys) |
| **Anthropic Claude**| Pay-as-you-go | [Anthropic Console](https://console.anthropic.com/settings/keys) |

> 💡 **Recommendation**: Start by generating a free key at [Google AI Studio](https://aistudio.google.com/app/apikey) to try live Google Gemini 2.0 Flash instantly with zero credit card required!

---

## 📜 License
MIT License. Feel free to use, modify, and build upon this project!

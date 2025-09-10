# 📧 Gmail AI Assist  

A Chrome extension that makes Gmail smarter with **AI-powered drafting and summarizing**.  

✨ Features  
- **AI Draft** → instantly rewrite or generate professional email drafts.  
- **AI Summarize** → condense long threads into 3–5 clear bullet points.  
- **Hotkey Support** → `Ctrl + Shift + A` to draft instantly.  
- Works in **Compose** and **Reply** windows.  
- Choose your favorite AI model (Claude, GPT-3.5, Mistral, etc) via [OpenRouter](https://openrouter.ai).  
- **Unlimited usage** with your own API key (or the built-in fallback key, if configured).  

---

## 🚀 Installation (Developer Mode)
Until it’s live on the Chrome Web Store, you can install manually:  

1. Clone or download this repo.  
2. Open Chrome → `chrome://extensions/`.  
3. Enable **Developer mode** (toggle top right).  
4. Click **Load unpacked** → select the `gmail-ai-assist/` folder.  
5. Pin the extension to your toolbar.  

---

## ⚙️ Setup
1. Click on the extension → **Options**.  
2. Paste your [OpenRouter](https://openrouter.ai) API key (starts with `sk-...`).  
3. Choose your preferred models for Draft and Summarize.  
4. Open Gmail → hit **Compose** or **Reply**.  
5. Look for the **AI Draft** and **Summarize** buttons near the Send button.  

---

## 🎯 Usage
- **AI Draft**  
  - Type a rough draft → click AI Draft → it’s rewritten clearly and professionally.  
  - Or click it on a blank draft → AI creates a polite, professional reply based on the thread.  

- **AI Summarize**  
  - In long threads, click Summarize → get 3–5 key bullet points (decisions, next steps).  

- **Hotkey**  
  - `Ctrl + Shift + A` → triggers Draft in the active editor.  

---

## 🔒 Privacy
- We do **not** collect or store your Gmail data.  
- Only the email text you choose to process is sent securely to the OpenRouter API.  
- Your API key is stored locally in Chrome storage on your own device.  

---

## 🛠️ Development Notes
- Built with **Chrome Extensions Manifest V3**.  
- Uses `chrome.storage.sync` for settings.  
- Content scripts inject buttons into Gmail’s DOM.  
- Background script handles API calls to OpenRouter.  

---

## 📜 License
MIT License. Free to use and modify.  

---

## 🙌 Contributing
PRs are welcome!  
- Bug fixes  
- UI improvements  
- New features (tone settings, multi-model presets, etc.)  

---

## ⭐ Support
If you like this extension:  
- Give this repo a ⭐ on GitHub.  
- Leave a review on the Chrome Web Store once it’s live.  

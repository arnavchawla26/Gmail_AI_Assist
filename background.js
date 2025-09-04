// background.js — OpenRouter calls, unlimited usage

let SETTINGS = {
    openai_api_key: "",
    model_draft: "openai/gpt-3.5-turbo",       // cheap & solid for drafting
    model_summary: "anthropic/claude-3-haiku"   // great at concise summaries
  };
  
  // Load saved settings
  chrome.storage.sync.get(Object.keys(SETTINGS), (res) => {
    SETTINGS = { ...SETTINGS, ...res };
    console.log("[Gmail AI Assist] settings loaded:", SETTINGS);
  });
  
  // Keep in sync if user changes Options
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync") {
      for (const [k, v] of Object.entries(changes)) {
        SETTINGS[k] = v.newValue;
      }
    }
  });
  
  // Core AI call via OpenRouter
  async function callOpenRouter(prompt, mode) {
    if (!SETTINGS.openai_api_key) throw new Error("NO_API_KEY");
    const model = mode === "summarize" ? SETTINGS.model_summary : SETTINGS.model_draft;
  
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SETTINGS.openai_api_key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gmail-ai-assist.local",
        "X-Title": "Gmail AI Assist"
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              mode === "summarize"
                ? "Summarize the email thread into 3–5 short, actionable bullet points."
                : "You are an expert email assistant. Write clear, concise, professional emails with a friendly tone."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });
  
    if (!resp.ok) throw new Error("HTTP " + resp.status);
    const data = await resp.json();
    const out = data?.choices?.[0]?.message?.content?.trim();
    if (!out) throw new Error("EMPTY_RESPONSE");
    return out;
  }
  
  // Messages from content script
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    (async () => {
      try {
        if (msg.type === "AI_GENERATE") {
          const text = await callOpenRouter(msg.prompt, msg.mode);
          sendResponse({ ok: true, text });
        } else {
          sendResponse({ ok: false, error: "UNKNOWN_MSG" });
        }
      } catch (e) {
        sendResponse({ ok: false, error: e.message });
      }
    })();
    return true;
  });
  
  // Keyboard shortcut (Ctrl+Shift+A)
  chrome.commands.onCommand.addListener((command) => {
    if (command === "ai_assist") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: "HOTKEY_AI" });
        }
      });
    }
  });
  
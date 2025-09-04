// Inject AI Draft + Summarize; support hotkey
(function () {
    'use strict';
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  
    function toast(msg) {
      const el = document.createElement('div');
      el.className = 'gaa-toast';
      el.textContent = msg;
      document.documentElement.appendChild(el);
      requestAnimationFrame(() => el.classList.add('in'));
      setTimeout(() => el.classList.remove('in'), 2200);
      setTimeout(() => el.remove(), 2600);
    }
  
    function findEditor(dialog) {
      return (
        dialog.querySelector('[aria-label="Message Body"] div[contenteditable="true"]') ||
        dialog.querySelector('div[role="textbox"][contenteditable="true"]') ||
        dialog.querySelector('div[contenteditable="true"]')
      );
    }
  
    function getContext(dialog) {
      // last few visible messages + current draft
      const parts = $$('div[role="listitem"] div[dir="ltr"]').slice(-6)
        .map(n => n.innerText.trim()).filter(Boolean);
      const editor = findEditor(dialog);
      const draft = editor ? editor.innerText.trim() : "";
      const ctx = [...parts, draft].filter(Boolean).join("\n\n---\n\n");
      return ctx.length > 5000 ? ctx.slice(-5000) : ctx;
    }
  
    function sendMessage(msg) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(msg, (resp) => {
          if (chrome.runtime.lastError) {
            resolve({ ok: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(resp);
          }
        });
      });
    }
  
    async function runAI(dialog, mode) {
      const editor = findEditor(dialog);
      if (!editor) return toast("Editor not found");
  
      const context = getContext(dialog);
      const userText = editor.innerText.trim();
  
      let prompt;
      if (mode === "summarize") {
        prompt = `Summarize the following email thread:\n\n${context}`;
        editor.innerText = "✳️ Summarizing with AI…";
      } else {
        // draft/rewriter
        prompt = userText
          ? `Rewrite this draft as a clear, concise, professional email:\n\n${userText}`
          : `Draft a polite, professional reply for this thread:\n\n${context}`;
        editor.innerText = "✳️ Generating with AI…";
      }
  
      const res = await sendMessage({ type: "AI_GENERATE", prompt, mode });
      if (!res || !res.ok) return toast("AI error: " + (res?.error || "unknown"));
      editor.innerText = res.text;
      toast(mode === "summarize" ? "AI summary ready ✓" : "AI draft ready ✓");
    }
  
    function injectButtons(dialog) {
      if (dialog.querySelector('.gaa-draft')) return;
  
      const draftBtn = document.createElement('button');
      draftBtn.className = 'gaa-btn gaa-draft';
      draftBtn.textContent = 'AI Draft';
      draftBtn.addEventListener('click', () => runAI(dialog, "draft"));
  
      const sumBtn = document.createElement('button');
      sumBtn.className = 'gaa-btn gaa-sum';
      sumBtn.textContent = 'Summarize';
      sumBtn.addEventListener('click', () => runAI(dialog, "summarize"));
  
      const toolbar = dialog.querySelector('div[aria-label="More options"]')?.parentElement || dialog;
      toolbar.appendChild(draftBtn);
      toolbar.appendChild(sumBtn);
    }
  
    // Observe compose dialogs
    const obs = new MutationObserver(() => {
      $$('div[role="dialog"]').forEach(d => {
        if (d.querySelector('[aria-label="Message Body"]')) injectButtons(d);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });
  
    // Hotkey: use the most recent dialog
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.type === "HOTKEY_AI") {
        const dialogs = $$('div[role="dialog"]');
        if (dialogs.length) runAI(dialogs[dialogs.length - 1], "draft");
      }
    });
  
    toast("Gmail AI Assist ready");
  })();
  
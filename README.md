# Gmail AI Assist

A Chrome extension that puts two buttons, "AI Draft" and "Summarize", next
to the toolbar in Gmail's compose and reply windows. Draft rewrites what you
have typed as a clear, professional email, or writes a reply from the thread
if the box is empty; Summarize turns the last few messages into 3-5 bullet
points. Calls go to [OpenRouter](https://openrouter.ai) with your own API key,
so you pick the model. I wrote it in September 2025; the whole idea was to
have the model in the compose window instead of in another tab.

## How it works

- Manifest V3. Permissions: `storage`, plus host access to
  `https://openrouter.ai/*`. Nothing else.
- `content/contentScript.js` watches for compose dialogs with a
  `MutationObserver`, injects the two buttons, and collects context: the last
  six visible messages in the thread plus your current draft, capped at the
  last 5,000 characters.
- `background.js` (service worker) makes the OpenRouter chat-completions call
  (temperature 0.5, max 500 tokens). Defaults: `openai/gpt-3.5-turbo` for
  drafting, `anthropic/claude-3-haiku` for summaries. Both are changeable on
  the options page, which also offers Mistral Tiny and `openrouter/auto`.
- Settings live in `chrome.storage.sync`.
- `Ctrl+Shift+A` runs Draft in the most recent compose window.

## Install (developer mode)

It is not on the Chrome Web Store.

1. Clone or download this repo.
2. Open `chrome://extensions/` and turn on Developer mode (top right).
3. Click "Load unpacked" and select the repo folder (the one containing
   `manifest.json`).
4. Open the extension's Options page, paste your OpenRouter key (it starts
   with `sk-or-`; the form only checks for `sk-`) and pick the models.
5. Open Gmail, click Compose or Reply, and the two buttons appear near the
   toolbar.

## Privacy

Nothing is collected or stored by me. The only data that leaves the browser
is the thread text and draft you choose to process, sent straight to
OpenRouter. The API key is kept in Chrome storage on your own profile.

## What I would change

- The buttons find Gmail's editor and toolbar by `aria-label` ("Message
  Body", "More options"), so a Gmail layout change or a non-English Gmail UI
  breaks the injection silently.
- The key is stored in `chrome.storage.sync`, which syncs it across every
  Chrome profile signed into the same account, in plain text. Local storage
  would be the safer default.
- No streaming and a 500-token cap, so long drafts get cut off.
- Generating replaces the draft box with a placeholder and then the result;
  there is no undo other than Gmail's own.
- The default drafting model, GPT-3.5 Turbo, is dated; the list on the
  options page should be refreshed.
- The hotkey only drafts; there is no shortcut for Summarize.
- No tests. The only check is loading it and trying it.

## License

MIT.

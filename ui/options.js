const apiKeyEl = document.getElementById("apiKey");
const draftEl  = document.getElementById("modelDraft");
const sumEl    = document.getElementById("modelSummary");
const statusEl = document.getElementById("status");

// Load
chrome.storage.sync.get(["openai_api_key", "model_draft", "model_summary"], (res) => {
  if (res.openai_api_key) apiKeyEl.value = res.openai_api_key;
  if (res.model_draft)  draftEl.value = res.model_draft;
  if (res.model_summary) sumEl.value = res.model_summary;
});

// Save
document.getElementById("save").addEventListener("click", () => {
  const apiKey  = apiKeyEl.value.trim();
  const draft   = draftEl.value;
  const summary = sumEl.value;

  if (!apiKey.startsWith("sk-")) {
    statusEl.textContent = "Invalid API key";
    statusEl.style.color = "#b00020";
    return;
  }
  chrome.storage.sync.set({
    openai_api_key: apiKey,
    model_draft: draft,
    model_summary: summary
  }, () => {
    statusEl.textContent = "Saved ✓";
    statusEl.style.color = "#0a7a0a";
  });
});

// Manifest V3 service worker for domain blocking via declarativeNetRequest

const FETCH_URLS = "url.json";

async function loadAndApplyRules() {
  try {
    const response = await fetch(chrome.runtime.getURL(FETCH_URLS));
    const data = await response.json();

    const blockedUrls = (data.BLOCKEDDOMAINS || []).map((item) => item.url);

    // Remove any existing dynamic rules first
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const removeRuleIds = existingRules.map((rule) => rule.id);

    // Build redirect rules for each blocked URL pattern
    // urlFilter in DNR is similar to match patterns but uses a slightly different syntax.
    // Patterns like "*://www.example.com/*" work well as urlFilter.
    const rules = blockedUrls.map((urlPattern, index) => ({
      id: index + 1,
      priority: 1,
      action: {
        type: "redirect",
        redirect: {
          extensionPath: "/redirect.html"
        }
      },
      condition: {
        urlFilter: urlPattern,
        resourceTypes: ["main_frame"]
      }
    }));

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: rules
    });

    console.log(`Applied ${rules.length} domain block rule(s).`);
  } catch (err) {
    console.error("Failed to load or apply block rules:", err);
  }
}

// Run on service worker startup / install / update
chrome.runtime.onInstalled.addListener(() => {
  loadAndApplyRules();
});

// Also run when the service worker starts (e.g. after browser restart)
loadAndApplyRules();

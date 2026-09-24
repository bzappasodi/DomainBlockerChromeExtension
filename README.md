# CSC Domain Block (Manifest V3)

Domain blocking Chrome extension converted from Manifest V2 to Manifest V3.

## Changes from the original (MV2)

- `manifest_version` updated to 3
- Background page replaced with a non-persistent service worker
- `browser_action` → `action`
- Blocking `webRequest` + `webRequestBlocking` replaced with `declarativeNetRequest` dynamic rules
- `chrome.extension.getURL` → `chrome.runtime.getURL`
- Fixed relative paths in `popup.html` and `redirect.html` (they previously used incorrect `../css` paths)
- Added proper `web_accessible_resources` format for MV3
- Host permissions moved to `host_permissions`

## How it works

On install / service worker start the background script:

1. Fetches `url.json`
2. Builds declarativeNetRequest rules that redirect matching main-frame navigations to the extension's `redirect.html`
3. Applies the rules via `chrome.declarativeNetRequest.updateDynamicRules`

To change the blocked domains, edit `url.json` and reload the extension (or trigger a re-install so the rules are refreshed).

## Install in Chrome / Chromium / Edge

1. Download / extract this folder
2. Open `chrome://extensions` (or `edge://extensions`)
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select this folder

The extension icon should appear in the toolbar.

## Example `url.json` format

```json
{
  "BLOCKEDDOMAINS": [
    { "url": "*://www.msnbc.com/*" },
    { "url": "*://code.org/*" },
    { "url": "*://www.cnn.com/*" }
  ]
}
```

Patterns use the same style as Chrome match patterns / DNR `urlFilter`.

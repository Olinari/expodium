import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,

  permissions: [
    "activeTab",
    "alarms",
    "background",
    "bookmarks",
    "browsingData",
    "clipboardRead",
    "clipboardWrite",
    "contentSettings",
    "contextMenus",
    "cookies",
    "debugger",
    "declarativeContent",
    "declarativeNetRequest",
    "declarativeWebRequest",
    "desktopCapture",
    "downloads",
    "downloads.shelf",
    "geolocation",
    "history",
    "identity",
    "idle",
    "management",
    "nativeMessaging",
    "notifications",
    "pageCapture",
    "power",
    "printerProvider",
    "proxy",
    "scripting",
    "search",
    "sessions",
    "storage",
    "system.cpu",
    "system.memory",
    "system.storage",
    "tabCapture",
    "tabs",
    "topSites",
    "tts",
    "ttsEngine",
    "unlimitedStorage",
    "vpnProvider",
    "webNavigation",
    "webRequest",
    "webRequestBlocking",
  ],
  host_permissions: [
    "http://*/*",
    "https://*/*",
    "file:///*",
    "ftp://*/*",
    "<all_urls>",
    "chrome://favicon/",
    "chrome://thumb/",
  ],

  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },

  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon-34.png",
  },
  chrome_url_overrides: {
    newtab: "src/pages/newtab/index.html",
  },
  icons: {
    "128": "icon-128.png",
  },
  content_scripts: [
    {
      matches: ["http://*/*", "https://*/*", "<all_urls>"],
      js: ["src/pages/content/index.js"],

      css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  devtools_page: "src/pages/devtools/index.html",
  web_accessible_resources: [
    {
      resources: [
        "sandbox.html",
        "assets/js/*.js",
        "assets/css/*.css",
        "icon-128.png",
        "icon-34.png",
      ],
      matches: ["*://*/*"],
    },
  ],
  sandbox: {
    pages: ["sandbox.html"],
  },
};

export default manifest;

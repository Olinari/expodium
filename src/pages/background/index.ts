import reloadOnUpdate from "virtual:reload-on-update-in-background-script";

import { BardService } from "@src/services/bard";
console.log("Background Loaded");

reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

const ImageSevice = new BardService();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      console.log(dataUrl);
    });
  }
});

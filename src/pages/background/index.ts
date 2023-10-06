import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { dataURLtoBlob } from "@src/utils/image-utils";

reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse({ status: "success", dataUrl: dataUrl.toString() });
    });
    return true;
  }
});

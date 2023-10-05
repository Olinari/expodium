import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import html2canvas from "html2canvas";

reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      console.log(dataUrl);
    });
  }
});

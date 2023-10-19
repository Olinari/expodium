import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import { dataURLtoBlob } from "@src/utils/image-utils";

reloadOnUpdate("pages/background");
reloadOnUpdate("pages/content/style.scss");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureScreenshot") {
    chrome.tabs.captureVisibleTab(
      null,
      { format: "jpeg", quality: 80 },
      (dataUrl) => {
        sendResponse({ status: "success", dataUrl: dataUrl.toString() });
      }
    );
    return true;
  }

  if (request.action === "capturePartialScreenshot") {
    const rect = request.rect;

    chrome.tabs.captureVisibleTab(
      null,
      { format: "jpeg", quality: 80 },
      async (dataUrl) => {
        try {
          const response = await fetch(dataUrl);
          const imgBlob = await response.blob();
          const offscreenCanvas = new OffscreenCanvas(rect.width, rect.height);
          const ctx = offscreenCanvas.getContext("2d");
          const imgBitmap = await createImageBitmap(imgBlob);

          ctx.drawImage(
            imgBitmap,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            0,
            0,
            rect.width,
            rect.height
          );
          const croppedBlob = await offscreenCanvas.convertToBlob({
            type: "image/jpeg",
            quality: 0.8,
          });

          const reader = new FileReader();
          reader.onloadend = function () {
            const croppedDataUrl = reader.result;
            sendResponse({ status: "success", dataUrl: croppedDataUrl });
          };
          reader.readAsDataURL(croppedBlob);
        } catch (error) {
          console.error("Failed to process the image:", error);
          sendResponse({
            status: "error",
            message: "Failed to process the image.",
          });
        }
      }
    );
    return true; // indicates the response is sent asynchronously
  }
});

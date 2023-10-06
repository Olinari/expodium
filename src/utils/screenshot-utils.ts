export const captureScreenshot = (onScreenshot) => {
  chrome.runtime.sendMessage({ action: "captureScreenshot" }, (response) => {
    onScreenshot(response);
  });
};

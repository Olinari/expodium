export const captureScreenshot = (onScreenshot) => {
  chrome.runtime.sendMessage({ action: "captureScreenshot" }, (response) => {
    onScreenshot(response);
  });
};

export const capturePartialScreenshot = (
  rect: { x: number; y: number; width: number; height: number },
  onScreenshot: (response: any) => void
) => {
  chrome.runtime.sendMessage(
    { action: "capturePartialScreenshot", rect: rect },
    (response) => {
      console.log(response);
      onScreenshot(response);
    }
  );
};

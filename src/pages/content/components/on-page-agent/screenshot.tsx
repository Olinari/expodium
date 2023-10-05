import React from "react";

function ScreenshotComponent() {
  const captureScreenshot = () => {
    console.log("ScreenShot");
    chrome.runtime.sendMessage({ action: "captureScreenshot" });
  };

  return (
    <div>
      <button onClick={captureScreenshot}>Capture Screenshot</button>
    </div>
  );
}

export default ScreenshotComponent;

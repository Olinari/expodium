import { useState, useEffect } from "react";
import _ from "lodash";
import { captureScreenshot } from "@src/utils/screenshot-utils";

function useScrollScreenshot(
  onScreenshot: (data: { dataUrl: string }) => void
) {
  const [chatInitialized, setChatInitialized] = useState(false);

  const handleScroll = _.debounce(() => {
    if (!chatInitialized) {
      setChatInitialized(true);
      captureScreenshot(onScreenshot);
    }
  }, 3000);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  }, []);

  return { chatInitialized, setChatInitialized };
}

export default useScrollScreenshot;

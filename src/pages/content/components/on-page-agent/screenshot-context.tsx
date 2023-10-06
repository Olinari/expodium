import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { captureScreenshot } from "@src/utils/screenshot-utils";
import { dataURLtoBlob, minifyPng } from "@src/utils/image-utils";
import { BardService } from "@src/services/bard";
import _ from "lodash";

const Bard = new BardService();

interface ScreenShotContextType {
  viewDescription: string | null;
  setViewDescription: React.Dispatch<React.SetStateAction<string | null>>;
  chat: typeof Bard.chat;
}

interface ScreenShotProviderProps {
  children: ReactNode;
}

const ScreenShotContext = createContext<ScreenShotContextType | undefined>(
  undefined
);

export const useScreenShotContext = (): ScreenShotContextType => {
  return useContext(ScreenShotContext);
};

export function ScreenShotProvider({ children }: ScreenShotProviderProps) {
  const [viewDescription, setViewDescription] = useState<string | null>(null);

  const [chatInitialized, setChatInitialized] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    Bard.chat.create();
    return () => {
      document.removeEventListener("scroll", handleScroll);
      Bard.chat.end();
    };
  }, []);

  const onScreenshot = async ({ dataUrl }: { dataUrl: string }) => {
    const compressedData = await minifyPng(dataUrl, 3);
    const processedScreenshot = await dataURLtoBlob(compressedData);
    try {
      const screenshotBrief = await Bard.chat.image(
        processedScreenshot,
        "please describe the UI in simple words, briefly describing the content and list main actions (refer text on buttons).be as brief and concise as possible."
      );
      console.log(screenshotBrief);
      setViewDescription(screenshotBrief);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScroll = _.debounce(() => {
    if (!chatInitialized) {
      setChatInitialized(true);
    }
    captureScreenshot(onScreenshot);
  }, 3000);

  return (
    <ScreenShotContext.Provider
      value={{ viewDescription, setViewDescription, chat: Bard.chat }}
    >
      {children}
    </ScreenShotContext.Provider>
  );
}

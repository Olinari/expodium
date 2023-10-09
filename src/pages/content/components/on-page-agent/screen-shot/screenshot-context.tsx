import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { captureScreenshot } from "@src/utils/screenshot-utils";
import { dataURLtoBlob, minifyPng } from "@src/utils/image-utils";
import _ from "lodash";
import { useChatContext } from "../chat-provider";
import { getPageDetails } from "@src/utils/webpage-utils";

interface ScreenShotContextType {
  viewDescription: string | null;
  setViewDescription: React.Dispatch<React.SetStateAction<string | null>>;
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
  const { chat } = useChatContext();

  const onScreenshot = async ({ dataUrl }: { dataUrl: string }) => {
    const compressedData = await minifyPng(dataUrl, 3);
    const processedScreenshot = await dataURLtoBlob(compressedData);
    useScrollScreenshot(onScreenshot);

    try {
      const { audio } = await chat.image(
        processedScreenshot,
        getExplainScreenShotPrompt()
      );

      const audioObject = new Audio(audio);
      audioObject.play();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScreenShotContext.Provider value={{ viewDescription, setViewDescription }}>
      {children}
    </ScreenShotContext.Provider>
  );
}

const getExplainScreenShotPrompt = () => {
  const pageDetails = getPageDetails();

  if (parseInt(pageDetails["Scroll Percentage"]) < 1) {
    return `Describe in 250 characters the UI in this screenshot in simple words, briefly describing the content, and list main actions. Be as brief and concise as possible. Make sure every reference you make is **actually in the UI** and that you have covered all the content and components on the screen. To avoid confusion please respond with ***only the description***. page details:${JSON.stringify(
      pageDetails
    )}`;
  } else {
    return `Scrolled:${pageDetails["Scroll Percentage"]}%  Describe in 250 characters the UI in this screenshot in simple words, briefly describing the content, and list main actions. Be as brief and concise as possible. Make sure every reference you make is **actually in the UI** and that you have covered all the content and components on the screen. To avoid confusion please respond with ***only the description***`;
  }
};

function useScrollScreenshot(
  onScreenshot: (data: { dataUrl: string }) => void
) {
  const [chatInitialized, setChatInitialized] = useState(false);

  const handleScroll = _.debounce(() => {
    if (!chatInitialized) {
      setChatInitialized(true);
    }
    captureScreenshot(onScreenshot);
  }, 3000);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { chatInitialized, setChatInitialized };
}

export default useScrollScreenshot;

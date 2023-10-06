import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { captureScreenshot } from "@src/utils/screenshot-utils";
import { compressBlob, dataURLtoBlob } from "@src/utils/image-utils";
import { BardService } from "@src/services/bard";
import _ from "lodash";
const Bard = new BardService();
interface ScreenShotContextType {
  viewDescription: string | null;
  setViewDescription: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ScreenShotProviderProps {
  children: ReactNode;
}

const ScreenShotContextProvider = createContext<
  ScreenShotContextType | undefined
>(undefined);

export const useScreenShotContext = (): ScreenShotContextType => {
  return useContext(ScreenShotContextProvider);
};

export function ScreenShotContext({ children }: ScreenShotProviderProps) {
  const [viewDescription, setViewDescription] = useState<string | null>(null);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const onScreenshot = async ({ dataUrl }: { dataUrl: string }) => {
    const blob = await dataURLtoBlob(dataUrl);
    try {
      const screenshotbrief = await Bard.analyzeImage(
        blob,
        "please decribe the UI in simple words short describing the content shortly and list main actions(refer text on buttons)"
      );
      console.log(screenshotbrief);
      setViewDescription(screenshotbrief);
    } catch (error) {
      console.log(error);
    }
  };

  const handleScroll = _.debounce(() => {
    captureScreenshot(onScreenshot);
  }, 3000);

  return (
    <ScreenShotContextProvider.Provider
      value={{ viewDescription, setViewDescription }}
    >
      {children}
    </ScreenShotContextProvider.Provider>
  );
}

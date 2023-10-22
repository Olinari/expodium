import React, { createContext, ReactNode, useContext, useState } from "react";

import { dataURLtoBlob, minifyPng } from "@src/utils/image-utils";
import { useChatContext } from "@pages/content/components/on-page-agent/chat-provider";
import { captureScreenshot } from "@src/utils/screenshot-utils";
import { useScrollController } from "@pages/content/components/on-page-agent/scroll-controller";
import { DoctrService } from "@src/services/doctr";
import { useUiHelpersContext } from "@pages/content/components/on-page-agent/ui-helpers-context";
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
  const { promptChatWithImage } = useChatContext();

  const { analyzeImage } = new DoctrService();

  const { updateUiHelperControls } = useUiHelpersContext();

  const handleScreenShot = async (onScrollEnd?: () => void) => {
    captureScreenshot(async ({ dataUrl }: { dataUrl: string }) => {
      const compressedData = await minifyPng(dataUrl, 2);
      const processedScreenshot = dataURLtoBlob(compressedData);

      try {
        const imageData = await analyzeImage(processedScreenshot);

        updateUiHelperControls(imageData);
        await promptChatWithImage(
          processedScreenshot,
          getExplainScreenShotPrompt(),
          "audio"
        );

        onScrollEnd?.();
      } catch (error) {
        console.error(error);
      }
    });
  };

  useScrollController(handleScreenShot);

  return (
    <ScreenShotContext.Provider value={{ viewDescription, setViewDescription }}>
      {children}
    </ScreenShotContext.Provider>
  );
}

const getExplainScreenShotPrompt = () => {
  const pageDetails = getPageDetails();

  if (parseInt(pageDetails["Scroll Percentage"]) < 1) {
    return `The image attached is a website screen shot of the user's viewport.respond ***ONLY***
          .with the following JSON, filled with accurate data. double check that any data you fill in is corresponding with the images I sent you.
          page details:${pageDetails}
          Fil in this JSON:
          {
          view: //E.G Hero section, about, features items, news section,portfolio,chat,forum,video-player,gallery etc., 
          description: //200 chars max what is the purpose of section?,
          actions://what action are possible on this section. e.g read article, sign in, download,buy, search, playa audio/video,comment etc.
          }:{
          view:string,
          description:string,
          actions:string[]
          }
          
         This time respond only with the json. no text before, no text after. your response is my data. avoid Template literals and string interpolation`;
  } else {
    return `Scrolled:${pageDetails["Scroll Percentage"]}%  Describe in 250 characters the UI in this screenshot in simple words, briefly describing the content, and list main actions. Be as brief and concise as possible. Make sure every reference you make is **actually in the UI** and that you have covered all the content and components on the screen. To avoid confusion please respond with ***only the description***`;
  }
};

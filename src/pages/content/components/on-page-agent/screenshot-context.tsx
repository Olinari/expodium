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
          getExplainScreenShotPrompt()
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

  return `As a language model, analyze the image attached. This is a website screenshot of a viewport. respond ***ONLY***
          with the text of the following JSON, filled with accurate data. double check that any data you fill in is corresponding with the images I sent you!!!!.
          page details:${pageDetails}
          Fil in this JSON:
          {
          view: //e.g Hero section, about, features items, news section,portfolio,chat,forum,video-player,gallery etc., 
          SectionComponents: //200  what are it the main components that exist in the image of the section? what information do they hold?,
          actions://what action are possible on this section. e.g read article, sign in, download,buy, search, playa audio/video,comment etc.
          }:{
          view:string,
          description:string,
          actions:string[]
          }
          
         This time respond only with the json. no text before, no text after. make sure all the components stated do exists in the image. dont summarize dont prefix dont state anything.just generate text for the JSON`;
};

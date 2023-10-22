import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { BardService } from "@src/services/bard";
import { getHTMLElmentFromRect } from "@src/utils/webpage-utils";
import { playAudio } from "@src/utils/audio-utils";
import { capturePartialScreenshot } from "@src/utils/screenshot-utils";
import { dataURLtoBlob } from "@src/utils/image-utils";

const Bard = new BardService();
type ResponseType = "audio" | "text";

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ChatContextType {
  chat: typeof Bard.chat;
  promptChatWithElement: (element: Rect) => void;
  promptChatWithImage: (
    image: any,
    prompt: string,
    response: ResponseType
  ) => Promise<string | null>;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = (): ChatContextType => {
  return useContext(ChatContext);
};

export function ChatProvider({ children }: ChatProviderProps) {
  useEffect(() => {
    Bard.chat.create();
    return () => {
      Bard.chat.end();
    };
  }, []);

  const promptChatWithImage = async (
    image: File | Blob,
    prompt: string,
    response: ResponseType
  ) => {
    try {
      const { audio, response: text } = await Bard.chat.image(image, prompt);
      if (response === "audio") {
        await playAudio(audio);
      } else if (response === "text") {
        console.log(text);
        return text;
      }
      return null;
    } catch (error) {
      console.error(error);
    }
  };

  const promptChatWithElement = (element: Rect & { tag?: string }) => {
    const markup = getHTMLElmentFromRect(
      element.x - 0.5 * element.width,
      element.y - 0.5 * element.height,
      element.width,
      element.height,
      element.tag
    ).innerHTML;
    capturePartialScreenshot(
      {
        x: element.x * 2 - element.width,
        y: element.y * 2 - element.height,
        width: element.width * 2,
        height: element.height * 2,
      },
      ({ dataUrl }) => {
        console.log(dataUrl, markup);
        promptChatWithImage(
          dataURLtoBlob(dataUrl),
          `The attached image and the following HTML are representing an element on the page I've previously sent. respond ***ONLY***
          .with the following JSON, filled with accurate data. double check that any data you fill in is corresponding with the images I sent you.
          markup:${markup}
          Fil in this JSON:
          {
          componentType: //The HTML component e.g div or button,
          description: //200 chars max what is the purpose of this element?,
          actions://what action are possible on this div. options are :['click','input','navigate']
          }:{
          componentType:string,
          description:string,
   
          }
          
         This time respond only with the json. no text before, no text after. no summaries. JUST THE JSON. your response is my data 
   `,
          "audio"
        );
      }
    );
  };

  return (
    <ChatContext.Provider
      value={{ chat: Bard.chat, promptChatWithImage, promptChatWithElement }}
    >
      {children}
    </ChatContext.Provider>
  );
}

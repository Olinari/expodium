import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { BardService } from "@src/services/bard";
import { playAudio } from "@src/utils/audio-utils";
import { capturePartialScreenshot } from "@src/utils/screenshot-utils";
import { dataURLtoBlob } from "@src/utils/image-utils";

const Bard = new BardService();

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ChatContextType {
  chat: typeof Bard.chat;
  promptChatWithElement: (element: Rect, markup: string) => Promise<string>;
  promptChatWithImage: (
    image: Blob | File,
    prompt: string
  ) => Promise<string | null>;
}

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = (): ChatContextType => {
  return useContext(ChatContext);
};

const initializeChat = () => {
  Bard.chat.create();
};

const terminateChat = () => {
  Bard.chat.end();
};

const sendImageToChat = async (image: File | Blob, prompt: string) => {
  try {
    const { audio, response: text } = await Bard.chat.image(image, prompt);
    await playAudio(audio);
    return text;
  } catch (error) {
    console.error(error);
    return null; // Return null or some default value in case of an error
  }
};

const captureAndChatWithElement = (rect, markup) => {
  return new Promise<string>((resolve, reject) => {
    capturePartialScreenshot(rect, ({ dataUrl }) => {
      sendImageToChat(dataURLtoBlob(dataUrl), createPrompt(markup))
        .then((textResponse: string) => {
          resolve(textResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
};

const createPrompt = (markup: string) => {
  return `The attached image and the following HTML are representing an element on the page I've previously sent. respond ***ONLY***
          .with the following JSON, filled with accurate data. Double check that any data you fill in corresponds with the images I sent you.
          markup: ${markup}
          Fill in this JSON:
          {
            componentType: //The HTML component e.g div or button,
            description: //200 chars max what is the purpose of this element?,
            actions://what action are possible on this div. options are :['click','input','navigate']
          }:{
            componentType:string,
            description:string,
            actions:string[]
          }
          This time respond only with the json. No text before, no text after. No summaries. JUST THE JSON. Your response is my data.`;
};

export function ChatProvider({ children }: ChatProviderProps) {
  useEffect(() => {
    initializeChat();
    return terminateChat;
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chat: Bard.chat,
        promptChatWithImage: sendImageToChat,
        promptChatWithElement: captureAndChatWithElement,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

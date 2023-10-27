import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { BardService } from "@src/services/bard";
import { playAudio } from "@src/utils/audio-utils";
import { capturePartialScreenshot } from "@src/utils/screenshot-utils";
import { dataURLtoBlob } from "@src/utils/image-utils";
import { createPromptFormElement } from "@pages/content/components/on-page-agent/prompts";

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

const promptChatWithImage = async (image: File | Blob, prompt: string) => {
  try {
    const { audio, response: text } = await Bard.chat.image(image, prompt);
    await playAudio(audio);
    return text;
  } catch (error) {
    console.error(error);
    return null; // Return null or some default value in case of an error
  }
};

const promptChatWithElement = (rect, markup) => {
  return new Promise<string>((resolve, reject) => {
    capturePartialScreenshot(rect, ({ dataUrl }) => {
      promptChatWithImage(
        dataURLtoBlob(dataUrl),
        createPromptFormElement(markup)
      )
        .then((textResponse: string) => {
          resolve(textResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
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
        promptChatWithImage,
        promptChatWithElement,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { BardService } from "@src/services/bard";
import { getHTMLElmentFromRect } from "@src/utils/webpage-utils";
import { loadAudio, playAudio } from "@src/utils/audio-utils";
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
      const loadingAudioPath = await loadAudio("please-wait.m4a");
      if (loadingAudioPath) {
        //avoid await here to prevent delaying the fetch
        playAudio(loadingAudioPath);
      }

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
    );
    capturePartialScreenshot(
      {
        x: element.x,
        y: element.y,
        width: element.width * 2,
        height: element.height * 2,
      },
      ({ dataUrl }) => {
        promptChatWithImage(
          dataURLtoBlob(dataUrl),
          `What this button do? ${markup}`,
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

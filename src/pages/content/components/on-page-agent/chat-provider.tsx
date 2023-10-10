import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { BardService } from "@src/services/bard";
import { getPageDetails } from "@src/utils/webpage-utils";

const Bard = new BardService();
type ResponseType = "audio" | "text";
interface ChatContextType {
  chat: typeof Bard.chat;
  promptChatWithImage: (
    image: any,
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
    response: ResponseType
  ) => {
    try {
      const { audio, response: text } = await Bard.chat.image(
        image,
        getExplainScreenShotPrompt()
      );
      if (response === "audio") {
        const audioObject = new Audio(audio);
        await audioObject.play();
      } else if (response === "text") {
        return text;
      }
      return null;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ChatContext.Provider value={{ chat: Bard.chat, promptChatWithImage }}>
      {children}
    </ChatContext.Provider>
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

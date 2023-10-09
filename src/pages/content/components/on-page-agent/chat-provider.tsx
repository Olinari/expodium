import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { BardService } from "@src/services/bard";

const Bard = new BardService();

interface ChatContextType {
  chat: typeof Bard.chat;
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

  return (
    <ChatContext.Provider value={{ chat: Bard.chat }}>
      {children}
    </ChatContext.Provider>
  );
}

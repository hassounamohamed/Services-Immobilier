import { createContext, ReactNode, useContext, useState } from "react";

type Message = { id: string; text: string; from: string; to: string; createdAt: number };
type ChatValue = {
  messages: Message[];
  send: (text: string, to: string) => void;
};

const ChatContext = createContext<ChatValue | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  function send(text: string, to: string) {
    setMessages((prev) => [...prev, { id: Math.random().toString(36).slice(2), text, to, from: "me", createdAt: Date.now() }]);
  }
  return <ChatContext.Provider value={{ messages, send }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}

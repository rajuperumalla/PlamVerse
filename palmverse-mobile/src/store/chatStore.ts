import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface ChatState {
  messages: ChatMessage[];
  add: (m: Omit<ChatMessage, "id" | "ts">) => void;
  clear: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: "sys-1",
      role: "system",
      text: "Welcome to PalmVerse. Your editor will message you here.",
      ts: Date.now(),
    },
  ],
  add: (m) =>
    set((s) => ({
      messages: [
        ...s.messages,
        { ...m, id: `${Date.now()}-${Math.random()}`, ts: Date.now() },
      ],
    })),
  clear: () => set({ messages: [] }),
}));

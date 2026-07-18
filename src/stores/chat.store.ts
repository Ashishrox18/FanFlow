/**
 * @fileoverview Zustand store for the AI chat assistant state.
 * Manages message history and loading states.
 */

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { ChatMessage, Language } from "@/types";

// ─── State Shape ──────────────────────────────────────────────────────────────

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useChatStore = create<ChatState>()((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
    })),

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearMessages: () => set({ messages: [], error: null }),
}));

// ─── Selectors ────────────────────────────────────────────────────────────────

/**
 * Returns the last N messages in the conversation.
 * Uses shallow equality to prevent infinite re-renders from new array references.
 */
export function useRecentMessages(count = 20) {
  return useChatStore(useShallow((s) => s.messages.slice(-count)));
}

/**
 * Returns messages filtered by language.
 * Uses shallow equality to prevent infinite re-renders from new array references.
 */
export function useMessagesByLanguage(language: Language) {
  return useChatStore(useShallow((s) => s.messages.filter((m) => m.language === language)));
}

/**
 * @fileoverview useAssistant — Custom hook for the AI multilingual chat assistant.
 * Encapsulates message state, API calls, debouncing, and error handling.
 */

"use client";

import { useCallback } from "react";
import { useChatStore } from "@/stores/chat.store";
import { useAppStore } from "@/stores/app.store";
import type { AssistantResponse, ApiResponse } from "@/types";

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Provides send/clear actions for the AI assistant chat.
 * Reads selected stadium and language from global store.
 */
export function useAssistant() {
  const { addMessage, setLoading, setError, clearMessages, isLoading, error } = useChatStore();
  const { language, selectedStadiumId } = useAppStore();

  const sendMessage = useCallback(
    async (userMessage: string): Promise<void> => {
      if (!userMessage.trim()) return;

      addMessage({ role: "user", content: userMessage, language });
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            language,
            stadiumId: selectedStadiumId,
          }),
        });

        const result: ApiResponse<AssistantResponse> =
          (await response.json()) as ApiResponse<AssistantResponse>;

        if (!result.success) {
          setError(result.error);
          addMessage({
            role: "assistant",
            content: "I'm sorry, I couldn't process that request. Please try again.",
            language,
          });
          return;
        }

        addMessage({
          role: "assistant",
          content: result.data.answer,
          language,
        });
      } catch {
        setError("Network error. Please check your connection.");
        addMessage({
          role: "assistant",
          content: "I'm offline right now. Please check your internet connection.",
          language,
        });
      } finally {
        setLoading(false);
      }
    },
    [addMessage, setLoading, setError, language, selectedStadiumId],
  );

  return {
    sendMessage,
    clearMessages,
    isLoading,
    error,
  };
}

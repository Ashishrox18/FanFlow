import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAssistant } from "@/hooks/useAssistant";
import { useChatStore } from "@/stores/chat.store";
import { useAppStore } from "@/stores/app.store";

describe("useAssistant hook", () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages();
    useAppStore.setState({ language: "English", selectedStadiumId: "sofi" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("adds user message and fetches AI response successfully", async () => {
    const mockResponse = {
      success: true,
      data: {
        answer: "Welcome to SoFi Stadium!",
        category: "General",
        suggestedActions: ["View seats", "Exit"],
      },
    };

    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useAssistant());

    let sendPromise: Promise<void> | undefined;
    act(() => {
      sendPromise = result.current.sendMessage("Hi there");
    });

    // Verify loading states while loading
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await sendPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    const messages = useChatStore.getState().messages;
    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe("user");
    expect(messages[0].content).toBe("Hi there");
    expect(messages[1].role).toBe("assistant");
    expect(messages[1].content).toBe("Welcome to SoFi Stadium!");

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/ai/assistant",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          message: "Hi there",
          language: "English",
          stadiumId: "sofi",
        }),
      }),
    );
  });

  it("handles api response failures gracefully", async () => {
    const mockResponse = {
      success: false,
      error: "LLM rate limit reached",
    };

    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useAssistant());

    await act(async () => {
      await result.current.sendMessage("Fail query");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("LLM rate limit reached");

    const messages = useChatStore.getState().messages;
    expect(messages).toHaveLength(2);
    expect(messages[1].content).toBe("I'm sorry, I couldn't process that request. Please try again.");
  });

  it("handles network crash/exception offline scenario", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Offline")));

    const { result } = renderHook(() => useAssistant());

    await act(async () => {
      await result.current.sendMessage("Crash please");
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Network error. Please check your connection.");

    const messages = useChatStore.getState().messages;
    expect(messages).toHaveLength(2);
    expect(messages[1].content).toBe("I'm offline right now. Please check your internet connection.");
  });

  it("avoids sending empty or whitespace-only messages", async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useAssistant());

    await act(async () => {
      await result.current.sendMessage("   ");
    });

    expect(mockFetch).not.toHaveBeenCalled();
    const messages = useChatStore.getState().messages;
    expect(messages).toHaveLength(0);
  });
});

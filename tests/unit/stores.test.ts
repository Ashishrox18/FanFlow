import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAppStore, useSelectedStadium } from "@/stores/app.store";
import { useChatStore, useRecentMessages, useMessagesByLanguage } from "@/stores/chat.store";
import { STADIUMS_DATA } from "@/lib/constants";

// ─── App Store ────────────────────────────────────────────────────────────────

describe("useAppStore", () => {
  beforeEach(() => {
    // Reset store to defaults before each test
    useAppStore.setState({
      selectedStadiumId: STADIUMS_DATA[0].id,
      language: "English",
      isAccessibilityMode: false,
      isDarkMode: true,
    });
  });

  it("has correct default values", () => {
    const state = useAppStore.getState();
    expect(state.selectedStadiumId).toBe(STADIUMS_DATA[0].id);
    expect(state.language).toBe("English");
    expect(state.isAccessibilityMode).toBe(false);
    expect(state.isDarkMode).toBe(true);
  });

  it("selectStadium updates selectedStadiumId", () => {
    act(() => {
      useAppStore.getState().selectStadium("sofi");
    });
    expect(useAppStore.getState().selectedStadiumId).toBe("sofi");
  });

  it("setLanguage updates language", () => {
    act(() => {
      useAppStore.getState().setLanguage("Spanish");
    });
    expect(useAppStore.getState().language).toBe("Spanish");
  });

  it("toggleAccessibilityMode flips the mode", () => {
    expect(useAppStore.getState().isAccessibilityMode).toBe(false);
    act(() => {
      useAppStore.getState().toggleAccessibilityMode();
    });
    expect(useAppStore.getState().isAccessibilityMode).toBe(true);
    act(() => {
      useAppStore.getState().toggleAccessibilityMode();
    });
    expect(useAppStore.getState().isAccessibilityMode).toBe(false);
  });

  it("toggleDarkMode flips the mode", () => {
    expect(useAppStore.getState().isDarkMode).toBe(true);
    act(() => {
      useAppStore.getState().toggleDarkMode();
    });
    expect(useAppStore.getState().isDarkMode).toBe(false);
  });
});

describe("useSelectedStadium", () => {
  beforeEach(() => {
    useAppStore.setState({ selectedStadiumId: STADIUMS_DATA[0].id });
  });

  it("returns the first stadium by default", () => {
    const { result } = renderHook(() => useSelectedStadium());
    expect(result.current.id).toBe(STADIUMS_DATA[0].id);
  });

  it("returns the selected stadium after change", () => {
    act(() => {
      useAppStore.getState().selectStadium("sofi");
    });
    const { result } = renderHook(() => useSelectedStadium());
    expect(result.current.id).toBe("sofi");
    expect(result.current.name).toBe("SoFi Stadium");
  });

  it("falls back to first stadium for invalid id", () => {
    act(() => {
      useAppStore.getState().selectStadium("invalid-id");
    });
    const { result } = renderHook(() => useSelectedStadium());
    expect(result.current).toEqual(STADIUMS_DATA[0]);
  });
});

// ─── Chat Store ───────────────────────────────────────────────────────────────

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages();
    useChatStore.setState({ isLoading: false, error: null });
  });

  it("starts with empty messages and no loading/error state", () => {
    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(0);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("addMessage appends a message with id and timestamp", () => {
    act(() => {
      useChatStore.getState().addMessage({
        role: "user",
        content: "Hello",
        language: "English",
      });
    });
    const { messages } = useChatStore.getState();
    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe("Hello");
    expect(messages[0].role).toBe("user");
    expect(messages[0].id).toBeTruthy();
    expect(messages[0].timestamp).toBeInstanceOf(Date);
  });

  it("addMessage generates unique ids", () => {
    act(() => {
      useChatStore.getState().addMessage({ role: "user", content: "a", language: "English" });
      useChatStore.getState().addMessage({ role: "user", content: "b", language: "English" });
    });
    const { messages } = useChatStore.getState();
    expect(messages[0].id).not.toBe(messages[1].id);
  });

  it("setLoading updates loading state", () => {
    act(() => useChatStore.getState().setLoading(true));
    expect(useChatStore.getState().isLoading).toBe(true);
    act(() => useChatStore.getState().setLoading(false));
    expect(useChatStore.getState().isLoading).toBe(false);
  });

  it("setError updates error state", () => {
    act(() => useChatStore.getState().setError("Network failure"));
    expect(useChatStore.getState().error).toBe("Network failure");
    act(() => useChatStore.getState().setError(null));
    expect(useChatStore.getState().error).toBeNull();
  });

  it("clearMessages resets messages and error", () => {
    act(() => {
      useChatStore.getState().addMessage({ role: "user", content: "hi", language: "English" });
      useChatStore.getState().setError("Something failed");
    });
    act(() => useChatStore.getState().clearMessages());
    expect(useChatStore.getState().messages).toHaveLength(0);
    expect(useChatStore.getState().error).toBeNull();
  });
});

describe("useRecentMessages", () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages();
    // Add 5 messages
    for (let i = 0; i < 5; i++) {
      useChatStore
        .getState()
        .addMessage({ role: "user", content: `Message ${i}`, language: "English" });
    }
  });

  it("returns last N messages via selector hook", () => {
    const { result } = renderHook(() => useRecentMessages(3));
    expect(result.current).toHaveLength(3);
    expect(result.current[2].content).toBe("Message 4");
  });

  it("returns all messages when count exceeds total", () => {
    const { result } = renderHook(() => useRecentMessages(100));
    expect(result.current).toHaveLength(5);
  });
});

describe("useMessagesByLanguage", () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages();
    useChatStore
      .getState()
      .addMessage({ role: "user", content: "English msg", language: "English" });
    useChatStore
      .getState()
      .addMessage({ role: "user", content: "Spanish msg", language: "Spanish" });
    useChatStore
      .getState()
      .addMessage({ role: "user", content: "English msg 2", language: "English" });
  });

  it("filters English messages via selector hook", () => {
    const { result } = renderHook(() => useMessagesByLanguage("English"));
    expect(result.current).toHaveLength(2);
    result.current.forEach((m) => expect(m.language).toBe("English"));
  });

  it("returns empty array for unrepresented language", () => {
    const { result } = renderHook(() => useMessagesByLanguage("Arabic"));
    expect(result.current).toHaveLength(0);
  });
});

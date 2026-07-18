import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { callGroq } from "@/services/ai/groq.service";
import { AIError, AIValidationError, AITimeoutError } from "@/lib/errors";

const mockCreate = vi.fn();

vi.mock("groq-sdk", () => {
  return {
    default: class MockGroq {
      chat = {
        completions: {
          create: mockCreate,
        },
      };
    },
  };
});

describe("callGroq", () => {
  beforeEach(() => {
    vi.stubEnv("GROQ_API_KEY", "mock-groq-key");
    mockCreate.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns parsed JSON on successful response", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: '{"success":true}' } }],
    });

    const result = await callGroq<{ success: boolean }>("system", "user");
    expect(result).toEqual({ success: true });
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: [
          { role: "system", content: "system" },
          { role: "user", content: "user" },
        ],
      }),
      expect.anything(),
    );
  });

  it("throws AIValidationError on invalid JSON", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "invalid-json" } }],
    });

    await expect(callGroq("sys", "usr")).rejects.toThrow(AIValidationError);
  });

  it("throws AIError on empty content", async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: "" } }],
    });

    await expect(callGroq("sys", "usr")).rejects.toThrow(AIError);
  });

  it("throws AIError when API key is missing", async () => {
    vi.stubEnv("GROQ_API_KEY", "");
    await expect(callGroq("sys", "usr")).rejects.toThrow(/GROQ_API_KEY/);
  });

  it("throws AITimeoutError on abort/timeout signal", async () => {
    // Force a mock delay or mock abort error rejection
    const abortError = new Error("aborted");
    abortError.name = "AbortError";
    mockCreate.mockRejectedValue(abortError);

    await expect(callGroq("sys", "usr")).rejects.toThrow(AITimeoutError);
  });

  it("throws generic AIError on SDK rejection", async () => {
    mockCreate.mockRejectedValue(new Error("API Limit reached"));
    await expect(callGroq("sys", "usr")).rejects.toThrow(AIError);
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { callGemini } from "@/services/ai/gemini.service";
import { AIError, AIValidationError } from "@/lib/errors";

const mockGenerateContent = vi.fn();

vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: class MockGoogleGenerativeAI {
      getGenerativeModel = vi.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent,
      }));
    },
  };
});

describe("callGemini", () => {
  beforeEach(() => {
    vi.stubEnv("GEMINI_API_KEY", "mock-gemini-key");
    mockGenerateContent.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns parsed JSON on successful response", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => '{"success":true}',
      },
    });

    const result = await callGemini<{ success: boolean }>("system", "user");
    expect(result).toEqual({ success: true });
  });

  it("throws AIValidationError on invalid JSON", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => "invalid-json",
      },
    });

    await expect(callGemini("sys", "usr")).rejects.toThrow(AIValidationError);
  });

  it("throws AIError on empty content", async () => {
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => "",
      },
    });

    await expect(callGemini("sys", "usr")).rejects.toThrow(AIError);
  });

  it("throws AIError when API key is missing", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    await expect(callGemini("sys", "usr")).rejects.toThrow(/GEMINI_API_KEY/);
  });

  it("throws generic AIError on SDK rejection", async () => {
    mockGenerateContent.mockRejectedValue(new Error("Gemini quota exceeded"));
    await expect(callGemini("sys", "usr")).rejects.toThrow(AIError);
  });
});

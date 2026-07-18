import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST as POST_arrival } from "@/app/api/ai/arrival/route";
import { NextRequest } from "next/server";
import { callGroq } from "@/services/ai/groq.service";
import { AIError } from "@/lib/errors";

// Mock Groq service module
vi.mock("@/services/ai/groq.service", () => ({
  callGroq: vi.fn(),
}));

describe("API LLM error propagation scenarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const makeRequest = (body: Record<string, unknown>) => {
    return new NextRequest("http://localhost:3000/api/ai/arrival", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  const validBody = {
    stadiumId: "sofi",
    currentLocation: "West gate lot",
    transportMode: "Metro",
    desiredArrivalTime: "18:00",
    language: "English",
  };

  it("returns 502 status code when LLM returns invalid JSON schema", async () => {
    // LLM response missing recommendedGate or other fields
    const invalidSchemaResponse = {
      somethingElse: "invalid",
    };

    vi.mocked(callGroq).mockResolvedValue(invalidSchemaResponse);

    const res = await POST_arrival(makeRequest(validBody));
    expect(res.status).toBe(502);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.code).toBe("AI_VALIDATION_ERROR");
  });

  it("returns 502 status code when LLM service throws an error", async () => {
    vi.mocked(callGroq).mockRejectedValue(new AIError("API authentication failed", "gemini"));

    const res = await POST_arrival(makeRequest(validBody));
    expect(res.status).toBe(502);

    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.code).toBe("AI_ERROR");
  });
});

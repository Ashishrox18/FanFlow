/**
 * Integration tests for POST /api/ai/assistant.
 * Mocks Groq so no real API calls are made.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/ai/assistant/route";

// ─── Mock Groq ────────────────────────────────────────────────────────────────

vi.mock("groq-sdk", () => {
  return {
    default: class MockGroq {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    answer: "Gate A is on the north side.",
                    category: "Navigation",
                    suggestedActions: ["Follow the green signs"],
                  }),
                },
              },
            ],
          }),
        },
      };
    },
  };
});

// ─── Mock env ─────────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.stubEnv("GROQ_API_KEY", "test-groq-key");
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/ai/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/ai/assistant", () => {
  it("returns 200 with valid assistant response", async () => {
    const req = makeRequest({
      message: "Where is Gate A?",
      language: "English",
      stadiumId: "metlife",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.answer).toBeTruthy();
    expect(json.data.category).toBe("Navigation");
  });

  it("returns 400 for missing message field", async () => {
    const req = makeRequest({ language: "English", stadiumId: "metlife" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 400 for empty message", async () => {
    const req = makeRequest({ message: "", language: "English", stadiumId: "metlife" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid language", async () => {
    const req = makeRequest({
      message: "Hello",
      language: "Klingon",
      stadiumId: "metlife",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/assistant", {
      method: "POST",
      body: "not-json",
      headers: { "Content-Type": "text/plain" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("INVALID_JSON");
  });

  it("uses the stadium name from STADIUMS_DATA", async () => {
    const req = makeRequest({
      message: "Hello",
      language: "English",
      stadiumId: "sofi",
    });
    const res = await POST(req);
    // Success even for valid non-metlife stadiums
    expect(res.status).toBe(200);
  });

  it("falls back to generic stadium name for unknown stadiumId", async () => {
    const req = makeRequest({
      message: "Hello",
      language: "English",
      stadiumId: "unknown-stadium",
    });
    const res = await POST(req);
    // Should still succeed, just using fallback name
    expect(res.status).toBe(200);
  });

  it("accepts all supported languages", async () => {
    const languages = ["English", "Spanish", "French", "Portuguese", "Hindi", "Japanese", "Arabic"];
    for (const language of languages) {
      const req = makeRequest({ message: "Hello", language, stadiumId: "metlife" });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }
  });
});

describe("GET /api/ai/assistant", () => {
  it("returns 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.code).toBe("METHOD_NOT_ALLOWED");
  });
});

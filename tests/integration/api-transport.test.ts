import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/ai/transport/route";
import type { TransportMode } from "@/types";

const mockTransportResponse = {
  recommendedMode: "Metro",
  estimatedTime: "15 minutes",
  estimatedCost: "$2.75",
  instructions: ["Walk to MetLife Stadium station", "Take Train Line 1 north"],
  congestionLevel: "Low",
  alternative: null,
  reason: "Train avoids matchday vehicle road blocks",
};

vi.mock("groq-sdk", () => {
  return {
    default: class MockGroq {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockTransportResponse) } }],
          }),
        },
      };
    },
  };
});

beforeEach(() => {
  vi.stubEnv("GROQ_API_KEY", "test-groq-key");
});

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/ai/transport", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  stadiumId: "metlife",
  phase: "before",
  userLocation: "Secaucus Junction",
  preferredMode: "Metro",
  language: "English",
};

describe("POST /api/ai/transport", () => {
  it("returns 200 with valid transport recommendation plan", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.recommendedMode).toBe("Metro");
  });

  it("returns 400 for invalid preferredMode", async () => {
    const res = await POST(
      makeRequest({ ...validBody, preferredMode: "Submarine" as unknown as TransportMode }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing phase", async () => {
    const body = { ...validBody };
    delete (body as any).phase;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it("works without optional preferredMode field", async () => {
    const body = { ...validBody };
    delete (body as any).preferredMode;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(200);
  });
});

describe("GET /api/ai/transport", () => {
  it("returns 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const json = await res.json();
    expect(json.code).toBe("METHOD_NOT_ALLOWED");
  });
});

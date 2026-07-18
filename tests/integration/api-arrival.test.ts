/**
 * Integration tests for POST /api/ai/arrival.
 * Mocks Groq SDK to avoid real API calls.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/ai/arrival/route";

// ─── Mock Groq ────────────────────────────────────────────────────────────────

const mockArrivalResponse = {
  recommendedGate: "Gate B",
  bestArrivalWindow: "5:30 PM - 6:00 PM",
  expectedCrowdLevel: "Medium",
  walkingDistance: "350 metres",
  walkingTime: "5 minutes",
  reason: "Shortest route from Metro",
  alternative: "Gate C has lower crowds",
  tips: ["Take the Metro", "Arrive early"],
};

vi.mock("groq-sdk", () => {
  return {
    default: class MockGroq {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockArrivalResponse) } }],
          }),
        },
      };
    },
  };
});

beforeEach(() => {
  vi.stubEnv("GROQ_API_KEY", "test-groq-key");
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/ai/arrival", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  stadiumId: "metlife",
  currentLocation: "Manhattan, NY",
  transportMode: "Metro",
  desiredArrivalTime: "2026-07-20T18:00:00Z",
  language: "English",
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/ai/arrival", () => {
  it("returns 200 with a valid arrival plan", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.recommendedGate).toBe("Gate B");
    expect(json.data.expectedCrowdLevel).toBe("Medium");
  });

  it("returns the full valid schema shape", async () => {
    const res = await POST(makeRequest(validBody));
    const json = await res.json();
    expect(json.data).toHaveProperty("recommendedGate");
    expect(json.data).toHaveProperty("bestArrivalWindow");
    expect(json.data).toHaveProperty("walkingDistance");
    expect(json.data).toHaveProperty("walkingTime");
    expect(json.data).toHaveProperty("reason");
    expect(json.data).toHaveProperty("alternative");
    expect(Array.isArray(json.data.tips)).toBe(true);
  });

  it("returns 400 for missing stadiumId", async () => {
    const body = { ...validBody };
    delete (body as Partial<typeof validBody>).stadiumId;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 400 for invalid transport mode", async () => {
    const res = await POST(makeRequest({ ...validBody, transportMode: "Hovercraft" as unknown as string }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing currentLocation", async () => {
    const body = { ...validBody };
    delete (body as Partial<typeof validBody>).currentLocation;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing desiredArrivalTime", async () => {
    const body = { ...validBody };
    delete (body as Partial<typeof validBody>).desiredArrivalTime;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it("works without optional language field", async () => {
    const body = { ...validBody };
    delete (body as Partial<typeof validBody>).language;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(200);
  });

  it("accepts all valid transport modes", async () => {
    const modes = ["Metro", "Bus", "Taxi", "Walking", "Ride-share"];
    for (const transportMode of modes) {
      const res = await POST(makeRequest({ ...validBody, transportMode }));
      expect(res.status).toBe(200);
    }
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("http://localhost:3000/api/ai/arrival", {
      method: "POST",
      body: "{{invalid}}",
      headers: { "Content-Type": "text/plain" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("GET /api/ai/arrival", () => {
  it("returns 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const json = await res.json();
    expect(json.code).toBe("METHOD_NOT_ALLOWED");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/ai/navigation/route";
import type { NavigationDestination } from "@/types";

const mockNavigationResponse = {
  shortestRoute: [
    { stepNumber: 1, instruction: "Head north to gate", isAccessible: true },
  ],
  leastCrowdedRoute: [
    { stepNumber: 1, instruction: "Take the east elevator", isAccessible: true },
  ],
  walkingTime: "4 minutes",
  alternativeOption: "Wait 5 mins for crowd to clear",
  avoidStairs: false,
  crowdLevel: "Low",
  reason: "Elevator route avoids stairs and restrooms congestion",
};

vi.mock("groq-sdk", () => {
  return {
    default: class MockGroq {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockNavigationResponse) } }],
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
  return new NextRequest("http://localhost:3000/api/ai/navigation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  stadiumId: "metlife",
  from: "Gate A",
  destination: "Seat",
  seatNumber: "Section 101, Row 5, Seat 12",
  isAccessibilityMode: false,
  language: "English",
};

describe("POST /api/ai/navigation", () => {
  it("returns 200 with valid navigation plan", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.walkingTime).toBe("4 minutes");
  });

  it("returns 400 for invalid destination", async () => {
    const res = await POST(
      makeRequest({ ...validBody, destination: "Parking Lot" as unknown as NavigationDestination }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing from location", async () => {
    const body = { ...validBody };
    delete (body as any).from;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it("works without optional seatNumber field", async () => {
    const body = { ...validBody };
    delete (body as any).seatNumber;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(200);
  });
});

describe("GET /api/ai/navigation", () => {
  it("returns 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const json = await res.json();
    expect(json.code).toBe("METHOD_NOT_ALLOWED");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST, GET } from "@/app/api/ai/emergency/route";

const mockEmergencyResponse = {
  immediateAction: "Please proceed to Gate C",
  steps: ["Stay calm", "Walk, do not run", "Listen to staff announcements"],
  contactNumber: "+1-800-555-0199",
  nearestExit: "Gate C",
  estimatedResponseTime: "2 minutes",
};

vi.mock("groq-sdk", () => {
  return {
    default: class MockGroq {
      chat = {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify(mockEmergencyResponse) } }],
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
  return new NextRequest("http://localhost:3000/api/ai/emergency", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  stadiumId: "metlife",
  type: "Medical",
  location: "Section 110",
  language: "English",
};

describe("POST /api/ai/emergency", () => {
  it("returns 200 with valid emergency response plan", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.immediateAction).toBe("Please proceed to Gate C");
  });

  it("returns 400 for invalid emergency type", async () => {
    const res = await POST(makeRequest({ ...validBody, type: "Alien Invasion" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing location", async () => {
    const body = { ...validBody };
    delete (body as any).location;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
  });

  it("works without optional language field", async () => {
    const body = { ...validBody };
    delete (body as any).language;
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(200);
  });
});

describe("GET /api/ai/emergency", () => {
  it("returns 405 Method Not Allowed", async () => {
    const res = await GET();
    expect(res.status).toBe(405);
    const json = await res.json();
    expect(json.code).toBe("METHOD_NOT_ALLOWED");
  });
});

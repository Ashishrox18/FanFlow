/**
 * Integration tests for GET /api/crowd.
 * Tests the crowd intelligence endpoint without external dependencies.
 */

import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/crowd/route";

// Mock getTimeSeed for deterministic crowd data
vi.mock("@/lib/utils", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/utils")>();
  return { ...original, getTimeSeed: vi.fn(() => 42) };
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeGetRequest(stadiumId?: string): NextRequest {
  const url = stadiumId
    ? `http://localhost:3000/api/crowd?stadiumId=${encodeURIComponent(stadiumId)}`
    : "http://localhost:3000/api/crowd";
  return new NextRequest(url, { method: "GET" });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("GET /api/crowd", () => {
  it("returns 200 with valid crowd snapshot for metlife", async () => {
    const res = await GET(makeGetRequest("metlife"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.stadiumId).toBe("metlife");
    expect(Array.isArray(json.data.zones)).toBe(true);
    expect(json.data.zones.length).toBeGreaterThan(0);
  });

  it("returns 400 when stadiumId is missing", async () => {
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.code).toBe("VALIDATION_ERROR");
  });

  it("returns a valid CrowdLevel for overallLevel", async () => {
    const res = await GET(makeGetRequest("sofi"));
    const json = await res.json();
    expect(["Low", "Medium", "High"]).toContain(json.data.overallLevel);
  });

  it("each zone has required fields", async () => {
    const res = await GET(makeGetRequest("azteca"));
    const json = await res.json();
    json.data.zones.forEach(
      (zone: {
        id: string;
        name: string;
        type: string;
        crowdLevel: string;
        capacityPercent: number;
        waitTimeMinutes: number;
        isOperational: boolean;
      }) => {
        expect(zone.id).toBeTruthy();
        expect(zone.name).toBeTruthy();
        expect(typeof zone.capacityPercent).toBe("number");
        expect(zone.capacityPercent).toBeGreaterThanOrEqual(0);
        expect(zone.capacityPercent).toBeLessThanOrEqual(100);
        expect(["Low", "Medium", "High"]).toContain(zone.crowdLevel);
      },
    );
  });

  it("returns no-store cache-control header", async () => {
    const res = await GET(makeGetRequest("metlife"));
    expect(res.headers.get("Cache-Control")).toContain("no-store");
  });

  it("returns X-Content-Type-Options: nosniff header", async () => {
    const res = await GET(makeGetRequest("metlife"));
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("returns a valid ISO timestamp", async () => {
    const res = await GET(makeGetRequest("metlife"));
    const json = await res.json();
    expect(() => new Date(json.data.timestamp).toISOString()).not.toThrow();
  });

  it("works for all supported stadium IDs", async () => {
    const stadiums = ["metlife", "sofi", "azteca", "bmo", "atandt", "nrg"];
    for (const id of stadiums) {
      const res = await GET(makeGetRequest(id));
      expect(res.status).toBe(200);
    }
  });
});

describe("POST /api/crowd", () => {
  it("returns 405 Method Not Allowed", async () => {
    const res = await POST();
    expect(res.status).toBe(405);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.code).toBe("METHOD_NOT_ALLOWED");
  });
});

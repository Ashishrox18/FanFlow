import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateCrowdSnapshot, filterZonesByType } from "@/services/crowd/crowd.service";
import type { CrowdSnapshot } from "@/types";

// Mock getTimeSeed to return a fixed value for deterministic tests
vi.mock("@/lib/utils", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/utils")>();
  return {
    ...original,
    getTimeSeed: vi.fn(() => 42),
  };
});

describe("generateCrowdSnapshot", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a snapshot with the correct stadiumId", () => {
    const snapshot = generateCrowdSnapshot("metlife");
    expect(snapshot.stadiumId).toBe("metlife");
  });

  it("returns a snapshot with a valid ISO timestamp", () => {
    const snapshot = generateCrowdSnapshot("metlife");
    expect(() => new Date(snapshot.timestamp)).not.toThrow();
    expect(new Date(snapshot.timestamp).toISOString()).toBe(snapshot.timestamp);
  });

  it("returns exactly 16 zones", () => {
    const snapshot = generateCrowdSnapshot("metlife");
    expect(snapshot.zones).toHaveLength(16);
  });

  it("every zone has required fields", () => {
    const snapshot = generateCrowdSnapshot("sofi");
    snapshot.zones.forEach((zone) => {
      expect(zone.id).toBeTruthy();
      expect(zone.name).toBeTruthy();
      expect(["Food", "Restroom", "Medical", "Merchandise", "Information", "Exit"]).toContain(
        zone.type,
      );
      expect(["Low", "Medium", "High"]).toContain(zone.crowdLevel);
      expect(zone.capacityPercent).toBeGreaterThanOrEqual(0);
      expect(zone.capacityPercent).toBeLessThanOrEqual(100);
      expect(zone.waitTimeMinutes).toBeGreaterThanOrEqual(0);
      expect(typeof zone.isOperational).toBe("boolean");
    });
  });

  it("overallLevel is a valid CrowdLevel", () => {
    const snapshot = generateCrowdSnapshot("azteca");
    expect(["Low", "Medium", "High"]).toContain(snapshot.overallLevel);
  });

  it("is deterministic for the same seed (mocked to 42)", () => {
    const snap1 = generateCrowdSnapshot("metlife");
    const snap2 = generateCrowdSnapshot("metlife");
    // Same seed → same zone crowd levels
    snap1.zones.forEach((zone, i) => {
      expect(zone.crowdLevel).toBe(snap2.zones[i].crowdLevel);
    });
  });

  it("produces different results for different stadia with same seed", () => {
    const metlife = generateCrowdSnapshot("metlife");
    const sofi = generateCrowdSnapshot("sofi");
    // At least some zones should differ due to different zone ID hashing
    const levels1 = metlife.zones.map((z) => z.crowdLevel).join(",");
    const levels2 = sofi.zones.map((z) => z.crowdLevel).join(",");
    expect(levels1).not.toBe(levels2);
  });

  it("includes Food zones", () => {
    const snapshot = generateCrowdSnapshot("metlife");
    const foodZones = snapshot.zones.filter((z) => z.type === "Food");
    expect(foodZones.length).toBeGreaterThan(0);
  });

  it("includes Medical zone", () => {
    const snapshot = generateCrowdSnapshot("metlife");
    const medicalZones = snapshot.zones.filter((z) => z.type === "Medical");
    expect(medicalZones.length).toBeGreaterThan(0);
  });
});

describe("filterZonesByType", () => {
  const makeSnapshot = (): CrowdSnapshot => generateCrowdSnapshot("metlife");

  it("filters to only Food zones", () => {
    const snapshot = makeSnapshot();
    const result = filterZonesByType(snapshot, "Food");
    result.forEach((z) => expect(z.type).toBe("Food"));
  });

  it("filters to only Medical zones", () => {
    const snapshot = makeSnapshot();
    const result = filterZonesByType(snapshot, "Medical");
    result.forEach((z) => expect(z.type).toBe("Medical"));
  });

  it("returns empty array for a type with no zones", () => {
    // Create a snapshot with all Food zones, then filter for Merchandise
    const snapshot: CrowdSnapshot = {
      stadiumId: "test",
      timestamp: new Date().toISOString(),
      zones: [
        {
          id: "food-1",
          name: "Food Court",
          type: "Food",
          crowdLevel: "Low",
          capacityPercent: 20,
          waitTimeMinutes: 2,
          isOperational: true,
        },
      ],
      overallLevel: "Low",
    };
    expect(filterZonesByType(snapshot, "Merchandise")).toHaveLength(0);
  });

  it("returns all zones when type matches all", () => {
    const snapshot: CrowdSnapshot = {
      stadiumId: "test",
      timestamp: new Date().toISOString(),
      zones: [
        {
          id: "exit-1",
          name: "Exit A",
          type: "Exit",
          crowdLevel: "Low",
          capacityPercent: 10,
          waitTimeMinutes: 0,
          isOperational: true,
        },
        {
          id: "exit-2",
          name: "Exit B",
          type: "Exit",
          crowdLevel: "Medium",
          capacityPercent: 50,
          waitTimeMinutes: 5,
          isOperational: true,
        },
      ],
      overallLevel: "Low",
    };
    expect(filterZonesByType(snapshot, "Exit")).toHaveLength(2);
  });
});

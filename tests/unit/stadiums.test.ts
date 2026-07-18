import { describe, it, expect } from "vitest";
import { STADIUMS_DATA } from "@/lib/constants";

describe("Stadiums configuration data", () => {
  it("defines coordinates, timezone, and capacity properties for all stadiums", () => {
    expect(STADIUMS_DATA).toHaveLength(6);

    STADIUMS_DATA.forEach((stadium) => {
      expect(stadium.id).toBeDefined();
      expect(stadium.name).toBeDefined();
      expect(stadium.city).toBeDefined();
      expect(stadium.country).toBeDefined();
      expect(stadium.capacity).toBeGreaterThan(10000);
      expect(stadium.lat).toBeGreaterThan(-90);
      expect(stadium.lat).toBeLessThan(90);
      expect(stadium.lng).toBeGreaterThan(-180);
      expect(stadium.lng).toBeLessThan(180);
      expect(stadium.timezone).toMatch(/^America\//);
    });
  });

  it("has correct matching configurations for standard IDs", () => {
    const metlife = STADIUMS_DATA.find((s) => s.id === "metlife");
    expect(metlife).toBeDefined();
    expect(metlife?.city).toBe("East Rutherford");
    expect(metlife?.capacity).toBe(82500);

    const sofi = STADIUMS_DATA.find((s) => s.id === "sofi");
    expect(sofi).toBeDefined();
    expect(sofi?.city).toBe("Inglewood");
  });
});

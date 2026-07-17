import { describe, it, expect } from "vitest";
import { checkRateLimit, sanitiseInput, simulateCrowdLevel } from "@/lib/utils";

describe("Utils", () => {
  describe("checkRateLimit", () => {
    it("should allow first request", () => {
      const result = checkRateLimit("test-ip-1", 10, 60000);
      expect(result.allowed).toBe(true);
    });

    it("should block request if max requests exceeded", () => {
      checkRateLimit("test-ip-2", 1, 60000);
      const result2 = checkRateLimit("test-ip-2", 1, 60000);
      expect(result2.allowed).toBe(false);
      expect(result2.retryAfterMs).toBeGreaterThan(0);
    });
  });

  describe("sanitiseInput", () => {
    it("should remove HTML tags", () => {
      const input = "<script>alert('xss')</script>Hello";
      expect(sanitiseInput(input)).toBe("alert(xss)Hello");
    });
    
    it("should truncate to max length", () => {
      const input = "a".repeat(600);
      expect(sanitiseInput(input, 500).length).toBe(500);
    });
  });

  describe("simulateCrowdLevel", () => {
    it("should be deterministic for the same seed and zone", () => {
      const level1 = simulateCrowdLevel("zone-a", 12345);
      const level2 = simulateCrowdLevel("zone-a", 12345);
      expect(level1).toBe(level2);
    });

    it("should change based on seed", () => {
      // Very likely to be different with different seeds, but technically could randomly be same.
      // Testing the concept.
      const levels = [1, 2, 3, 4, 5].map(seed => simulateCrowdLevel("zone-a", seed));
      const hasVariation = new Set(levels).size > 1;
      expect(hasVariation).toBe(true);
    });
  });
});

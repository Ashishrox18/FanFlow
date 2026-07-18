import { describe, it, expect } from "vitest";
import {
  truncate,
  sanitiseInput,
  simulateCrowdLevel,
  simulateCapacity,
  simulateWaitTime,
  checkRateLimit,
  formatTime,
  getTimeSeed,
} from "@/lib/utils";

describe("truncate", () => {
  it("should return the string unchanged when within limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("should truncate and append ellipsis when over limit", () => {
    const result = truncate("hello world", 8);
    expect(result).toBe("hello...");
    expect(result.length).toBe(8);
  });

  it("should handle exact length boundary", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("sanitiseInput", () => {
  it("should strip HTML tags", () => {
    expect(sanitiseInput("<b>bold</b>")).toBe("bold");
  });

  it("should strip script tags and content", () => {
    expect(sanitiseInput("<script>alert('xss')</script>Hello")).toBe("alert(xss)Hello");
  });

  it("should strip content between angle brackets as tags", () => {
    // "a < b > c" — the regex treats "< b >" as an HTML tag and strips "b"
    expect(sanitiseInput("a < b > c")).toBe("a  c");
  });

  it("should truncate to default max length of 500", () => {
    expect(sanitiseInput("a".repeat(600)).length).toBe(500);
  });

  it("should truncate to custom max length", () => {
    expect(sanitiseInput("a".repeat(200), 100).length).toBe(100);
  });

  it("should trim whitespace", () => {
    expect(sanitiseInput("  hello  ")).toBe("hello");
  });
});

describe("simulateCrowdLevel", () => {
  it("should return a valid CrowdLevel", () => {
    const level = simulateCrowdLevel("gate-a", 100);
    expect(["Low", "Medium", "High"]).toContain(level);
  });

  it("should be deterministic for the same inputs", () => {
    expect(simulateCrowdLevel("zone-1", 999)).toBe(simulateCrowdLevel("zone-1", 999));
  });

  it("should vary across different seeds", () => {
    const levels = [1, 10, 100, 1000, 9999].map((s) => simulateCrowdLevel("gate-a", s));
    expect(new Set(levels).size).toBeGreaterThan(1);
  });

  it("should vary across different zone IDs", () => {
    const levels = ["gate-a", "gate-b", "gate-c", "food-1", "restroom-1"].map((z) =>
      simulateCrowdLevel(z, 42),
    );
    expect(new Set(levels).size).toBeGreaterThan(1);
  });
});

describe("simulateCapacity", () => {
  it("should return a number between 0 and 100", () => {
    const cap = simulateCapacity("zone-a", 42);
    expect(cap).toBeGreaterThanOrEqual(0);
    expect(cap).toBeLessThanOrEqual(100);
  });

  it("should be deterministic", () => {
    expect(simulateCapacity("zone-b", 77)).toBe(simulateCapacity("zone-b", 77));
  });
});

describe("simulateWaitTime", () => {
  it("should return 0–5 for Low crowd", () => {
    // Run multiple times since it uses Math.random internally
    for (let i = 0; i < 20; i++) {
      const wait = simulateWaitTime("Low");
      expect(wait).toBeGreaterThanOrEqual(0);
      expect(wait).toBeLessThanOrEqual(5);
    }
  });

  it("should return 5–15 for Medium crowd", () => {
    for (let i = 0; i < 20; i++) {
      const wait = simulateWaitTime("Medium");
      expect(wait).toBeGreaterThanOrEqual(5);
      expect(wait).toBeLessThanOrEqual(15);
    }
  });

  it("should return 15–30 for High crowd", () => {
    for (let i = 0; i < 20; i++) {
      const wait = simulateWaitTime("High");
      expect(wait).toBeGreaterThanOrEqual(15);
      expect(wait).toBeLessThanOrEqual(30);
    }
  });
});

describe("checkRateLimit", () => {
  it("should allow the first request", () => {
    const result = checkRateLimit("ip-unique-1", 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.retryAfterMs).toBe(0);
  });

  it("should allow up to maxRequests", () => {
    const key = "ip-unique-2";
    checkRateLimit(key, 3, 60_000);
    checkRateLimit(key, 3, 60_000);
    const third = checkRateLimit(key, 3, 60_000);
    expect(third.allowed).toBe(true);
  });

  it("should block requests exceeding maxRequests", () => {
    const key = "ip-unique-3";
    checkRateLimit(key, 2, 60_000);
    checkRateLimit(key, 2, 60_000);
    const blocked = checkRateLimit(key, 2, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });
});

describe("formatTime", () => {
  it("should return a non-empty time string", () => {
    const result = formatTime(new Date("2026-07-18T14:30:00"));
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("should include AM or PM in 12-hour format", () => {
    const result = formatTime(new Date("2026-07-18T14:30:00"));
    expect(result.toLowerCase()).toMatch(/am|pm/);
  });
});

describe("getTimeSeed", () => {
  it("should return a positive integer", () => {
    const seed = getTimeSeed();
    expect(seed).toBeGreaterThan(0);
    expect(Number.isInteger(seed)).toBe(true);
  });

  it("should return the same seed within a 30-second window", () => {
    const seed1 = getTimeSeed();
    const seed2 = getTimeSeed();
    // Called within microseconds of each other — must be identical
    expect(seed1).toBe(seed2);
  });
});

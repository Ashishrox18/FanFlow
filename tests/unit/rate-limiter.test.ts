import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { checkRateLimit } from "@/lib/utils";

describe("checkRateLimit utility", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests below threshold", () => {
    const key = "ip-test-1";
    const result1 = checkRateLimit(key, 3, 10000);
    expect(result1.allowed).toBe(true);
    expect(result1.retryAfterMs).toBe(0);

    const result2 = checkRateLimit(key, 3, 10000);
    expect(result2.allowed).toBe(true);

    const result3 = checkRateLimit(key, 3, 10000);
    expect(result3.allowed).toBe(true);
  });

  it("rejects requests exceeding limit within the window", () => {
    const key = "ip-test-2";
    // 3 requests allowed
    checkRateLimit(key, 3, 10000);
    checkRateLimit(key, 3, 10000);
    checkRateLimit(key, 3, 10000);

    const result = checkRateLimit(key, 3, 10000);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterMs).toBeGreaterThan(0);
    expect(result.retryAfterMs).toBeLessThanOrEqual(10000);
  });

  it("resets limits when window time expires", () => {
    const key = "ip-test-3";
    checkRateLimit(key, 1, 5000);
    const blockedResult = checkRateLimit(key, 1, 5000);
    expect(blockedResult.allowed).toBe(false);

    // Fast forward window time
    vi.advanceTimersByTime(5001);

    const allowedResult = checkRateLimit(key, 1, 5000);
    expect(allowedResult.allowed).toBe(true);
  });
});

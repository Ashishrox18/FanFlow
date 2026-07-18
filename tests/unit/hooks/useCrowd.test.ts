import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCrowd } from "@/hooks/useCrowd";
import { CROWD_REFRESH_INTERVAL_MS } from "@/lib/constants";

describe("useCrowd hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("polls and retrieves crowd snapshot details successfully", async () => {
    const mockSnapshot = {
      stadiumId: "sofi",
      stadiumName: "SoFi Stadium",
      timestamp: "2026-07-18T12:00:00Z",
      zones: [
        { zoneId: "Gate A", zoneName: "Gate A Entrance", crowdLevel: "Low", capacityPercent: 12, waitTimeMinutes: 2, status: "Open" },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: mockSnapshot }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useCrowd("sofi"));

    expect(result.current.isLoading).toBe(true);

    // Run pending promises for initial mount fetch
    await act(async () => {
      await vi.runAllTicks();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.snapshot).toEqual(mockSnapshot);
    expect(result.current.error).toBeNull();
    expect(result.current.lastUpdated).toBeInstanceOf(Date);

    // Fast-forward interval
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: { ...mockSnapshot, timestamp: "2026-07-18T12:00:30Z" },
      }),
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CROWD_REFRESH_INTERVAL_MS);
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("retains previous state and updates error on failed fetches", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: false, error: "Database lock error" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useCrowd("metlife"));

    await act(async () => {
      await vi.runAllTicks();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.snapshot).toBeNull();
    expect(result.current.error).toBe("Database lock error");
  });

  it("handles exception throws during API connections cleanly", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Timeout")));

    const { result } = renderHook(() => useCrowd("sofi"));

    await act(async () => {
      await vi.runAllTicks();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Failed to load crowd data");
  });

  it("cleans up polling intervals on unmount", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: {} }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { unmount } = renderHook(() => useCrowd("sofi"));

    await act(async () => {
      await vi.runAllTicks();
    });

    unmount();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(CROWD_REFRESH_INTERVAL_MS * 2);
    });

    // Should only have been called once on initial mount
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});

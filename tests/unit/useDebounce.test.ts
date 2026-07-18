import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 300));
    expect(result.current).toBe("hello");
  });

  it("does not update immediately when value changes", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "updated" });
    // Before delay, still shows old value
    expect(result.current).toBe("initial");
  });

  it("updates after the delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "initial" },
    });

    rerender({ value: "updated" });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toBe("updated");
  });

  it("cancels previous timer on rapid updates", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(150)); // Halfway through
    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(150)); // Original timer would have fired
    // Should still be "a" since "c"'s timer hasn't completed
    expect(result.current).toBe("a");

    act(() => vi.advanceTimersByTime(150)); // Complete "c"'s timer
    expect(result.current).toBe("c");
  });

  it("uses default delay of 300ms", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: "first" },
    });

    rerender({ value: "second" });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe("first");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("second");
  });

  it("works with number values", () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 0 },
    });

    rerender({ value: 42 });
    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe(42);
  });

  it("works with object values", () => {
    const initial = { name: "initial" };
    const updated = { name: "updated" };
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: initial },
    });

    rerender({ value: updated });
    act(() => vi.advanceTimersByTime(300));
    expect(result.current).toEqual(updated);
  });
});

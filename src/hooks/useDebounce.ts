/**
 * @fileoverview useDebounce — Debounces a rapidly-changing value.
 */

"use client";

import { useState, useEffect } from "react";

/**
 * Returns a debounced version of the given value.
 * Only updates after the specified delay with no further changes.
 *
 * @param value - The value to debounce
 * @param delayMs - Debounce delay in milliseconds
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

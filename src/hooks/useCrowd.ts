/**
 * @fileoverview useCrowd — Custom hook for live crowd intelligence data.
 * Polls the crowd API on a refresh interval and caches results.
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { CrowdSnapshot, ApiResponse } from "@/types";
import { CROWD_REFRESH_INTERVAL_MS } from "@/lib/constants";

interface UseCrowdResult {
  snapshot: CrowdSnapshot | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdated: Date | null;
}

/**
 * Fetches and auto-refreshes crowd data for a given stadium.
 * Uses a cleanup-safe polling interval.
 *
 * @param stadiumId - The stadium to fetch crowd data for
 */
export function useCrowd(stadiumId: string): UseCrowdResult {
  const [snapshot, setSnapshot] = useState<CrowdSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCrowd = useCallback(async () => {
    try {
      const res = await fetch(`/api/crowd?stadiumId=${encodeURIComponent(stadiumId)}`, {
        cache: "no-store",
      });
      const result: ApiResponse<CrowdSnapshot> = (await res.json()) as ApiResponse<CrowdSnapshot>;

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSnapshot(result.data);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("Failed to load crowd data");
    } finally {
      setIsLoading(false);
    }
  }, [stadiumId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    void fetchCrowd();

    intervalRef.current = setInterval(() => {
      void fetchCrowd();
    }, CROWD_REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchCrowd]);

  return { snapshot, isLoading, error, refresh: fetchCrowd, lastUpdated };
}

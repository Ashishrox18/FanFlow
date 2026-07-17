/**
 * @fileoverview Shared utility functions for FanFlow AI.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CrowdLevel } from "@/types";

// ─── Tailwind ─────────────────────────────────────────────────────────────────

/**
 * Merges Tailwind CSS class names safely, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple in-memory rate limiter.
 * @param key - Unique identifier (e.g., IP address)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Whether the request is allowed and ms until reset
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, retryAfterMs: 0 };
}

// ─── Crowd Simulation ─────────────────────────────────────────────────────────

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Produces deterministic crowd levels based on time and zone ID.
 */
function seededRandom(seed: number): number {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Generates a simulated crowd level for a zone based on time and zone ID.
 * Crowd peaks before match start (t-60min to t+15min).
 */
export function simulateCrowdLevel(zoneId: string, seed: number): CrowdLevel {
  const hash = zoneId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const random = seededRandom(seed + hash);
  if (random < 0.33) return "Low";
  if (random < 0.66) return "Medium";
  return "High";
}

/**
 * Returns a simulated capacity percentage for a zone.
 */
export function simulateCapacity(zoneId: string, seed: number): number {
  const hash = zoneId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const random = seededRandom(seed + hash + 1000);
  return Math.round(random * 100);
}

/**
 * Returns simulated wait time in minutes.
 */
export function simulateWaitTime(crowdLevel: CrowdLevel): number {
  const waitMap: Record<CrowdLevel, [number, number]> = {
    Low: [0, 5],
    Medium: [5, 15],
    High: [15, 30],
  };
  const [min, max] = waitMap[crowdLevel];
  return Math.round(min + Math.random() * (max - min));
}

// ─── String Utils ─────────────────────────────────────────────────────────────

/**
 * Safely truncates a string to a maximum length, appending ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Sanitises user-provided text to prevent XSS in AI prompts.
 * Strips HTML tags and limits length.
 */
export function sanitiseInput(input: string, maxLength = 500): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/[<>&"']/g, "")
    .trim()
    .slice(0, maxLength);
}

// ─── Date Utils ───────────────────────────────────────────────────────────────

/**
 * Formats a Date object to a human-readable time string.
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Returns a time-based seed for crowd simulation.
 * Changes every 30 seconds for realistic variation.
 */
export function getTimeSeed(): number {
  return Math.floor(Date.now() / 30_000);
}

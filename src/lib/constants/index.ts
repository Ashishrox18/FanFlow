/**
 * @fileoverview Application-wide constants for FanFlow AI.
 * Single source of truth for configuration values.
 */

// ─── App ──────────────────────────────────────────────────────────────────────

export const APP_NAME = "FanFlow AI" as const;
export const APP_TAGLINE = "Your intelligent matchday assistant." as const;
export const APP_VERSION = "1.0.0" as const;

// ─── Rate Limiting ────────────────────────────────────────────────────────────

/** Max AI requests per window per IP */
export const RATE_LIMIT_MAX_REQUESTS = 30 as const;
/** Rate limit window in milliseconds (1 minute) */
export const RATE_LIMIT_WINDOW_MS = 60_000 as const;

// ─── AI ───────────────────────────────────────────────────────────────────────

export const GROQ_MODEL = "llama-3.3-70b-versatile" as const;
export const GEMINI_MODEL = "gemini-1.5-flash" as const;
export const AI_TEMPERATURE = 0.3 as const;
export const AI_MAX_TOKENS = 1024 as const;
export const AI_TIMEOUT_MS = 15_000 as const;

// ─── Crowd Simulation ─────────────────────────────────────────────────────────

/** How often crowd data refreshes (ms) */
export const CROWD_REFRESH_INTERVAL_MS = 30_000 as const;
/** Seed for deterministic simulation */
export const CROWD_SIMULATION_SEED = 42 as const;

// ─── Navigation ───────────────────────────────────────────────────────────────

export const NAVIGATION_DESTINATIONS = [
  "Seat",
  "Food",
  "Restroom",
  "Medical",
  "Merchandise",
  "AccessibilityRoute",
] as const;

// ─── Languages ────────────────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
] as const;

// ─── Transport Modes ──────────────────────────────────────────────────────────

export const TRANSPORT_MODES = [
  { id: "Metro", label: "Metro", icon: "train" },
  { id: "Bus", label: "Bus", icon: "bus" },
  { id: "Taxi", label: "Taxi", icon: "car" },
  { id: "Walking", label: "Walking", icon: "footprints" },
  { id: "Ride-share", label: "Ride-share", icon: "smartphone" },
] as const;

// ─── Stadiums ─────────────────────────────────────────────────────────────────

export const STADIUMS_DATA = [
  {
    id: "metlife",
    name: "MetLife Stadium",
    city: "East Rutherford",
    country: "USA",
    capacity: 82_500,
    lat: 40.8135,
    lng: -74.0745,
    timezone: "America/New_York",
  },
  {
    id: "sofi",
    name: "SoFi Stadium",
    city: "Inglewood",
    country: "USA",
    capacity: 70_240,
    lat: 33.9534,
    lng: -118.3392,
    timezone: "America/Los_Angeles",
  },
  {
    id: "azteca",
    name: "Estadio Azteca",
    city: "Mexico City",
    country: "Mexico",
    capacity: 87_523,
    lat: 19.3029,
    lng: -99.1505,
    timezone: "America/Mexico_City",
  },
  {
    id: "bmo",
    name: "BMO Field",
    city: "Toronto",
    country: "Canada",
    capacity: 30_991,
    lat: 43.6332,
    lng: -79.4189,
    timezone: "America/Toronto",
  },
  {
    id: "atandt",
    name: "AT&T Stadium",
    city: "Arlington",
    country: "USA",
    capacity: 80_000,
    lat: 32.7480,
    lng: -97.0933,
    timezone: "America/Chicago",
  },
  {
    id: "nrg",
    name: "NRG Stadium",
    city: "Houston",
    country: "USA",
    capacity: 72_220,
    lat: 29.6847,
    lng: -95.4107,
    timezone: "America/Chicago",
  },
] as const;

// ─── Crowd Level Colors ───────────────────────────────────────────────────────

export const CROWD_LEVEL_CONFIG = {
  Low: {
    label: "Low",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/30",
    dot: "bg-emerald-400",
  },
  Medium: {
    label: "Medium",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    dot: "bg-amber-400",
  },
  High: {
    label: "High",
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
    dot: "bg-red-400",
  },
} as const;

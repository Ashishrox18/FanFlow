import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  APP_VERSION,
  SUPPORTED_LANGUAGES,
  TRANSPORT_MODES,
  STADIUMS_DATA,
  CROWD_LEVEL_CONFIG,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  AI_TIMEOUT_MS,
  NAVIGATION_DESTINATIONS,
} from "@/lib/constants";

describe("Constants", () => {
  describe("App constants", () => {
    it("APP_NAME is correct", () => {
      expect(APP_NAME).toBe("FanFlow AI");
    });

    it("APP_VERSION is a valid semver string", () => {
      expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe("SUPPORTED_LANGUAGES", () => {
    it("has exactly 7 languages", () => {
      expect(SUPPORTED_LANGUAGES).toHaveLength(7);
    });

    it("every language has code, label, and flag", () => {
      SUPPORTED_LANGUAGES.forEach((lang) => {
        expect(lang.code).toBeTruthy();
        expect(lang.label).toBeTruthy();
        expect(lang.flag).toBeTruthy();
      });
    });

    it("includes English", () => {
      const english = SUPPORTED_LANGUAGES.find((l) => l.label === "English");
      expect(english).toBeDefined();
      expect(english?.code).toBe("en");
    });
  });

  describe("TRANSPORT_MODES", () => {
    it("has exactly 5 transport modes", () => {
      expect(TRANSPORT_MODES).toHaveLength(5);
    });

    it("every mode has id, label, and icon", () => {
      TRANSPORT_MODES.forEach((mode) => {
        expect(mode.id).toBeTruthy();
        expect(mode.label).toBeTruthy();
        expect(mode.icon).toBeTruthy();
      });
    });
  });

  describe("STADIUMS_DATA", () => {
    it("has at least 6 stadiums", () => {
      expect(STADIUMS_DATA.length).toBeGreaterThanOrEqual(6);
    });

    it("every stadium has required fields", () => {
      STADIUMS_DATA.forEach((stadium) => {
        expect(stadium.id).toBeTruthy();
        expect(stadium.name).toBeTruthy();
        expect(stadium.city).toBeTruthy();
        expect(stadium.capacity).toBeGreaterThan(0);
        expect(typeof stadium.lat).toBe("number");
        expect(typeof stadium.lng).toBe("number");
        expect(stadium.timezone).toBeTruthy();
      });
    });

    it("MetLife Stadium is present", () => {
      const metlife = STADIUMS_DATA.find((s) => s.id === "metlife");
      expect(metlife).toBeDefined();
      expect(metlife?.capacity).toBeGreaterThan(80_000);
    });
  });

  describe("CROWD_LEVEL_CONFIG", () => {
    it("has entries for Low, Medium, and High", () => {
      expect(CROWD_LEVEL_CONFIG.Low).toBeDefined();
      expect(CROWD_LEVEL_CONFIG.Medium).toBeDefined();
      expect(CROWD_LEVEL_CONFIG.High).toBeDefined();
    });

    it("every level has color, bg, border, and dot classes", () => {
      (["Low", "Medium", "High"] as const).forEach((level) => {
        const config = CROWD_LEVEL_CONFIG[level];
        expect(config.color).toBeTruthy();
        expect(config.bg).toBeTruthy();
        expect(config.border).toBeTruthy();
        expect(config.dot).toBeTruthy();
      });
    });
  });

  describe("Rate limiting constants", () => {
    it("RATE_LIMIT_MAX_REQUESTS is a positive number", () => {
      expect(RATE_LIMIT_MAX_REQUESTS).toBeGreaterThan(0);
    });

    it("RATE_LIMIT_WINDOW_MS is at least 1 second", () => {
      expect(RATE_LIMIT_WINDOW_MS).toBeGreaterThanOrEqual(1000);
    });
  });

  describe("AI constants", () => {
    it("AI_TIMEOUT_MS is a positive number", () => {
      expect(AI_TIMEOUT_MS).toBeGreaterThan(0);
    });
  });

  describe("NAVIGATION_DESTINATIONS", () => {
    it("includes AccessibilityRoute", () => {
      expect(NAVIGATION_DESTINATIONS).toContain("AccessibilityRoute");
    });

    it("includes Medical destination", () => {
      expect(NAVIGATION_DESTINATIONS).toContain("Medical");
    });
  });
});

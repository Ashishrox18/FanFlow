import { describe, it, expect } from "vitest";
import {
  ArrivalRequestSchema,
  ArrivalPlanSchema,
  NavigationRequestSchema,
  AssistantRequestSchema,
  EmergencyRequestSchema,
  EmergencyResponseSchema,
  CrowdLevelSchema,
  LanguageSchema,
  TransportModeSchema,
  CrowdZoneSchema,
  CrowdSnapshotSchema,
} from "@/lib/validators";

describe("CrowdLevelSchema", () => {
  it("accepts valid values", () => {
    expect(CrowdLevelSchema.parse("Low")).toBe("Low");
    expect(CrowdLevelSchema.parse("Medium")).toBe("Medium");
    expect(CrowdLevelSchema.parse("High")).toBe("High");
  });

  it("rejects invalid values", () => {
    expect(() => CrowdLevelSchema.parse("Critical")).toThrow();
  });
});

describe("LanguageSchema", () => {
  it("accepts all 7 supported languages", () => {
    const langs = [
      "English",
      "Spanish",
      "French",
      "Portuguese",
      "Hindi",
      "Japanese",
      "Arabic",
    ];
    langs.forEach((lang) => {
      expect(LanguageSchema.parse(lang)).toBe(lang);
    });
  });

  it("rejects unsupported languages", () => {
    expect(() => LanguageSchema.parse("Klingon")).toThrow();
  });
});

describe("TransportModeSchema", () => {
  it("accepts all valid transport modes", () => {
    ["Metro", "Bus", "Taxi", "Walking", "Ride-share"].forEach((mode) => {
      expect(TransportModeSchema.parse(mode)).toBe(mode);
    });
  });

  it("rejects invalid modes", () => {
    expect(() => TransportModeSchema.parse("Helicopter")).toThrow();
  });
});

describe("ArrivalRequestSchema", () => {
  const validRequest = {
    stadiumId: "metlife",
    currentLocation: "Manhattan, NY",
    transportMode: "Metro",
    desiredArrivalTime: "2026-07-20T18:00:00Z",
    language: "English",
  };

  it("accepts a valid request", () => {
    expect(() => ArrivalRequestSchema.parse(validRequest)).not.toThrow();
  });

  it("rejects missing required fields", () => {
    expect(() =>
      ArrivalRequestSchema.parse({ stadiumId: "metlife" }),
    ).toThrow();
  });

  it("rejects empty stadiumId", () => {
    expect(() =>
      ArrivalRequestSchema.parse({ ...validRequest, stadiumId: "" }),
    ).toThrow();
  });

  it("language field is optional", () => {
    const { language: _language, ...withoutLanguage } = validRequest;
    expect(() => ArrivalRequestSchema.parse(withoutLanguage)).not.toThrow();
  });
});

describe("ArrivalPlanSchema", () => {
  const validPlan = {
    recommendedGate: "Gate A",
    bestArrivalWindow: "2 hours before",
    expectedCrowdLevel: "Medium",
    walkingDistance: "500m",
    walkingTime: "7 min",
    reason: "Lower congestion",
    alternative: "Gate B",
    tips: ["Bring water", "Arrive early"],
  };

  it("accepts a valid plan", () => {
    expect(() => ArrivalPlanSchema.parse(validPlan)).not.toThrow();
  });

  it("rejects empty tips array", () => {
    expect(() =>
      ArrivalPlanSchema.parse({ ...validPlan, tips: [] }),
    ).toThrow();
  });

  it("rejects more than 5 tips", () => {
    expect(() =>
      ArrivalPlanSchema.parse({
        ...validPlan,
        tips: ["1", "2", "3", "4", "5", "6"],
      }),
    ).toThrow();
  });
});

describe("NavigationRequestSchema", () => {
  const validRequest = {
    stadiumId: "metlife",
    from: "Section 104",
    destination: "Food",
    isAccessibilityMode: false,
  };

  it("accepts a valid request", () => {
    expect(() => NavigationRequestSchema.parse(validRequest)).not.toThrow();
  });

  it("accepts accessibility mode", () => {
    expect(() =>
      NavigationRequestSchema.parse({
        ...validRequest,
        isAccessibilityMode: true,
      }),
    ).not.toThrow();
  });

  it("rejects invalid destination", () => {
    expect(() =>
      NavigationRequestSchema.parse({ ...validRequest, destination: "Gym" }),
    ).toThrow();
  });
});

describe("AssistantRequestSchema", () => {
  it("accepts a valid request", () => {
    expect(() =>
      AssistantRequestSchema.parse({
        message: "Where is gate A?",
        language: "English",
        stadiumId: "metlife",
      }),
    ).not.toThrow();
  });

  it("rejects message over 500 chars", () => {
    expect(() =>
      AssistantRequestSchema.parse({
        message: "a".repeat(501),
        language: "English",
        stadiumId: "metlife",
      }),
    ).toThrow();
  });

  it("rejects empty message", () => {
    expect(() =>
      AssistantRequestSchema.parse({
        message: "",
        language: "English",
        stadiumId: "metlife",
      }),
    ).toThrow();
  });
});

describe("EmergencyRequestSchema", () => {
  it("accepts all valid emergency types", () => {
    ["Medical", "Security", "LostChild", "Fire", "EmergencyExit"].forEach(
      (type) => {
        expect(() =>
          EmergencyRequestSchema.parse({
            stadiumId: "metlife",
            type,
            location: "Section 101, Row 5",
          }),
        ).not.toThrow();
      },
    );
  });

  it("rejects invalid emergency type", () => {
    expect(() =>
      EmergencyRequestSchema.parse({
        stadiumId: "metlife",
        type: "Earthquake",
        location: "Section 101",
      }),
    ).toThrow();
  });
});

describe("EmergencyResponseSchema", () => {
  it("accepts a valid response", () => {
    expect(() =>
      EmergencyResponseSchema.parse({
        immediateAction: "Call 911",
        steps: ["Step 1", "Step 2"],
        contactNumber: "911",
        nearestExit: "Gate C",
        estimatedResponseTime: "3 minutes",
      }),
    ).not.toThrow();
  });

  it("rejects empty steps", () => {
    expect(() =>
      EmergencyResponseSchema.parse({
        immediateAction: "Call 911",
        steps: [],
        contactNumber: "911",
        nearestExit: "Gate C",
        estimatedResponseTime: "3 minutes",
      }),
    ).toThrow();
  });
});

describe("CrowdZoneSchema", () => {
  it("accepts a valid crowd zone", () => {
    expect(() =>
      CrowdZoneSchema.parse({
        id: "zone-1",
        name: "Food Court A",
        type: "Food",
        crowdLevel: "High",
        capacityPercent: 85,
        waitTimeMinutes: 12,
        isOperational: true,
      }),
    ).not.toThrow();
  });

  it("rejects capacity over 100", () => {
    expect(() =>
      CrowdZoneSchema.parse({
        id: "zone-1",
        name: "Food Court A",
        type: "Food",
        crowdLevel: "High",
        capacityPercent: 150,
        waitTimeMinutes: 12,
        isOperational: true,
      }),
    ).toThrow();
  });
});

describe("CrowdSnapshotSchema", () => {
  it("accepts a valid snapshot", () => {
    expect(() =>
      CrowdSnapshotSchema.parse({
        stadiumId: "metlife",
        timestamp: new Date().toISOString(),
        zones: [
          {
            id: "zone-1",
            name: "Food Court A",
            type: "Food",
            crowdLevel: "Low",
            capacityPercent: 30,
            waitTimeMinutes: 2,
            isOperational: true,
          },
        ],
        overallLevel: "Low",
      }),
    ).not.toThrow();
  });

  it("rejects empty zones array", () => {
    expect(() =>
      CrowdSnapshotSchema.parse({
        stadiumId: "metlife",
        timestamp: new Date().toISOString(),
        zones: [],
        overallLevel: "Low",
      }),
    ).toThrow();
  });
});

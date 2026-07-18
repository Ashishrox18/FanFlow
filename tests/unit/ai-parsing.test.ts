/**
 * Tests for AI JSON parsing — validates that the Zod schemas correctly
 * accept valid AI responses and reject malformed/unexpected outputs.
 * These simulate what routeAIRequest returns from Groq/Gemini.
 */

import { describe, it, expect } from "vitest";
import {
  AssistantResponseSchema,
  ArrivalPlanSchema,
  NavigationPlanSchema,
  TransportPlanSchema,
  EmergencyResponseSchema,
  CrowdSnapshotSchema,
} from "@/lib/validators";

// ─── AssistantResponseSchema ──────────────────────────────────────────────────

describe("AI JSON Parsing: AssistantResponseSchema", () => {
  const validResponse = {
    answer: "Gate A is on the north side of the stadium.",
    category: "Navigation",
    suggestedActions: ["Follow the signs to Gate A", "Ask a staff member"],
    gateName: "Gate A",
    walkingTime: "5 minutes",
    crowdLevel: "Low",
  };

  it("accepts a fully valid assistant response", () => {
    expect(() => AssistantResponseSchema.parse(validResponse)).not.toThrow();
  });

  it("accepts response without optional fields", () => {
    expect(() =>
      AssistantResponseSchema.parse({
        answer: "Here is the information.",
        category: "General",
      }),
    ).not.toThrow();
  });

  it("rejects empty answer", () => {
    expect(() => AssistantResponseSchema.parse({ ...validResponse, answer: "" })).toThrow();
  });

  it("rejects invalid category", () => {
    expect(() =>
      AssistantResponseSchema.parse({ ...validResponse, category: "Weather" }),
    ).toThrow();
  });

  it("rejects invalid crowdLevel", () => {
    expect(() =>
      AssistantResponseSchema.parse({ ...validResponse, crowdLevel: "Critical" }),
    ).toThrow();
  });

  it("accepts all valid categories", () => {
    const categories = [
      "Navigation",
      "Emergency",
      "Accessibility",
      "Transportation",
      "General",
      "Ticketing",
    ] as const;
    categories.forEach((category) => {
      expect(() => AssistantResponseSchema.parse({ answer: "ok", category })).not.toThrow();
    });
  });

  it("rejects completely empty object", () => {
    expect(() => AssistantResponseSchema.parse({})).toThrow();
  });

  it("rejects null input", () => {
    expect(() => AssistantResponseSchema.parse(null)).toThrow();
  });
});

// ─── ArrivalPlanSchema ────────────────────────────────────────────────────────

describe("AI JSON Parsing: ArrivalPlanSchema", () => {
  const validPlan = {
    recommendedGate: "Gate B",
    bestArrivalWindow: "5:30 PM - 6:00 PM",
    expectedCrowdLevel: "Medium",
    walkingDistance: "350 metres",
    walkingTime: "5 minutes",
    reason: "Shortest route from the Metro stop",
    alternative: "Gate C has lower crowds",
    tips: ["Arrive by Metro", "Avoid peak 6PM rush"],
  };

  it("accepts a valid arrival plan", () => {
    expect(() => ArrivalPlanSchema.parse(validPlan)).not.toThrow();
  });

  it("requires at least 1 tip", () => {
    expect(() => ArrivalPlanSchema.parse({ ...validPlan, tips: [] })).toThrow();
  });

  it("rejects more than 5 tips", () => {
    const tips = ["1", "2", "3", "4", "5", "6"];
    expect(() => ArrivalPlanSchema.parse({ ...validPlan, tips })).toThrow();
  });

  it("rejects invalid crowd level", () => {
    expect(() =>
      ArrivalPlanSchema.parse({ ...validPlan, expectedCrowdLevel: "Extreme" }),
    ).toThrow();
  });

  it("requires all string fields to be non-empty", () => {
    expect(() => ArrivalPlanSchema.parse({ ...validPlan, recommendedGate: "" })).toThrow();
  });
});

// ─── NavigationPlanSchema ─────────────────────────────────────────────────────

describe("AI JSON Parsing: NavigationPlanSchema", () => {
  const validStep = {
    stepNumber: 1,
    instruction: "Walk forward 50 metres",
    isAccessible: true,
  };
  const validPlan = {
    shortestRoute: [validStep],
    leastCrowdedRoute: [{ ...validStep, stepNumber: 1, instruction: "Take the ramp" }],
    walkingTime: "8 minutes",
    alternativeOption: "Use elevator on Level 2",
    avoidStairs: false,
    crowdLevel: "Low",
    reason: "This is the most direct path",
  };

  it("accepts a valid navigation plan", () => {
    expect(() => NavigationPlanSchema.parse(validPlan)).not.toThrow();
  });

  it("rejects empty shortestRoute array", () => {
    expect(() => NavigationPlanSchema.parse({ ...validPlan, shortestRoute: [] })).toThrow();
  });

  it("requires stepNumber to be a positive integer", () => {
    expect(() =>
      NavigationPlanSchema.parse({
        ...validPlan,
        shortestRoute: [{ stepNumber: -1, instruction: "back", isAccessible: false }],
      }),
    ).toThrow();
  });

  it("step landmark is optional", () => {
    const stepWithLandmark = { ...validStep, landmark: "Near the food stall" };
    expect(() =>
      NavigationPlanSchema.parse({ ...validPlan, shortestRoute: [stepWithLandmark] }),
    ).not.toThrow();
  });

  it("avoidStairs must be boolean", () => {
    expect(() => NavigationPlanSchema.parse({ ...validPlan, avoidStairs: "yes" })).toThrow();
  });
});

// ─── TransportPlanSchema ──────────────────────────────────────────────────────

describe("AI JSON Parsing: TransportPlanSchema", () => {
  const validPlan = {
    recommendedMode: "Metro",
    estimatedTime: "25 minutes",
    estimatedCost: "$3.50",
    instructions: ["Take the Red Line", "Alight at Stadium Stop"],
    congestionLevel: "Low",
    alternative: null,
    reason: "Metro is fastest during match day",
  };

  it("accepts a valid transport plan", () => {
    expect(() => TransportPlanSchema.parse(validPlan)).not.toThrow();
  });

  it("accepts plan without estimatedCost", () => {
    const withoutCost = { ...validPlan };
    delete (withoutCost as Partial<typeof validPlan>).estimatedCost;
    expect(() => TransportPlanSchema.parse(withoutCost)).not.toThrow();
  });

  it("rejects non-null alternative", () => {
    expect(() =>
      TransportPlanSchema.parse({ ...validPlan, alternative: { nested: "plan" } as unknown as null }),
    ).toThrow();
  });

  it("rejects invalid transport mode", () => {
    expect(() =>
      TransportPlanSchema.parse({ ...validPlan, recommendedMode: "Helicopter" as unknown as string }),
    ).toThrow();
  });

  it("requires at least one instruction", () => {
    expect(() => TransportPlanSchema.parse({ ...validPlan, instructions: [] })).toThrow();
  });
});

// ─── EmergencyResponseSchema ──────────────────────────────────────────────────

describe("AI JSON Parsing: EmergencyResponseSchema", () => {
  const validResponse = {
    immediateAction: "Call 911 immediately",
    steps: ["Stay calm", "Move away from the area", "Alert the nearest staff member"],
    contactNumber: "911",
    nearestExit: "Gate C, 50 metres to your left",
    estimatedResponseTime: "3 minutes",
  };

  it("accepts a valid emergency response", () => {
    expect(() => EmergencyResponseSchema.parse(validResponse)).not.toThrow();
  });

  it("requires at least 1 step", () => {
    expect(() => EmergencyResponseSchema.parse({ ...validResponse, steps: [] })).toThrow();
  });

  it("rejects more than 10 steps", () => {
    const steps = Array.from({ length: 11 }, (_, i) => `Step ${i + 1}`);
    expect(() => EmergencyResponseSchema.parse({ ...validResponse, steps })).toThrow();
  });

  it("rejects missing immediateAction", () => {
    const withoutAction = { ...validResponse };
    delete (withoutAction as Partial<typeof validResponse>).immediateAction;
    expect(() => EmergencyResponseSchema.parse(withoutAction)).toThrow();
  });
});

// ─── CrowdSnapshotSchema ──────────────────────────────────────────────────────

describe("AI JSON Parsing: CrowdSnapshotSchema (from crowd service)", () => {
  const validZone = {
    id: "gate-a",
    name: "Gate A",
    type: "Exit",
    crowdLevel: "Medium",
    capacityPercent: 60,
    waitTimeMinutes: 8,
    isOperational: true,
  };

  const validSnapshot = {
    stadiumId: "metlife",
    timestamp: new Date().toISOString(),
    zones: [validZone],
    overallLevel: "Medium",
  };

  it("accepts a valid crowd snapshot", () => {
    expect(() => CrowdSnapshotSchema.parse(validSnapshot)).not.toThrow();
  });

  it("rejects snapshot with no zones", () => {
    expect(() => CrowdSnapshotSchema.parse({ ...validSnapshot, zones: [] })).toThrow();
  });

  it("rejects zone with capacity over 100", () => {
    expect(() =>
      CrowdSnapshotSchema.parse({
        ...validSnapshot,
        zones: [{ ...validZone, capacityPercent: 101 }],
      }),
    ).toThrow();
  });

  it("rejects negative wait time", () => {
    expect(() =>
      CrowdSnapshotSchema.parse({
        ...validSnapshot,
        zones: [{ ...validZone, waitTimeMinutes: -1 }],
      }),
    ).toThrow();
  });
});

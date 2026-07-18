/**
 * @fileoverview Zod validation schemas for all FanFlow AI API requests and AI responses.
 * Every AI response is validated here before being passed to the UI.
 */

import { z } from "zod";

// ─── Shared ───────────────────────────────────────────────────────────────────

export const CrowdLevelSchema = z.enum(["Low", "Medium", "High"]);

export const LanguageSchema = z.enum([
  "English",
  "Spanish",
  "French",
  "Portuguese",
  "Hindi",
  "Japanese",
  "Arabic",
]);

export const TransportModeSchema = z.enum(["Metro", "Bus", "Taxi", "Walking", "Ride-share"]);

// ─── Arrival ─────────────────────────────────────────────────────────────────

export const ArrivalRequestSchema = z.object({
  stadiumId: z.string().min(1),
  currentLocation: z.string().min(2).max(200),
  transportMode: TransportModeSchema,
  desiredArrivalTime: z.string().datetime({ offset: true }).or(z.string().min(1)),
  language: LanguageSchema.optional(),
});

export const ArrivalPlanSchema = z.object({
  recommendedGate: z.string().min(1),
  bestArrivalWindow: z.string().min(1),
  expectedCrowdLevel: CrowdLevelSchema,
  walkingDistance: z.string().min(1),
  walkingTime: z.string().min(1),
  reason: z.string().min(1),
  alternative: z.string().min(1),
  tips: z.array(z.string()).min(1).max(5),
});

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NavigationDestinationSchema = z.enum([
  "Seat",
  "Food",
  "Restroom",
  "Medical",
  "Merchandise",
  "AccessibilityRoute",
]);

export const NavigationRequestSchema = z.object({
  stadiumId: z.string().min(1),
  from: z.string().min(1).max(200),
  destination: NavigationDestinationSchema,
  seatNumber: z.string().optional(),
  isAccessibilityMode: z.boolean(),
  language: LanguageSchema.optional(),
});

export const RouteStepSchema = z.object({
  stepNumber: z.number().int().positive(),
  instruction: z.string().min(1),
  landmark: z.string().optional(),
  isAccessible: z.boolean(),
});

export const NavigationPlanSchema = z.object({
  shortestRoute: z.array(RouteStepSchema).min(1),
  leastCrowdedRoute: z.array(RouteStepSchema).min(1),
  walkingTime: z.string().min(1),
  alternativeOption: z.string().min(1),
  avoidStairs: z.boolean(),
  crowdLevel: CrowdLevelSchema,
  reason: z.string().min(1),
});

// ─── Transport ───────────────────────────────────────────────────────────────

export const TransportRequestSchema = z.object({
  stadiumId: z.string().min(1),
  phase: z.enum(["before", "after"]),
  userLocation: z.string().min(1).max(200),
  preferredMode: TransportModeSchema.optional(),
  language: LanguageSchema.optional(),
});

export const TransportPlanSchema: z.ZodType<{
  recommendedMode: z.infer<typeof TransportModeSchema>;
  estimatedTime: string;
  estimatedCost?: string;
  instructions: string[];
  congestionLevel: z.infer<typeof CrowdLevelSchema>;
  alternative: null;
  reason: string;
}> = z.object({
  recommendedMode: TransportModeSchema,
  estimatedTime: z.string().min(1),
  estimatedCost: z.string().optional(),
  instructions: z.array(z.string()).min(1),
  congestionLevel: CrowdLevelSchema,
  alternative: z.null(),
  reason: z.string().min(1),
});

// ─── Chat Assistant ───────────────────────────────────────────────────────────

export const AssistantRequestSchema = z.object({
  message: z.string().min(1).max(500),
  language: LanguageSchema,
  stadiumId: z.string().min(1),
  context: z.string().max(1000).optional(),
});

export const AssistantResponseSchema = z.object({
  answer: z.string().min(1),
  category: z.enum([
    "Navigation",
    "Emergency",
    "Accessibility",
    "Transportation",
    "General",
    "Ticketing",
  ]),
  suggestedActions: z.array(z.string()).optional(),
  gateName: z.string().optional(),
  walkingTime: z.string().optional(),
  crowdLevel: CrowdLevelSchema.optional(),
});

// ─── Emergency ───────────────────────────────────────────────────────────────

export const EmergencyTypeSchema = z.enum([
  "Medical",
  "Security",
  "LostChild",
  "Fire",
  "EmergencyExit",
]);

export const EmergencyRequestSchema = z.object({
  stadiumId: z.string().min(1),
  type: EmergencyTypeSchema,
  location: z.string().min(1).max(200),
  language: LanguageSchema.optional(),
});

export const EmergencyResponseSchema = z.object({
  immediateAction: z.string().min(1),
  steps: z.array(z.string()).min(1).max(10),
  contactNumber: z.string().min(1),
  nearestExit: z.string().min(1),
  estimatedResponseTime: z.string().min(1),
});

// ─── Crowd Zone ───────────────────────────────────────────────────────────────

export const CrowdZoneSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["Food", "Restroom", "Medical", "Merchandise", "Information", "Exit"]),
  crowdLevel: CrowdLevelSchema,
  capacityPercent: z.number().min(0).max(100),
  waitTimeMinutes: z.number().min(0),
  isOperational: z.boolean(),
});

export const CrowdSnapshotSchema = z.object({
  stadiumId: z.string().min(1),
  timestamp: z.string(),
  zones: z.array(CrowdZoneSchema).min(1),
  overallLevel: CrowdLevelSchema,
});

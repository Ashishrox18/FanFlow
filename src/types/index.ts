/**
 * @fileoverview Global TypeScript types for FanFlow AI
 * All domain entities, AI response shapes, and shared interfaces.
 */

// ─── Stadium ─────────────────────────────────────────────────────────────────

export type CrowdLevel = "Low" | "Medium" | "High";
export type TransportMode = "Metro" | "Bus" | "Taxi" | "Walking" | "Ride-share";
export type Language =
  | "English"
  | "Spanish"
  | "French"
  | "Portuguese"
  | "Hindi"
  | "Japanese"
  | "Arabic";

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  lat: number;
  lng: number;
  timezone: string;
  gates: Gate[];
  sections: StadiumSection[];
  amenities: Amenity[];
  accessibilityFeatures: AccessibilityFeature[];
}

export interface Gate {
  id: string;
  name: string;
  description: string;
  hasElevator: boolean;
  isAccessible: boolean;
  crowdLevel: CrowdLevel;
}

export interface StadiumSection {
  id: string;
  name: string;
  level: number;
  hasElevatorAccess: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  type: AmenityType;
  location: string;
  crowdLevel: CrowdLevel;
  isAccessible: boolean;
}

export type AmenityType =
  | "Food"
  | "Restroom"
  | "Medical"
  | "Merchandise"
  | "Information"
  | "Exit";

export interface AccessibilityFeature {
  id: string;
  type: "Elevator" | "Ramp" | "WheelchairEntrance" | "AssistanceDesk";
  location: string;
  level: number;
}

// ─── Arrival ─────────────────────────────────────────────────────────────────

export interface ArrivalRequest {
  stadiumId: string;
  currentLocation: string;
  transportMode: TransportMode;
  desiredArrivalTime: string; // ISO string
}

export interface ArrivalPlan {
  recommendedGate: string;
  bestArrivalWindow: string;
  expectedCrowdLevel: CrowdLevel;
  walkingDistance: string;
  walkingTime: string;
  reason: string;
  alternative: string;
  tips: string[];
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type NavigationDestination =
  | "Seat"
  | "Food"
  | "Restroom"
  | "Medical"
  | "Merchandise"
  | "AccessibilityRoute";

export interface NavigationRequest {
  stadiumId: string;
  from: string;
  destination: NavigationDestination;
  seatNumber?: string;
  isAccessibilityMode: boolean;
}

export interface NavigationPlan {
  shortestRoute: RouteStep[];
  leastCrowdedRoute: RouteStep[];
  walkingTime: string;
  alternativeOption: string;
  avoidStairs: boolean;
  crowdLevel: CrowdLevel;
  reason: string;
}

export interface RouteStep {
  stepNumber: number;
  instruction: string;
  landmark?: string;
  isAccessible: boolean;
}

// ─── Transport ───────────────────────────────────────────────────────────────

export interface TransportRequest {
  stadiumId: string;
  phase: "before" | "after";
  userLocation: string;
  preferredMode?: TransportMode;
}

export interface TransportPlan {
  recommendedMode: TransportMode;
  estimatedTime: string;
  estimatedCost?: string;
  instructions: string[];
  congestionLevel: CrowdLevel;
  alternative: TransportPlan | null;
  reason: string;
}

// ─── Chat / Assistant ─────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  language: Language;
  isLoading?: boolean;
}

export interface AssistantRequest {
  message: string;
  language: Language;
  stadiumId: string;
  context?: string;
}

export interface AssistantResponse {
  answer: string;
  category: AssistantCategory;
  suggestedActions?: string[];
  gateName?: string;
  walkingTime?: string;
  crowdLevel?: CrowdLevel;
}

export type AssistantCategory =
  | "Navigation"
  | "Emergency"
  | "Accessibility"
  | "Transportation"
  | "General"
  | "Ticketing";

// ─── Emergency ───────────────────────────────────────────────────────────────

export type EmergencyType = "Medical" | "Security" | "LostChild" | "Fire" | "EmergencyExit";

export interface EmergencyRequest {
  stadiumId: string;
  type: EmergencyType;
  location: string;
}

export interface EmergencyResponse {
  immediateAction: string;
  steps: string[];
  contactNumber: string;
  nearestExit: string;
  estimatedResponseTime: string;
}

// ─── Crowd Intelligence ───────────────────────────────────────────────────────

export interface CrowdSnapshot {
  stadiumId: string;
  timestamp: string;
  zones: CrowdZone[];
  overallLevel: CrowdLevel;
}

export interface CrowdZone {
  id: string;
  name: string;
  type: AmenityType;
  crowdLevel: CrowdLevel;
  capacityPercent: number;
  waitTimeMinutes: number;
  isOperational: boolean;
}

// ─── AI Routing ──────────────────────────────────────────────────────────────

export type AIModel = "groq" | "gemini";

export type QueryComplexity = "simple" | "complex";

export interface AIRequest {
  prompt: string;
  systemPrompt: string;
  model: AIModel;
  temperature?: number;
}

export interface AIResponse<T> {
  data: T;
  model: AIModel;
  latencyMs: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

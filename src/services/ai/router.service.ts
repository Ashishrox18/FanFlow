/**
 * @fileoverview AI Router service — intelligently routes queries to Groq or Gemini.
 *
 * Decision logic:
 * - Simple FAQ, navigation questions, general chat → Groq (fast, low-latency)
 * - Complex planning, arrival plans, transport routing, navigation planning → Gemini
 *
 * Both services return strict JSON validated by Zod before this function returns.
 */

import { callGroq } from "./groq.service";
import type { AIModel, QueryComplexity } from "@/types";

// ─── Complexity Classification ─────────────────────────────────────────────────

const COMPLEX_KEYWORDS = [
  "plan",
  "route",
  "navigate",
  "transport",
  "arrival",
  "schedule",
  "optimal",
  "recommend path",
  "best way",
  "how to get",
  "emergency",
  "evacuation",
] as const;

/**
 * Classifies a user query as simple (Groq) or complex (Gemini).
 * @param query - Raw user query string
 * @returns Query complexity classification
 */
export function classifyQuery(query: string): QueryComplexity {
  const lower = query.toLowerCase();
  const isComplex = COMPLEX_KEYWORDS.some((keyword) => lower.includes(keyword));
  return isComplex ? "complex" : "simple";
}

/**
 * Selects the appropriate AI model based on query complexity.
 * @param complexity - Classified query complexity
 * @returns The selected AI model identifier
 */
export function selectModel(complexity: QueryComplexity): AIModel {
  return complexity === "complex" ? "gemini" : "groq";
}

// ─── Unified Router ───────────────────────────────────────────────────────────

/**
 * Routes an AI request to the appropriate model (Groq or Gemini).
 * For feature-specific routes (arrival, navigation, transport), always uses Gemini.
 * For conversational assistant, uses query complexity to decide.
 *
 * @param systemPrompt - System instruction with JSON schema
 * @param userPrompt - The user's query or structured request
 * @param forceModel - Override model selection
 * @returns Parsed JSON response from the selected model
 */
export async function routeAIRequest<T>(
  systemPrompt: string,
  userPrompt: string,
  forceModel?: AIModel,
): Promise<{ data: T; model: AIModel }> {
  const model = forceModel ?? selectModel(classifyQuery(userPrompt));

  // User requested all Gemini calls to route through Groq
  const data = await callGroq<T>(systemPrompt, userPrompt);

  return { data, model };
}

// ─── System Prompts ───────────────────────────────────────────────────────────

/**
 * System prompt for the multilingual assistant (Groq).
 */
export function buildAssistantSystemPrompt(language: string, stadiumName: string): string {
  return `You are FanFlow AI, an intelligent stadium assistant for ${stadiumName} during FIFA World Cup 2026.
Always respond in ${language}.
You must ONLY return valid JSON matching this exact schema. Never add markdown, code blocks, or free text outside JSON.

Required JSON schema:
{
  "answer": "string (your helpful response in ${language})",
  "category": "Navigation|Emergency|Accessibility|Transportation|General|Ticketing",
  "suggestedActions": ["string", "string"],
  "gateName": "string or omit",
  "walkingTime": "string or omit",
  "crowdLevel": "Low|Medium|High or omit"
}

Be helpful, concise, safety-first. For emergencies, always provide immediate guidance.`;
}

/**
 * System prompt for the arrival planner (Gemini).
 */
export function buildArrivalSystemPrompt(stadiumName: string, language: string): string {
  return `You are FanFlow AI's arrival planning engine for ${stadiumName}, FIFA World Cup 2026.
Analyse the fan's location, transport mode, and desired arrival time to generate an optimal arrival plan.
Always respond in ${language}.
Return ONLY valid JSON matching this exact schema:

{
  "recommendedGate": "string",
  "bestArrivalWindow": "string (e.g. '5:30 PM - 6:00 PM')",
  "expectedCrowdLevel": "Low|Medium|High",
  "walkingDistance": "string (e.g. '350 metres')",
  "walkingTime": "string (e.g. '5 minutes')",
  "reason": "string (brief explanation in ${language})",
  "alternative": "string (gate or route alternative in ${language})",
  "tips": ["string in ${language}", "string in ${language}", "string in ${language}"]
}`;
}

/**
 * System prompt for navigation planning (Gemini).
 */
export function buildNavigationSystemPrompt(
  stadiumName: string,
  isAccessibilityMode: boolean,
  language: string,
): string {
  const accessNote = isAccessibilityMode
    ? `IMPORTANT: The user requires accessibility routing. Always avoid stairs. Use elevators and ramps.`
    : "";
  return `You are FanFlow AI's navigation engine for ${stadiumName}, FIFA World Cup 2026.
${accessNote}
Always respond in ${language}.
Generate a clear step-by-step navigation plan. Return ONLY valid JSON:

{
  "shortestRoute": [{"stepNumber":1,"instruction":"string in ${language}","landmark":"string in ${language} or omit","isAccessible":true}],
  "leastCrowdedRoute": [{"stepNumber":1,"instruction":"string in ${language}","landmark":"string in ${language} or omit","isAccessible":true}],
  "walkingTime": "string (e.g. '8 minutes')",
  "alternativeOption": "string in ${language}",
  "avoidStairs": ${isAccessibilityMode},
  "crowdLevel": "Low|Medium|High",
  "reason": "string in ${language}"
}`;
}

/**
 * System prompt for transport planning (Gemini).
 */
export function buildTransportSystemPrompt(
  stadiumName: string,
  phase: string,
  language: string,
): string {
  return `You are FanFlow AI's transport planning engine for ${stadiumName}, FIFA World Cup 2026.
Plan the ${phase}-match transport recommendation. Always respond in ${language}. Return ONLY valid JSON:

{
  "recommendedMode": "Metro|Bus|Taxi|Walking|Ride-share",
  "estimatedTime": "string",
  "estimatedCost": "string or omit",
  "instructions": ["string in ${language}", "string in ${language}"],
  "congestionLevel": "Low|Medium|High",
  "alternative": null,
  "reason": "string in ${language}"
}`;
}

/**
 * System prompt for emergency assistance (Groq).
 */
export function buildEmergencySystemPrompt(stadiumName: string, language: string): string {
  return `You are FanFlow AI's emergency response system for ${stadiumName}, FIFA World Cup 2026.
Provide IMMEDIATE, clear, actionable guidance. Safety is the highest priority.
Always respond in ${language}.
Return ONLY valid JSON:

{
  "immediateAction": "string (first thing to do right now in ${language})",
  "steps": ["string in ${language}", "string in ${language}", "string in ${language}"],
  "contactNumber": "string (emergency number)",
  "nearestExit": "string in ${language}",
  "estimatedResponseTime": "string"
}`;
}

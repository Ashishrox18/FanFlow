/**
 * @fileoverview POST /api/ai/navigation — AI navigation planning endpoint.
 * Routes to Gemini for shortest-path and accessibility-aware routing.
 */

import type { NextRequest } from "next/server";
import { NavigationRequestSchema, NavigationPlanSchema } from "@/lib/validators";
import { routeAIRequest, buildNavigationSystemPrompt } from "@/services/ai/router.service";
import { RateLimitError, ValidationError, toApiError } from "@/lib/errors";
import { checkRateLimit, sanitiseInput } from "@/lib/utils";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS, STADIUMS_DATA } from "@/lib/constants";
import type { NavigationPlan, ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed, retryAfterMs } = checkRateLimit(
    `navigation:${ip}`,
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS
  );
  if (!allowed) throw new RateLimitError(retryAfterMs);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body", code: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = NavigationRequestSchema.safeParse(body);
  if (!parsed.success) {
    const err = new ValidationError("Invalid request", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    return Response.json({ success: false, ...toApiError(err) }, { status: 400 });
  }

  const { stadiumId, from, destination, seatNumber, isAccessibilityMode, language } = parsed.data;
  const stadium = STADIUMS_DATA.find((s) => s.id === stadiumId);
  const stadiumName = stadium?.name ?? "FIFA World Cup 2026 Stadium";

  const systemPrompt = buildNavigationSystemPrompt(stadiumName, isAccessibilityMode, language ?? "English");
  const userPrompt = `Stadium: ${stadiumName}
From: ${sanitiseInput(from)}
Destination: ${destination}${seatNumber ? `\nSeat: ${seatNumber}` : ""}
Accessibility mode: ${isAccessibilityMode}
Generate a clear navigation plan with step-by-step instructions.`;

  try {
    const { data: rawResponse } = await routeAIRequest<unknown>(systemPrompt, userPrompt, "gemini");
    const validated = NavigationPlanSchema.safeParse(rawResponse);
    if (!validated.success) {
      return Response.json({ success: false, error: "AI returned unexpected format", code: "AI_VALIDATION_ERROR" }, { status: 502 });
    }
    return Response.json({ success: true, data: validated.data } satisfies ApiResponse<NavigationPlan>, { status: 200 });
  } catch (error: unknown) {
    return Response.json({ success: false, ...toApiError(error) }, { status: 502 });
  }
}

export async function GET(): Promise<Response> {
  return Response.json({ success: false, error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, { status: 405 });
}

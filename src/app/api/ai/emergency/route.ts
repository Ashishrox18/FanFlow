/**
 * @fileoverview POST /api/ai/emergency — Emergency assistance API endpoint.
 * Routes to Groq for fast emergency response generation.
 */

import type { NextRequest } from "next/server";
import { EmergencyRequestSchema, EmergencyResponseSchema } from "@/lib/validators";
import { routeAIRequest, buildEmergencySystemPrompt } from "@/services/ai/router.service";
import { RateLimitError, ValidationError, toApiError } from "@/lib/errors";
import { checkRateLimit, sanitiseInput } from "@/lib/utils";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS, STADIUMS_DATA } from "@/lib/constants";
import type { EmergencyResponse, ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  // Emergency gets higher rate limit (triple)
  const { allowed, retryAfterMs } = checkRateLimit(
    `emergency:${ip}`,
    RATE_LIMIT_MAX_REQUESTS * 3,
    RATE_LIMIT_WINDOW_MS
  );
  if (!allowed) throw new RateLimitError(retryAfterMs);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body", code: "INVALID_JSON" }, { status: 400 });
  }

  const parsed = EmergencyRequestSchema.safeParse(body);
  if (!parsed.success) {
    const err = new ValidationError("Invalid request", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    return Response.json({ success: false, ...toApiError(err) }, { status: 400 });
  }

  const { stadiumId, type, location, language } = parsed.data;
  const stadium = STADIUMS_DATA.find((s) => s.id === stadiumId);
  const stadiumName = stadium?.name ?? "FIFA World Cup 2026 Stadium";

  const systemPrompt = buildEmergencySystemPrompt(stadiumName, language ?? "English");
  const userPrompt = `Emergency type: ${type}
Location: ${sanitiseInput(location)}
Stadium: ${stadiumName}
Provide immediate step-by-step emergency guidance.`;

  try {
    const { data: rawResponse } = await routeAIRequest<unknown>(systemPrompt, userPrompt, "groq");
    const validated = EmergencyResponseSchema.safeParse(rawResponse);
    if (!validated.success) {
      return Response.json({ success: false, error: "AI returned unexpected format", code: "AI_VALIDATION_ERROR" }, { status: 502 });
    }
    return Response.json({ success: true, data: validated.data } satisfies ApiResponse<EmergencyResponse>, { status: 200 });
  } catch (error: unknown) {
    return Response.json({ success: false, ...toApiError(error) }, { status: 502 });
  }
}

export async function GET(): Promise<Response> {
  return Response.json({ success: false, error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, { status: 405 });
}

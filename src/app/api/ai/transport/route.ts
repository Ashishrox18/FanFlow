/**
 * @fileoverview POST /api/ai/transport — Transport planning endpoint.
 * POST /api/ai/emergency — Emergency assistance endpoint.
 */

import type { NextRequest } from "next/server";
import { TransportRequestSchema, TransportPlanSchema } from "@/lib/validators";
import { routeAIRequest, buildTransportSystemPrompt } from "@/services/ai/router.service";
import { RateLimitError, ValidationError, toApiError } from "@/lib/errors";
import { checkRateLimit, sanitiseInput } from "@/lib/utils";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS, STADIUMS_DATA } from "@/lib/constants";
import type { TransportPlan, ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed, retryAfterMs } = checkRateLimit(
    `transport:${ip}`,
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

  const parsed = TransportRequestSchema.safeParse(body);
  if (!parsed.success) {
    const err = new ValidationError("Invalid request", parsed.error.flatten().fieldErrors as Record<string, string[]>);
    return Response.json({ success: false, ...toApiError(err) }, { status: 400 });
  }

  const { stadiumId, phase, userLocation, preferredMode, language } = parsed.data;
  const stadium = STADIUMS_DATA.find((s) => s.id === stadiumId);
  const stadiumName = stadium?.name ?? "FIFA World Cup 2026 Stadium";

  const systemPrompt = buildTransportSystemPrompt(stadiumName, phase, language ?? "English");
  const userPrompt = `Stadium: ${stadiumName}
Phase: ${phase}-match
User location: ${sanitiseInput(userLocation)}
${preferredMode ? `Preferred mode: ${preferredMode}` : "No mode preference"}
City: ${stadium?.city ?? "Unknown"}, ${stadium?.country ?? ""}
Provide the best transport recommendation.`;

  try {
    const { data: rawResponse } = await routeAIRequest<unknown>(systemPrompt, userPrompt, "gemini");
    const validated = TransportPlanSchema.safeParse(rawResponse);
    if (!validated.success) {
      return Response.json({ success: false, error: "AI returned unexpected format", code: "AI_VALIDATION_ERROR" }, { status: 502 });
    }
    return Response.json({ success: true, data: validated.data } satisfies ApiResponse<TransportPlan>, { status: 200 });
  } catch (error: unknown) {
    return Response.json({ success: false, ...toApiError(error) }, { status: 502 });
  }
}

export async function GET(): Promise<Response> {
  return Response.json({ success: false, error: "Method not allowed", code: "METHOD_NOT_ALLOWED" }, { status: 405 });
}

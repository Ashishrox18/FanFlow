/**
 * @fileoverview POST /api/ai/arrival — Arrival planning endpoint.
 * Routes to Gemini for deep reasoning about optimal arrival windows.
 */

import type { NextRequest } from "next/server";
import { ArrivalRequestSchema, ArrivalPlanSchema } from "@/lib/validators";
import { routeAIRequest, buildArrivalSystemPrompt } from "@/services/ai/router.service";
import { RateLimitError, ValidationError, toApiError } from "@/lib/errors";
import { checkRateLimit, sanitiseInput } from "@/lib/utils";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS, STADIUMS_DATA } from "@/lib/constants";
import type { ArrivalPlan, ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed, retryAfterMs } = checkRateLimit(
    `arrival:${ip}`,
    RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS,
  );

  if (!allowed) {
    throw new RateLimitError(retryAfterMs);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, error: "Invalid JSON body", code: "INVALID_JSON" },
      { status: 400 },
    );
  }

  const parsed = ArrivalRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    const err = new ValidationError("Invalid request", fieldErrors);
    return Response.json({ success: false, ...toApiError(err) }, { status: 400 });
  }

  const { stadiumId, currentLocation, transportMode, desiredArrivalTime, language } = parsed.data;
  const stadium = STADIUMS_DATA.find((s) => s.id === stadiumId);
  const stadiumName = stadium?.name ?? "FIFA World Cup 2026 Stadium";

  const systemPrompt = buildArrivalSystemPrompt(stadiumName, language ?? "English");
  const userPrompt = `Stadium: ${stadiumName}
Current location: ${sanitiseInput(currentLocation)}
Transport mode: ${transportMode}
Desired arrival time: ${desiredArrivalTime}
Capacity: ${stadium?.capacity ?? "Unknown"}
Please provide an optimal arrival plan.`;

  try {
    const { data: rawResponse } = await routeAIRequest<unknown>(systemPrompt, userPrompt, "gemini");

    const validated = ArrivalPlanSchema.safeParse(rawResponse);
    if (!validated.success) {
      return Response.json(
        { success: false, error: "AI returned unexpected format", code: "AI_VALIDATION_ERROR" },
        { status: 502 },
      );
    }

    return Response.json(
      { success: true, data: validated.data } satisfies ApiResponse<ArrivalPlan>,
      { status: 200 },
    );
  } catch (error: unknown) {
    return Response.json({ success: false, ...toApiError(error) }, { status: 502 });
  }
}

export async function GET(): Promise<Response> {
  return Response.json(
    { success: false, error: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 },
  );
}

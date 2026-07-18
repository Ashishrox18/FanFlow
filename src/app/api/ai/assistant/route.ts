/**
 * @fileoverview POST /api/ai/assistant — Multilingual AI assistant endpoint.
 * Routes to Groq for fast conversational responses.
 */

import type { NextRequest } from "next/server";
import { AssistantRequestSchema, AssistantResponseSchema } from "@/lib/validators";
import { routeAIRequest, buildAssistantSystemPrompt } from "@/services/ai/router.service";
import { RateLimitError, ValidationError, toApiError } from "@/lib/errors";
import { checkRateLimit, sanitiseInput } from "@/lib/utils";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS, STADIUMS_DATA } from "@/lib/constants";
import type { AssistantResponse, ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Handles POST requests to the AI assistant endpoint.
 */
export async function POST(request: NextRequest): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed, retryAfterMs } = checkRateLimit(
    `assistant:${ip}`,
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
      {
        success: false,
        error: "Invalid JSON body",
        code: "INVALID_JSON",
      } satisfies ApiResponse<never>,
      { status: 400 },
    );
  }

  const parsed = AssistantRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    const validationError = new ValidationError("Invalid request", fieldErrors);
    return Response.json(
      { success: false, ...toApiError(validationError) } satisfies ApiResponse<never>,
      { status: 400 },
    );
  }

  const { message, language, stadiumId } = parsed.data;
  const stadium = STADIUMS_DATA.find((s) => s.id === stadiumId);
  const stadiumName = stadium?.name ?? "FIFA World Cup 2026 Stadium";

  const sanitisedMessage = sanitiseInput(message);
  const systemPrompt = buildAssistantSystemPrompt(language, stadiumName);

  try {
    const { data: rawResponse } = await routeAIRequest<unknown>(
      systemPrompt,
      sanitisedMessage,
      "groq",
    );

    const validated = AssistantResponseSchema.safeParse(rawResponse);
    if (!validated.success) {
      return Response.json(
        {
          success: false,
          error: "AI returned unexpected response format",
          code: "AI_VALIDATION_ERROR",
        } satisfies ApiResponse<never>,
        { status: 502 },
      );
    }

    return Response.json(
      { success: true, data: validated.data } satisfies ApiResponse<AssistantResponse>,
      { status: 200 },
    );
  } catch (error: unknown) {
    const apiError = toApiError(error);
    return Response.json({ success: false, ...apiError } satisfies ApiResponse<never>, {
      status: 502,
    });
  }
}

export async function GET(): Promise<Response> {
  return Response.json(
    { success: false, error: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 },
  );
}

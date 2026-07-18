/**
 * @fileoverview GET /api/crowd — Live crowd intelligence endpoint.
 * Returns a time-seeded, deterministic crowd snapshot for a given stadium.
 */

import type { NextRequest } from "next/server";
import { generateCrowdSnapshot } from "@/services/crowd/crowd.service";
import { CrowdSnapshotSchema } from "@/lib/validators";
import { toApiError } from "@/lib/errors";
import { checkRateLimit } from "@/lib/utils";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from "@/lib/constants";
import type { CrowdSnapshot, ApiResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/crowd?stadiumId=metlife
 */
export async function GET(request: NextRequest): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
  const { allowed } = checkRateLimit(
    `crowd:${ip}`,
    RATE_LIMIT_MAX_REQUESTS * 2,
    RATE_LIMIT_WINDOW_MS,
  );
  if (!allowed) {
    return Response.json(
      { success: false, error: "Too many requests", code: "RATE_LIMIT_EXCEEDED" },
      { status: 429 },
    );
  }

  const stadiumId = request.nextUrl.searchParams.get("stadiumId");
  if (!stadiumId) {
    return Response.json(
      { success: false, error: "stadiumId is required", code: "VALIDATION_ERROR" },
      { status: 400 },
    );
  }

  try {
    const snapshot = generateCrowdSnapshot(stadiumId);
    const validated = CrowdSnapshotSchema.safeParse({
      ...snapshot,
      timestamp: new Date().toISOString(),
    });

    if (!validated.success) {
      return Response.json(
        { success: false, error: "Failed to generate crowd data", code: "INTERNAL_ERROR" },
        { status: 500 },
      );
    }

    return Response.json(
      { success: true, data: validated.data } satisfies ApiResponse<CrowdSnapshot>,
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error: unknown) {
    return Response.json({ success: false, ...toApiError(error) }, { status: 500 });
  }
}

export async function POST(): Promise<Response> {
  return Response.json(
    { success: false, error: "Method not allowed", code: "METHOD_NOT_ALLOWED" },
    { status: 405 },
  );
}

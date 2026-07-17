/**
 * @fileoverview Custom error classes for FanFlow AI.
 * Provides strongly-typed error hierarchy for predictable error handling.
 */

// ─── Base ─────────────────────────────────────────────────────────────────────

/**
 * Base application error with a machine-readable error code.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    // Fix prototype chain for `instanceof` checks in transpiled code
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── AI Errors ───────────────────────────────────────────────────────────────

/**
 * Thrown when an AI model call fails.
 */
export class AIError extends AppError {
  public readonly model: string;

  constructor(message: string, model: string) {
    super(message, "AI_ERROR", 502);
    this.name = "AIError";
    this.model = model;
  }
}

/**
 * Thrown when an AI response fails Zod schema validation.
 */
export class AIValidationError extends AppError {
  public readonly raw: unknown;

  constructor(message: string, raw: unknown) {
    super(message, "AI_VALIDATION_ERROR", 502);
    this.name = "AIValidationError";
    this.raw = raw;
  }
}

/**
 * Thrown when an AI model times out.
 */
export class AITimeoutError extends AppError {
  constructor(model: string) {
    super(`AI model '${model}' timed out`, "AI_TIMEOUT", 504);
    this.name = "AITimeoutError";
  }
}

// ─── Validation Errors ───────────────────────────────────────────────────────

/**
 * Thrown when request body fails Zod validation.
 */
export class ValidationError extends AppError {
  public readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, fieldErrors: Record<string, string[]> = {}) {
    super(message, "VALIDATION_ERROR", 400);
    this.name = "ValidationError";
    this.fieldErrors = fieldErrors;
  }
}

// ─── Network Errors ──────────────────────────────────────────────────────────

/**
 * Thrown when an external HTTP request fails.
 */
export class NetworkError extends AppError {
  constructor(message: string) {
    super(message, "NETWORK_ERROR", 503);
    this.name = "NetworkError";
  }
}

// ─── Rate Limit Errors ───────────────────────────────────────────────────────

/**
 * Thrown when a client exceeds the rate limit.
 */
export class RateLimitError extends AppError {
  public readonly retryAfterMs: number;

  constructor(retryAfterMs: number) {
    super("Too many requests. Please try again later.", "RATE_LIMIT_EXCEEDED", 429);
    this.name = "RateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

// ─── Not Found Errors ────────────────────────────────────────────────────────

/**
 * Thrown when a requested resource is not found.
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Converts any error into a safe, serialisable shape for API responses.
 */
export function toApiError(error: unknown): { error: string; code: string } {
  if (error instanceof AppError) {
    return { error: error.message, code: error.code };
  }
  if (error instanceof Error) {
    return { error: error.message, code: "INTERNAL_ERROR" };
  }
  return { error: "An unexpected error occurred", code: "INTERNAL_ERROR" };
}

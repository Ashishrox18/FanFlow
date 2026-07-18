import { describe, it, expect } from "vitest";
import {
  AppError,
  AIError,
  AIValidationError,
  AITimeoutError,
  ValidationError,
  NetworkError,
  RateLimitError,
  NotFoundError,
  toApiError,
} from "@/lib/errors";

describe("AppError", () => {
  it("sets message, code, and default statusCode", () => {
    const err = new AppError("test error", "TEST_CODE");
    expect(err.message).toBe("test error");
    expect(err.code).toBe("TEST_CODE");
    expect(err.statusCode).toBe(500);
    expect(err.name).toBe("AppError");
  });

  it("accepts custom statusCode", () => {
    const err = new AppError("not found", "NOT_FOUND", 404);
    expect(err.statusCode).toBe(404);
  });

  it("is instanceof Error", () => {
    expect(new AppError("x", "y")).toBeInstanceOf(Error);
  });

  it("is instanceof AppError", () => {
    expect(new AppError("x", "y")).toBeInstanceOf(AppError);
  });
});

describe("AIError", () => {
  it("sets model and code AI_ERROR", () => {
    const err = new AIError("Groq failed", "llama-3.3-70b");
    expect(err.model).toBe("llama-3.3-70b");
    expect(err.code).toBe("AI_ERROR");
    expect(err.statusCode).toBe(502);
    expect(err.name).toBe("AIError");
  });

  it("is instanceof AIError and AppError", () => {
    const err = new AIError("x", "model");
    expect(err).toBeInstanceOf(AIError);
    expect(err).toBeInstanceOf(AppError);
  });
});

describe("AIValidationError", () => {
  it("stores the raw response", () => {
    const raw = '{"bad": json}';
    const err = new AIValidationError("bad json", raw);
    expect(err.raw).toBe(raw);
    expect(err.code).toBe("AI_VALIDATION_ERROR");
    expect(err.statusCode).toBe(502);
    expect(err.name).toBe("AIValidationError");
  });

  it("stores complex raw objects", () => {
    const raw = { unexpected: true };
    const err = new AIValidationError("unexpected", raw);
    expect(err.raw).toEqual(raw);
  });
});

describe("AITimeoutError", () => {
  it("formats the model name in message", () => {
    const err = new AITimeoutError("gemini-1.5-flash");
    expect(err.message).toContain("gemini-1.5-flash");
    expect(err.code).toBe("AI_TIMEOUT");
    expect(err.statusCode).toBe(504);
    expect(err.name).toBe("AITimeoutError");
  });
});

describe("ValidationError", () => {
  it("stores field errors", () => {
    const fields = { email: ["Invalid email"] };
    const err = new ValidationError("Invalid request", fields);
    expect(err.fieldErrors).toEqual(fields);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.statusCode).toBe(400);
  });

  it("defaults to empty field errors", () => {
    const err = new ValidationError("Bad input");
    expect(err.fieldErrors).toEqual({});
  });
});

describe("NetworkError", () => {
  it("uses NETWORK_ERROR code and 503 status", () => {
    const err = new NetworkError("Connection refused");
    expect(err.code).toBe("NETWORK_ERROR");
    expect(err.statusCode).toBe(503);
    expect(err.name).toBe("NetworkError");
  });
});

describe("RateLimitError", () => {
  it("stores retryAfterMs", () => {
    const err = new RateLimitError(5000);
    expect(err.retryAfterMs).toBe(5000);
    expect(err.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(err.statusCode).toBe(429);
    expect(err.name).toBe("RateLimitError");
  });

  it("has a user-friendly message", () => {
    const err = new RateLimitError(1000);
    expect(err.message).toMatch(/too many requests/i);
  });
});

describe("NotFoundError", () => {
  it("includes resource name in message", () => {
    const err = new NotFoundError("Stadium");
    expect(err.message).toContain("Stadium");
    expect(err.code).toBe("NOT_FOUND");
    expect(err.statusCode).toBe(404);
  });
});

describe("toApiError", () => {
  it("serialises AppError subclasses correctly", () => {
    const err = new AIError("model failed", "groq");
    const result = toApiError(err);
    expect(result.error).toBe("model failed");
    expect(result.code).toBe("AI_ERROR");
  });

  it("serialises plain Error with INTERNAL_ERROR code", () => {
    const err = new Error("something broke");
    const result = toApiError(err);
    expect(result.error).toBe("something broke");
    expect(result.code).toBe("INTERNAL_ERROR");
  });

  it("handles non-Error objects", () => {
    const result = toApiError("string error");
    expect(result.error).toBe("An unexpected error occurred");
    expect(result.code).toBe("INTERNAL_ERROR");
  });

  it("handles null", () => {
    const result = toApiError(null);
    expect(result.error).toBe("An unexpected error occurred");
    expect(result.code).toBe("INTERNAL_ERROR");
  });

  it("handles RateLimitError correctly", () => {
    const err = new RateLimitError(3000);
    const result = toApiError(err);
    expect(result.code).toBe("RATE_LIMIT_EXCEEDED");
  });
});

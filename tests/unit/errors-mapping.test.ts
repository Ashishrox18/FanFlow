import { describe, it, expect } from "vitest";
import { toApiError, RateLimitError, ValidationError, AIError } from "@/lib/errors";

describe("errors-mapping utility", () => {
  it("maps app errors correctly using custom properties", () => {
    const rateLimit = new RateLimitError(5000);
    const apiError = toApiError(rateLimit);

    expect(apiError.code).toBe("RATE_LIMIT_EXCEEDED");
    expect(apiError.error).toBe("Too many requests. Please try again later.");
  });

  it("handles validation errors properly", () => {
    const validation = new ValidationError("Incorrect payload parameters");
    const apiError = toApiError(validation);

    expect(apiError.code).toBe("VALIDATION_ERROR");
    expect(apiError.error).toBe("Incorrect payload parameters");
  });

  it("gracefully falls back on standard JavaScript exceptions", () => {
    const stdError = new Error("Generic db connection timeout");
    const apiError = toApiError(stdError);

    expect(apiError.code).toBe("INTERNAL_ERROR");
    expect(apiError.error).toBe("Generic db connection timeout");
  });

  it("maps ai execution errors with status checks", () => {
    const aiErr = new AIError("LLM response failed", "gemini");
    const apiError = toApiError(aiErr);

    expect(aiErr.statusCode).toBe(502);
    expect(apiError.code).toBe("AI_ERROR");
  });
});

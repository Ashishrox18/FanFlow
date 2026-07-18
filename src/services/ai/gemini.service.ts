/**
 * @fileoverview Google Gemini AI service for deep reasoning and complex planning.
 * Uses gemini-1.5-flash for structured planning, routing, and multi-step reasoning.
 */

import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";
import { AIError, AITimeoutError, AIValidationError } from "@/lib/errors";
import { GEMINI_MODEL, AI_TEMPERATURE, AI_MAX_TOKENS, AI_TIMEOUT_MS } from "@/lib/constants";

// ─── Singleton ────────────────────────────────────────────────────────────────

let geminiInstance: GoogleGenerativeAI | null = null;

/**
 * Returns a singleton Gemini client. Initialises lazily.
 * @throws {AIError} if GEMINI_API_KEY is not configured.
 */
function getGeminiClient(): GoogleGenerativeAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new AIError("GEMINI_API_KEY is not configured", GEMINI_MODEL);
  }
  if (!geminiInstance) {
    geminiInstance = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return geminiInstance;
}

// ─── Generation Config ───────────────────────────────────────────────────────

const generationConfig: GenerationConfig = {
  temperature: AI_TEMPERATURE,
  maxOutputTokens: AI_MAX_TOKENS,
  responseMimeType: "application/json",
};

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Calls the Google Gemini API with a system and user prompt.
 * Enforces strict JSON output via responseMimeType and system instruction.
 *
 * @param systemPrompt - System instruction that describes the required JSON schema
 * @param userPrompt - The user's planning request
 * @returns Parsed JSON object from the model response
 * @throws {AIError | AITimeoutError | AIValidationError}
 */
export async function callGemini<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const client = getGeminiClient();

  const model = client.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
    generationConfig,
  });

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new AITimeoutError(GEMINI_MODEL)), AI_TIMEOUT_MS),
  );

  try {
    const result = await Promise.race([model.generateContent(userPrompt), timeoutPromise]);

    const raw = result.response.text();
    if (!raw) {
      throw new AIError("Empty response from Gemini", GEMINI_MODEL);
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new AIValidationError(`Gemini returned invalid JSON: ${raw}`, raw);
    }
  } catch (error: unknown) {
    if (
      error instanceof AIError ||
      error instanceof AITimeoutError ||
      error instanceof AIValidationError
    ) {
      throw error;
    }
    throw new AIError(
      `Gemini call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      GEMINI_MODEL,
    );
  }
}

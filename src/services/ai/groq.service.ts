/**
 * @fileoverview Groq AI service for fast conversational responses.
 * Uses llama-3.3-70b-versatile for low-latency FAQ and chat tasks.
 */

import Groq from "groq-sdk";
import { AIError, AITimeoutError, AIValidationError } from "@/lib/errors";
import { GROQ_MODEL, AI_TEMPERATURE, AI_MAX_TOKENS, AI_TIMEOUT_MS } from "@/lib/constants";

// ─── Singleton ────────────────────────────────────────────────────────────────

let groqInstance: Groq | null = null;

/**
 * Returns a singleton Groq client. Initialises lazily.
 * @throws {AIError} if GROQ_API_KEY is not configured.
 */
function getGroqClient(): Groq {
  if (!process.env.GROQ_API_KEY) {
    throw new AIError("GROQ_API_KEY is not configured", GROQ_MODEL);
  }
  if (!groqInstance) {
    groqInstance = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqInstance;
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Calls the Groq API with a system and user prompt.
 * Enforces strict JSON output via system prompt instructions.
 *
 * @param systemPrompt - Instruction prompt that includes the required JSON schema
 * @param userPrompt - The user's query
 * @returns Parsed JSON object from the model response
 * @throws {AIError | AITimeoutError | AIValidationError}
 */
export async function callGroq<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const client = getGroqClient();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const completion = await client.chat.completions.create(
      {
        model: GROQ_MODEL,
        temperature: AI_TEMPERATURE,
        max_tokens: AI_MAX_TOKENS,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      },
      { signal: controller.signal },
    );

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new AIError("Empty response from Groq", GROQ_MODEL);
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      throw new AIValidationError(`Groq returned invalid JSON: ${raw}`, raw);
    }
  } catch (error: unknown) {
    if (error instanceof AIError || error instanceof AIValidationError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new AITimeoutError(GROQ_MODEL);
    }
    throw new AIError(
      `Groq call failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      GROQ_MODEL,
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

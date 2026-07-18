# Decision Engine Documentation

FanFlow AI uses an intelligent routing and planning layer to select the appropriate AI engine based on latency requirements and query complexity.

## LLM Models Applied

1. **Llama-3.3-70b-versatile (via Groq)**: High-speed, safety-critical inference used for the general chat assistant and immediate emergency guides.
2. **Gemini-1.5-Flash (via Google AI)**: Reasoning engine used for Multi-Step navigation routing, transport planning, and optimal arrival schedules.

*Note: In environments where Gemini service is unavailable, routing falls back securely to Llama-3.3 on Groq.*

## Classification Logic

When a user submits a conversational query, `RouterService.classifyQuery` scans for spatial or complex logistics keywords (e.g., "route", "plan", "navigate", "arrive", "transport"). 
- If found, the query is classified as **complex** and dispatched to Gemini.
- If not, it falls back to a **simple** classification and executes via Groq.

## Strict JSON Output Enforcement

Every system prompt contains detailed instructions forcing the model to respond in a strict JSON format. 
1. **System Prompt Constraint**: "Return ONLY valid JSON matching this exact schema. Never add markdown, code blocks, or free text outside JSON."
2. **Server-Side Validation**: Before returning the response to the client, the Route Handler parses the JSON and runs it against a corresponding Zod validation schema (e.g., `NavigationPlanSchema`).
3. **Recovery Flow**: If the AI returns malformed JSON or fails the schema check, the system catches the exception and returns a fallback JSON response, preventing app crashes.

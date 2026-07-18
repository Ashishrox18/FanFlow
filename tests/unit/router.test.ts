import { describe, it, expect } from "vitest";
import {
  classifyQuery,
  selectModel,
  buildAssistantSystemPrompt,
  buildArrivalSystemPrompt,
  buildNavigationSystemPrompt,
  buildTransportSystemPrompt,
  buildEmergencySystemPrompt,
} from "@/services/ai/router.service";

describe("classifyQuery", () => {
  it('classifies simple queries as "simple"', () => {
    expect(classifyQuery("Where is the nearest food stall?")).toBe("simple");
    expect(classifyQuery("What time does the match start?")).toBe("simple");
    expect(classifyQuery("Thank you")).toBe("simple");
  });

  it('classifies complex queries as "complex"', () => {
    expect(classifyQuery("Can you plan my arrival?")).toBe("complex");
    expect(classifyQuery("What is the best route to gate A?")).toBe("complex");
    expect(classifyQuery("Plan the transport schedule for me")).toBe("complex");
    expect(classifyQuery("I need to navigate to section 12")).toBe("complex");
    expect(classifyQuery("There is an emergency at gate B")).toBe("complex");
    expect(classifyQuery("How to get to the exit?")).toBe("complex");
  });

  it("is case-insensitive", () => {
    expect(classifyQuery("PLAN MY ARRIVAL")).toBe("complex");
    expect(classifyQuery("ROUTE TO GATE A")).toBe("complex");
  });

  it("returns simple for empty string", () => {
    expect(classifyQuery("")).toBe("simple");
  });
});

describe("selectModel", () => {
  it('returns "groq" for simple queries', () => {
    expect(selectModel("simple")).toBe("groq");
  });

  it('returns "gemini" for complex queries', () => {
    expect(selectModel("complex")).toBe("gemini");
  });
});

describe("buildAssistantSystemPrompt", () => {
  it("includes language and stadium name", () => {
    const prompt = buildAssistantSystemPrompt("Spanish", "MetLife Stadium");
    expect(prompt).toContain("Spanish");
    expect(prompt).toContain("MetLife Stadium");
  });

  it("includes the JSON schema for assistant responses", () => {
    const prompt = buildAssistantSystemPrompt("English", "SoFi Stadium");
    expect(prompt).toContain('"answer"');
    expect(prompt).toContain('"category"');
    expect(prompt).toContain("Navigation|Emergency|Accessibility|Transportation|General|Ticketing");
  });

  it("instructs the model to respond in the given language", () => {
    const prompt = buildAssistantSystemPrompt("Hindi", "Azteca");
    expect(prompt).toContain("Always respond in Hindi");
  });

  it("instructs the model to return only valid JSON", () => {
    const prompt = buildAssistantSystemPrompt("English", "Stadium");
    expect(prompt).toContain("ONLY return valid JSON");
  });
});

describe("buildArrivalSystemPrompt", () => {
  it("includes stadium name and language", () => {
    const prompt = buildArrivalSystemPrompt("AT&T Stadium", "Portuguese");
    expect(prompt).toContain("AT&T Stadium");
    expect(prompt).toContain("Portuguese");
  });

  it("includes all required JSON fields", () => {
    const prompt = buildArrivalSystemPrompt("Stadium", "English");
    expect(prompt).toContain('"recommendedGate"');
    expect(prompt).toContain('"bestArrivalWindow"');
    expect(prompt).toContain('"expectedCrowdLevel"');
    expect(prompt).toContain('"walkingDistance"');
    expect(prompt).toContain('"walkingTime"');
    expect(prompt).toContain('"reason"');
    expect(prompt).toContain('"alternative"');
    expect(prompt).toContain('"tips"');
  });
});

describe("buildNavigationSystemPrompt", () => {
  it("includes accessibility warning when mode is enabled", () => {
    const prompt = buildNavigationSystemPrompt("MetLife", true, "English");
    expect(prompt).toContain("accessibility routing");
    expect(prompt).toContain("avoid stairs");
  });

  it("does not include accessibility warning when mode is disabled", () => {
    const prompt = buildNavigationSystemPrompt("MetLife", false, "English");
    expect(prompt).not.toContain("avoid stairs");
  });

  it("sets avoidStairs correctly in JSON schema", () => {
    const prompt = buildNavigationSystemPrompt("MetLife", true, "English");
    expect(prompt).toContain('"avoidStairs": true');
  });

  it("includes all required navigation JSON fields", () => {
    const prompt = buildNavigationSystemPrompt("Stadium", false, "English");
    expect(prompt).toContain('"shortestRoute"');
    expect(prompt).toContain('"leastCrowdedRoute"');
    expect(prompt).toContain('"walkingTime"');
    expect(prompt).toContain('"crowdLevel"');
  });
});

describe("buildTransportSystemPrompt", () => {
  it("includes phase in the prompt", () => {
    const before = buildTransportSystemPrompt("Stadium", "before", "English");
    expect(before).toContain("before");

    const after = buildTransportSystemPrompt("Stadium", "after", "French");
    expect(after).toContain("after");
  });

  it("includes all valid transport modes in schema", () => {
    const prompt = buildTransportSystemPrompt("Stadium", "before", "English");
    expect(prompt).toContain("Metro|Bus|Taxi|Walking|Ride-share");
  });

  it("includes the language instruction", () => {
    const prompt = buildTransportSystemPrompt("Stadium", "after", "Japanese");
    expect(prompt).toContain("Japanese");
  });
});

describe("buildEmergencySystemPrompt", () => {
  it("includes stadium name and language", () => {
    const prompt = buildEmergencySystemPrompt("NRG Stadium", "Arabic");
    expect(prompt).toContain("NRG Stadium");
    expect(prompt).toContain("Arabic");
  });

  it("emphasises safety as highest priority", () => {
    const prompt = buildEmergencySystemPrompt("Stadium", "English");
    expect(prompt.toLowerCase()).toContain("safety");
  });

  it("includes all required emergency JSON fields", () => {
    const prompt = buildEmergencySystemPrompt("Stadium", "English");
    expect(prompt).toContain('"immediateAction"');
    expect(prompt).toContain('"steps"');
    expect(prompt).toContain('"contactNumber"');
    expect(prompt).toContain('"nearestExit"');
    expect(prompt).toContain('"estimatedResponseTime"');
  });
});

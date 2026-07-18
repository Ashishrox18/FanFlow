import { describe, it, expect } from "vitest";
import {
  buildAssistantSystemPrompt,
  buildArrivalSystemPrompt,
  buildNavigationSystemPrompt,
  buildTransportSystemPrompt,
  buildEmergencySystemPrompt,
} from "@/services/ai/router.service";

describe("AI prompt versioning and stability", () => {
  it("generates correct assistant prompt schema", () => {
    const prompt = buildAssistantSystemPrompt("Spanish", "Estadio Azteca");
    expect(prompt).toContain("Estadio Azteca");
    expect(prompt).toContain("Spanish");
    expect(prompt).toContain("JSON schema");
    expect(prompt).toContain('"answer":');
  });

  it("injects accessibility guidance when enabled", () => {
    const accessiblePrompt = buildNavigationSystemPrompt("MetLife Stadium", true, "English");
    expect(accessiblePrompt).toContain("IMPORTANT: The user requires accessibility routing. Always avoid stairs.");
    expect(accessiblePrompt).toContain('"avoidStairs": true');

    const normalPrompt = buildNavigationSystemPrompt("MetLife Stadium", false, "English");
    expect(normalPrompt).not.toContain("Always avoid stairs");
    expect(normalPrompt).toContain('"avoidStairs": false');
  });

  it("incorporates matches phases dynamically into transport plans", () => {
    const beforePrompt = buildTransportSystemPrompt("BMO Field", "before", "French");
    expect(beforePrompt).toContain("French");
    expect(beforePrompt).toContain("before-match");

    const afterPrompt = buildTransportSystemPrompt("BMO Field", "after", "French");
    expect(afterPrompt).toContain("after-match");
  });

  it("generates structured schema for emergencies", () => {
    const prompt = buildEmergencySystemPrompt("SoFi Stadium", "English");
    expect(prompt).toContain("SoFi Stadium");
    expect(prompt).toContain('"immediateAction":');
    expect(prompt).toContain('"nearestExit":');
  });

  it("includes custom response language instructions for arrival prompts", () => {
    const prompt = buildArrivalSystemPrompt("MetLife", "Hindi");
    expect(prompt).toContain("Hindi");
    expect(prompt).toContain('"recommendedGate":');
  });
});

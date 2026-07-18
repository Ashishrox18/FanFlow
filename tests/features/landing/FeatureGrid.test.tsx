import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureGrid } from "@/features/landing/FeatureGrid";

describe("FeatureGrid landing feature component", () => {
  it("renders feature overview details and cards", () => {
    render(<FeatureGrid />);

    // Verification of cards
    expect(screen.getByText("AI Navigation")).toBeDefined();
    expect(screen.getByText("Crowd Tracker")).toBeDefined();
    expect(screen.getByText("AI Assistant")).toBeDefined();
    expect(screen.getByText("Transport Hub")).toBeDefined();
    expect(screen.getByText("Emergency Response")).toBeDefined();
  });
});

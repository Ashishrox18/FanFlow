import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouteStepList } from "@/components/navigation/RouteStepList";
import type { RouteStep } from "@/types";

describe("RouteStepList component", () => {
  const mockSteps: RouteStep[] = [
    { stepNumber: 1, instruction: "Enter gate C", landmark: "ticketing", isAccessible: true },
    { stepNumber: 2, instruction: "Turn left towards elevator 2", isAccessible: true },
  ];

  it("renders steps, landmarks, and accessibility badges correctly", () => {
    render(<RouteStepList steps={mockSteps} />);

    // Steps details
    expect(screen.getByText("Enter gate C")).toBeDefined();
    expect(screen.getByText("Turn left towards elevator 2")).toBeDefined();

    // Landmark verification
    expect(screen.getByText(/Near ticketing/i)).toBeDefined();

    // Verification of numbers labels
    expect(screen.getByText("1")).toBeDefined();
  });

  it("renders empty list container when no steps exist", () => {
    const { container } = render(<RouteStepList steps={[]} />);
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CrowdCard } from "@/components/crowd/CrowdCard";
import type { CrowdZone } from "@/types";

describe("CrowdCard component", () => {
  const mockZone: CrowdZone = {
    id: "concessions-1",
    name: "North Food Court",
    type: "Food",
    crowdLevel: "Medium",
    capacityPercent: 65,
    waitTimeMinutes: 8,
    isOperational: true,
  };

  it("renders layout parameters and details correctly", () => {
    render(<CrowdCard zone={mockZone} index={0} />);

    // Name and status details
    expect(screen.getByText("North Food Court")).toBeDefined();

    // Congestion and capacity metrics
    expect(screen.getByText("Medium")).toBeDefined();
    expect(screen.getByText("65%")).toBeDefined();
    expect(screen.getByText("8")).toBeDefined();
  });

  it("adds specific indicators for emergency or custom status levels", () => {
    const closedZone: CrowdZone = { ...mockZone, isOperational: false, waitTimeMinutes: 0 };
    render(<CrowdCard zone={closedZone} index={1} />);

    expect(screen.getByText(/closed/i)).toBeDefined();
  });
});

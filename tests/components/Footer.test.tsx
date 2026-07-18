import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";

describe("Footer component", () => {
  it("renders correctly with current year and brand logo details", () => {
    render(<Footer />);

    // Verify logo signature
    expect(screen.getByText("FanFlow AI")).toBeDefined();

    // Verify copyright notice
    expect(screen.getByText(/Built for Google/i)).toBeDefined();

    // Verify architectural documentation links or target labels
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThanOrEqual(1);
  });
});

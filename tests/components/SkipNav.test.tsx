import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkipNav } from "@/components/layout/SkipNav";

describe("SkipNav component", () => {
  it("renders with a target link to main-content section", () => {
    render(<SkipNav />);

    const link = screen.getByRole("link", { name: /Skip to main content/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("#main-content");
  });
});

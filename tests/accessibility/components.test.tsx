import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { CrowdBadge } from "@/components/crowd/CrowdBadge";
import { SkipNav } from "@/components/layout/SkipNav";
import { Skeleton } from "@/components/ui/Skeleton";

describe("Accessibility", () => {
  it("CrowdBadge should have no a11y violations", async () => {
    const { container } = render(<CrowdBadge level="High" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("SkipNav should have no a11y violations", async () => {
    const { container } = render(<SkipNav />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("Skeleton should have no a11y violations", async () => {
    const { container } = render(<Skeleton aria-label="Loading something" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

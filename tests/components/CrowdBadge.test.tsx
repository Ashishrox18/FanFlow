import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { CrowdBadge } from "@/components/crowd/CrowdBadge";

describe("CrowdBadge — rendering", () => {
  it("renders 'Low' level with label", () => {
    render(<CrowdBadge level="Low" />);
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("renders 'Medium' level with label", () => {
    render(<CrowdBadge level="Medium" />);
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders 'High' level with label", () => {
    render(<CrowdBadge level="High" />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("does not render label when showLabel is false", () => {
    render(<CrowdBadge level="High" showLabel={false} />);
    expect(screen.queryByText("High")).not.toBeInTheDocument();
  });
});

describe("CrowdBadge — ARIA", () => {
  it("has role=status", () => {
    render(<CrowdBadge level="Medium" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it.each(["Low", "Medium", "High"] as const)(
    'has accessible label "Crowd level: %s"',
    (level) => {
      render(<CrowdBadge level={level} />);
      expect(screen.getByRole("status")).toHaveAttribute("aria-label", `Crowd level: ${level}`);
    },
  );

  it("dot span has aria-hidden", () => {
    const { container } = render(<CrowdBadge level="Low" />);
    const dot = container.querySelector("[aria-hidden='true']");
    expect(dot).toBeInTheDocument();
  });
});

describe("CrowdBadge — accessibility (axe)", () => {
  it("has no a11y violations for Low", async () => {
    const { container } = render(<CrowdBadge level="Low" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no a11y violations for Medium", async () => {
    const { container } = render(<CrowdBadge level="Medium" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no a11y violations for High", async () => {
    const { container } = render(<CrowdBadge level="High" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no a11y violations when showLabel is false", async () => {
    const { container } = render(<CrowdBadge level="Low" showLabel={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CrowdBadge — size prop", () => {
  it("renders in sm size", () => {
    const { container } = render(<CrowdBadge level="Low" size="sm" />);
    expect(container.firstChild).toHaveClass("px-2", "py-0.5", "text-xs");
  });

  it("renders in md size by default", () => {
    const { container } = render(<CrowdBadge level="Low" />);
    expect(container.firstChild).toHaveClass("px-3", "py-1", "text-sm");
  });
});

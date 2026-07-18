import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { Skeleton, CrowdGridSkeleton, ChatSkeleton } from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it("renders with default aria-label", () => {
    render(<Skeleton />);
    const el = screen.getByRole("status");
    expect(el).toHaveAttribute("aria-label", "Loading...");
  });

  it("renders with custom aria-label", () => {
    render(<Skeleton aria-label="Loading crowd data" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Loading crowd data");
  });

  it("has aria-busy=true", () => {
    render(<Skeleton />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
  });

  it("applies custom className", () => {
    const { container } = render(<Skeleton className="h-10 w-10" />);
    expect(container.firstChild).toHaveClass("h-10", "w-10");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Skeleton aria-label="Loading something" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CrowdGridSkeleton", () => {
  it("renders default of 6 skeleton cards", () => {
    render(<CrowdGridSkeleton />);
    // The outer div has role=status
    const status = screen.getByRole("status", { name: "Loading crowd data..." });
    expect(status).toBeInTheDocument();
  });

  it("renders custom count of skeleton cards", () => {
    const { container } = render(<CrowdGridSkeleton count={3} />);
    // Each card is a div inside the grid — there should be 3
    const gridChildren = container.querySelector('[aria-label="Loading crowd data..."]')?.children;
    expect(gridChildren).toHaveLength(3);
  });

  it("has accessible label", () => {
    render(<CrowdGridSkeleton />);
    expect(screen.getByLabelText("Loading crowd data...")).toBeInTheDocument();
  });
});

describe("ChatSkeleton", () => {
  it("renders at least one role=status element", () => {
    render(<ChatSkeleton />);
    const statuses = screen.getAllByRole("status");
    expect(statuses.length).toBeGreaterThan(0);
  });

  it("renders with loading response label", () => {
    render(<ChatSkeleton />);
    expect(screen.getByLabelText("Loading response...")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<ChatSkeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

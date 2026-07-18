import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect, vi } from "vitest";
import { HeroSection } from "@/features/landing/HeroSection";
import { FeatureGrid } from "@/features/landing/FeatureGrid";
import { StadiumSelector } from "@/features/landing/StadiumSelector";

// Mock framer-motion to avoid animation ticks in jest-axe
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

describe("A11y Page Section Audits", () => {
  it("HeroSection should have no a11y violations", async () => {
    const { container } = render(<HeroSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("FeatureGrid should have no a11y violations", async () => {
    const { container } = render(<FeatureGrid />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("StadiumSelector should have no a11y violations", async () => {
    const { container } = render(<StadiumSelector />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

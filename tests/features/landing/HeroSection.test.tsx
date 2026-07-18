import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/features/landing/HeroSection";

describe("HeroSection landing feature component", () => {
  it("renders correctly with primary taglines and CTA navigation links", () => {
    render(<HeroSection />);

    // Brand and headline tags
    expect(screen.getByText("FanFlow AI")).toBeDefined();
    expect(screen.getByText(/Your intelligent matchday assistant/i)).toBeDefined();

    // CTA routing links
    const launchChat = screen.getByRole("link", { name: /Launch Assistant/i });
    expect(launchChat).toBeDefined();
    expect(launchChat.getAttribute("href")).toBe("/assistant");
  });
});

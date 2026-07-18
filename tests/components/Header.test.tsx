import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/layout/Header";
import { useAppStore } from "@/stores/app.store";

// Mock next-themes hook
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: vi.fn(),
  }),
}));

describe("Header component", () => {
  it("renders navigation brand, toggles, and selectors", () => {
    useAppStore.setState({ language: "English", selectedStadiumId: "sofi" });

    render(<Header />);

    // Brand logo title
    expect(screen.getByText("FanFlow AI")).toBeDefined();

    // Switch button for dark/light themes
    const themeBtn = screen.getByLabelText(/Switch to/i);
    expect(themeBtn).toBeDefined();

    // Verify nav links presence
    expect(screen.getByText("Navigate")).toBeDefined();
    expect(screen.getByText("Crowd")).toBeDefined();
    expect(screen.getByText("Assistant")).toBeDefined();
  });

  it("handles mobile layout trigger clicks", () => {
    render(<Header />);

    const menuBtn = screen.getByLabelText(/Open menu/i);
    expect(menuBtn).toBeDefined();

    // Expand mobile nav drawer
    fireEvent.click(menuBtn);

    // Verify close menu accessibility description
    expect(screen.getByLabelText(/Close menu/i)).toBeDefined();
  });
});

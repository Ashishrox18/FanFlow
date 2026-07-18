import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, it, expect } from "vitest";
import { MessageBubble } from "@/components/chat/MessageBubble";
import type { ChatMessage } from "@/types";

const makeMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
  id: "test-id",
  role: "user",
  content: "Hello, where is Gate A?",
  timestamp: new Date("2026-07-18T14:30:00"),
  language: "English",
  ...overrides,
});

describe("MessageBubble — rendering", () => {
  it("renders user message content", () => {
    render(<MessageBubble message={makeMessage({ content: "Where is the restroom?" })} />);
    expect(screen.getByText("Where is the restroom?")).toBeInTheDocument();
  });

  it("renders assistant message content", () => {
    render(
      <MessageBubble
        message={makeMessage({ role: "assistant", content: "The restroom is on Level 2." })}
      />,
    );
    expect(screen.getByText("The restroom is on Level 2.")).toBeInTheDocument();
  });

  it("renders a formatted time string", () => {
    render(<MessageBubble message={makeMessage()} />);
    // formatTime returns something like "02:30 PM"
    const timeElements = screen.getAllByText(/AM|PM/i);
    expect(timeElements.length).toBeGreaterThan(0);
  });
});

describe("MessageBubble — layout", () => {
  it("user messages are aligned right (flex-row-reverse)", () => {
    const { container } = render(<MessageBubble message={makeMessage({ role: "user" })} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex-row-reverse");
  });

  it("assistant messages are aligned left (flex-row)", () => {
    const { container } = render(<MessageBubble message={makeMessage({ role: "assistant" })} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("flex-row");
  });
});

describe("MessageBubble — accessibility", () => {
  it("avatar has aria-hidden", () => {
    const { container } = render(<MessageBubble message={makeMessage()} />);
    const hidden = container.querySelector("[aria-hidden='true']");
    expect(hidden).toBeInTheDocument();
  });

  it("has no a11y violations for user message", async () => {
    const { container } = render(<MessageBubble message={makeMessage({ role: "user" })} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no a11y violations for assistant message", async () => {
    const { container } = render(
      <MessageBubble
        message={makeMessage({ role: "assistant", content: "Gate A is to the north." })}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("MessageBubble — edge cases", () => {
  it("renders multi-line content preserving whitespace", () => {
    const content = "Line 1\nLine 2\nLine 3";
    render(<MessageBubble message={makeMessage({ content })} />);
    const el = screen.getByText((txt, element) => {
      return (
        element?.tagName.toLowerCase() === "p" && txt.includes("Line 1") && txt.includes("Line 2")
      );
    });
    expect(el).toHaveClass("whitespace-pre-wrap");
  });

  it("renders very long content without breaking layout", () => {
    const longContent = "A".repeat(500);
    render(<MessageBubble message={makeMessage({ content: longContent })} />);
    expect(screen.getByText(longContent)).toBeInTheDocument();
  });
});

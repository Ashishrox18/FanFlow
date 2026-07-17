import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { toHaveNoViolations } from "jest-axe";

expect.extend(matchers);
expect.extend(toHaveNoViolations);

// Mock Next.js router
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock ResizeObserver for Recharts / Framer Motion
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

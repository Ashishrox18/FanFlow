/**
 * @fileoverview SkipNav — Accessibility skip navigation link.
 * Allows keyboard users to bypass the header and go directly to main content.
 */

import Link from "next/link";

/**
 * Renders a visually hidden skip link that becomes visible on focus.
 * Targets #main-content, which must exist in the layout.
 */
export function SkipNav() {
  return (
    <Link
      href="#main-content"
      className="
        absolute left-4 top-4 z-[9999]
        -translate-y-16 transform
        rounded-md bg-primary px-4 py-2
        text-sm font-semibold text-primary-foreground
        shadow-lg transition-transform duration-200
        focus:translate-y-0
      "
      aria-label="Skip to main content"
    >
      Skip to main content
    </Link>
  );
}

/**
 * @fileoverview Global 404 Not Found page for FanFlow AI.
 */

import Link from "next/link";
import type { Metadata } from "next";
import { MapPinOff, Home, Compass } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Page Not Found | ${APP_NAME}`,
  description: "The page you are looking for could not be found.",
};

/**
 * Renders the 404 Not Found page with accessible navigation options.
 */
export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center"
      role="main"
      aria-labelledby="not-found-heading"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <MapPinOff className="h-8 w-8 text-primary" aria-hidden="true" />
      </div>

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
        <h1
          id="not-found-heading"
          className="mt-2 text-3xl font-bold tracking-tight text-foreground"
        >
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-sm">
          That page doesn&apos;t exist. Head back to the matchday assistant or explore our features.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to home
        </Link>

        <Link
          href="/assistant"
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Compass className="h-4 w-4" aria-hidden="true" />
          AI Assistant
        </Link>
      </div>
    </div>
  );
}

/**
 * @fileoverview Global error boundary for FanFlow AI.
 * Catches unhandled errors in the React tree and shows a recovery UI.
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error UI shown when an unhandled error bubbles to the root.
 * Provides reset and home navigation actions.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error tracking service in production
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle className="h-8 w-8 text-red-400" aria-hidden="true" />
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          An unexpected error occurred. Our team has been notified. You can try refreshing the page
          or returning home.
        </p>
        {process.env.NODE_ENV === "development" && error.message && (
          <p className="mt-3 rounded-md bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
            {error.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try again
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Go home
        </Link>
      </div>
    </div>
  );
}

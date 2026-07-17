/**
 * @fileoverview Application footer.
 */

import Link from "next/link";
import { Zap } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/50 glass mt-auto" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="font-bold">{APP_NAME}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for Google PromptWars 2026.
          </p>
          <div className="flex gap-4">
            <Link href="/accessibility" className="text-sm text-muted-foreground hover:text-foreground">
              Accessibility
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

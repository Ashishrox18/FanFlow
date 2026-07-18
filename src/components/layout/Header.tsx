/**
 * @fileoverview Application header with navigation, language selector, and accessibility toggle.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/stores/app.store";
import { APP_NAME, SUPPORTED_LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Accessibility, Zap, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import type { Language } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

// ─── Nav Links ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/arrival", label: "Arrival" },
  { href: "/assistant", label: "Assistant" },
  { href: "/crowd", label: "Crowd" },
  { href: "/navigate", label: "Navigate" },
  { href: "/transport", label: "Transport" },
  { href: "/emergency", label: "Emergency" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Primary application header with responsive navigation,
 * language selector, accessibility toggle, and dark mode toggle.
 */
export function Header() {
  const pathname = usePathname();
  const { language, setLanguage, isAccessibilityMode, toggleAccessibilityMode } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleMobile = useCallback(() => setMobileOpen((o) => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <header role="banner" className="sticky top-0 z-50 w-full glass border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg focus-visible:ring-2"
          aria-label={`${APP_NAME} home`}
          onClick={closeMobile}
        >
          <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="gradient-text">{APP_NAME}</span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="relative hidden sm:block">
            <label htmlFor="language-select" className="sr-only">
              Select language
            </label>
            <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted px-2 py-1.5">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
                aria-label="Select assistant language"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.label}
                    className="bg-background text-foreground"
                  >
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Accessibility toggle */}
          <button
            onClick={toggleAccessibilityMode}
            className={cn(
              "rounded-md p-2 transition-colors",
              isAccessibilityMode
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-pressed={isAccessibilityMode}
            aria-label={
              isAccessibilityMode ? "Disable accessibility mode" : "Enable accessibility mode"
            }
            title="Accessibility mode (wheelchair-friendly routes)"
          >
            <Accessibility className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={
              mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {!mounted ? (
              <div className="h-4 w-4" />
            ) : theme === "dark" ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobile}
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/50 bg-background/95 md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
              {/* Language select on mobile */}
              <div className="mt-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <label htmlFor="language-select-mobile" className="sr-only">
                  Select language
                </label>
                <select
                  id="language-select-mobile"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent text-sm text-foreground outline-none"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option
                      key={lang.code}
                      value={lang.label}
                      className="bg-background text-foreground"
                    >
                      {lang.flag} {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

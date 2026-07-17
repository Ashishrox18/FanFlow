/**
 * @fileoverview ThemeProvider — wraps next-themes for dark/light mode support.
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Wraps next-themes ThemeProvider for use in the App Router.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

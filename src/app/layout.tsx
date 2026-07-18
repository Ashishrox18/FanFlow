/**
 * @fileoverview Root layout for FanFlow AI.
 * Sets up global providers, fonts, metadata, and accessibility features.
 */

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "sonner";
import { SkipNav } from "@/components/layout/SkipNav";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import "./globals.css";

// ─── Font ─────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "FanFlow AI is your intelligent matchday assistant for FIFA World Cup 2026. Navigate stadiums, plan arrivals, get real-time crowd intelligence, and access multilingual AI assistance.",
  keywords: [
    "FIFA World Cup 2026",
    "stadium assistant",
    "AI navigation",
    "crowd intelligence",
    "matchday",
    "accessibility",
    "multilingual",
  ],
  authors: [{ name: "FanFlow AI Team" }],
  creator: "FanFlow AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: APP_NAME,
    description: APP_TAGLINE,
    siteName: APP_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_TAGLINE,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0f1e" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SkipNav />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Toaster
            position="top-right"
            richColors
            theme="dark"
            toastOptions={{
              style: { fontFamily: "var(--font-inter)" },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

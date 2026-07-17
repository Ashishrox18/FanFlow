/**
 * @fileoverview Landing page — FanFlow AI home.
 * Stadium selector, hero, feature overview, and call-to-action.
 */

import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/features/landing/HeroSection";
import { StadiumSelector } from "@/features/landing/StadiumSelector";
import { FeatureGrid } from "@/features/landing/FeatureGrid";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} — ${APP_TAGLINE}`,
  description:
    "AI-powered matchday assistant for FIFA World Cup 2026. Navigate stadiums, manage crowds, and get real-time AI guidance.",
};

/**
 * Home page — entry point for the user journey.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <div className="hero-gradient">
        <HeroSection />
        <StadiumSelector />
        <FeatureGrid />
      </div>
    </>
  );
}

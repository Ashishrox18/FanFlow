/**
 * @fileoverview HeroSection — landing page hero with motion and CTA.
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Map, Zap, ShieldAlert } from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section
      className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-32"
      aria-labelledby="hero-heading"
    >
      <div className="text-center">
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block text-foreground">Welcome to</span>
          <span className="block gradient-text mt-1">{APP_NAME}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          {APP_TAGLINE} Experience the FIFA World Cup 2026 with real-time crowd
          intelligence, AI-powered navigation, and seamless accessibility.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-10 flex max-w-sm flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Link
            href="/assistant"
            className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Zap className="h-4 w-4" aria-hidden="true" />
            Launch Assistant
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
          <Link
            href="/crowd"
            className="flex items-center justify-center gap-2 rounded-full glass px-8 py-3.5 text-sm font-semibold text-foreground transition-all hover:bg-muted focus-visible:ring-2"
          >
            <Map className="h-4 w-4 text-brand-secondary" aria-hidden="true" />
            Live Crowd Map
          </Link>
          <Link
            href="/emergency"
            className="flex items-center justify-center gap-2 rounded-full bg-brand-danger/10 px-8 py-3.5 text-sm font-semibold text-brand-danger transition-all hover:bg-brand-danger/20 focus-visible:ring-2 focus-visible:ring-brand-danger"
          >
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            Emergency
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

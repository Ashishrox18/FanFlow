/**
 * @fileoverview FeatureGrid — overview of application capabilities on landing page.
 */

"use client";

import { motion } from "framer-motion";
import { Map, MessageSquare, Accessibility, Train, ShieldAlert, Clock } from "lucide-react";

const FEATURES = [
  {
    name: "Live Crowd Intelligence",
    description: "Real-time congestion tracking across gates, food courts, and restrooms.",
    icon: Map,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    name: "Multilingual Assistant",
    description: "Instant help in 7 languages powered by fast AI conversational routing.",
    icon: MessageSquare,
    color: "text-brand-secondary",
    bg: "bg-brand-secondary/10",
  },
  {
    name: "Accessibility Routing",
    description: "Smart pathfinding avoiding stairs, prioritizing elevators and ramps.",
    icon: Accessibility,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    name: "Transport Planning",
    description: "Pre-match and post-match transit recommendations based on live data.",
    icon: Train,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    name: "Emergency Guidance",
    description: "Immediate step-by-step instructions for medical or security incidents.",
    icon: ShieldAlert,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    name: "Arrival Optimization",
    description: "Calculates the best time and gate to arrive at to beat the crowds.",
    icon: Clock,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
];

export function FeatureGrid() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="features-heading"
    >
      <div className="text-center">
        <h2
          id="features-heading"
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          Everything You Need for Matchday
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Powered by advanced Generative AI to ensure a smooth, accessible, and safe tournament
          experience.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass relative flex flex-col gap-4 rounded-2xl p-6 transition-shadow hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}
              >
                <Icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{feature.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

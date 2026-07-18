/**
 * @fileoverview Arrival Planner Page.
 * Optimizes the best time and gate to arrive at the stadium.
 */

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CrowdBadge } from "@/components/crowd/CrowdBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppStore, useSelectedStadium } from "@/stores/app.store";
import { TRANSPORT_MODES } from "@/lib/constants";
import type { ArrivalPlan, TransportMode, ApiResponse } from "@/types";
import { Clock, MapPin, Loader2, AlertCircle, ArrowRight, Lightbulb } from "lucide-react";

export default function ArrivalPage() {
  const stadium = useSelectedStadium();

  const [currentLocation, setCurrentLocation] = useState("");
  const [transportMode, setTransportMode] = useState<TransportMode>("Metro");
  const [desiredArrivalTime, setDesiredArrivalTime] = useState("");

  const [plan, setPlan] = useState<ArrivalPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLocation.trim() || !desiredArrivalTime.trim()) return;

    setIsLoading(true);
    setError(null);
    setPlan(null);

    const { language } = useAppStore.getState();

    try {
      const res = await fetch("/api/ai/arrival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stadiumId: stadium.id,
          currentLocation,
          transportMode,
          desiredArrivalTime,
          language,
        }),
      });

      const result: ApiResponse<ArrivalPlan> = (await res.json()) as ApiResponse<ArrivalPlan>;
      if (!result.success) throw new Error(result.error);
      setPlan(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate arrival plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main
        className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6 lg:p-8"
        aria-labelledby="arrival-heading"
      >
        <header className="mb-8">
          <h1 id="arrival-heading" className="text-3xl font-bold tracking-tight text-foreground">
            Arrival Planner
          </h1>
          <p className="mt-2 text-muted-foreground">
            Beat the crowds. Get the optimal arrival time and gate for {stadium.name}.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="glass rounded-xl border border-border/50 p-5 shadow-sm"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="mb-1.5 block text-sm font-medium">
                    Starting Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    required
                    value={currentLocation}
                    onChange={(e) => setCurrentLocation(e.target.value)}
                    placeholder="e.g. Downtown Hotel"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="mode" className="mb-1.5 block text-sm font-medium">
                    Transport Mode
                  </label>
                  <select
                    id="mode"
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value as TransportMode)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {TRANSPORT_MODES.map((mode) => (
                      <option key={mode.id} value={mode.id}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="time" className="mb-1.5 block text-sm font-medium">
                    Desired Arrival Time
                  </label>
                  <input
                    id="time"
                    type="time"
                    required
                    value={desiredArrivalTime}
                    onChange={(e) => setDesiredArrivalTime(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !currentLocation.trim() || !desiredArrivalTime.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  Plan Arrival
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {error && (
              <div className="rounded-md bg-brand-danger/10 p-4 text-brand-danger flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-6">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
              </div>
            )}

            {plan && !isLoading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Summary Card */}
                <div className="glass flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-5">
                  <div>
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" /> {plan.bestArrivalWindow}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Recommended Arrival Window</p>
                  </div>
                  <div className="h-px w-full bg-border sm:h-12 sm:w-px" />
                  <div>
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-brand-secondary" /> {plan.recommendedGate}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">Optimal Gate</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground">Expected Crowd</span>
                    <CrowdBadge level={plan.expectedCrowdLevel} />
                  </div>
                </div>

                <div className="glass rounded-xl border p-5">
                  <h3 className="font-semibold text-base mb-2">Why this plan?</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{plan.reason}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5">
                      <ArrowRight className="h-4 w-4 text-primary" /> {plan.walkingDistance} walk to
                      seat
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-primary" /> {plan.walkingTime}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5 bg-muted/30">
                  <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" /> Pro Tips
                  </h3>
                  <ul className="space-y-3">
                    {plan.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-medium text-amber-600 dark:text-amber-400">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!plan && !isLoading && !error && (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 text-muted-foreground bg-muted/10">
                <Clock className="h-12 w-12 mb-4 opacity-20" />
                <p>Enter your location and target time to plan your arrival.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

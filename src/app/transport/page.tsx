/**
 * @fileoverview Transport Planner feature page.
 */

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CrowdBadge } from "@/components/crowd/CrowdBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppStore, useSelectedStadium } from "@/stores/app.store";
import { TRANSPORT_MODES } from "@/lib/constants";
import type { TransportPlan, TransportMode, ApiResponse } from "@/types";
import { Train, Loader2, AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TransportPage() {
  const stadium = useSelectedStadium();

  const [phase, setPhase] = useState<"before" | "after">("before");
  const [userLocation, setUserLocation] = useState("");
  const [preferredMode, setPreferredMode] = useState<TransportMode | "">("");

  const [plan, setPlan] = useState<TransportPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLocation.trim()) return;

    setIsLoading(true);
    setError(null);
    setPlan(null);

    const { language } = useAppStore.getState();

    try {
      const res = await fetch("/api/ai/transport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stadiumId: stadium.id,
          phase,
          userLocation,
          preferredMode: preferredMode || undefined,
          language,
        }),
      });

      const result: ApiResponse<TransportPlan> = (await res.json()) as ApiResponse<TransportPlan>;
      if (!result.success) throw new Error(result.error);
      setPlan(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate transport plan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main
        className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6 lg:p-8"
        aria-labelledby="transport-heading"
      >
        <header className="mb-8">
          <h1 id="transport-heading" className="text-3xl font-bold tracking-tight text-foreground">
            Transportation Planner
          </h1>
          <p className="mt-2 text-muted-foreground">
            AI-optimized routing to and from {stadium.name} avoiding congestion.
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
                {/* Phase Toggle */}
                <div className="flex rounded-lg bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setPhase("before")}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-sm font-medium transition-all",
                      phase === "before"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Going to Match
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhase("after")}
                    className={cn(
                      "flex-1 rounded-md py-1.5 text-sm font-medium transition-all",
                      phase === "after"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Leaving Match
                  </button>
                </div>

                <div>
                  <label htmlFor="location" className="mb-1.5 block text-sm font-medium">
                    Your Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    required
                    value={userLocation}
                    onChange={(e) => setUserLocation(e.target.value)}
                    placeholder="e.g. Downtown Hotel, City Center"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="mode" className="mb-1.5 block text-sm font-medium">
                    Preferred Mode (Optional)
                  </label>
                  <select
                    id="mode"
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value as TransportMode | "")}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">No preference (Let AI decide)</option>
                    {TRANSPORT_MODES.map((mode) => (
                      <option key={mode.id} value={mode.id}>
                        {mode.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !userLocation.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Train className="h-4 w-4" />
                  )}
                  Plan Journey
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
                <Skeleton className="h-[300px] w-full rounded-xl" />
              </div>
            )}

            {plan && !isLoading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Summary */}
                <div className="glass flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {plan.recommendedMode}
                      </span>
                      <h2 className="font-semibold text-lg">Recommended Mode</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plan.reason}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        <Clock className="h-4 w-4 text-primary" /> {plan.estimatedTime}
                      </span>
                      {plan.estimatedCost && (
                        <span className="text-xs text-muted-foreground mt-1">
                          Cost: {plan.estimatedCost}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-muted-foreground">Route Congestion</span>
                      <CrowdBadge level={plan.congestionLevel} size="sm" />
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="glass rounded-xl border p-5 sm:p-8">
                  <h3 className="mb-6 text-lg font-semibold">Step-by-Step Instructions</h3>
                  <ul className="space-y-4">
                    {plan.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-accent mt-0.5" />
                        <span className="text-sm text-foreground">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!plan && !isLoading && !error && (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 text-muted-foreground bg-muted/10">
                <Train className="h-12 w-12 mb-4 opacity-20" />
                <p>Enter your location to plan your matchday travel.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

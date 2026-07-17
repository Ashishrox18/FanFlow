/**
 * @fileoverview AI Smart Navigation Page.
 */

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RouteStepList } from "@/components/navigation/RouteStepList";
import { CrowdBadge } from "@/components/crowd/CrowdBadge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAppStore, useSelectedStadium } from "@/stores/app.store";
import { NAVIGATION_DESTINATIONS } from "@/lib/constants";
import type { NavigationPlan, NavigationDestination, ApiResponse } from "@/types";
import { Map, Loader2, AlertCircle, Clock, Footprints } from "lucide-react";

export default function NavigatePage() {
  const stadium = useSelectedStadium();
  const { isAccessibilityMode } = useAppStore();

  const [from, setFrom] = useState("");
  const [destination, setDestination] = useState<NavigationDestination>("Seat");
  const [seatNumber, setSeatNumber] = useState("");
  const [plan, setPlan] = useState<NavigationPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from.trim()) return;

    setIsLoading(true);
    setError(null);
    setPlan(null);

    const { language } = useAppStore.getState();

    try {
      const res = await fetch("/api/ai/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stadiumId: stadium.id,
          from,
          destination,
          seatNumber: destination === "Seat" ? seatNumber : undefined,
          isAccessibilityMode,
          language,
        }),
      });

      const result: ApiResponse<NavigationPlan> = await res.json() as ApiResponse<NavigationPlan>;
      if (!result.success) throw new Error(result.error);
      setPlan(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate route.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="mx-auto w-full max-w-5xl flex-1 p-4 sm:p-6 lg:p-8" aria-labelledby="nav-heading">
        <header className="mb-8">
          <h1 id="nav-heading" className="text-3xl font-bold tracking-tight text-foreground">
            AI Smart Navigation
          </h1>
          <p className="mt-2 text-muted-foreground">
            Get the fastest, least crowded route through {stadium.name}.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="glass rounded-xl border border-border/50 p-5 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label htmlFor="from" className="mb-1.5 block text-sm font-medium">Starting Point</label>
                  <input
                    id="from"
                    type="text"
                    required
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="e.g. Gate C, Section 102"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="dest" className="mb-1.5 block text-sm font-medium">Destination</label>
                  <select
                    id="dest"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value as NavigationDestination)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {NAVIGATION_DESTINATIONS.map((d) => (
                      <option key={d} value={d}>{d.replace(/([A-Z])/g, ' $1').trim()}</option>
                    ))}
                  </select>
                </div>

                {destination === "Seat" && (
                  <div>
                    <label htmlFor="seat" className="mb-1.5 block text-sm font-medium">Seat Number (Optional)</label>
                    <input
                      id="seat"
                      type="text"
                      value={seatNumber}
                      onChange={(e) => setSeatNumber(e.target.value)}
                      placeholder="e.g. Row H, Seat 12"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}

                {isAccessibilityMode && (
                  <div className="rounded-md bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                    <strong>Accessibility Mode Active:</strong> Routes will avoid stairs.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !from.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Map className="h-4 w-4" />}
                  Generate Route
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
                <Skeleton className="h-[400px] w-full rounded-xl" />
              </div>
            )}

            {plan && !isLoading && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Summary Card */}
                <div className="glass flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-5">
                  <div>
                    <h2 className="font-semibold text-lg">Recommended Route</h2>
                    <p className="text-sm text-muted-foreground mt-1">{plan.reason}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1.5 text-sm font-medium">
                        <Clock className="h-4 w-4 text-primary" /> {plan.walkingTime}
                      </span>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                        <Footprints className="h-4 w-4" /> Expected Crowd
                      </span>
                    </div>
                    <CrowdBadge level={plan.crowdLevel} />
                  </div>
                </div>

                {/* Steps */}
                <div className="glass rounded-xl border p-5 sm:p-8">
                  <h3 className="mb-6 text-lg font-semibold">Step-by-Step Directions</h3>
                  <RouteStepList steps={plan.shortestRoute} />
                </div>
                
                {/* Alternative */}
                <div className="rounded-xl border border-dashed border-border p-4 bg-muted/30 text-sm">
                  <strong>Alternative Option:</strong> {plan.alternativeOption}
                </div>
              </div>
            )}

            {!plan && !isLoading && !error && (
              <div className="flex h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 text-muted-foreground bg-muted/10">
                <Map className="h-12 w-12 mb-4 opacity-20" />
                <p>Enter your starting point to get AI-powered routing.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

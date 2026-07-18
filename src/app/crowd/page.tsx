/**
 * @fileoverview Crowd Intelligence Page.
 * Displays live, time-seeded crowd data for the selected stadium.
 */

"use client";

import { useCrowd } from "@/hooks/useCrowd";
import { useSelectedStadium } from "@/stores/app.store";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CrowdCard } from "@/components/crowd/CrowdCard";
import { CrowdGridSkeleton } from "@/components/ui/Skeleton";
import { formatTime } from "@/lib/utils";
import { RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CrowdPage() {
  const stadium = useSelectedStadium();
  const { snapshot, isLoading, error, refresh, lastUpdated } = useCrowd(stadium.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8" aria-labelledby="page-title">
        <div className="mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 id="page-title" className="text-3xl font-bold tracking-tight text-foreground">
                Live Crowd Intelligence
              </h1>
              <p className="mt-2 text-muted-foreground">
                Real-time congestion data for {stadium.name}.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-xs text-muted-foreground">
                  Updated: {formatTime(lastUpdated)}
                </span>
              )}
              <button
                onClick={refresh}
                disabled={isLoading}
                className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50 focus-visible:ring-2"
                aria-label="Refresh crowd data"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div
              className="mb-8 rounded-md bg-brand-danger/10 p-4 text-brand-danger flex items-center gap-3"
              role="alert"
            >
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !snapshot && <CrowdGridSkeleton />}

          {/* Data Grid */}
          {snapshot && (
            <motion.div
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              role="list"
              aria-label="Stadium zones"
            >
              {snapshot.zones.map((zone, index) => (
                <CrowdCard key={zone.id} zone={zone} index={index} />
              ))}
            </motion.div>
          )}

          {/* Empty State (Should rarely happen) */}
          {!isLoading && !error && snapshot?.zones.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border text-muted-foreground">
              <p>No zones data available.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

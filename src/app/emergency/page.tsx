/**
 * @fileoverview Emergency Assistant Page.
 * Fast, clear, and high-contrast UI for critical situations.
 */

"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAppStore, useSelectedStadium } from "@/stores/app.store";
import type { EmergencyResponse, EmergencyType, ApiResponse } from "@/types";
import { ShieldAlert, Phone, MapPin, Loader2, AlertTriangle, ArrowRight } from "lucide-react";

const EMERGENCY_TYPES: { id: EmergencyType; label: string; description: string }[] = [
  {
    id: "Medical",
    label: "Medical Emergency",
    description: "Injury, illness, or medical assistance needed.",
  },
  {
    id: "Security",
    label: "Security Incident",
    description: "Suspicious activity, altercation, or threat.",
  },
  { id: "LostChild", label: "Lost Child", description: "Report a separated child or dependent." },
  { id: "Fire", label: "Fire / Smoke", description: "Report a fire hazard or visible smoke." },
  { id: "EmergencyExit", label: "Evacuation", description: "Immediate exit guidance." },
];

export default function EmergencyPage() {
  const stadium = useSelectedStadium();

  const [type, setType] = useState<EmergencyType>("Medical");
  const [location, setLocation] = useState("");
  const [response, setResponse] = useState<EmergencyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    setIsLoading(true);
    setError(null);
    setResponse(null);

    const { language } = useAppStore.getState();

    try {
      const res = await fetch("/api/ai/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stadiumId: stadium.id,
          type,
          location,
          language,
        }),
      });

      const result: ApiResponse<EmergencyResponse> =
        (await res.json()) as ApiResponse<EmergencyResponse>;
      if (!result.success) throw new Error(result.error);
      setResponse(result.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get emergency response.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main
        className="mx-auto w-full max-w-4xl flex-1 p-4 sm:p-6 lg:p-8"
        aria-labelledby="emergency-heading"
      >
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-border/50 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-danger/10 shrink-0">
            <ShieldAlert className="h-6 w-6 text-brand-danger" />
          </div>
          <div>
            <h1
              id="emergency-heading"
              className="text-3xl font-bold tracking-tight text-brand-danger"
            >
              Emergency Assistance
            </h1>
            <p className="mt-1 text-muted-foreground">
              Immediate AI guidance for {stadium.name}. If life-threatening, call emergency services
              directly.
            </p>
          </div>
        </header>

        {!response ? (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">1. Select Emergency Type</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {EMERGENCY_TYPES.map((et) => (
                  <button
                    key={et.id}
                    type="button"
                    onClick={() => setType(et.id)}
                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all hover:border-brand-danger/50 focus-visible:ring-2 ${
                      type === et.id
                        ? "border-brand-danger bg-brand-danger/10 ring-1 ring-brand-danger"
                        : "border-border glass"
                    }`}
                  >
                    <span className="font-semibold">{et.label}</span>
                    <span className="mt-1 text-xs text-muted-foreground">{et.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">2. Your Exact Location</h2>
              <div>
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Section 102, Row H, Seat 12 or outside Gate B"
                  className="w-full rounded-xl border border-input bg-background p-4 text-base focus:border-brand-danger focus:outline-none focus:ring-1 focus:ring-brand-danger"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-brand-danger/10 p-4 text-brand-danger flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !location.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-danger py-4 text-lg font-bold text-white transition-colors hover:bg-brand-danger/90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ShieldAlert className="h-5 w-5" />
              )}
              GET IMMEDIATE ASSISTANCE
            </button>
          </form>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            {/* Immediate Action */}
            <div className="rounded-2xl border-2 border-brand-danger bg-brand-danger/10 p-6 shadow-lg shadow-brand-danger/20">
              <h2 className="text-lg font-bold uppercase tracking-wider text-brand-danger">
                Immediate Action Required
              </h2>
              <p className="mt-2 text-2xl font-bold leading-snug">{response.immediateAction}</p>
            </div>

            {/* Steps */}
            <div className="glass rounded-2xl border p-6">
              <h3 className="mb-4 text-xl font-bold">Follow these steps carefully:</h3>
              <ul className="space-y-4">
                {response.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-danger text-sm font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="text-lg pt-0.5">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="glass flex flex-col justify-center rounded-xl border p-5">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4" /> Emergency Contact
                </span>
                <span className="text-2xl font-bold">{response.contactNumber}</span>
              </div>
              <div className="glass flex flex-col justify-center rounded-xl border p-5">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" /> Nearest Exit / Location
                </span>
                <span className="text-xl font-semibold">{response.nearestExit}</span>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setResponse(null);
                  setLocation("");
                }}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="h-4 w-4 rotate-180" /> Report another emergency
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

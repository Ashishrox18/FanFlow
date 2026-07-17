/**
 * @fileoverview StadiumSelector — allows users to choose their active stadium.
 */

"use client";

import { motion } from "framer-motion";
import { useAppStore, useSelectedStadium } from "@/stores/app.store";
import { STADIUMS_DATA } from "@/lib/constants";
import { MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function StadiumSelector() {
  const { selectStadium } = useAppStore();
  const selectedStadium = useSelectedStadium();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="stadium-heading">
      <div className="mb-8 text-center">
        <h2 id="stadium-heading" className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Select Your Venue
        </h2>
        <p className="mt-2 text-muted-foreground">
          Choose a stadium to get localised intelligence and routing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Stadium list">
        {STADIUMS_DATA.map((stadium, index) => {
          const isSelected = selectedStadium.id === stadium.id;
          return (
            <motion.button
              key={stadium.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => selectStadium(stadium.id)}
              className={cn(
                "group relative flex w-full flex-col gap-2 rounded-xl border p-5 text-left transition-all hover:shadow-md focus-visible:ring-2",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border glass hover:border-primary/50"
              )}
              aria-pressed={isSelected}
              role="listitem"
            >
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2">
                  <MapPin
                    className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")}
                    aria-hidden="true"
                  />
                  <h3 className="font-semibold text-foreground">{stadium.name}</h3>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {stadium.city}, {stadium.country}
              </p>
              <div className="mt-2 inline-flex w-fit items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                Capacity: {stadium.capacity.toLocaleString()}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

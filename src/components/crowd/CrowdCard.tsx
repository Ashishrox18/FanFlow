/**
 * @fileoverview CrowdCard — shows crowd level, wait time, and capacity for a single zone.
 */

import { motion } from "framer-motion";
import { CrowdBadge } from "./CrowdBadge";
import { cn } from "@/lib/utils";
import type { CrowdZone } from "@/types";
import {
  Utensils,
  DoorOpen,
  Toilet,
  ShoppingBag,
  Info,
  HeartPulse,
} from "lucide-react";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ZONE_ICONS: Record<CrowdZone["type"], React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>> = {
  Food: Utensils,
  Exit: DoorOpen,
  Restroom: Toilet,
  Merchandise: ShoppingBag,
  Information: Info,
  Medical: HeartPulse,
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CrowdCardProps {
  zone: CrowdZone;
  index: number;
}

/**
 * Animated card displaying crowd intelligence for a single stadium zone.
 */
export function CrowdCard({ zone, index }: CrowdCardProps) {
  const Icon = ZONE_ICONS[zone.type];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        "glass rounded-xl p-4 transition-shadow hover:shadow-lg",
        !zone.isOperational && "opacity-50"
      )}
      aria-label={`${zone.name}: ${zone.crowdLevel} crowd level`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4 text-primary" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight text-foreground">
              {zone.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground capitalize">{zone.type}</p>
          </div>
        </div>
        <CrowdBadge level={zone.crowdLevel} size="sm" />
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center gap-4">
        {/* Wait time */}
        <div className="flex flex-col">
          <span className="text-lg font-bold tabular-nums text-foreground">
            {zone.waitTimeMinutes}
            <span className="ml-0.5 text-xs font-normal text-muted-foreground">min</span>
          </span>
          <span className="text-xs text-muted-foreground">Wait time</span>
        </div>

        {/* Capacity bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Capacity</span>
            <span>{zone.capacityPercent}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={zone.capacityPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${zone.capacityPercent}% capacity`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                zone.capacityPercent < 33
                  ? "bg-emerald-400"
                  : zone.capacityPercent < 66
                    ? "bg-amber-400"
                    : "bg-red-400"
              )}
              style={{ width: `${zone.capacityPercent}%` }}
            />
          </div>
        </div>
      </div>

      {!zone.isOperational && (
        <p className="mt-2 text-xs font-medium text-amber-400" role="alert">
          ⚠ Temporarily closed
        </p>
      )}
    </motion.article>
  );
}

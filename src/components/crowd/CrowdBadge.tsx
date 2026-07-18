/**
 * @fileoverview CrowdBadge — displays a crowd level indicator with colour and pulse animation.
 */

import { cn } from "@/lib/utils";
import { CROWD_LEVEL_CONFIG } from "@/lib/constants";
import type { CrowdLevel } from "@/types";

interface CrowdBadgeProps {
  level: CrowdLevel;
  showLabel?: boolean;
  size?: "sm" | "md";
}

/**
 * Visual badge for crowd level with accessibility-friendly text and ARIA label.
 */
export function CrowdBadge({ level, showLabel = true, size = "md" }: CrowdBadgeProps) {
  const config = CROWD_LEVEL_CONFIG[level];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.bg,
        config.border,
        config.color,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
      )}
      role="status"
      aria-label={`Crowd level: ${level}`}
    >
      <span
        className={cn(
          "rounded-full crowd-pulse",
          config.dot,
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
        )}
        aria-hidden="true"
      />
      {showLabel && level}
    </span>
  );
}

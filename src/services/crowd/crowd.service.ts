/**
 * @fileoverview Crowd simulation service.
 * Generates deterministic, time-seeded crowd intelligence data for all stadium zones.
 */

import type { CrowdSnapshot, CrowdZone, AmenityType } from "@/types";
import { simulateCrowdLevel, simulateCapacity, simulateWaitTime, getTimeSeed } from "@/lib/utils";

// ─── Zone Definitions ─────────────────────────────────────────────────────────

interface ZoneTemplate {
  id: string;
  name: string;
  type: AmenityType;
  isOperational: boolean;
}

const ZONE_TEMPLATES: ZoneTemplate[] = [
  { id: "entrance-a", name: "Gate A Entrance", type: "Exit", isOperational: true },
  { id: "entrance-b", name: "Gate B Entrance", type: "Exit", isOperational: true },
  { id: "entrance-c", name: "Gate C Entrance", type: "Exit", isOperational: true },
  { id: "entrance-d", name: "Gate D Entrance", type: "Exit", isOperational: true },
  { id: "food-north", name: "North Food Court", type: "Food", isOperational: true },
  { id: "food-south", name: "South Food Court", type: "Food", isOperational: true },
  { id: "food-east", name: "East Food Court", type: "Food", isOperational: true },
  { id: "restroom-l1", name: "Level 1 Restrooms", type: "Restroom", isOperational: true },
  { id: "restroom-l2", name: "Level 2 Restrooms", type: "Restroom", isOperational: true },
  { id: "restroom-l3", name: "Level 3 Restrooms", type: "Restroom", isOperational: true },
  { id: "merch-main", name: "Main Merchandise Store", type: "Merchandise", isOperational: true },
  { id: "merch-east", name: "East Merchandise Kiosk", type: "Merchandise", isOperational: true },
  { id: "medical-main", name: "Main Medical Centre", type: "Medical", isOperational: true },
  { id: "info-lobby", name: "Information Lobby", type: "Information", isOperational: true },
  { id: "exit-west", name: "West Exit", type: "Exit", isOperational: true },
  { id: "exit-east", name: "East Exit", type: "Exit", isOperational: true },
];

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Generates a crowd snapshot for a given stadium using time-seeded simulation.
 * Results are deterministic for a 30-second window, creating realistic variation.
 *
 * @param stadiumId - The stadium identifier
 * @returns A complete crowd snapshot with all zones
 */
export function generateCrowdSnapshot(stadiumId: string): CrowdSnapshot {
  const seed = getTimeSeed();

  const zones: CrowdZone[] = ZONE_TEMPLATES.map((template) => {
    const crowdLevel = simulateCrowdLevel(`${stadiumId}-${template.id}`, seed);
    return {
      id: template.id,
      name: template.name,
      type: template.type,
      crowdLevel,
      capacityPercent: simulateCapacity(`${stadiumId}-${template.id}`, seed),
      waitTimeMinutes: simulateWaitTime(crowdLevel),
      isOperational: template.isOperational,
    };
  });

  const levelCounts = { Low: 0, Medium: 0, High: 0 };
  zones.forEach((z) => levelCounts[z.crowdLevel]++);

  const dominantLevel =
    levelCounts.High > levelCounts.Low && levelCounts.High > levelCounts.Medium
      ? "High"
      : levelCounts.Medium >= levelCounts.Low
        ? "Medium"
        : "Low";

  return {
    stadiumId,
    timestamp: new Date().toISOString(),
    zones,
    overallLevel: dominantLevel,
  };
}

/**
 * Filters crowd zones by amenity type.
 *
 * @param snapshot - The crowd snapshot to filter
 * @param type - The amenity type to filter by
 * @returns Filtered zones
 */
export function filterZonesByType(snapshot: CrowdSnapshot, type: AmenityType): CrowdZone[] {
  return snapshot.zones.filter((z) => z.type === type);
}

/**
 * @fileoverview LoadingSkeleton — reusable skeleton placeholders for loading states.
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  "aria-label"?: string;
}

/**
 * Single skeleton block.
 */
export function Skeleton({ className, "aria-label": ariaLabel }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      role="status"
      aria-label={ariaLabel ?? "Loading..."}
      aria-busy="true"
    />
  );
}

/**
 * Grid of crowd card skeletons for loading state.
 */
export function CrowdGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading crowd data..."
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <Skeleton className="h-10 w-16" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Chat message skeleton.
 */
export function ChatSkeleton() {
  return (
    <div className="flex items-start gap-3" role="status" aria-label="Loading response...">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

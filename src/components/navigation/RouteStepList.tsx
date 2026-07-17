/**
 * @fileoverview RouteStepList — renders a step-by-step navigation list.
 */

import { CheckCircle2, MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RouteStep } from "@/types";

interface RouteStepListProps {
  steps: RouteStep[];
}

export function RouteStepList({ steps }: RouteStepListProps) {
  return (
    <div className="relative space-y-4 before:absolute before:inset-y-2 before:left-3.5 before:w-0.5 before:bg-border/50">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.stepNumber} className="relative flex items-start gap-4">
            <div
              className={cn(
                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-background",
                isLast ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
              aria-hidden="true"
            >
              {isLast ? <MapPin className="h-3.5 w-3.5" /> : <span className="text-xs font-medium">{step.stepNumber}</span>}
            </div>
            
            <div className={cn("flex-1 rounded-lg border bg-card p-3 shadow-sm", isLast ? "border-primary/50 bg-primary/5" : "border-border/50")}>
              <p className="text-sm font-medium leading-snug">{step.instruction}</p>
              {step.landmark && (
                <p className="mt-1 text-xs text-muted-foreground">
                  <Navigation className="inline h-3 w-3 mr-1" aria-hidden="true" />
                  Near {step.landmark}
                </p>
              )}
              {step.isAccessible && (
                <div className="mt-2 inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-500">
                  <CheckCircle2 className="h-3 w-3" /> Accessible
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { computeResourceOptimization } from "@/lib/biosphere/resourceOptimization";
import { simulateSensorReading } from "@/lib/biosphere/simulate";

export default function ResourceOptimizationPage() {
  const sensor = useMemo(() => simulateSensorReading(), []);
  const result = useMemo(() => computeResourceOptimization(sensor), [sensor]);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-[11px] uppercase tracking-wide text-muted">Overall Efficiency</div>
          <div className="mt-1.5 text-2xl font-semibold text-foreground">{result.overallEfficiencyPct}%</div>
        </div>
        <div className="card p-4 sm:col-span-2">
          <div className="text-[11px] uppercase tracking-wide text-muted">Potential Annual Savings</div>
          <div className="mt-1.5 text-2xl font-semibold text-foreground">${result.totalAnnualSavings.toLocaleString()}</div>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-[11px] uppercase tracking-wide text-muted">Resource Usage vs. Optimal</div>
        <div className="mt-3 space-y-4">
          {result.lines.map((l) => (
            <div key={l.resource}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{l.resource}</span>
                <span className="text-xs text-muted">
                  {l.currentUsage} / {l.optimalUsage} {l.unit} · {l.efficiencyPct}% efficient
                </span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-panel-2 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${Math.min(100, l.efficiencyPct)}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-muted">
                Up to {l.potentialSavingsPct}% savings potential · ~${l.costSavings.toLocaleString()}/yr
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="text-[11px] uppercase tracking-wide text-muted">Optimization Recommendations</div>
        <ul className="mt-3 space-y-1.5">
          {result.recommendations.map((r, i) => (
            <li key={i} className="text-xs text-muted flex gap-2">
              <span className="text-accent-2 mt-0.5">—</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

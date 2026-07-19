"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchOutcomes } from "@/lib/biosphere/outcomesApi";
import { deriveLearningInsight } from "@/lib/biosphere/learning";
import { simulateSensorReading, simulateWeather } from "@/lib/biosphere/simulate";
import { computeReadiness } from "@/lib/biosphere/readiness";
import { computeResourceOptimization } from "@/lib/biosphere/resourceOptimization";
import type { OutcomeEntry } from "@/lib/biosphere/types";

export default function ReportsPage() {
  const [outcomes, setOutcomes] = useState<OutcomeEntry[]>([]);
  useEffect(() => {
    fetchOutcomes().then(setOutcomes);
  }, []);

  const sensor = useMemo(() => simulateSensorReading(), []);
  const weather = useMemo(() => simulateWeather(), []);
  const readiness = useMemo(() => computeReadiness(sensor, weather), [sensor, weather]);
  const resources = useMemo(() => computeResourceOptimization(sensor), [sensor]);
  const insight = deriveLearningInsight(outcomes);

  const conditionCounts = outcomes.reduce<Record<string, number>>((acc, o) => {
    acc[o.cropCondition] = (acc[o.cropCondition] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-muted">Farm Performance Report</div>
        <button
          onClick={() => window.print()}
          className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-accent/50 transition"
        >
          Print / Export
        </button>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-foreground">Summary</div>
        <div className="mt-3 grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-2xl font-semibold text-foreground">{readiness.score}</div>
            <div className="text-xs text-muted">Current readiness ({readiness.verdict})</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">{outcomes.length}</div>
            <div className="text-xs text-muted">Outcomes logged</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-foreground">{resources.overallEfficiencyPct}%</div>
            <div className="text-xs text-muted">Resource efficiency</div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-foreground">Crop Condition History</div>
        {outcomes.length === 0 ? (
          <p className="mt-2 text-xs text-muted">No outcomes logged yet — visit Outcome Tracking to start building history.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {Object.entries(conditionCounts).map(([cond, count]) => (
              <div key={cond} className="flex items-center justify-between text-sm">
                <span className="capitalize text-foreground">{cond}</span>
                <span className="text-xs text-muted">{count} entr{count === 1 ? "y" : "ies"}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-foreground">Continuous Learning</div>
        <p className="mt-2 text-xs text-muted leading-relaxed">{insight.summary}</p>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-foreground">Resource Optimization Recommendations</div>
        <ul className="mt-3 space-y-1.5">
          {resources.recommendations.map((r, i) => (
            <li key={i} className="text-xs text-muted flex gap-2">
              <span className="text-accent-2 mt-0.5">—</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5">
        <div className="text-sm font-semibold text-foreground">Full Outcome Log</div>
        <div className="mt-3 divide-y divide-border">
          {outcomes.map((o) => (
            <div key={o.id} className="py-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-foreground">
                  {o.productName} {o.crop && `· ${o.crop}`}
                </span>
                <span className="text-xs text-muted capitalize">{o.cropCondition}</span>
              </div>
              <div className="text-[11px] text-muted">{o.dateApplied}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

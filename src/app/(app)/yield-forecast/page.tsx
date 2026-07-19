"use client";

import { useMemo, useState } from "react";
import { Area, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { forecastYield } from "@/lib/biosphere/yieldForecast";
import { getCropHealthMetrics } from "@/lib/biosphere/cropHealth";
import { simulateWeather } from "@/lib/biosphere/simulate";
import type { CropType } from "@/lib/biosphere/types";

const CROPS: CropType[] = ["Wheat", "Rice", "Cotton", "Sugarcane"];

export default function YieldForecastPage() {
  const [crop, setCrop] = useState<CropType>("Wheat");
  const weather = useMemo(() => simulateWeather(), []);
  const health = useMemo(() => getCropHealthMetrics("Primary Field", crop), [crop]);
  const result = useMemo(() => forecastYield(crop, health, weather), [crop, health, weather]);

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-wide text-muted">Yield Forecast</div>
          <div className="flex gap-1.5">
            {CROPS.map((c) => (
              <button
                key={c}
                onClick={() => setCrop(c)}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${
                  crop === c ? "bg-accent text-panel border-accent" : "border-border text-muted hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-3xl font-semibold text-foreground">{result.currentForecastTonsPerAcre}</span>
          <span className="text-sm text-muted">tons/acre</span>
          <span className={`text-sm ${result.changePct >= 0 ? "text-ok" : "text-danger"}`}>
            {result.changePct >= 0 ? "+" : ""}
            {result.changePct}%
          </span>
        </div>

        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={result.series} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{ background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="upper" stroke="none" fill="var(--accent-2)" fillOpacity={0.12} />
              <Area type="monotone" dataKey="lower" stroke="none" fill="var(--panel)" fillOpacity={1} />
              <Line type="monotone" dataKey="actual" stroke="var(--accent)" strokeWidth={2} dot={false} name="Historical" />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="var(--warn)"
                strokeWidth={2}
                strokeDasharray="4 3"
                dot={false}
                name="Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-5">
        <div className="text-[11px] uppercase tracking-wide text-muted">Key Yield Factors</div>
        <ul className="mt-3 space-y-1.5">
          {result.factors.map((f, i) => (
            <li key={i} className="text-xs text-muted flex gap-2">
              <span className="text-accent-2 mt-0.5">—</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

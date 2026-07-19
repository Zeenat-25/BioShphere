"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SensorReading, SensorStatus } from "@/lib/biosphere/types";

export function SensorStatusCard({ history, statuses }: { history: SensorReading[]; statuses: SensorStatus[] }) {
  const chartData = history.map((h) => ({
    time: new Date(h.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    soil: h.soilMoisturePct,
    temp: h.temperatureC,
    humidity: h.humidityPct,
  }));

  return (
    <div className="card p-5 lg:col-span-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-muted">Live Sensor Status</div>
        <span className="text-[11px] text-muted">{statuses.filter((s) => s.online).length}/{statuses.length} online</span>
      </div>

      <div className="mt-3 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line type="monotone" dataKey="soil" stroke="var(--accent)" strokeWidth={2} dot={false} name="Soil %" />
            <Line type="monotone" dataKey="temp" stroke="var(--accent-2)" strokeWidth={2} dot={false} name="Temp °C" />
            <Line type="monotone" dataKey="humidity" stroke="var(--warn)" strokeWidth={2} dot={false} name="Humidity %" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {statuses.map((s) => (
          <div key={s.id} className="rounded-lg border border-border p-2.5">
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${s.online ? "bg-ok" : "bg-danger"}`} />
              <span className="text-xs font-medium text-foreground">{s.name}</span>
            </div>
            <div className="text-[10px] text-muted mt-1">{s.zone}</div>
            <div className="text-[10px] text-muted">Battery {s.batteryPct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

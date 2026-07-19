"use client";

import { useEffect, useState } from "react";

interface GreenhouseNode {
  id: string;
  name: string;
  soilMoisturePct: number;
  humidityPct: number;
  temperatureC: number;
  irrigationOn: boolean;
  ventOpen: boolean;
}

const THRESHOLDS = {
  soilMoisture: { low: 25, high: 70 },
  humidity: { low: 35, high: 85 },
  temperature: { low: 15, high: 32 },
};

function statusFor(value: number, low: number, high: number) {
  if (value < low || value > high) return { label: "Critical", style: "text-danger border-danger/40 bg-danger/10" };
  if (value < low + 5 || value > high - 5) return { label: "Warning", style: "text-warn border-warn/40 bg-warn/10" };
  return { label: "Optimal", style: "text-ok border-ok/40 bg-ok/10" };
}

function seed(): GreenhouseNode[] {
  return [
    { id: "esp32-1", name: "Greenhouse A · ESP32-01", soilMoisturePct: 42, humidityPct: 58, temperatureC: 24, irrigationOn: false, ventOpen: false },
    { id: "esp32-2", name: "Greenhouse B · ESP32-02", soilMoisturePct: 31, humidityPct: 66, temperatureC: 27, irrigationOn: false, ventOpen: false },
  ];
}

export default function GreenhousePage() {
  const [nodes, setNodes] = useState<GreenhouseNode[]>(seed);

  useEffect(() => {
    const id = setInterval(() => {
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          soilMoisturePct: clamp(n.soilMoisturePct + (n.irrigationOn ? 2 : -0.6) + (Math.random() - 0.5) * 1.5, 5, 95),
          humidityPct: clamp(n.humidityPct + (n.ventOpen ? -1.2 : 0.4) + (Math.random() - 0.5) * 2, 10, 100),
          temperatureC: clamp(n.temperatureC + (n.ventOpen ? -0.4 : 0.2) + (Math.random() - 0.5) * 0.8, 5, 42),
        })),
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const toggle = (id: string, key: "irrigationOn" | "ventOpen") =>
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, [key]: !n[key] } : n)));

  return (
    <div className="space-y-5">
      <div className="card p-4 text-xs text-muted">
        Connect real ESP32 nodes by publishing soil moisture / humidity / temperature readings to a small ingest API
        that replaces the client-side simulation loop below. Until then, this view runs on realistic simulated data.
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {nodes.map((n) => {
          const soil = statusFor(n.soilMoisturePct, THRESHOLDS.soilMoisture.low, THRESHOLDS.soilMoisture.high);
          const hum = statusFor(n.humidityPct, THRESHOLDS.humidity.low, THRESHOLDS.humidity.high);
          const temp = statusFor(n.temperatureC, THRESHOLDS.temperature.low, THRESHOLDS.temperature.high);
          return (
            <div key={n.id} className="card p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{n.name}</span>
                <span className="text-[10px] mono text-muted">live</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2.5">
                <Metric label="Soil" value={`${Math.round(n.soilMoisturePct)}%`} status={soil} />
                <Metric label="Humidity" value={`${Math.round(n.humidityPct)}%`} status={hum} />
                <Metric label="Temp" value={`${n.temperatureC.toFixed(1)}°C`} status={temp} />
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => toggle(n.id, "irrigationOn")}
                  className={`flex-1 text-xs py-2 rounded-lg border transition ${
                    n.irrigationOn ? "bg-accent text-panel border-accent" : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  Irrigation {n.irrigationOn ? "ON" : "OFF"}
                </button>
                <button
                  onClick={() => toggle(n.id, "ventOpen")}
                  className={`flex-1 text-xs py-2 rounded-lg border transition ${
                    n.ventOpen ? "bg-accent text-panel border-accent" : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  Vent {n.ventOpen ? "OPEN" : "CLOSED"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value, status }: { label: string; value: string; status: { label: string; style: string } }) {
  return (
    <div className="rounded-lg border border-border p-2.5 text-center">
      <div className="text-[10px] text-muted">{label}</div>
      <div className="text-base font-semibold text-foreground mt-0.5">{value}</div>
      <div className={`mt-1 inline-block text-[9px] px-1.5 py-0.5 rounded-full border ${status.style}`}>{status.label}</div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

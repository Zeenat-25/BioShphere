"use client";

import { useEffect, useMemo, useState } from "react";
import { simulateSensorReading, simulateSensorStatuses, simulateWeather } from "@/lib/biosphere/simulate";
import { computeDiseaseRisk, computeReadiness } from "@/lib/biosphere/readiness";
import { computeResourceOptimization } from "@/lib/biosphere/resourceOptimization";
import { simulateFieldHealth } from "@/lib/biosphere/cropHealth";
import { buildNotifications } from "@/lib/biosphere/notifications";
import type { NotificationAlert } from "@/lib/biosphere/types";

const SEVERITY_DOT: Record<NotificationAlert["severity"], string> = {
  high: "bg-danger",
  medium: "bg-warn",
  info: "bg-muted",
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState<NotificationAlert[]>([]);
  const [read, setRead] = useState<Set<string>>(new Set());

  const snapshot = useMemo(() => {
    const sensor = simulateSensorReading();
    const weather = simulateWeather();
    return {
      readiness: computeReadiness(sensor, weather),
      disease: computeDiseaseRisk(sensor, weather),
      weather,
      fields: simulateFieldHealth(),
      resources: computeResourceOptimization(sensor),
      sensors: simulateSensorStatuses(),
    };
  }, []);

  useEffect(() => {
    setAlerts(buildNotifications(snapshot));
  }, [snapshot]);

  const unread = alerts.filter((a) => !read.has(a.id)).length;

  const markAllRead = () => setRead(new Set(alerts.map((a) => a.id)));

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted hover:text-foreground hover:border-accent/50 transition"
      >
        <span className="text-xs">🔔</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-panel text-[9px] flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 card z-50 overflow-hidden fade-in">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Notifications</span>
            <button onClick={markAllRead} className="text-[11px] text-accent hover:underline">
              Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.map((a) => (
              <div
                key={a.id}
                onClick={() => setRead((prev) => new Set(prev).add(a.id))}
                className={`px-4 py-3 border-b border-border last:border-0 cursor-pointer ${
                  read.has(a.id) ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${SEVERITY_DOT[a.severity]}`} />
                  <span className="text-xs font-medium text-foreground">{a.title}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted leading-relaxed pl-3.5">{a.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

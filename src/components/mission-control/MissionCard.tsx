"use client";

import { useState } from "react";
import type { MissionItem } from "@/lib/biosphere/types";

const PRIORITY_DOT: Record<MissionItem["priority"], string> = {
  high: "bg-danger",
  medium: "bg-warn",
  low: "bg-muted",
};

export function MissionCard({ items }: { items: MissionItem[] }) {
  const [state, setState] = useState(items);

  const toggle = (id: string) =>
    setState((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  return (
    <div className="card p-5 lg:col-span-2">
      <div className="text-[11px] uppercase tracking-wide text-muted">Today&apos;s AI Mission</div>
      <div className="mt-3 space-y-2.5">
        {state.map((item) => (
          <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggle(item.id)}
              className="mt-1 accent-[var(--accent)]"
            />
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${PRIORITY_DOT[item.priority]}`} />
            <div className={item.done ? "opacity-50" : ""}>
              <div className="text-sm text-foreground">{item.title}</div>
              <div className="text-xs text-muted mt-0.5">{item.detail}</div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

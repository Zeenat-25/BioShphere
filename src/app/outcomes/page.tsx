"use client";

import { useEffect, useState } from "react";
import type { OutcomeEntry } from "@/lib/biosphere/types";

const STORAGE_KEY = "biosphere.outcomes";

function load(): OutcomeEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(entries: OutcomeEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const CONDITIONS: OutcomeEntry["cropCondition"][] = ["poor", "fair", "good", "excellent"];

export default function OutcomesPage() {
  const [entries, setEntries] = useState<OutcomeEntry[]>([]);
  const [form, setForm] = useState({
    productName: "",
    dateApplied: new Date().toISOString().slice(0, 10),
    cropCondition: "good" as OutcomeEntry["cropCondition"],
    yieldImprovementPct: "",
    notes: "",
  });

  useEffect(() => setEntries(load()), []);

  const addEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: OutcomeEntry = {
      id: crypto.randomUUID(),
      productName: form.productName,
      dateApplied: form.dateApplied,
      cropCondition: form.cropCondition,
      yieldImprovementPct: form.yieldImprovementPct ? Number(form.yieldImprovementPct) : null,
      notes: form.notes,
    };
    const next = [entry, ...entries];
    setEntries(next);
    save(next);
    setForm({ ...form, productName: "", yieldImprovementPct: "", notes: "" });
  };

  const removeEntry = (id: string) => {
    const next = entries.filter((e) => e.id !== id);
    setEntries(next);
    save(next);
  };

  const avgYield =
    entries.filter((e) => e.yieldImprovementPct != null).length > 0
      ? (
          entries.reduce((sum, e) => sum + (e.yieldImprovementPct ?? 0), 0) /
          entries.filter((e) => e.yieldImprovementPct != null).length
        ).toFixed(1)
      : null;

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <form onSubmit={addEntry} className="card p-5 space-y-3 h-fit">
        <div className="text-[11px] uppercase tracking-wide text-muted">Log an Outcome</div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Product applied</label>
          <input
            required
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent/60"
            placeholder="Mycorrhizal Root Inoculant"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Date applied</label>
          <input
            type="date"
            value={form.dateApplied}
            onChange={(e) => setForm({ ...form, dateApplied: e.target.value })}
            className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent/60"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Crop condition</label>
          <select
            value={form.cropCondition}
            onChange={(e) => setForm({ ...form, cropCondition: e.target.value as OutcomeEntry["cropCondition"] })}
            className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent/60 capitalize"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Yield improvement (%)</label>
          <input
            type="number"
            step="0.1"
            value={form.yieldImprovementPct}
            onChange={(e) => setForm({ ...form, yieldImprovementPct: e.target.value })}
            className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent/60"
            placeholder="optional"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent/60"
          />
        </div>
        <button type="submit" className="w-full rounded-lg bg-accent text-panel text-sm font-medium py-2.5 hover:opacity-90 transition">
          Add entry
        </button>
      </form>

      <div className="lg:col-span-2 space-y-4">
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wide text-muted">History</div>
          <p className="mt-1 text-xs text-muted">
            {avgYield !== null
              ? `Average recorded yield improvement: ${avgYield}% across ${entries.length} entries.`
              : "Log outcomes to build a history that improves future recommendations."}
          </p>
        </div>

        {entries.length === 0 && <div className="card p-5 text-sm text-muted">No outcomes logged yet.</div>}

        {entries.map((e) => (
          <div key={e.id} className="card p-4 flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">{e.productName}</div>
              <div className="mt-1 text-xs text-muted">
                {e.dateApplied} · <span className="capitalize">{e.cropCondition}</span>
                {e.yieldImprovementPct != null && ` · +${e.yieldImprovementPct}% yield`}
              </div>
              {e.notes && <p className="mt-1.5 text-xs text-muted">{e.notes}</p>}
            </div>
            <button onClick={() => removeEntry(e.id)} className="text-xs text-muted hover:text-danger transition">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

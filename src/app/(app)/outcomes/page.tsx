"use client";

import { useEffect, useState } from "react";
import type { OutcomeEntry } from "@/lib/biosphere/types";
import { fetchOutcomes, createOutcome, deleteOutcome } from "@/lib/biosphere/outcomesApi";
import { deriveLearningInsight } from "@/lib/biosphere/learning";

const CONDITIONS: OutcomeEntry["cropCondition"][] = ["poor", "fair", "good", "excellent"];

export default function OutcomesPage() {
  const [entries, setEntries] = useState<OutcomeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    crop: "",
    dateApplied: new Date().toISOString().slice(0, 10),
    cropCondition: "good" as OutcomeEntry["cropCondition"],
    yieldImprovementPct: "",
    notes: "",
    farmerFeedback: "",
  });

  useEffect(() => {
    fetchOutcomes()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  const addEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const created = await createOutcome({
      productName: form.productName,
      crop: form.crop || undefined,
      dateApplied: form.dateApplied,
      cropCondition: form.cropCondition,
      yieldImprovementPct: form.yieldImprovementPct ? Number(form.yieldImprovementPct) : null,
      notes: form.notes,
      farmerFeedback: form.farmerFeedback || undefined,
    });
    setSaving(false);
    if (created) {
      setEntries((prev) => [created, ...prev]);
      setForm({ ...form, productName: "", crop: "", yieldImprovementPct: "", notes: "", farmerFeedback: "" });
    }
  };

  const removeEntry = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await deleteOutcome(id);
  };

  const insight = deriveLearningInsight(entries);

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
          <label className="block text-xs font-medium text-foreground mb-1">Crop (optional)</label>
          <input
            value={form.crop}
            onChange={(e) => setForm({ ...form, crop: e.target.value })}
            className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent/60"
            placeholder="Wheat"
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
          <label className="block text-xs font-medium text-foreground mb-1">Farmer feedback</label>
          <textarea
            value={form.farmerFeedback}
            onChange={(e) => setForm({ ...form, farmerFeedback: e.target.value })}
            rows={2}
            className="w-full rounded-lg border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-accent/60"
            placeholder="How did it go, in your own words?"
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
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-accent text-panel text-sm font-medium py-2.5 hover:opacity-90 transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Add entry"}
        </button>
      </form>

      <div className="lg:col-span-2 space-y-4">
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wide text-muted">Continuous Learning Engine</div>
          <p className="mt-1 text-xs text-muted leading-relaxed">{insight.summary}</p>
          {avgYield !== null && (
            <p className="mt-1 text-xs text-muted">Average recorded yield improvement: {avgYield}%.</p>
          )}
        </div>

        {loading && <div className="card p-5 text-sm text-muted">Loading outcome history…</div>}
        {!loading && entries.length === 0 && <div className="card p-5 text-sm text-muted">No outcomes logged yet.</div>}

        {entries.map((e) => (
          <div key={e.id} className="card p-4 flex items-start justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">
                {e.productName} {e.crop && <span className="text-muted font-normal">· {e.crop}</span>}
              </div>
              <div className="mt-1 text-xs text-muted">
                {e.dateApplied} · <span className="capitalize">{e.cropCondition}</span>
                {e.yieldImprovementPct != null && ` · +${e.yieldImprovementPct}% yield`}
              </div>
              {e.farmerFeedback && <p className="mt-1.5 text-xs text-foreground italic">&ldquo;{e.farmerFeedback}&rdquo;</p>}
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

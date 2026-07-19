import type { OutcomeEntry } from "./types";

interface OutcomeRow {
  id: string;
  productName: string;
  crop: string | null;
  dateApplied: string;
  cropCondition: string;
  yieldImprovementPct: number | null;
  notes: string | null;
  farmerFeedback: string | null;
}

function toEntry(row: OutcomeRow): OutcomeEntry {
  return {
    id: row.id,
    productName: row.productName,
    crop: row.crop ?? undefined,
    dateApplied: row.dateApplied,
    cropCondition: row.cropCondition as OutcomeEntry["cropCondition"],
    yieldImprovementPct: row.yieldImprovementPct,
    notes: row.notes ?? "",
    farmerFeedback: row.farmerFeedback ?? undefined,
  };
}

export async function fetchOutcomes(): Promise<OutcomeEntry[]> {
  const res = await fetch("/api/outcomes");
  if (!res.ok) return [];
  const data = await res.json();
  return (data.outcomes as OutcomeRow[]).map(toEntry);
}

export async function createOutcome(input: Omit<OutcomeEntry, "id">): Promise<OutcomeEntry | null> {
  const res = await fetch("/api/outcomes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return toEntry(data.outcome as OutcomeRow);
}

export async function deleteOutcome(id: string): Promise<boolean> {
  const res = await fetch(`/api/outcomes/${id}`, { method: "DELETE" });
  return res.ok;
}

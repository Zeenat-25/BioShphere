"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { recommendSchemes } from "@/lib/biosphere/schemes";
import type { GovScheme } from "@/lib/biosphere/types";

export default function SchemesPage() {
  const { data: session } = useSession();
  const [schemes, setSchemes] = useState<GovScheme[]>([]);

  useEffect(() => {
    setSchemes(recommendSchemes((session?.user?.experience as "beginner" | "experienced" | null) ?? null));
  }, [session]);

  return (
    <div className="space-y-4">
      <div className="card p-4 text-xs text-muted">
        Matched to your farm profile and current activity. Replace the static dataset in
        <code className="mono"> lib/biosphere/schemes.ts</code> with a live government-scheme API when available.
      </div>

      {schemes.map((s) => (
        <div key={s.id} className="card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{s.name}</span>
            <span className="text-[10px] mono text-muted">{s.agency}</span>
          </div>
          <p className="mt-2 text-xs text-muted">{s.benefit}</p>
          <p className="mt-1 text-[11px] text-muted">Eligibility: {s.eligibility}</p>
          <p className="mt-2 text-[11px] text-accent-2">Why it's suggested: {s.matchReason}</p>
        </div>
      ))}
    </div>
  );
}

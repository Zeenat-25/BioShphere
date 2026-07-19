import type { ReadinessResult } from "@/lib/biosphere/types";

const VERDICT_STYLE: Record<ReadinessResult["verdict"], string> = {
  Ready: "text-ok border-ok/40 bg-ok/10",
  Wait: "text-warn border-warn/40 bg-warn/10",
  "High Risk": "text-danger border-danger/40 bg-danger/10",
};

export function ReadinessCard({ readiness }: { readiness: ReadinessResult }) {
  return (
    <div className="card p-5 lg:col-span-2">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-muted">Biological Readiness Score</div>
          <div className="mt-1.5 text-4xl font-semibold text-foreground">{readiness.score}</div>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${VERDICT_STYLE[readiness.verdict]}`}>
          {readiness.verdict}
        </span>
      </div>

      <p className="mt-3 text-sm text-muted leading-relaxed">{readiness.explanation}</p>

      <ul className="mt-4 space-y-1.5">
        {readiness.reasons.map((r, i) => (
          <li key={i} className="text-xs text-muted flex gap-2">
            <span className="text-accent-2 mt-0.5">—</span>
            <span>{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

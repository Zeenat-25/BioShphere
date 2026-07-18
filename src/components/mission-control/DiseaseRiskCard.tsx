import type { DiseaseRisk } from "@/lib/biosphere/types";

const LEVEL_STYLE: Record<DiseaseRisk["level"], string> = {
  low: "text-ok border-ok/40 bg-ok/10",
  moderate: "text-warn border-warn/40 bg-warn/10",
  high: "text-danger border-danger/40 bg-danger/10",
};

export function DiseaseRiskCard({ disease }: { disease: DiseaseRisk }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-muted">Disease Risk</div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${LEVEL_STYLE[disease.level]}`}>
          {disease.level}
        </span>
      </div>
      <div className="mt-2 text-lg font-semibold text-foreground">{disease.pathogen}</div>
      <div className="mt-1 text-xs text-muted">Risk score {disease.score}/100</div>
      <p className="mt-2 text-xs text-muted leading-relaxed">{disease.note}</p>
    </div>
  );
}

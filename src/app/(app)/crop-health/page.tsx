"use client";

import { useState } from "react";
import { simulateFieldHealth, scanFieldImage } from "@/lib/biosphere/cropHealth";
import type { CropHealthMetrics, DiseaseScanResult } from "@/lib/biosphere/types";

const RISK_STYLE: Record<CropHealthMetrics["riskLevel"], string> = {
  Low: "text-ok border-ok/40 bg-ok/10",
  Medium: "text-warn border-warn/40 bg-warn/10",
  High: "text-danger border-danger/40 bg-danger/10",
};

export default function CropHealthPage() {
  const [fields] = useState<CropHealthMetrics[]>(() => simulateFieldHealth());
  const [scan, setScan] = useState<DiseaseScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  const runScan = () => {
    setScanning(true);
    setScan(null);
    setTimeout(() => {
      setScan(scanFieldImage());
      setScanning(false);
    }, 900);
  };

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="text-[11px] uppercase tracking-wide text-muted">Health Metrics by Field</div>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {fields.map((f) => (
            <div key={f.fieldName} className="rounded-lg border border-border p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{f.fieldName}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${RISK_STYLE[f.riskLevel]}`}>{f.riskLevel}</span>
              </div>
              <div className="text-[11px] text-muted mt-0.5">{f.cropType}</div>
              <div className="mt-2 text-2xl font-semibold text-foreground">{f.healthScore}</div>
              <div className="text-[11px] text-muted">Health score / 100</div>
              <div className="mt-2 grid grid-cols-3 gap-1.5 text-center">
                <div>
                  <div className="text-xs font-medium text-foreground">{f.ndvi}</div>
                  <div className="text-[9px] text-muted">NDVI</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">{f.stressIndex}</div>
                  <div className="text-[9px] text-muted">Stress</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">{f.moisturePct}%</div>
                  <div className="text-[9px] text-muted">Moisture</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="text-[11px] uppercase tracking-wide text-muted">Disease Detection</div>
        <p className="mt-1 text-xs text-muted">
          Run a field-image scan for early disease detection. Wire a real computer-vision model behind this button by
          replacing <code className="mono">scanFieldImage()</code> in <code className="mono">lib/biosphere/cropHealth.ts</code>.
        </p>
        <button
          onClick={runScan}
          disabled={scanning}
          className="mt-3 px-4 py-2 rounded-lg bg-accent text-panel text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {scanning ? "Analyzing image…" : "Run field scan"}
        </button>

        {scan && (
          <div className="mt-4 rounded-lg border border-border p-4">
            {scan.diseaseDetected ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{scan.diseaseName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-danger/40 text-danger bg-danger/10">
                    {scan.confidence}% confidence
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted leading-relaxed">{scan.description}</p>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">No disease detected</span>
                <span className="text-xs px-2 py-0.5 rounded-full border border-ok/40 text-ok bg-ok/10">
                  {scan.confidence}% confidence
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

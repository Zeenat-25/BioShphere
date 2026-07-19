"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Weather Engine", "Sensor Network", "AI Core"];

export function BootSequence({ onDone }: { onDone: () => void }) {
  const [checked, setChecked] = useState<number>(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (checked < STEPS.length) {
      const t = setTimeout(() => setChecked((c) => c + 1), 420);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, [checked]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setLeaving(true), 500);
    const t2 = setTimeout(onDone, 950);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [ready, onDone]);

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          <div className="serif text-3xl tracking-tight text-foreground">BioSphere AI</div>
          <div className="mt-1.5 text-xs mono text-muted tracking-wide">Synchronizing Earth Intelligence…</div>

          <div className="mt-8 w-64 space-y-2.5">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors ${
                    i < checked
                      ? "border-accent bg-accent text-panel"
                      : "border-border text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className={i < checked ? "text-foreground" : "text-muted"}>{step}</span>
              </div>
            ))}
            <div className="flex items-center gap-2.5 text-sm">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors ${
                  ready ? "border-accent bg-accent text-panel" : "border-border text-transparent"
                }`}
              >
                ✓
              </span>
              <span className={ready ? "text-foreground" : "text-muted"}>Ready</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

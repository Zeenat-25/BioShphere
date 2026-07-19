"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BootSequence } from "@/components/BootSequence";
import { EarthHero } from "@/components/EarthHero";

export default function Home() {
  const [booted, setBooted] = useState(false);

  // Skip the boot sequence on client-side navigations back to "/" within the
  // same session — it should only play once per visit.
  useEffect(() => {
    if (sessionStorage.getItem("biosphere.booted")) setBooted(true);
  }, []);

  const finishBoot = () => {
    sessionStorage.setItem("biosphere.booted", "1");
    setBooted(true);
  };

  return (
    <>
      {!booted && <BootSequence onDone={finishBoot} />}
      <main className="flex-1 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left: identity + entry points */}
        <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-16">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 mb-10">
              <span className="h-8 w-8 rounded-md bg-accent flex items-center justify-center text-panel text-sm font-semibold">
                B
              </span>
              <span className="serif text-xl">BioSphere AI</span>
            </div>

            <h1 className="serif text-4xl sm:text-5xl leading-[1.08] text-foreground">
              Earth Intelligence for Every Farm
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-muted">
              BioSphere AI fuses live soil, weather and sensor data into a single Biological
              Readiness Score — so you know exactly when conditions support a biological
              application, and when to wait.
            </p>

            <div className="mt-9 flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-lg bg-accent text-panel text-sm font-medium hover:opacity-90 transition"
              >
                Log in
              </Link>
              <a
                href="#learn-more"
                className="px-5 py-2.5 rounded-lg border border-border text-sm text-foreground hover:border-accent/50 transition"
              >
                Learn more
              </a>
            </div>

            <p className="mt-6 text-xs text-muted">
              No account? <Link href="/register" className="text-accent hover:underline">Request access</Link>
            </p>

            <div id="learn-more" className="mt-14 pt-8 border-t border-border grid grid-cols-3 gap-4">
              {[
                ["Biological Readiness Engine", "Rule-based scoring, fully explainable."],
                ["Live Sensor Network", "Soil moisture, temperature, humidity."],
                ["Marketplace", "Retailers, prices, and selling windows."],
              ].map(([title, body]) => (
                <div key={title}>
                  <div className="text-xs font-medium text-foreground">{title}</div>
                  <div className="text-[11px] text-muted mt-1 leading-snug">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: hero video */}
        <div className="hidden lg:block p-6">
          <EarthHero />
        </div>
      </main>
    </>
  );
}

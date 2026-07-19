"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { ExperienceLevel } from "@/lib/biosphere/types";

const OPTIONS: { level: ExperienceLevel; title: string; body: string }[] = [
  {
    level: "beginner",
    title: "Beginner Farmer",
    body: "New to biological products or precision agriculture. BioSphere AI will explain every recommendation in plain language.",
  },
  {
    level: "experienced",
    title: "Experienced Farmer",
    body: "Comfortable with agronomy and biologicals. BioSphere AI will surface dense, technical detail and skip the basics.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [saving, setSaving] = useState<ExperienceLevel | null>(null);

  const choose = async (level: ExperienceLevel) => {
    setSaving(level);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experience: level }),
    });
    // Refresh the JWT so the new experience level is reflected everywhere
    // (this triggers the `trigger === "update"` branch in the jwt callback).
    await update();
    router.push("/mission-control");
    router.refresh();
  };

  const name = session?.user?.name;

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <p className="text-xs mono text-muted uppercase tracking-wide">Welcome{name ? `, ${name}` : ""}</p>
        <h1 className="serif text-3xl mt-2 text-foreground">Are you a beginner or experienced farmer?</h1>
        <p className="mt-3 text-sm text-muted">This tunes how the AI explains recommendations. You can change it later in settings.</p>

        <div className="mt-10 grid sm:grid-cols-2 gap-4 text-left">
          {OPTIONS.map((opt) => (
            <button
              key={opt.level}
              onClick={() => choose(opt.level)}
              disabled={saving !== null}
              className="card p-6 text-left hover:border-accent/60 transition group disabled:opacity-60"
            >
              <div className="text-sm font-semibold text-foreground group-hover:text-accent transition">
                {opt.title} {saving === opt.level && "…"}
              </div>
              <div className="mt-2 text-xs text-muted leading-relaxed">{opt.body}</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

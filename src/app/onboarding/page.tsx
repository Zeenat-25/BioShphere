"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, saveExperience } from "@/lib/biosphere/auth";
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
  const [name, setName] = useState("");

  useEffect(() => {
    const profile = getProfile();
    if (!profile) {
      router.push("/login");
      return;
    }
    setName(profile.name);
  }, [router]);

  const choose = (level: ExperienceLevel) => {
    saveExperience(level);
    router.push("/mission-control");
  };

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
              className="card p-6 text-left hover:border-accent/60 transition group"
            >
              <div className="text-sm font-semibold text-foreground group-hover:text-accent transition">{opt.title}</div>
              <div className="mt-2 text-xs text-muted leading-relaxed">{opt.body}</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

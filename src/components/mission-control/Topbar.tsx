"use client";

import { signOut } from "next-auth/react";
import { NotificationCenter } from "./NotificationCenter";

interface TopbarProfile {
  name?: string | null;
  experience?: string | null;
}

export function Topbar({ profile, title }: { profile: TopbarProfile | null; title: string }) {
  return (
    <header className="h-14 shrink-0 border-b border-border bg-panel flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <NotificationCenter />
        {profile && (
          <span className="text-xs text-muted">
            {profile.name} · <span className="mono">{profile.experience ?? "unset"}</span>
          </span>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-xs px-3 py-1.5 rounded-md border border-border text-muted hover:text-foreground hover:border-accent/50 transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

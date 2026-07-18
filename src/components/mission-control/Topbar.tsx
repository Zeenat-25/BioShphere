"use client";

import { useRouter } from "next/navigation";
import type { UserProfile } from "@/lib/biosphere/types";
import { logout } from "@/lib/biosphere/auth";

export function Topbar({ profile, title }: { profile: UserProfile | null; title: string }) {
  const router = useRouter();
  return (
    <header className="h-14 shrink-0 border-b border-border bg-panel flex items-center justify-between px-6">
      <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        {profile && (
          <span className="text-xs text-muted">
            {profile.name} · <span className="mono">{profile.experience ?? "unset"}</span>
          </span>
        )}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="text-xs px-3 py-1.5 rounded-md border border-border text-muted hover:text-foreground hover:border-accent/50 transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

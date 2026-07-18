"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/mission-control/Sidebar";
import { Topbar } from "@/components/mission-control/Topbar";
import { AIAssistant } from "@/components/AIAssistant";
import { getProfile } from "@/lib/biosphere/auth";
import type { UserProfile } from "@/lib/biosphere/types";

export default function MissionControlLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null | undefined>(undefined);

  useEffect(() => {
    const p = getProfile();
    if (!p) {
      router.push("/login");
      return;
    }
    if (!p.experience) {
      router.push("/onboarding");
      return;
    }
    setProfile(p);
  }, [router]);

  if (profile === undefined) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar profile={profile} title="Mission Control" />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <AIAssistant experience={profile?.experience ?? null} />
    </div>
  );
}

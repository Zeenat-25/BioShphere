"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/mission-control/Sidebar";
import { Topbar } from "@/components/mission-control/Topbar";
import { AIAssistant } from "@/components/AIAssistant";

const TITLES: Record<string, string> = {
  "/mission-control": "Mission Control",
  "/crop-health": "Crop Health",
  "/yield-forecast": "Yield Forecast",
  "/resource-optimization": "Resource Optimization",
  "/greenhouse": "Greenhouse Monitor",
  "/marketplace": "Marketplace Intelligence",
  "/schemes": "Government Schemes",
  "/outcomes": "Outcome Tracking",
  "/reports": "Historical Farm Reports",
};

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Middleware already enforces auth + onboarding server-side before this
  // ever renders; this loading guard just avoids a flash of empty content
  // while the session hydrates client-side.
  if (status === "loading") {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar profile={session?.user ?? null} title={TITLES[pathname] ?? "BioSphere AI"} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
      <AIAssistant experience={(session?.user?.experience as "beginner" | "experienced" | null) ?? null} />
    </div>
  );
}

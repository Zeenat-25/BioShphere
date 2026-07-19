"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/mission-control", label: "Mission Control" },
  { href: "/crop-health", label: "Crop Health" },
  { href: "/yield-forecast", label: "Yield Forecast" },
  { href: "/resource-optimization", label: "Resource Optimization" },
  { href: "/greenhouse", label: "Greenhouse Monitor" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/schemes", label: "Government Schemes" },
  { href: "/outcomes", label: "Outcome Tracking" },
  { href: "/reports", label: "Reports" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-panel px-4 py-6">
      <Link href="/" className="flex items-center gap-2.5 px-2 mb-8">
        <span className="h-7 w-7 rounded-md bg-accent flex items-center justify-center text-panel text-xs font-semibold">
          B
        </span>
        <span className="serif text-base">BioSphere AI</span>
      </Link>

      <nav className="space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm transition ${
                active ? "bg-panel-2 text-foreground font-medium" : "text-muted hover:bg-panel-2 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 text-[11px] text-muted px-2 leading-relaxed">
        Earth Intelligence for Every Farm
      </div>
    </aside>
  );
}

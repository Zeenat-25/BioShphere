import Link from "next/link";
import type { Retailer } from "@/lib/biosphere/types";

export function RetailersCard({ retailers }: { retailers: Retailer[] }) {
  const top = [...retailers].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 4);
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-muted">Nearby Retailers</div>
        <Link href="/marketplace" className="text-[11px] text-accent hover:underline">
          View map →
        </Link>
      </div>
      <div className="mt-3 space-y-2.5">
        {top.map((r) => (
          <div key={r.id} className="flex items-center justify-between text-sm">
            <div>
              <div className="text-foreground">{r.name}</div>
              <div className="text-[11px] text-muted">{r.category}</div>
            </div>
            <span className="text-xs text-muted">{r.distanceKm} km</span>
          </div>
        ))}
      </div>
    </div>
  );
}

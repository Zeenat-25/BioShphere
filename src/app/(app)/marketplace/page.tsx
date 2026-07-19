"use client";

import { useMemo } from "react";
import { simulateMarketPrices, simulateRetailers } from "@/lib/biosphere/simulate";
import { RetailerMap } from "@/components/RetailerMap";

export default function MarketplacePage() {
  const retailers = useMemo(() => simulateRetailers(), []);
  const prices = useMemo(() => simulateMarketPrices(), []);
  const bestSeller = [...prices].sort((a, b) => b.changePct - a.changePct)[0];

  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="text-[11px] uppercase tracking-wide text-muted">Retailers &amp; Buyers Near You</div>
        <div className="mt-3">
          <RetailerMap retailers={retailers} />
        </div>
        <div className="mt-4 space-y-5">
          {(["Seed", "Biologicals", "Buyer", "Co-op"] as const).map((cat) => {
            const items = retailers.filter((r) => r.category === cat);
            if (items.length === 0) return null;
            const label =
              cat === "Seed" ? "Nearby Seed Stores" : cat === "Biologicals" ? "Nearby Biological Retailers" : cat === "Buyer" ? "Crop Buyers" : "Co-ops";
            return (
              <div key={cat}>
                <div className="text-[11px] uppercase tracking-wide text-muted mb-2">{label}</div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((r) => (
                    <div key={r.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{r.name}</span>
                        <span className="text-[10px] mono text-muted">{r.category}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted">{r.address}</div>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted">
                        <span>{r.distanceKm} km away</span>
                        <span>★ {r.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wide text-muted">Current Market Prices</div>
          <div className="mt-3 space-y-2">
            {prices.map((p) => (
              <div key={p.crop} className="flex items-center justify-between text-sm border-b border-border last:border-0 py-2">
                <span className="text-foreground">{p.crop}</span>
                <span className="text-muted text-xs">
                  ${p.pricePerUnit} {p.unit} ({p.changePct > 0 ? "+" : ""}
                  {p.changePct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="text-[11px] uppercase tracking-wide text-muted">Best Place &amp; Time to Sell</div>
          {bestSeller && (
            <div className="mt-3">
              <div className="text-lg font-semibold text-foreground">{bestSeller.crop}</div>
              <p className="mt-1 text-xs text-muted leading-relaxed">
                {bestSeller.crop} is trending {bestSeller.trend} ({bestSeller.changePct > 0 ? "+" : ""}
                {bestSeller.changePct}% this week) — currently the strongest pricing opportunity among your tracked crops.
              </p>
              <div className="mt-3 text-xs text-muted">
                Predicted next window: prices for {bestSeller.crop.toLowerCase()} typically firm up 2–3 weeks before
                regional harvest peaks — plan delivery contracts accordingly.
              </div>
            </div>
          )}
          <p className="mt-4 text-[11px] text-muted border-t border-border pt-3">
            Price predictions are illustrative. Connect a commodity price feed to replace simulated data.
          </p>
        </div>
      </div>
    </div>
  );
}

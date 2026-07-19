import type { MarketPrice } from "@/lib/biosphere/types";

const TREND_ICON: Record<MarketPrice["trend"], string> = { up: "▲", down: "▼", flat: "▬" };
const TREND_COLOR: Record<MarketPrice["trend"], string> = { up: "text-ok", down: "text-danger", flat: "text-muted" };

export function MarketCard({ prices }: { prices: MarketPrice[] }) {
  return (
    <div className="card p-5">
      <div className="text-[11px] uppercase tracking-wide text-muted">Market Prices</div>
      <div className="mt-3 space-y-2">
        {prices.map((p) => (
          <div key={p.crop} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{p.crop}</span>
            <div className="flex items-center gap-2">
              <span className="text-muted text-xs">
                ${p.pricePerUnit} {p.unit}
              </span>
              <span className={`text-xs ${TREND_COLOR[p.trend]}`}>
                {TREND_ICON[p.trend]} {Math.abs(p.changePct)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

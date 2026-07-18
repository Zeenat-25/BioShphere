import type { BiologicalProduct } from "@/lib/biosphere/types";

export function ProductsCard({ products }: { products: BiologicalProduct[] }) {
  return (
    <div className="card p-5 lg:col-span-2">
      <div className="text-[11px] uppercase tracking-wide text-muted">Recommended Biological Products</div>
      <div className="mt-3 divide-y divide-border">
        {products.map((p) => (
          <div key={p.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{p.name}</span>
              <span className="text-[10px] mono text-muted">{p.type}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{p.matchReason}</p>
            <p className="mt-0.5 text-[11px] text-accent-2">{p.applicationWindow}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

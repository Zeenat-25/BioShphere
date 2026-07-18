"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Retailer } from "@/lib/biosphere/types";

const CATEGORY_COLOR: Record<Retailer["category"], string> = {
  Seed: "#7c8a4a",
  Biologicals: "#35502f",
  Buyer: "#b3813a",
  "Co-op": "#a8442c",
};

export function RetailerMap({ retailers }: { retailers: Retailer[] }) {
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !elRef.current || mapRef.current || retailers.length === 0) return;

      const map = L.map(elRef.current, { zoomControl: true, scrollWheelZoom: false });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap contributors © CARTO",
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      const bounds: [number, number][] = [];
      for (const r of retailers) {
        const latlng: [number, number] = [r.lat, r.lng];
        const color = CATEGORY_COLOR[r.category];
        L.circleMarker(latlng, { radius: 8, color, weight: 2, fillColor: color, fillOpacity: 0.85 })
          .addTo(map)
          .bindTooltip(`${r.name} · ${r.category} · ${r.distanceKm} km`, { direction: "top", offset: [0, -6] });
        bounds.push(latlng);
      }
      map.fitBounds(L.latLngBounds(bounds).pad(0.4), { animate: false });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [retailers]);

  return <div ref={elRef} className="h-80 w-full rounded-xl overflow-hidden border border-border" />;
}

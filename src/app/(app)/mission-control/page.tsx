"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  simulateMarketPrices,
  simulateRetailers,
  simulateSensorHistory,
  simulateSensorReading,
  simulateSensorStatuses,
  simulateWeather,
} from "@/lib/biosphere/simulate";
import { computeDiseaseRisk, computeReadiness } from "@/lib/biosphere/readiness";
import { buildTodaysMission, recommendProducts } from "@/lib/biosphere/recommendations";
import { fetchOutcomes } from "@/lib/biosphere/outcomesApi";
import { applyLearningToReadiness, deriveLearningInsight } from "@/lib/biosphere/learning";
import type { OutcomeEntry, SensorReading } from "@/lib/biosphere/types";

import { StatCard } from "@/components/mission-control/StatCard";
import { ReadinessCard } from "@/components/mission-control/ReadinessCard";
import { WeatherCard } from "@/components/mission-control/WeatherCard";
import { DiseaseRiskCard } from "@/components/mission-control/DiseaseRiskCard";
import { ProductsCard } from "@/components/mission-control/ProductsCard";
import { MissionCard } from "@/components/mission-control/MissionCard";
import { MarketCard } from "@/components/mission-control/MarketCard";
import { RetailersCard } from "@/components/mission-control/RetailersCard";
import { SensorStatusCard } from "@/components/mission-control/SensorStatusCard";

const QUICK_LINKS = [
  { href: "/crop-health", label: "Crop Health" },
  { href: "/yield-forecast", label: "Yield Forecast" },
  { href: "/resource-optimization", label: "Resource Optimization" },
  { href: "/greenhouse", label: "Greenhouse Monitor" },
  { href: "/schemes", label: "Government Schemes" },
  { href: "/reports", label: "Reports" },
];

export default function MissionControlPage() {
  const { data: session } = useSession();
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeEntry[]>([]);
  const [tick, setTick] = useState(0);

  // Seed sensor history once, then simulate a new live reading every 8s —
  // this is where a real deployment would subscribe to a hardware gateway.
  useEffect(() => {
    setHistory(simulateSensorHistory());
    const id = setInterval(() => {
      setHistory((prev) => [...prev.slice(-23), simulateSensorReading(prev[prev.length - 1])]);
      setTick((t) => t + 1);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchOutcomes().then(setOutcomes);
  }, []);

  const latest = history[history.length - 1];
  const weather = useMemo(() => simulateWeather(), [tick]);
  const statuses = useMemo(() => simulateSensorStatuses(), [tick]);
  const prices = useMemo(() => simulateMarketPrices(), []);
  const retailers = useMemo(() => simulateRetailers(), []);
  const experience = (session?.user?.experience as "beginner" | "experienced" | null) ?? null;

  if (!latest) {
    return <div className="text-sm text-muted">Loading live readings…</div>;
  }

  const baseReadiness = computeReadiness(latest, weather);
  const learning = deriveLearningInsight(outcomes);
  const readiness = applyLearningToReadiness(baseReadiness, learning);
  const disease = computeDiseaseRisk(latest, weather);
  const products = recommendProducts(readiness, disease);
  const mission = buildTodaysMission(readiness, disease, experience);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {QUICK_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-accent/50 transition"
          >
            {l.label} →
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReadinessCard readiness={readiness} />
        <DiseaseRiskCard disease={disease} />

        <StatCard label="Soil Moisture" value={latest.soilMoisturePct} unit="%" />
        <StatCard label="Temperature" value={latest.temperatureC} unit="°C" />
        <StatCard label="Humidity" value={latest.humidityPct} unit="%" />

        <WeatherCard weather={weather} />
        <MarketCard prices={prices} />

        <ProductsCard products={products} />
        <RetailersCard retailers={retailers} />

        <MissionCard items={mission} />

        <SensorStatusCard history={history} statuses={statuses} />
      </div>
    </div>
  );
}

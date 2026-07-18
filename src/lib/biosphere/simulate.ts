// Deterministic-ish simulator for sensor, weather and market data.
// Swap these functions out for real integrations (LoRaWAN gateway, weather API,
// commodity price feed) without touching any component — every widget reads
// through this module only.

import type {
  DailyForecast,
  MarketPrice,
  Retailer,
  SensorReading,
  SensorStatus,
  WeatherSnapshot,
} from "./types";

function wobble(base: number, amount: number) {
  return base + (Math.random() - 0.5) * amount;
}

export function simulateSensorReading(prev?: SensorReading): SensorReading {
  const soil = clamp(wobble(prev?.soilMoisturePct ?? 38, 3), 8, 95);
  const temp = clamp(wobble(prev?.temperatureC ?? 24, 1.2), 5, 42);
  const humidity = clamp(wobble(prev?.humidityPct ?? 55, 4), 10, 100);
  return {
    timestamp: new Date().toISOString(),
    soilMoisturePct: round1(soil),
    temperatureC: round1(temp),
    humidityPct: round1(humidity),
  };
}

export function simulateSensorHistory(points = 24): SensorReading[] {
  const out: SensorReading[] = [];
  let prev: SensorReading | undefined;
  const now = Date.now();
  for (let i = points - 1; i >= 0; i--) {
    const reading = simulateSensorReading(prev);
    reading.timestamp = new Date(now - i * 15 * 60 * 1000).toISOString();
    out.push(reading);
    prev = reading;
  }
  return out;
}

export function simulateSensorStatuses(): SensorStatus[] {
  const zones = ["North Field", "South Field", "Greenhouse A", "Greenhouse B", "East Row"];
  return zones.map((zone, i) => ({
    id: `sensor-${i + 1}`,
    name: `Node ${String(i + 1).padStart(2, "0")}`,
    zone,
    online: Math.random() > 0.12,
    batteryPct: Math.round(clamp(wobble(75, 40), 5, 100)),
    lastSeen: new Date(Date.now() - Math.random() * 20 * 60 * 1000).toISOString(),
  }));
}

const CONDITIONS: DailyForecast["condition"][] = ["sunny", "cloudy", "rain", "clear", "storm"];

export function simulateWeather(): WeatherSnapshot {
  const temperatureC = round1(wobble(27, 6));
  const humidityPct = round1(clamp(wobble(58, 15), 20, 95));
  const windKph = round1(clamp(wobble(12, 8), 0, 40));
  const condition = CONDITIONS[Math.floor(Math.random() * 3)]; // bias away from storm for "now"

  const heatStress: WeatherSnapshot["heatStress"] =
    temperatureC > 34 ? "high" : temperatureC > 29 ? "moderate" : "low";

  const forecast: DailyForecast[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const c = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    return {
      date: d.toISOString().slice(0, 10),
      high: Math.round(wobble(31, 5)),
      low: Math.round(wobble(20, 4)),
      condition: c,
      rainProbabilityPct: Math.round(clamp(wobble(c === "rain" || c === "storm" ? 70 : 20, 25), 0, 100)),
    };
  });

  const rainSoon = forecast.slice(0, 2).some((f) => f.rainProbabilityPct > 55);
  const applicationWindow = {
    open: !rainSoon && heatStress !== "high" && windKph < 25,
    reason: rainSoon
      ? "Rain expected within 48 hours — biological products may wash off before uptake."
      : heatStress === "high"
        ? "Heat stress is high — foliar applications risk leaf burn and reduced efficacy."
        : windKph >= 25
          ? "Wind speed exceeds safe spray drift threshold."
          : "Conditions are stable: low wind, no rain in the next 48 hours, moderate temperatures.",
  };

  return { temperatureC, humidityPct, windKph, condition, heatStress, applicationWindow, forecast };
}

export function simulateMarketPrices(): MarketPrice[] {
  const crops: { crop: string; base: number; unit: string }[] = [
    { crop: "Wheat", base: 224, unit: "per tonne" },
    { crop: "Soybean", base: 512, unit: "per tonne" },
    { crop: "Maize", base: 189, unit: "per tonne" },
    { crop: "Cotton", base: 71, unit: "per 100 lb" },
    { crop: "Rice (paddy)", base: 268, unit: "per tonne" },
  ];
  return crops.map((c) => {
    const changePct = round1(wobble(0, 6));
    return {
      crop: c.crop,
      pricePerUnit: Math.round(c.base * (1 + changePct / 100)),
      unit: c.unit,
      trend: changePct > 0.5 ? "up" : changePct < -0.5 ? "down" : "flat",
      changePct,
    };
  });
}

export function simulateRetailers(centerLat = 19.076, centerLng = 72.8777): Retailer[] {
  const names: { name: string; category: Retailer["category"] }[] = [
    { name: "Green Field Agro Seeds", category: "Seed" },
    { name: "TerraBiologics Co-op Store", category: "Biologicals" },
    { name: "Regional Grain Buyers Ltd.", category: "Buyer" },
    { name: "Farmers' Collective Co-op", category: "Co-op" },
    { name: "Sunrise Seed & Supply", category: "Seed" },
    { name: "EarthGrow Biological Depot", category: "Biologicals" },
  ];
  return names.map((n, i) => ({
    id: `retailer-${i + 1}`,
    name: n.name,
    category: n.category,
    distanceKm: round1(1.2 + i * 2.4 + Math.random() * 2),
    lat: centerLat + (Math.random() - 0.5) * 0.25,
    lng: centerLng + (Math.random() - 0.5) * 0.25,
    address: `${12 + i * 4} Market Road, District ${i + 1}`,
    rating: round1(3.6 + Math.random() * 1.3),
  }));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function round1(n: number) {
  return Math.round(n * 10) / 10;
}

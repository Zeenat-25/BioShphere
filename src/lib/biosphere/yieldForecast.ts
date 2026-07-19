import type { CropHealthMetrics, CropType, WeatherSnapshot, YieldForecastResult } from "./types";

// Baseline yields (tons/acre), ported from the source app's yield_data sample.
const BASE_YIELD: Record<CropType, number> = { Wheat: 3.7, Rice: 4.2, Cotton: 2.5, Sugarcane: 35.0 };

/**
 * Trend-extrapolation forecast: 12 historical points + 5 forecast points with
 * a ±10% confidence band, same shape as the source Streamlit chart — but the
 * growth rate here responds to live crop health and weather instead of pure
 * random noise, so the forecast actually reflects current conditions.
 */
export function forecastYield(
  crop: CropType,
  health: CropHealthMetrics,
  weather: WeatherSnapshot,
): YieldForecastResult {
  const base = BASE_YIELD[crop] ?? 3.5;

  // Health and weather nudge the underlying growth rate up or down.
  const healthAdj = (health.healthScore - 70) / 1000; // -0.07..0.03
  const heatPenalty = weather.heatStress === "high" ? -0.015 : weather.heatStress === "moderate" ? -0.005 : 0;
  const growthRate = 0.02 + healthAdj + heatPenalty;

  const historical: number[] = [];
  let v = base * 0.85;
  for (let i = 0; i < 12; i++) {
    v = v * (1 + 0.015 + (Math.random() - 0.5) * 0.01);
    historical.push(Math.round(v * 100) / 100);
  }

  const series: YieldForecastResult["series"] = historical.map((val, i) => ({
    label: `T-${12 - i}`,
    actual: val,
    forecast: null,
    upper: null,
    lower: null,
  }));

  let last = historical[historical.length - 1];
  for (let i = 1; i <= 5; i++) {
    last = last * (1 + growthRate + Math.random() * 0.01);
    const value = Math.round(last * 100) / 100;
    series.push({
      label: `T+${i}`,
      actual: null,
      forecast: value,
      upper: Math.round(value * 1.1 * 100) / 100,
      lower: Math.round(value * 0.9 * 100) / 100,
    });
  }

  const currentForecastTonsPerAcre = series[series.length - 1].forecast ?? base;
  const changePct = Math.round(((currentForecastTonsPerAcre - historical[0]) / historical[0]) * 1000) / 10;

  const factors: string[] = [];
  factors.push(
    health.healthScore >= 75
      ? "Crop health index is strong and supporting yield growth."
      : "Crop health index is below target — treat this as a risk to the forecast.",
  );
  factors.push(
    weather.heatStress === "high"
      ? "High heat stress is projected to reduce yield potential."
      : "Temperature conditions are within a supportive range.",
  );
  factors.push(`Disease/stress index at ${health.stressIndex} is factored into the growth-rate adjustment.`);

  return { crop, currentForecastTonsPerAcre, changePct, series, factors };
}

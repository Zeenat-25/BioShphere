import type { DiseaseRisk, ReadinessResult, ReadinessVerdict, SensorReading, WeatherSnapshot } from "./types";

/**
 * Fuses soil moisture, temperature, humidity and the weather forecast into a
 * single 0-100 Biological Readiness Score, with a plain-language explanation
 * of every contributing factor. This is intentionally rule-based (not a
 * black box) so an advisor can audit exactly why a recommendation was made.
 */
export function computeReadiness(sensor: SensorReading, weather: WeatherSnapshot): ReadinessResult {
  let score = 100;
  const reasons: string[] = [];

  // Soil moisture: biologicals need moist (not saturated, not dry) soil to establish.
  if (sensor.soilMoisturePct < 20) {
    score -= 30;
    reasons.push("Soil moisture is low (below 20%) — microbial products will struggle to establish.");
  } else if (sensor.soilMoisturePct > 80) {
    score -= 20;
    reasons.push("Soil is near saturation — risk of runoff and reduced uptake.");
  } else if (sensor.soilMoisturePct >= 30 && sensor.soilMoisturePct <= 60) {
    reasons.push("Soil moisture is in the ideal establishment range (30–60%).");
  }

  // Temperature: most biological/microbial products have an optimal 15-30C band.
  if (sensor.temperatureC < 12) {
    score -= 25;
    reasons.push("Soil/air temperature is too cold for reliable microbial activity.");
  } else if (sensor.temperatureC > 34) {
    score -= 25;
    reasons.push("Temperature is high enough to stress applied organisms and reduce survival.");
  } else if (sensor.temperatureC >= 18 && sensor.temperatureC <= 28) {
    reasons.push("Temperature is in the optimal biological activity range.");
  }

  // Humidity supports foliar survival of many biologicals.
  if (sensor.humidityPct < 30) {
    score -= 10;
    reasons.push("Low humidity increases desiccation risk for foliar-applied organisms.");
  }

  // Weather application window (rain, wind, heat stress).
  if (!weather.applicationWindow.open) {
    score -= 20;
    reasons.push(weather.applicationWindow.reason);
  } else {
    reasons.push("Weather application window is open: low wind, no rain forecast, safe heat range.");
  }

  if (weather.heatStress === "moderate") {
    score -= 5;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const verdict: ReadinessVerdict = score >= 70 ? "Ready" : score >= 40 ? "Wait" : "High Risk";

  const explanation =
    verdict === "Ready"
      ? "Soil, air and forecast conditions currently support a biological application. This is a good window to apply within the next 24-48 hours."
      : verdict === "Wait"
        ? "Conditions are borderline. Applying now carries real risk of reduced efficacy — consider waiting for the next favorable window."
        : "Current conditions are unfavorable and a biological application is likely to fail or wash off. Hold off and recheck after conditions change.";

  return { score, verdict, reasons, explanation };
}

const PATHOGENS_BY_HUMIDITY = [
  { min: 80, pathogen: "Powdery mildew / foliar blight", level: "high" as const },
  { min: 60, pathogen: "Leaf spot fungi", level: "moderate" as const },
  { min: 0, pathogen: "General fungal pressure", level: "low" as const },
];

export function computeDiseaseRisk(sensor: SensorReading, weather: WeatherSnapshot): DiseaseRisk {
  const match =
    PATHOGENS_BY_HUMIDITY.find((p) => sensor.humidityPct >= p.min) ?? PATHOGENS_BY_HUMIDITY[PATHOGENS_BY_HUMIDITY.length - 1];
  const warmAndWet = sensor.humidityPct > 65 && sensor.temperatureC > 20 && sensor.temperatureC < 30;
  const score = Math.round(
    Math.min(100, sensor.humidityPct * 0.7 + (warmAndWet ? 20 : 0) + (weather.condition === "rain" ? 10 : 0)),
  );
  const level: DiseaseRisk["level"] = score >= 65 ? "high" : score >= 40 ? "moderate" : "low";
  return {
    level,
    pathogen: match.pathogen,
    score,
    note:
      level === "high"
        ? "Warm, humid conditions favor disease pressure. Scout fields today and consider a preventive biological fungicide."
        : level === "moderate"
          ? "Conditions are moderately favorable for disease — keep monitoring humidity and canopy wetness."
          : "Low disease pressure under current conditions.",
  };
}

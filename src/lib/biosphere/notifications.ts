import type {
  CropHealthMetrics,
  DiseaseRisk,
  NotificationAlert,
  ReadinessResult,
  ResourceOptimizationResult,
  SensorStatus,
  WeatherSnapshot,
} from "./types";

let counter = 0;
function id() {
  counter += 1;
  return `alert-${Date.now()}-${counter}`;
}

/**
 * Builds the day's notification feed from live module outputs. Categories
 * mirror the source app's alert_type set (weather / crop_health / yield /
 * resource) plus a sensor category for the greenhouse network.
 */
export function buildNotifications(args: {
  readiness: ReadinessResult;
  disease: DiseaseRisk;
  weather: WeatherSnapshot;
  fields: CropHealthMetrics[];
  resources: ResourceOptimizationResult;
  sensors: SensorStatus[];
}): NotificationAlert[] {
  const { readiness, disease, weather, fields, resources, sensors } = args;
  const now = new Date().toISOString();
  const alerts: NotificationAlert[] = [];

  if (readiness.verdict === "High Risk") {
    alerts.push({
      id: id(),
      category: "weather",
      severity: "high",
      title: "Biological application: High Risk",
      message: readiness.explanation,
      timestamp: now,
      read: false,
    });
  }

  if (!weather.applicationWindow.open) {
    alerts.push({
      id: id(),
      category: "weather",
      severity: "medium",
      title: "Application window closed",
      message: weather.applicationWindow.reason,
      timestamp: now,
      read: false,
    });
  }

  if (disease.level !== "low") {
    alerts.push({
      id: id(),
      category: "crop_health",
      severity: disease.level === "high" ? "high" : "medium",
      title: `${disease.pathogen} risk: ${disease.level}`,
      message: disease.note,
      timestamp: now,
      read: false,
    });
  }

  for (const f of fields) {
    if (f.riskLevel === "High") {
      alerts.push({
        id: id(),
        category: "crop_health",
        severity: "high",
        title: `${f.fieldName}: crop health critical`,
        message: `Health score ${f.healthScore}/100 for ${f.cropType} — inspect and consider foliar nutrient application.`,
        timestamp: now,
        read: false,
      });
    }
  }

  const worstResource = [...resources.lines].sort((a, b) => b.potentialSavingsPct - a.potentialSavingsPct)[0];
  if (worstResource && worstResource.potentialSavingsPct > 15) {
    alerts.push({
      id: id(),
      category: "resource",
      severity: "medium",
      title: `${worstResource.resource} usage above optimal`,
      message: `Efficiency at ${worstResource.efficiencyPct}% — up to ${worstResource.potentialSavingsPct}% savings available.`,
      timestamp: now,
      read: false,
    });
  }

  const offline = sensors.filter((s) => !s.online);
  if (offline.length > 0) {
    alerts.push({
      id: id(),
      category: "sensor",
      severity: offline.length > 1 ? "high" : "medium",
      title: `${offline.length} sensor node${offline.length > 1 ? "s" : ""} offline`,
      message: `${offline.map((s) => s.name).join(", ")} not reporting — check power and gateway connectivity.`,
      timestamp: now,
      read: false,
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: id(),
      category: "weather",
      severity: "info",
      title: "All systems nominal",
      message: "No active alerts — conditions, sensors and crop health are within normal range.",
      timestamp: now,
      read: false,
    });
  }

  return alerts;
}

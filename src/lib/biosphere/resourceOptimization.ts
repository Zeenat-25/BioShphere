import type { ResourceLine, ResourceOptimizationResult, SensorReading } from "./types";

/**
 * Water/fertilizer/energy efficiency analysis, ported from the source app's
 * water-savings and fertilizer-optimization calculations. Water's "optimal
 * usage" here is derived from the live soil moisture reading rather than a
 * static sample table, so it responds to real conditions.
 */
export function computeResourceOptimization(sensor: SensorReading): ResourceOptimizationResult {
  const targetMoisture = 45; // ideal soil moisture % for most row crops
  const moistureGapPct = Math.max(0, targetMoisture - sensor.soilMoisturePct);

  const currentWaterUsage = 65 + moistureGapPct * 0.6; // mm/week, rises when soil runs dry
  const optimalWaterUsage = 58; // mm/week, the source app's benchmark
  const waterEfficiency = Math.round((optimalWaterUsage / currentWaterUsage) * 100);
  const waterSavingsPct = Math.max(0, Math.round(((currentWaterUsage - optimalWaterUsage) / currentWaterUsage) * 100));

  const lines: ResourceLine[] = [
    {
      resource: "Water",
      currentUsage: Math.round(currentWaterUsage),
      optimalUsage: optimalWaterUsage,
      unit: "mm/week",
      efficiencyPct: Math.min(100, waterEfficiency),
      potentialSavingsPct: waterSavingsPct,
      costSavings: Math.round((currentWaterUsage - optimalWaterUsage) * 2 * 52), // $2/mm-equivalent, annualized
    },
    {
      resource: "Fertilizer",
      currentUsage: 210,
      optimalUsage: 175,
      unit: "kg/ha",
      efficiencyPct: 83,
      potentialSavingsPct: 17,
      costSavings: 1225,
    },
    {
      resource: "Energy",
      currentUsage: 12000,
      optimalUsage: 9600,
      unit: "kWh/yr",
      efficiencyPct: 80,
      potentialSavingsPct: 20,
      costSavings: 960,
    },
  ];

  const overallEfficiencyPct = Math.round(lines.reduce((s, l) => s + l.efficiencyPct, 0) / lines.length);
  const totalAnnualSavings = lines.reduce((s, l) => s + l.costSavings, 0);

  const recommendations: string[] = [];
  if (waterSavingsPct > 15) {
    recommendations.push("Soil moisture is running below target — install drip irrigation or soil moisture sensors to close the gap.");
  } else {
    recommendations.push("Water usage is close to optimal for current soil conditions.");
  }
  recommendations.push("Fertilizer efficiency is below 90% — consider a variable-rate application based on the soil health index.");
  recommendations.push("Energy costs can drop ~20% by scheduling irrigation pumps during off-peak hours and maintaining pump sizing.");

  return { lines, overallEfficiencyPct, totalAnnualSavings, recommendations };
}

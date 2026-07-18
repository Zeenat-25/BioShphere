import type { BiologicalProduct, DiseaseRisk, ExperienceLevel, MissionItem, ReadinessResult } from "./types";

export function recommendProducts(readiness: ReadinessResult, disease: DiseaseRisk): BiologicalProduct[] {
  const products: BiologicalProduct[] = [];

  if (disease.level !== "low") {
    products.push({
      id: "prod-biofungicide",
      name: "Bacillus subtilis Biofungicide",
      type: "Biological Fungicide",
      matchReason: `${disease.pathogen} risk is ${disease.level} at current humidity levels.`,
      applicationWindow: readiness.verdict === "Ready" ? "Apply within 24 hours" : "Hold until conditions improve",
    });
  }

  if (readiness.verdict === "Ready") {
    products.push({
      id: "prod-mycorrhizae",
      name: "Mycorrhizal Root Inoculant",
      type: "Soil Biological",
      matchReason: "Soil moisture and temperature are in the optimal establishment range.",
      applicationWindow: "Apply at planting or during next irrigation cycle",
    });
    products.push({
      id: "prod-biostimulant",
      name: "Seaweed Extract Biostimulant",
      type: "Foliar Biostimulant",
      matchReason: "Weather application window is open — low wind, no rain forecast.",
      applicationWindow: "Apply in early morning or evening within 48 hours",
    });
  } else {
    products.push({
      id: "prod-hold",
      name: "Hold all foliar biologicals",
      type: "Advisory",
      matchReason: "Current soil/weather conditions reduce product efficacy.",
      applicationWindow: "Recheck after next favorable window",
    });
  }

  return products;
}

export function buildTodaysMission(
  readiness: ReadinessResult,
  disease: DiseaseRisk,
  experience: ExperienceLevel | null,
): MissionItem[] {
  const items: MissionItem[] = [];

  items.push({
    id: "m-readiness",
    title:
      readiness.verdict === "Ready"
        ? "Apply scheduled biologicals today"
        : readiness.verdict === "Wait"
          ? "Hold applications — recheck conditions this evening"
          : "Do not apply — conditions are high risk",
    detail: readiness.explanation,
    priority: readiness.verdict === "High Risk" ? "high" : "medium",
    done: false,
  });

  if (disease.level !== "low") {
    items.push({
      id: "m-scout",
      title: "Scout fields for early disease symptoms",
      detail: disease.note,
      priority: disease.level === "high" ? "high" : "medium",
      done: false,
    });
  }

  items.push({
    id: "m-sensors",
    title: "Confirm all sensor nodes are reporting",
    detail: "Check the Live Sensor Status panel for any offline or low-battery nodes.",
    priority: "low",
    done: false,
  });

  if (experience === "beginner") {
    items.push({
      id: "m-learn",
      title: "Review today's readiness explanation",
      detail: "New to biologicals? Open the Biological Readiness card to see exactly why today's score is what it is.",
      priority: "low",
      done: false,
    });
  }

  return items;
}

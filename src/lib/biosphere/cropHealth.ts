import type { CropHealthMetrics, CropType, DiseaseScanResult } from "./types";

// Per-crop baselines, ported from Agricultural-AI's get_crop_health_metrics().
const CROP_BASELINES: Record<CropType, { ndvi: number; stress: number; moisture: number }> = {
  Wheat: { ndvi: 0.82, stress: 12, moisture: 28 },
  Rice: { ndvi: 0.78, stress: 15, moisture: 35 },
  Cotton: { ndvi: 0.75, stress: 18, moisture: 25 },
  Sugarcane: { ndvi: 0.8, stress: 14, moisture: 30 },
};

function gaussianNoise(sd: number) {
  // Box-Muller, mirrors numpy.random.normal used by the source implementation.
  const u1 = Math.random() || 1e-9;
  const u2 = Math.random();
  return sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

export function getCropHealthMetrics(fieldName: string, cropType: CropType): CropHealthMetrics {
  const base = CROP_BASELINES[cropType] ?? CROP_BASELINES.Wheat;

  const ndvi = Math.max(0, Math.min(1, base.ndvi + gaussianNoise(0.05)));
  const stress = Math.max(0, base.stress + gaussianNoise(3));
  const moisture = Math.max(0, base.moisture + gaussianNoise(5));

  const healthScore = Math.round(Math.min(100, Math.max(0, ndvi * 100 - stress)));
  const riskLevel: CropHealthMetrics["riskLevel"] = healthScore >= 80 ? "Low" : healthScore >= 60 ? "Medium" : "High";

  return {
    fieldName,
    cropType,
    ndvi: Math.round(ndvi * 100) / 100,
    stressIndex: Math.round(stress * 10) / 10,
    moisturePct: Math.round(moisture * 10) / 10,
    healthScore,
    riskLevel,
    timestamp: new Date().toISOString(),
  };
}

const DISEASES = [
  {
    name: "Wheat Leaf Rust",
    description: "Orange-brown pustules on leaves that reduce photosynthesis and yield. Control with fungicides and resistant varieties.",
  },
  {
    name: "Rice Blast",
    description: "Diamond-shaped lesions on leaves. Can kill plants at seedling stage. Manage with fungicides and resistant varieties.",
  },
  {
    name: "Cotton Leaf Curl Virus",
    description: "Upward curling of leaves with thickened veins. Spread by whiteflies. Use resistant varieties and control insect vectors.",
  },
  {
    name: "Sugarcane Red Rot",
    description: "Red discoloration inside stalks. Causes withering and death. Use disease-free seed cane and resistant varieties.",
  },
];

/**
 * Simulated field-image disease scan. Ported 1:1 from analyze_crop_image() —
 * swap for a real computer-vision model behind the same signature.
 */
export function scanFieldImage(): DiseaseScanResult {
  const detected = Math.random() > 0.5;
  if (!detected) {
    return { success: true, diseaseDetected: false, confidence: Math.round(85 + Math.random() * 13) };
  }
  const disease = DISEASES[Math.floor(Math.random() * DISEASES.length)];
  return {
    success: true,
    diseaseDetected: true,
    diseaseName: disease.name,
    description: disease.description,
    confidence: Math.round(75 + Math.random() * 20),
  };
}

export function simulateFieldHealth(): CropHealthMetrics[] {
  const fields: { name: string; crop: CropType }[] = [
    { name: "North Field", crop: "Wheat" },
    { name: "South Field", crop: "Rice" },
    { name: "East Field", crop: "Cotton" },
    { name: "West Field", crop: "Sugarcane" },
  ];
  return fields.map((f) => getCropHealthMetrics(f.name, f.crop));
}

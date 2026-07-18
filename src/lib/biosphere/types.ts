// Core domain types for BioSphere AI

export type ExperienceLevel = "beginner" | "experienced";

export interface UserProfile {
  name: string;
  email: string;
  farmName?: string;
  experience: ExperienceLevel | null;
  createdAt: string;
}

export interface SensorReading {
  timestamp: string; // ISO
  soilMoisturePct: number; // 0-100
  temperatureC: number;
  humidityPct: number; // 0-100
}

export interface SensorStatus {
  id: string;
  name: string;
  zone: string;
  online: boolean;
  batteryPct: number;
  lastSeen: string;
}

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: "sunny" | "cloudy" | "rain" | "storm" | "clear";
  rainProbabilityPct: number;
}

export interface WeatherSnapshot {
  temperatureC: number;
  humidityPct: number;
  windKph: number;
  condition: DailyForecast["condition"];
  heatStress: "low" | "moderate" | "high";
  applicationWindow: {
    open: boolean;
    reason: string;
  };
  forecast: DailyForecast[];
}

export type ReadinessVerdict = "Ready" | "Wait" | "High Risk";

export interface ReadinessResult {
  score: number; // 0-100
  verdict: ReadinessVerdict;
  reasons: string[];
  explanation: string;
}

export interface DiseaseRisk {
  level: "low" | "moderate" | "high";
  pathogen: string;
  score: number;
  note: string;
}

export interface BiologicalProduct {
  id: string;
  name: string;
  type: string;
  matchReason: string;
  applicationWindow: string;
}

export interface MarketPrice {
  crop: string;
  pricePerUnit: number;
  unit: string;
  trend: "up" | "down" | "flat";
  changePct: number;
}

export interface Retailer {
  id: string;
  name: string;
  category: "Seed" | "Biologicals" | "Buyer" | "Co-op";
  distanceKm: number;
  lat: number;
  lng: number;
  address: string;
  rating: number;
}

export interface MissionItem {
  id: string;
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

export interface OutcomeEntry {
  id: string;
  productName: string;
  dateApplied: string;
  cropCondition: "poor" | "fair" | "good" | "excellent";
  yieldImprovementPct: number | null;
  notes: string;
}

import type { ExperienceLevel, GovScheme } from "./types";

const SCHEMES: GovScheme[] = [
  {
    id: "scheme-soil-health",
    name: "Soil Health Card Scheme",
    agency: "Dept. of Agriculture & Farmers Welfare",
    benefit: "Free biennial soil testing with nutrient-specific fertilizer recommendations.",
    eligibility: "All registered land-holding farmers.",
    matchReason: "Improves the accuracy of fertilizer optimization for your fields.",
  },
  {
    id: "scheme-micro-irrigation",
    name: "Per Drop More Crop (Micro-Irrigation Subsidy)",
    agency: "Ministry of Agriculture",
    benefit: "30-55% subsidy on drip and sprinkler irrigation equipment.",
    eligibility: "Farmers with irrigation efficiency below 85%.",
    matchReason: "Your current water-use efficiency shows room for improvement.",
  },
  {
    id: "scheme-crop-insurance",
    name: "Crop Insurance Scheme",
    agency: "Ministry of Agriculture",
    benefit: "Low-premium insurance against yield loss from weather, pests and disease.",
    eligibility: "All farmers growing notified crops.",
    matchReason: "Recommended given current disease-risk and weather volatility on your farm.",
  },
  {
    id: "scheme-biological-inputs",
    name: "Biological Input Promotion Subsidy",
    agency: "State Agriculture Department",
    benefit: "Cost-sharing on certified biological fertilizers and biopesticides.",
    eligibility: "Farmers transitioning toward biological/organic inputs.",
    matchReason: "You're actively using biological products tracked in Outcome Tracking.",
  },
  {
    id: "scheme-farmer-training",
    name: "Farmer Field School Training Program",
    agency: "Extension Services Directorate",
    benefit: "Free hands-on training in integrated pest management and precision agriculture.",
    eligibility: "Open to all farmers, prioritized for new entrants.",
    matchReason: "Recommended for farmers newer to biological and precision practices.",
  },
];

export function recommendSchemes(experience: ExperienceLevel | null): GovScheme[] {
  if (experience === "beginner") return SCHEMES;
  // Experienced farmers likely already know the basics — surface the more advanced/financial schemes first.
  return [...SCHEMES].sort((a, b) => (a.id === "scheme-farmer-training" ? 1 : b.id === "scheme-farmer-training" ? -1 : 0));
}

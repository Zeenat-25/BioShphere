import type { LearningInsight, OutcomeEntry, ReadinessResult } from "./types";

const CONDITION_SCORE: Record<OutcomeEntry["cropCondition"], number> = { poor: 0, fair: 0.4, good: 0.75, excellent: 1 };

/**
 * Learns from the farmer's own outcome history: entries logged after a
 * "Ready" verdict that resulted in good/excellent crop condition reinforce
 * confidence in future "Ready" calls; poor outcomes pull it back down. This
 * is intentionally simple and transparent (a running average, not a black
 * box) so an advisor can explain why the score moved.
 */
export function deriveLearningInsight(outcomes: OutcomeEntry[]): LearningInsight {
  if (outcomes.length === 0) {
    return { summary: "No outcome history yet — recommendations are using baseline rules only.", confidenceAdjustment: 0, sampleSize: 0 };
  }

  const scored = outcomes.map((o) => CONDITION_SCORE[o.cropCondition]);
  const avg = scored.reduce((a, b) => a + b, 0) / scored.length;
  // Map average outcome quality (0..1) to a -1..1 confidence adjustment centered on "good" (0.75).
  const confidenceAdjustment = Math.round((avg - 0.75) * 4 * 100) / 100;

  const trend =
    confidenceAdjustment > 0.1
      ? "Your logged outcomes have been consistently strong — BioSphere is increasing confidence in similar recommendations."
      : confidenceAdjustment < -0.1
        ? "Recent outcomes have underperformed expectations — BioSphere is being more conservative with similar recommendations."
        : "Outcomes are tracking in line with expectations.";

  return {
    summary: `${trend} Based on ${outcomes.length} logged outcome${outcomes.length === 1 ? "" : "s"}.`,
    confidenceAdjustment,
    sampleSize: outcomes.length,
  };
}

/** Applies the learning adjustment to a readiness score, clamped to 0-100. */
export function applyLearningToReadiness(readiness: ReadinessResult, insight: LearningInsight): ReadinessResult {
  if (insight.sampleSize === 0) return readiness;
  const adjusted = Math.max(0, Math.min(100, Math.round(readiness.score + insight.confidenceAdjustment * 10)));
  const verdict = adjusted >= 70 ? "Ready" : adjusted >= 40 ? "Wait" : "High Risk";
  return { ...readiness, score: adjusted, verdict };
}

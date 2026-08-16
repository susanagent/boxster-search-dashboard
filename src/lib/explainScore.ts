import type { ScoreBreakdown } from "../data/types";

type ScoreCategoryKey = Exclude<keyof ScoreBreakdown, "total" | "updatedAt">;

const CATEGORIES: { key: ScoreCategoryKey; label: string; max: number }[] = [
  { key: "maintenanceAndMechanicalRisk", label: "maintenance & mechanical risk documentation", max: 25 },
  { key: "conditionAndInspectionEvidence", label: "condition & inspection evidence", max: 20 },
  { key: "priceValue", label: "price/value", max: 15 },
  { key: "specificationDesirability", label: "specification desirability", max: 15 },
  { key: "titleHistoryCredibility", label: "title/history credibility", max: 10 },
  { key: "mileageOwnership", label: "mileage & ownership", max: 5 },
  { key: "distanceLogistics", label: "distance/logistics", max: 5 },
  { key: "listingCompleteness", label: "listing completeness", max: 5 },
];

export function explainScore(score: ScoreBreakdown): string {
  const ratios = CATEGORIES.map((c) => ({ ...c, ratio: score[c.key] / c.max }));
  const strongest = [...ratios].sort((a, b) => b.ratio - a.ratio)[0];
  const weakest = [...ratios].sort((a, b) => a.ratio - b.ratio)[0];

  return `Currently strongest on ${strongest.label} (${score[strongest.key]}/${strongest.max}); the largest opportunity to improve the score is ${weakest.label} (${score[weakest.key]}/${weakest.max}), which is driven by evidence still marked unknown or claimed rather than confirmed.`;
}

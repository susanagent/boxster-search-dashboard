/**
 * Deterministic, documented scoring. Every sub-score is computed from
 * structured fields and evidence-fact status already present on the
 * candidate — nothing here invents a fact. Weights mirror the "Scoring"
 * section of the Boxster Search note (25/20/15/15/10/5/5/5, out of 100).
 *
 * Confidence is computed separately from score, per the note's instruction
 * that "a low-confidence numerical score must not outrank a well-documented
 * candidate automatically."
 */
import type {
  Candidate,
  ConfidenceLevel,
  EvidenceFact,
  EvidenceStatus,
  RiskFlag,
  ScoreBreakdown,
  Transmission,
} from "./types";

const EVIDENCE_WEIGHT: Record<EvidenceStatus, number> = {
  confirmed: 1,
  claimed: 0.4,
  inferred: 0.5,
  unknown: 0,
  contradicted: 0,
};

function averageWeight(facts: EvidenceFact[], ids: string[]): number {
  const relevant = facts.filter((f) => ids.includes(f.id));
  if (relevant.length === 0) return 0;
  const sum = relevant.reduce((acc, f) => acc + EVIDENCE_WEIGHT[f.status], 0);
  return sum / relevant.length;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const MECHANICAL_IDS = ["ims", "rms", "clutch", "cooling", "water-pump", "aos", "suspension", "records"];
const CONDITION_IDS = ["brakes-tires", "top", "ppi", "warning-lights", "corrosion", "modifications"];

const TARGET_MIN = 10000;
const TARGET_CEILING = 15500; // target max ($15,000) plus a small tolerance band

const TRANSMISSION_POINTS: Record<Transmission, number> = {
  manual: 9,
  automatic: 4,
  conflicting: 2,
  unknown: 0,
};

const SELLER_POINTS: Record<Candidate["sellerType"], number> = {
  private: 4,
  dealer: 3,
  unknown: 1,
};

export function computeScore(
  input: Pick<
    Candidate,
    | "facts"
    | "askPrice"
    | "mileage"
    | "transmission"
    | "specification"
    | "sellerType"
    | "distanceMiles"
    | "risks"
  >,
  now: string,
): ScoreBreakdown {
  const { facts, risks } = input;

  const maintenanceAndMechanicalRisk = round1(averageWeight(facts, MECHANICAL_IDS) * 25);
  const conditionAndInspectionEvidence = round1(averageWeight(facts, CONDITION_IDS) * 20);

  const priceValue = round1(
    clamp((TARGET_CEILING - input.askPrice) / (TARGET_CEILING - TARGET_MIN), 0, 1) * 15,
  );

  const generationPoints = 3; // 986/987 are both primary target generations
  const specNotesPoints = input.specification ? 3 : 0;
  const specificationDesirability = round1(
    TRANSMISSION_POINTS[input.transmission] + generationPoints + specNotesPoints,
  );

  const titleFact = facts.find((f) => f.id === "title");
  const titlePoints = (titleFact ? EVIDENCE_WEIGHT[titleFact.status] : 0) * 6;
  const blockingPenalty = risks.filter((r: RiskFlag) => r.severity === "blocking").length * 2;
  const titleHistoryCredibility = round1(
    clamp(titlePoints + SELLER_POINTS[input.sellerType] - blockingPenalty, 0, 10),
  );

  const ownershipFact = facts.find((f) => f.id === "ownership-history");
  const mileagePoints = clamp((100000 - input.mileage) / 100000, 0, 1) * 3;
  const ownershipPoints = ownershipFact && ownershipFact.status !== "unknown" ? 2 : 0;
  const mileageOwnership = round1(mileagePoints + ownershipPoints);

  const distanceLogistics = round1(distanceLogisticsPoints(input.distanceMiles));

  const requiredForCompleteness = [
    input.mileage > 0,
    input.askPrice > 0,
    input.transmission !== "unknown",
    Boolean(input.specification),
    input.sellerType !== "unknown",
  ];
  const listingCompleteness = round1(
    (requiredForCompleteness.filter(Boolean).length / requiredForCompleteness.length) * 5,
  );

  const total = round1(
    maintenanceAndMechanicalRisk +
      conditionAndInspectionEvidence +
      priceValue +
      specificationDesirability +
      titleHistoryCredibility +
      mileageOwnership +
      distanceLogistics +
      listingCompleteness,
  );

  return {
    maintenanceAndMechanicalRisk,
    conditionAndInspectionEvidence,
    priceValue,
    specificationDesirability,
    titleHistoryCredibility,
    mileageOwnership,
    distanceLogistics,
    listingCompleteness,
    total,
    updatedAt: now,
  };
}

function distanceLogisticsPoints(distanceMiles?: number): number {
  if (distanceMiles === undefined) return 0;
  if (distanceMiles <= 75) return 5;
  if (distanceMiles <= 150) return 4;
  if (distanceMiles <= 250) return 3;
  if (distanceMiles <= 400) return 2;
  return 1;
}

export function computeConfidence(facts: EvidenceFact[], risks: RiskFlag[]): ConfidenceLevel {
  if (risks.some((r) => r.severity === "blocking") || facts.some((f) => f.status === "contradicted")) {
    return "low";
  }
  const avg = facts.reduce((acc, f) => acc + EVIDENCE_WEIGHT[f.status], 0) / facts.length;
  if (avg >= 0.45) return "high";
  if (avg >= 0.18) return "medium";
  return "low";
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

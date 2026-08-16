/**
 * Standing search rules and their change log. The v1 baseline is transcribed
 * from the Boxster Search note's "Standing criteria" and "Scoring" sections.
 * No rule changes have been proposed yet, per the ledger's rejection/learning
 * log ("No permanent rejections yet.").
 */
import type { RulesChangeLogEntry } from "./types";

export const CURRENT_RULES_VERSION = "v1";

export const STANDING_RULES: string[] = [
  "Home base: Congers, NY 10920.",
  "Asking-price target: $10,000–$15,000.",
  "Search outward in bands: 75, 150, 250, then 400 miles.",
  "Manual transmission preferred; retain exceptional automatics as clearly labeled alternatives.",
  "Primary generations: 986 and early 987.",
  "Favor clean title, service documentation, credible ownership history, sensible mileage, desirable specification, and evidence that deferred maintenance is limited.",
  "Never contact a seller, place a deposit, arrange a paid inspection, or spend money without explicit approval.",
];

export const RULES_CHANGE_LOG: RulesChangeLogEntry[] = [
  {
    id: "RULES-V1",
    date: "2026-08-16",
    version: "v1",
    summary: "Baseline standing criteria and scoring rubric established.",
    rationale: "Initial search setup from the Boxster Search note.",
    proposedBy: "manual-review",
    status: "approved",
  },
];

export const KNOWN_TAGS = [
  "automatic",
  "distance",
  "title",
  "accident",
  "fees",
  "poor-records",
  "deferred-maintenance",
  "listing-conflict",
  "overpriced",
  "sold",
  "duplicate",
] as const;

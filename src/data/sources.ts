/**
 * Search sources. Only Craigslist has been used so far (all five seed
 * candidates cite craigslist.org URLs). Metrics not yet measurable from the
 * ledger (manual-match rate, duplicate rate, etc.) are left undefined rather
 * than invented — the Sources view renders those as "Not yet measured".
 */
import { CANDIDATES } from "./candidates";
import type { Source } from "./types";

export const SOURCES: Source[] = [
  {
    id: "craigslist",
    name: "Craigslist",
    type: "marketplace",
    url: "https://www.craigslist.org",
    metrics: {
      qualifiedCandidates: CANDIDATES.filter(
        (c) => c.listings.some((l) => l.sourceId === "craigslist") && c.status === "Qualified",
      ).length,
      duplicateRate: 0,
      lastSuccessfulCheck: "2026-08-16",
    },
  },
  {
    id: "cars.com",
    name: "Cars.com",
    type: "marketplace",
    url: "https://www.cars.com",
    metrics: {
      qualifiedCandidates: CANDIDATES.filter(
        (c) => c.listings.some((l) => l.sourceId === "cars.com") && c.status === "Qualified",
      ).length,
      duplicateRate: 0,
      lastSuccessfulCheck: "2026-08-16",
    },
  },
  {
    id: "manual-entry",
    name: "Manual entry",
    type: "manual",
    metrics: {
      qualifiedCandidates: CANDIDATES.filter(
        (c) => c.listings.some((l) => l.sourceId === "manual-entry") && c.status === "Qualified",
      ).length,
    },
  },
];

export function getSourceById(id: string): Source | undefined {
  return SOURCES.find((s) => s.id === id);
}

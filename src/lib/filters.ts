import type { Candidate, CandidateStatus, Transmission } from "../data/types";

export interface FilterState {
  statuses: Set<CandidateStatus>;
  transmissions: Set<Transmission>;
  maxDistance?: number;
  text: string;
}

export const ALL_STATUSES: CandidateStatus[] = [
  "New",
  "Profiling",
  "Qualified",
  "Watchlist",
  "Contact-ready",
  "PPI-ready",
  "Rejected",
  "Sold",
  "Removed",
  "Stale",
];

export const ALL_TRANSMISSIONS: Transmission[] = ["manual", "automatic", "conflicting", "unknown"];

export function emptyFilterState(): FilterState {
  return { statuses: new Set(), transmissions: new Set(), maxDistance: undefined, text: "" };
}

export function applyFilters(candidates: Candidate[], filters: FilterState): Candidate[] {
  const text = filters.text.trim().toLowerCase();
  return candidates.filter((c) => {
    if (filters.statuses.size > 0 && !filters.statuses.has(c.status)) return false;
    if (filters.transmissions.size > 0 && !filters.transmissions.has(c.transmission)) return false;
    if (filters.maxDistance !== undefined && (c.distanceMiles === undefined || c.distanceMiles > filters.maxDistance)) {
      return false;
    }
    if (text) {
      const haystack = `${c.id} ${c.title} ${c.location} ${c.specification ?? ""}`.toLowerCase();
      if (!haystack.includes(text)) return false;
    }
    return true;
  });
}

export interface SavedView {
  id: string;
  label: string;
  description: string;
  predicate: (c: Candidate) => boolean;
}

export const SAVED_VIEWS: SavedView[] = [
  {
    id: "manual-shortlist",
    label: "Manual shortlist",
    description: "Manual transmission, still under active consideration.",
    predicate: (c) => c.transmission === "manual" && !["Rejected", "Sold", "Removed"].includes(c.status),
  },
  {
    id: "needs-verification",
    label: "Needs verification",
    description: "Low confidence, a blocking risk, or a core fact (VIN / title / records) still unknown.",
    predicate: (c) =>
      c.confidence === "low" ||
      c.risks.some((r) => r.severity === "blocking") ||
      ["vin", "title", "records"].some((id) => c.facts.find((f) => f.id === id)?.status === "unknown"),
  },
  {
    id: "within-150",
    label: "Within 150 miles",
    description: "Within the second standing search band from Congers, NY 10920.",
    predicate: (c) => c.distanceMiles !== undefined && c.distanceMiles <= 150,
  },
  {
    id: "price-changed",
    label: "Price changed",
    description: "Ask price has changed since first capture.",
    predicate: (c) => c.priceHistory.length > 1,
  },
  {
    id: "ppi-ready",
    label: "PPI-ready",
    description: "Status is PPI-ready.",
    predicate: (c) => c.status === "PPI-ready",
  },
];

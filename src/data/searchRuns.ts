/**
 * Search-run log, transcribed from the Candidate Ledger's
 * "Search-run log" section (2026-08-16 initial capture). Fields the ledger
 * did not record (e.g. total listings scanned, duration) are left undefined
 * rather than invented.
 */
import type { SearchRun } from "./types";

export const SEARCH_RUNS: SearchRun[] = [
  {
    id: "RUN-2026-08-16-EXPANDED",
    startedAt: "2026-08-16T16:26:00-04:00",
    completedAt: "2026-08-16T16:47:00-04:00",
    radiusMiles: 500,
    filters: ["986 and early 987", "manual preferred", "$10,000–$15,000 target; evidence-backed outliers retained", "expanding bands 75/150/250/400 miles"],
    sourcesAttempted: ["craigslist", "cars.com", "autotrader", "cargurus", "carfax", "porsche-finder", "pca-classifieds", "rennlist", "bring-a-trailer", "cars-and-bids", "facebook-marketplace"],
    sourcesSucceeded: ["craigslist", "cars.com"],
    sourcesFailed: ["autotrader", "cargurus", "carfax"],
    listingsScanned: 17,
    newCount: 3,
    updatedCount: 5,
    duplicateCount: 0,
    staleCount: 0,
    rejectedCount: 9,
    rulesVersion: "v1",
    notes: "All five original candidates remained live. Three new manual candidates were promoted. No sellers were contacted.",
    events: [
      { timestamp: "2026-08-16T16:26:00-04:00", message: "Verified BX-001 through BX-005 as live Craigslist vehicle pages." },
      { timestamp: "2026-08-16T16:32:00-04:00", message: "Added BX-006, a below-band Philadelphia value outlier with replacement-engine claim." },
      { timestamp: "2026-08-16T16:40:00-04:00", message: "Added BX-007 from Cars.com; accident reported and dealer fees undisclosed." },
      { timestamp: "2026-08-16T16:43:00-04:00", message: "Added BX-008 from Cars.com; marketplace reports one owner, zero accidents, clean title." },
    ],
    changeSet: [
      { candidateId: "BX-001", change: "Listing verified active; ask and specification unchanged." },
      { candidateId: "BX-002", change: "Listing verified active; maintenance claims remain unsubstantiated by visible invoices." },
      { candidateId: "BX-003", change: "Listing verified active; transmission contradiction remains unresolved." },
      { candidateId: "BX-004", change: "Listing verified active; thin evidence and automatic transmission retained as watchlist." },
      { candidateId: "BX-005", change: "Listing verified active; top claim remains unsubstantiated by invoice." },
      { candidateId: "BX-006", change: "New candidate." },
      { candidateId: "BX-007", change: "New candidate." },
      { candidateId: "BX-008", change: "New candidate; best new candidate from this run." },
    ],
  },
  {
    id: "RUN-2026-08-16",
    startedAt: "2026-08-16",
    completedAt: "2026-08-16",
    radiusMiles: 75,
    filters: ["986/early 987", "manual preferred (automatics retained as alternatives)", "$10,000–$15,000"],
    sourcesAttempted: ["craigslist"],
    sourcesSucceeded: ["craigslist"],
    sourcesFailed: [],
    newCount: 5,
    updatedCount: 0,
    duplicateCount: 0,
    staleCount: 0,
    rejectedCount: 0,
    rulesVersion: "v1",
    notes:
      "Initial capture of five previously identified Craigslist candidates. BX-003 remains unresolved because of conflicting listing data on transmission type.",
    events: [
      { timestamp: "2026-08-16", message: "Captured BX-001 (Island Park, NY) — Qualified." },
      { timestamp: "2026-08-16", message: "Captured BX-002 (Waterford/Clifton Park, NY) — Qualified." },
      { timestamp: "2026-08-16", message: "Captured BX-003 (Feasterville-Trevose, PA) — Profiling; transmission conflict flagged as blocking." },
      { timestamp: "2026-08-16", message: "Captured BX-004 (Marshall, VA) — Watchlist; automatic alternative." },
      { timestamp: "2026-08-16", message: "Captured BX-005 (Wake Forest, NC) — Watchlist." },
    ],
    changeSet: [
      { candidateId: "BX-001", change: "New candidate captured." },
      { candidateId: "BX-002", change: "New candidate captured." },
      { candidateId: "BX-003", change: "New candidate captured; blocking transmission contradiction flagged." },
      { candidateId: "BX-004", change: "New candidate captured." },
      { candidateId: "BX-005", change: "New candidate captured." },
    ],
  },
];

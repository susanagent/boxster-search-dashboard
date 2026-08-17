/**
 * Durable typed data model for the Boxster Search Dashboard.
 *
 * Source of truth for candidate facts is the Candidate Ledger note. This file
 * defines the shapes used throughout the app; see src/data/candidates.ts for
 * the seeded records and docs/DATA_IMPORT.md for how future search runs
 * should update this data.
 */

/** Evidence quality for any single claimed fact about a candidate. */
export type EvidenceStatus =
  | "confirmed"
  | "claimed"
  | "inferred"
  | "unknown"
  | "contradicted";

export interface EvidenceFact {
  id: string;
  /** Human label, e.g. "IMS bearing", "Title status", "VIN". */
  label: string;
  status: EvidenceStatus;
  /** Free-text detail: the claim, the confirming document, or why it's unknown. */
  detail?: string;
  /** Source id (see Source) or a direct citation for where this fact came from. */
  sourceId?: string;
  /** ISO date the fact was captured/observed. */
  date?: string;
}

export type RiskSeverity = "blocking" | "high" | "medium" | "low";

export interface RiskFlag {
  id: string;
  title: string;
  severity: RiskSeverity;
  /** Summary of the evidence behind this risk. */
  evidence: string;
  /** What would resolve or downgrade this risk. */
  resolution?: string;
  linkedQuestionId?: string;
}

export type SellerQuestionStatus = "queued" | "asked" | "answered";

export interface SellerQuestion {
  id: string;
  question: string;
  status: SellerQuestionStatus;
  answer?: string;
  askedAt?: string;
  answeredAt?: string;
  /** Where this question originated, e.g. "Derived from ledger unknowns". */
  provenance?: string;
}

export interface PriceObservation {
  date: string;
  price: number;
  mileage?: number;
  status?: CandidateStatus;
  note?: string;
}

export interface ListingOccurrence {
  id: string;
  sourceId: string;
  url: string;
  firstSeen: string;
  lastCheckedAt: string;
  active: boolean;
  price: number;
  mileage: number;
}

/** Candidate-detail feedback vocabulary (Dashboard Spec, candidate detail §7). */
export type CandidateFeedbackType = "good-fit" | "poor-fit" | "false-positive" | "rejection-reason" | "workflow-lesson";

export interface FeedbackEntry {
  id: string;
  date: string;
  type: CandidateFeedbackType;
  note?: string;
}

/** Source/search-quality feedback vocabulary (Dashboard Spec, search runs & learning). */
export type SourceFeedbackType =
  | "useful"
  | "wrong-transmission"
  | "too-far"
  | "stale"
  | "poor-evidence"
  | "duplicate"
  | "wrong-price-band"
  | "promote-source"
  | "note";

export interface SourceFeedbackEntry {
  id: string;
  sourceId: string;
  candidateId?: string;
  date: string;
  type: SourceFeedbackType;
  note?: string;
}

/**
 * Canonical candidate lifecycle states, taken verbatim from the Candidate
 * Ledger's "Canonical candidate states" list. The Dashboard Specification
 * separately lists a UI-facing status vocabulary (New/Reviewing/Verify/...);
 * rather than fabricate a mapping between two status vocabularies, this app
 * uses the ledger's canonical states as the single source of truth
 * everywhere (data + UI), and represents "Verify" (blocking contradiction)
 * as a first-class RiskFlag with severity "blocking" instead of a status
 * value. See docs/DATA_IMPORT.md for the full rationale.
 */
export type CandidateStatus =
  | "New"
  | "Profiling"
  | "Qualified"
  | "Watchlist"
  | "Contact-ready"
  | "PPI-ready"
  | "Rejected"
  | "Sold"
  | "Removed"
  | "Stale";

export type Transmission = "manual" | "automatic" | "unknown" | "conflicting";

export type Generation = "986" | "987";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface ScoreBreakdown {
  /** out of 25 */
  maintenanceAndMechanicalRisk: number;
  /** out of 20 */
  conditionAndInspectionEvidence: number;
  /** out of 15 */
  priceValue: number;
  /** out of 15 */
  specificationDesirability: number;
  /** out of 10 */
  titleHistoryCredibility: number;
  /** out of 5 */
  mileageOwnership: number;
  /** out of 5 */
  distanceLogistics: number;
  /** out of 5 */
  listingCompleteness: number;
  /** sum of the above, out of 100 */
  total: number;
  updatedAt: string;
}

export interface Candidate {
  id: string;
  title: string;
  year: number;
  generation: Generation;
  location: string;
  /** Approximate town-center geocode; used to compute distance, never an exact address. */
  coordinates?: { lat: number; lng: number };
  /** Great-circle distance in miles from home base (10920), computed — see src/lib/geo.ts. */
  distanceMiles?: number;
  /** Estimated drive time in minutes, derived from distance with a documented assumption. */
  driveTimeMinutesEstimate?: number;
  askPrice: number;
  mileage: number;
  transmission: Transmission;
  specification?: string;
  /** Verified lead photo from the source listing; the UI falls back to an illustration if unavailable. */
  imageUrl?: string;
  sellerType: "private" | "dealer" | "unknown";
  status: CandidateStatus;
  confidence: ConfidenceLevel;
  score: ScoreBreakdown;
  vin?: string;
  facts: EvidenceFact[];
  risks: RiskFlag[];
  sellerQuestions: SellerQuestion[];
  listings: ListingOccurrence[];
  priceHistory: PriceObservation[];
  feedback: FeedbackEntry[];
  strength?: string;
  initialRecommendation?: string;
  lastVerifiedAt: string;
  createdAt: string;
}

export interface SourceMetrics {
  listingsScanned?: number;
  activeListingsVerified?: number;
  uniqueCandidates?: number;
  promotedCandidates?: number;
  qualifiedCandidates: number;
  falsePositiveRate?: number;
  blockedChecks?: number;
  zeroResultChecks?: number;
  manualMatchRate?: number;
  duplicateRate?: number;
  staleOrFalsePositiveRate?: number;
  listingCompleteness?: number;
  lastSuccessfulCheck?: string;
  medianUsefulPrice?: number;
  geographicYield?: string;
}

export interface Source {
  id: string;
  name: string;
  type: "marketplace" | "enthusiast-forum" | "dealer-network" | "auction" | "manual";
  url?: string;
  priority: "primary" | "secondary" | "comparables";
  accessNote?: string;
  metrics: SourceMetrics;
}

export interface SearchRunEvent {
  timestamp: string;
  message: string;
}

export interface ChangeSetEntry {
  candidateId: string;
  change: string;
}

export interface SearchRun {
  id: string;
  startedAt: string;
  completedAt?: string;
  radiusMiles: number;
  filters: string[];
  sourcesAttempted: string[];
  sourcesSucceeded: string[];
  sourcesFailed: string[];
  listingsScanned?: number;
  newCount: number;
  updatedCount: number;
  duplicateCount: number;
  staleCount: number;
  rejectedCount: number;
  durationMinutes?: number;
  rulesVersion: string;
  notes?: string;
  errors?: string[];
  events: SearchRunEvent[];
  changeSet: ChangeSetEntry[];
}

export interface RulesChangeLogEntry {
  id: string;
  date: string;
  version: string;
  summary: string;
  rationale: string;
  proposedBy: "feedback" | "seller-evidence" | "ppi-evidence" | "manual-review";
  status: "proposed" | "approved" | "rejected";
}

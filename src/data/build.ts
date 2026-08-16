import { FACT_CATALOG } from "./factCatalog";
import { distanceFromHome, estimateDriveTimeMinutes } from "../lib/geo";
import { computeConfidence, computeScore } from "./scoring";
import type {
  Candidate,
  CandidateStatus,
  EvidenceFact,
  EvidenceStatus,
  Generation,
  ListingOccurrence,
  PriceObservation,
  RiskFlag,
  SellerQuestion,
  Transmission,
} from "./types";

export interface FactOverride {
  status: EvidenceStatus;
  detail?: string;
  sourceId?: string;
  date?: string;
}

export interface CandidateSeed {
  id: string;
  title: string;
  year: number;
  generation: Generation;
  location: string;
  coordinates?: { lat: number; lng: number };
  askPrice: number;
  mileage: number;
  transmission: Transmission;
  specification?: string;
  imageUrl?: string;
  sellerType: Candidate["sellerType"];
  status: CandidateStatus;
  vin?: string;
  factOverrides?: Record<string, FactOverride>;
  extraFacts?: EvidenceFact[];
  risks: RiskFlag[];
  sellerQuestions: SellerQuestion[];
  strength?: string;
  initialRecommendation?: string;
  sourceId: string;
  url: string;
  firstSeen: string;
  lastVerifiedAt: string;
  createdAt: string;
}

export function buildCandidate(seed: CandidateSeed): Candidate {
  const facts: EvidenceFact[] = FACT_CATALOG.map((entry) => {
    const override = seed.factOverrides?.[entry.id];
    return {
      id: entry.id,
      label: entry.label,
      status: override?.status ?? "unknown",
      detail: override?.detail,
      sourceId: override?.sourceId,
      date: override?.date,
    };
  });
  if (seed.extraFacts) {
    facts.push(...seed.extraFacts);
  }

  const distanceMiles = seed.coordinates ? distanceFromHome(seed.coordinates) : undefined;
  const driveTimeMinutesEstimate = distanceMiles !== undefined ? estimateDriveTimeMinutes(distanceMiles) : undefined;

  const score = computeScore(
    {
      facts,
      askPrice: seed.askPrice,
      mileage: seed.mileage,
      transmission: seed.transmission,
      specification: seed.specification,
      sellerType: seed.sellerType,
      distanceMiles,
      risks: seed.risks,
    },
    seed.lastVerifiedAt,
  );
  const confidence = computeConfidence(facts, seed.risks);

  const listing: ListingOccurrence = {
    id: `${seed.id}-L1`,
    sourceId: seed.sourceId,
    url: seed.url,
    firstSeen: seed.firstSeen,
    lastCheckedAt: seed.lastVerifiedAt,
    active: true,
    price: seed.askPrice,
    mileage: seed.mileage,
  };

  const priceHistory: PriceObservation[] = [
    {
      date: seed.firstSeen,
      price: seed.askPrice,
      mileage: seed.mileage,
      status: seed.status,
      note: "Initial capture",
    },
  ];

  return {
    id: seed.id,
    title: seed.title,
    year: seed.year,
    generation: seed.generation,
    location: seed.location,
    coordinates: seed.coordinates,
    distanceMiles,
    driveTimeMinutesEstimate,
    askPrice: seed.askPrice,
    mileage: seed.mileage,
    transmission: seed.transmission,
    specification: seed.specification,
    imageUrl: seed.imageUrl,
    sellerType: seed.sellerType,
    status: seed.status,
    confidence,
    score,
    vin: seed.vin,
    facts,
    risks: seed.risks,
    sellerQuestions: seed.sellerQuestions,
    listings: [listing],
    priceHistory,
    feedback: [],
    strength: seed.strength,
    initialRecommendation: seed.initialRecommendation,
    lastVerifiedAt: seed.lastVerifiedAt,
    createdAt: seed.createdAt,
  };
}

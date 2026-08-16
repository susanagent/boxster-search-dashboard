/**
 * Canonical evidence checklist, drawn from the Boxster Search note's "Core
 * risk review" and the Dashboard Specification's mechanical/service evidence
 * list. Every candidate is seeded with one EvidenceFact per catalog entry
 * (defaulting to "unknown") so evidence gaps are always visible rather than
 * silently omitted.
 */

export type FactCategory = "title-and-history" | "mechanical" | "condition" | "logistics";

export interface FactCatalogEntry {
  id: string;
  label: string;
  category: FactCategory;
}

export const FACT_CATALOG: FactCatalogEntry[] = [
  { id: "vin", label: "VIN", category: "title-and-history" },
  { id: "title", label: "Title status", category: "title-and-history" },
  { id: "ownership-history", label: "Ownership history", category: "title-and-history" },
  { id: "accident-paint", label: "Accident / paintwork history", category: "title-and-history" },
  { id: "ims", label: "IMS bearing", category: "mechanical" },
  { id: "rms", label: "Rear main seal", category: "mechanical" },
  { id: "clutch", label: "Clutch", category: "mechanical" },
  { id: "cooling", label: "Cooling system / expansion tank / radiators", category: "mechanical" },
  { id: "water-pump", label: "Water pump", category: "mechanical" },
  { id: "aos", label: "Air-oil separator", category: "mechanical" },
  { id: "suspension", label: "Suspension", category: "mechanical" },
  { id: "records", label: "Service records / invoices", category: "mechanical" },
  { id: "brakes-tires", label: "Brakes, tires, and tire dates", category: "condition" },
  { id: "top", label: "Convertible top, rear window, drains", category: "condition" },
  { id: "ppi", label: "Pre-purchase inspection", category: "condition" },
  { id: "warning-lights", label: "Warning lights / stored diagnostic faults", category: "condition" },
  { id: "corrosion", label: "Corrosion", category: "condition" },
  { id: "modifications", label: "Modifications", category: "condition" },
  { id: "keys", label: "Keys", category: "logistics" },
  { id: "storage-history", label: "Storage history", category: "logistics" },
  { id: "out-the-door-price", label: "Complete out-the-door price / fees", category: "logistics" },
];

export function blankFacts(): { id: string; label: string; status: "unknown" }[] {
  return FACT_CATALOG.map((entry) => ({
    id: entry.id,
    label: entry.label,
    status: "unknown" as const,
  }));
}

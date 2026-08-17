import { describe, expect, it } from "vitest";
import { CANDIDATES } from "./candidates";
import { FACT_CATALOG } from "./factCatalog";

describe("seed candidates", () => {
  it("has the nine canonical candidates with unique ids", () => {
    expect(CANDIDATES.map((c) => c.id)).toEqual([
      "BX-001",
      "BX-002",
      "BX-003",
      "BX-004",
      "BX-005",
      "BX-006",
      "BX-007",
      "BX-008",
      "BX-009",
    ]);
    expect(new Set(CANDIDATES.map((c) => c.id)).size).toBe(CANDIDATES.length);
  });

  it("carries every catalog fact per candidate", () => {
    for (const candidate of CANDIDATES) {
      const ids = candidate.facts.map((f) => f.id);
      for (const entry of FACT_CATALOG) {
        expect(ids).toContain(entry.id);
      }
    }
  });

  it("keeps score totals within 0-100 and matching the sum of components", () => {
    for (const candidate of CANDIDATES) {
      const s = candidate.score;
      const sum =
        s.maintenanceAndMechanicalRisk +
        s.conditionAndInspectionEvidence +
        s.priceValue +
        s.specificationDesirability +
        s.titleHistoryCredibility +
        s.mileageOwnership +
        s.distanceLogistics +
        s.listingCompleteness;
      expect(s.total).toBeCloseTo(sum, 5);
      expect(s.total).toBeGreaterThanOrEqual(0);
      expect(s.total).toBeLessThanOrEqual(100);
    }
  });

  it("forces low confidence for BX-003 because of its blocking transmission contradiction", () => {
    const bx003 = CANDIDATES.find((c) => c.id === "BX-003");
    expect(bx003?.confidence).toBe("low");
    expect(bx003?.risks.some((r) => r.severity === "blocking")).toBe(true);
  });

  it("computes a positive distance and drive time for every candidate", () => {
    for (const candidate of CANDIDATES) {
      expect(candidate.distanceMiles).toBeGreaterThan(0);
      expect(candidate.driveTimeMinutesEstimate).toBeGreaterThan(0);
    }
  });

  it("never marks a fact confirmed without a source (nothing is fabricated in seed data)", () => {
    for (const candidate of CANDIDATES) {
      for (const fact of candidate.facts) {
        if (fact.status === "confirmed") {
          expect(fact.sourceId).toBeTruthy();
        }
      }
    }
  });
});

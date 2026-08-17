import { describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { sortCandidates } from "./candidateSort";

describe("candidate sorting", () => {
  it("puts the newest imported candidate first", () => {
    expect(sortCandidates(CANDIDATES, "recent")[0]?.id).toBe("BX-009");
  });

  it("sorts distance nearest first and leaves unknown distances last", () => {
    const sorted = sortCandidates(CANDIDATES, "distance");
    const distances = sorted.map((candidate) => candidate.distanceMiles ?? Infinity);
    expect(distances).toEqual([...distances].sort((a, b) => a - b));
  });

  it("sorts ranking by highest score first", () => {
    const sorted = sortCandidates(CANDIDATES, "ranking");
    const scores = sorted.map((candidate) => candidate.score.total);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});

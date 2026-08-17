import type { Candidate } from "../data/types";

export type CandidateSort = "ranking" | "distance" | "recent";

export function sortCandidates(candidates: Candidate[], sort: CandidateSort): Candidate[] {
  return [...candidates].sort((a, b) => {
    if (sort === "distance") {
      return (a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity);
    }
    if (sort === "recent") {
      return b.createdAt.localeCompare(a.createdAt) || b.lastVerifiedAt.localeCompare(a.lastVerifiedAt);
    }
    return b.score.total - a.score.total;
  });
}

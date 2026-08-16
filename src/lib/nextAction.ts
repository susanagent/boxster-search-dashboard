import type { Candidate } from "../data/types";

/** Deterministic "what should happen next" derived from status + open risks. */
export function nextAction(candidate: Candidate): string {
  const blocking = candidate.risks.find((r) => r.severity === "blocking");
  if (blocking) return `Resolve: ${blocking.title}`;

  switch (candidate.status) {
    case "New":
      return "Begin profiling";
    case "Profiling":
      return "Gather VIN, records, and mechanical evidence";
    case "Qualified":
      return "Request records and consider PPI scheduling";
    case "Watchlist":
      return "Monitor; verify before advancing";
    case "Contact-ready":
      return "Contact seller (pending explicit approval)";
    case "PPI-ready":
      return "Schedule pre-purchase inspection";
    case "Rejected":
      return "No action — rejected";
    case "Sold":
      return "No action — sold";
    case "Removed":
      return "No action — listing removed";
    case "Stale":
      return "Recheck availability";
    default:
      return "Review";
  }
}

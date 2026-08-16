import type { Candidate } from "../data/types";
import { daysSince } from "./format";

export type DecisionQueueAction =
  | "verify-conflict"
  | "contact-seller"
  | "request-records"
  | "arrange-ppi"
  | "recheck-availability";

export interface DecisionQueueItem {
  action: DecisionQueueAction;
  label: string;
  candidate: Candidate;
  detail: string;
}

const STALE_THRESHOLD_DAYS = 21;

export function buildDecisionQueue(candidates: Candidate[]): DecisionQueueItem[] {
  const items: DecisionQueueItem[] = [];

  for (const c of candidates) {
    if (["Rejected", "Sold", "Removed"].includes(c.status)) continue;

    const blocking = c.risks.find((r) => r.severity === "blocking");
    if (blocking) {
      items.push({ action: "verify-conflict", label: "Verify conflict", candidate: c, detail: blocking.title });
    }

    if (c.status === "Contact-ready") {
      items.push({
        action: "contact-seller",
        label: "Contact seller",
        candidate: c,
        detail: "Ready to contact — requires explicit approval before reaching out.",
      });
    }

    if (c.status === "PPI-ready") {
      items.push({
        action: "arrange-ppi",
        label: "Arrange PPI",
        candidate: c,
        detail: "Meets criteria for a pre-purchase inspection.",
      });
    }

    const missingCore = ["vin", "records", "title"].filter(
      (id) => c.facts.find((f) => f.id === id)?.status === "unknown",
    );
    if (!blocking && missingCore.length > 0 && (c.status === "Qualified" || c.status === "Profiling")) {
      items.push({
        action: "request-records",
        label: "Request VIN / records",
        candidate: c,
        detail: `Missing: ${missingCore.join(", ")}`,
      });
    }

    if (c.status === "Stale" || daysSince(c.lastVerifiedAt) >= STALE_THRESHOLD_DAYS) {
      items.push({
        action: "recheck-availability",
        label: "Recheck availability",
        candidate: c,
        detail: `Last verified ${daysSince(c.lastVerifiedAt)} days ago.`,
      });
    }
  }

  return items;
}

import type { ReactNode } from "react";
import type { Candidate } from "../data/types";
import { StatusPill } from "../components/StatusPill";
import { ConfidenceLabel } from "../components/ConfidenceLabel";
import { EvidenceMeter } from "../components/EvidenceMeter";
import { formatCurrency, formatDriveTime, formatMileage } from "./format";
import { nextAction } from "./nextAction";

/** Documented assumption for a rough near-term cost estimate; not a fact. */
const ASSUMED_PPI_COST = 200;

export interface CompareRow {
  group: string;
  label: string;
  diffKey: (c: Candidate) => string;
  render: (c: Candidate) => ReactNode;
}

function fact(c: Candidate, id: string) {
  return c.facts.find((f) => f.id === id);
}

function factText(c: Candidate, id: string): string {
  const f = fact(c, id);
  if (!f) return "Unknown";
  if (f.status === "unknown") return "Unknown";
  return `${f.status[0].toUpperCase()}${f.status.slice(1)}${f.detail ? `: ${f.detail}` : ""}`;
}

export const COMPARE_ROWS: CompareRow[] = [
  // Purchase facts
  { group: "Purchase facts", label: "Price", diffKey: (c) => String(c.askPrice), render: (c) => formatCurrency(c.askPrice) },
  { group: "Purchase facts", label: "Mileage", diffKey: (c) => String(c.mileage), render: (c) => formatMileage(c.mileage) },
  { group: "Purchase facts", label: "Transmission", diffKey: (c) => c.transmission, render: (c) => c.transmission },
  { group: "Purchase facts", label: "Year / generation", diffKey: (c) => `${c.year}-${c.generation}`, render: (c) => `${c.year} (${c.generation})` },
  { group: "Purchase facts", label: "Seller type", diffKey: (c) => c.sellerType, render: (c) => c.sellerType },
  { group: "Purchase facts", label: "Status", diffKey: (c) => c.status, render: (c) => <StatusPill status={c.status} /> },

  // Fit
  {
    group: "Fit",
    label: "Manual preference",
    diffKey: (c) => c.transmission,
    render: (c) => (c.transmission === "manual" ? "Matches" : c.transmission === "automatic" ? "Alternative only" : "Unresolved"),
  },
  {
    group: "Fit",
    label: "Budget fit",
    diffKey: (c) => String(c.askPrice <= 15000),
    render: (c) => (c.askPrice <= 15000 ? "Within $10k–$15k band" : "Above ceiling"),
  },

  // Service
  { group: "Service", label: "IMS bearing", diffKey: (c) => factText(c, "ims"), render: (c) => factText(c, "ims") },
  { group: "Service", label: "Clutch / RMS", diffKey: (c) => factText(c, "clutch") + factText(c, "rms"), render: (c) => `${factText(c, "clutch")} / ${factText(c, "rms")}` },
  { group: "Service", label: "Cooling / water pump", diffKey: (c) => factText(c, "cooling") + factText(c, "water-pump"), render: (c) => `${factText(c, "cooling")} / ${factText(c, "water-pump")}` },
  { group: "Service", label: "Service records", diffKey: (c) => factText(c, "records"), render: (c) => factText(c, "records") },
  { group: "Service", label: "Top condition", diffKey: (c) => factText(c, "top"), render: (c) => factText(c, "top") },

  // Risks
  {
    group: "Risks",
    label: "Blocking / high risks",
    diffKey: (c) => String(c.risks.filter((r) => r.severity === "blocking" || r.severity === "high").length),
    render: (c) => {
      const count = c.risks.filter((r) => r.severity === "blocking" || r.severity === "high").length;
      return count === 0 ? "None" : `${count}: ${c.risks.filter((r) => r.severity === "blocking" || r.severity === "high").map((r) => r.title).join("; ")}`;
    },
  },

  // Evidence confidence
  { group: "Evidence confidence", label: "Confidence", diffKey: (c) => c.confidence, render: (c) => <ConfidenceLabel level={c.confidence} /> },
  {
    group: "Evidence confidence",
    label: "Evidence completeness",
    diffKey: (c) => String(c.facts.filter((f) => f.status !== "unknown").length),
    render: (c) => <EvidenceMeter facts={c.facts} />,
  },

  // Logistics
  {
    group: "Logistics",
    label: "Distance",
    diffKey: (c) => String(c.distanceMiles ?? "unknown"),
    render: (c) => (c.distanceMiles !== undefined ? `${c.distanceMiles} mi` : "Unknown"),
  },
  {
    group: "Logistics",
    label: "Round-trip drive (est.)",
    diffKey: (c) => String(c.driveTimeMinutesEstimate ?? "unknown"),
    render: (c) => (c.driveTimeMinutesEstimate !== undefined ? formatDriveTime(c.driveTimeMinutesEstimate * 2) : "Unknown"),
  },

  // Seller responsiveness
  {
    group: "Seller responsiveness",
    label: "Seller questions",
    diffKey: (c) => `${c.sellerQuestions.filter((q) => q.status === "answered").length}/${c.sellerQuestions.length}`,
    render: (c) => `${c.sellerQuestions.filter((q) => q.status === "answered").length} answered / ${c.sellerQuestions.length} queued`,
  },

  // Near-term cost estimate
  {
    group: "Near-term cost estimate",
    label: `Ask + assumed PPI (${formatCurrency(ASSUMED_PPI_COST)})`,
    diffKey: (c) => String(c.askPrice + ASSUMED_PPI_COST),
    render: (c) => formatCurrency(c.askPrice + ASSUMED_PPI_COST),
  },
  {
    group: "Near-term cost estimate",
    label: "Deferred maintenance",
    diffKey: (c) => factText(c, "records"),
    render: (c) => (fact(c, "records")?.status === "unknown" ? "Unknown — not zero, not favorable" : "See service records"),
  },

  // Next action
  { group: "Next action", label: "Next action", diffKey: (c) => nextAction(c), render: (c) => nextAction(c) },
];

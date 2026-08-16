import type { ComponentType } from "react";
import type { CandidateStatus, ConfidenceLevel, EvidenceStatus, RiskSeverity } from "../data/types";
import {
  AlertOctagonIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  HelpCircleIcon,
  InfoIcon,
  XCircleIcon,
} from "../components/icons";

export interface Tone {
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;
  tint: string;
}

export const STATUS_META: Record<CandidateStatus, Tone> = {
  New: { label: "New", icon: InfoIcon, color: "var(--color-info)", tint: "var(--color-info-tint)" },
  Profiling: { label: "Profiling", icon: InfoIcon, color: "var(--color-info)", tint: "var(--color-info-tint)" },
  Qualified: { label: "Qualified", icon: CheckCircleIcon, color: "var(--color-positive)", tint: "var(--color-positive-tint)" },
  Watchlist: { label: "Watchlist", icon: AlertTriangleIcon, color: "var(--color-warning)", tint: "var(--color-warning-tint)" },
  "Contact-ready": { label: "Contact-ready", icon: AlertTriangleIcon, color: "var(--color-action)", tint: "var(--color-action-tint)" },
  "PPI-ready": { label: "PPI-ready", icon: CheckCircleIcon, color: "var(--color-positive)", tint: "var(--color-positive-tint)" },
  Rejected: { label: "Rejected", icon: XCircleIcon, color: "var(--color-neutral)", tint: "var(--color-neutral-tint)" },
  Sold: { label: "Sold", icon: XCircleIcon, color: "var(--color-neutral)", tint: "var(--color-neutral-tint)" },
  Removed: { label: "Removed", icon: XCircleIcon, color: "var(--color-neutral)", tint: "var(--color-neutral-tint)" },
  Stale: { label: "Stale", icon: ClockIcon, color: "var(--color-warning)", tint: "var(--color-warning-tint)" },
};

export const CONFIDENCE_META: Record<ConfidenceLevel, Tone> = {
  high: { label: "High confidence", icon: CheckCircleIcon, color: "var(--color-positive)", tint: "var(--color-positive-tint)" },
  medium: { label: "Medium confidence", icon: AlertTriangleIcon, color: "var(--color-warning)", tint: "var(--color-warning-tint)" },
  low: { label: "Low confidence", icon: HelpCircleIcon, color: "var(--color-neutral)", tint: "var(--color-neutral-tint)" },
};

export const EVIDENCE_META: Record<EvidenceStatus, Tone> = {
  confirmed: { label: "Confirmed", icon: CheckCircleIcon, color: "var(--color-positive)", tint: "var(--color-positive-tint)" },
  claimed: { label: "Claimed", icon: AlertTriangleIcon, color: "var(--color-warning)", tint: "var(--color-warning-tint)" },
  inferred: { label: "Inferred", icon: InfoIcon, color: "var(--color-info)", tint: "var(--color-info-tint)" },
  unknown: { label: "Unknown", icon: HelpCircleIcon, color: "var(--color-neutral)", tint: "var(--color-neutral-tint)" },
  contradicted: { label: "Contradicted", icon: AlertOctagonIcon, color: "var(--color-action)", tint: "var(--color-action-tint)" },
};

export const RISK_META: Record<RiskSeverity, Tone> = {
  blocking: { label: "Blocking", icon: AlertOctagonIcon, color: "var(--color-action)", tint: "var(--color-action-tint)" },
  high: { label: "High risk", icon: AlertTriangleIcon, color: "var(--color-action)", tint: "var(--color-action-tint)" },
  medium: { label: "Medium risk", icon: AlertTriangleIcon, color: "var(--color-warning)", tint: "var(--color-warning-tint)" },
  low: { label: "Low risk", icon: InfoIcon, color: "var(--color-info)", tint: "var(--color-info-tint)" },
};

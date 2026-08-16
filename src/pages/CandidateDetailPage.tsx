import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { Panel } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { ConfidenceLabel } from "../components/ConfidenceLabel";
import { ScoreBadge } from "../components/ScoreBadge";
import { EvidenceMeter } from "../components/EvidenceMeter";
import { EvidenceFactRow } from "../components/EvidenceFactRow";
import { RiskFlagBadge } from "../components/RiskFlagBadge";
import { PriceHistorySparkline } from "../components/PriceHistorySparkline";
import { FeedbackPrompt } from "../components/FeedbackPrompt";
import { EmptyState } from "../components/EmptyState";
import { CandidateThumbnail } from "../components/CandidateThumbnail";
import { formatCurrency, formatDate, formatDriveTime, formatMileage, daysSince } from "../lib/format";
import { nextAction } from "../lib/nextAction";
import { explainScore } from "../lib/explainScore";
import type { FactCategory } from "../data/factCatalog";
import { FACT_CATALOG } from "../data/factCatalog";
import styles from "./CandidateDetailPage.module.css";

const CATEGORY_LABELS: Record<FactCategory, string> = {
  "title-and-history": "Title & history",
  mechanical: "Mechanical & service",
  condition: "Condition",
  logistics: "Logistics",
};

const CATEGORY_ORDER: FactCategory[] = ["mechanical", "condition", "title-and-history", "logistics"];

const CANDIDATE_FEEDBACK_OPTIONS: { value: "good-fit" | "poor-fit" | "false-positive" | "rejection-reason" | "workflow-lesson"; label: string }[] = [
  { value: "good-fit", label: "Good fit" },
  { value: "poor-fit", label: "Poor fit" },
  { value: "false-positive", label: "False positive" },
  { value: "rejection-reason", label: "Rejection reason" },
  { value: "workflow-lesson", label: "Workflow lesson" },
];

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { candidates, isInCompare, toggleCompare, canAddToCompare, addCandidateFeedback, setSellerQuestionStatus } = useAppData();
  const candidate = candidates.find((c) => c.id === id);
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});

  if (!candidate) {
    return (
      <EmptyState
        title="Candidate not found"
        description="It may have been removed, or the link is out of date."
        action={<Link to="/candidates">Back to candidates</Link>}
      />
    );
  }

  const blockingRisks = candidate.risks.filter((r) => r.severity === "blocking" || r.severity === "high");
  const roundTripMinutes = candidate.driveTimeMinutesEstimate ? candidate.driveTimeMinutesEstimate * 2 : undefined;

  return (
    <div>
      <div className={styles.header}>
        <CandidateThumbnail candidate={candidate} size="hero" />
        <div>
          <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>{candidate.id}</p>
          <h1>{candidate.title}</h1>
          {candidate.specification && <p style={{ margin: "4px 0 0" }}>{candidate.specification}</p>}
          <div className={styles.headerMeta}>
            <span>{formatCurrency(candidate.askPrice)}</span>
            <span>{formatMileage(candidate.mileage)}</span>
            <span style={{ textTransform: "capitalize" }}>{candidate.transmission}</span>
            <span>{candidate.location}</span>
            {candidate.distanceMiles !== undefined && (
              <span>
                {candidate.distanceMiles} mi{candidate.driveTimeMinutesEstimate !== undefined ? ` (~${formatDriveTime(candidate.driveTimeMinutesEstimate)})` : ""}
              </span>
            )}
          </div>
          <div className={styles.headerBadges}>
            <StatusPill status={candidate.status} />
            <ConfidenceLabel level={candidate.confidence} />
            <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-small)" }}>
              Verified {formatDate(candidate.lastVerifiedAt)} ({daysSince(candidate.lastVerifiedAt)}d ago)
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          {candidate.listings.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className={styles.smallButton}
              style={{ minHeight: 40, display: "inline-flex", alignItems: "center" }}
            >
              View listing ({l.sourceId})
            </a>
          ))}
          <button
            type="button"
            onClick={() => toggleCompare(candidate.id)}
            disabled={!isInCompare(candidate.id) && !canAddToCompare}
            style={{
              minHeight: 40,
              padding: "var(--space-2) var(--space-4)",
              borderRadius: "var(--radius-control)",
              border: "1px solid var(--color-action)",
              background: isInCompare(candidate.id) ? "var(--color-action)" : "var(--color-surface)",
              color: isInCompare(candidate.id) ? "var(--color-surface)" : "var(--color-action)",
              fontWeight: 600,
            }}
          >
            {isInCompare(candidate.id) ? "Remove from compare" : "Add to compare"}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <Panel title="1. Decision summary">
            <ScoreBadge score={candidate.score} />
            <p style={{ marginTop: "var(--space-3)" }}>{explainScore(candidate.score)}</p>
            <p>
              <strong>Next action:</strong> {nextAction(candidate)}
            </p>
            {candidate.initialRecommendation && (
              <p style={{ color: "var(--color-text-secondary)" }}>{candidate.initialRecommendation}</p>
            )}
          </Panel>

          <Panel title="2. Fit">
            <ul style={{ margin: 0, paddingLeft: "var(--space-4)", display: "grid", gap: "var(--space-1)" }}>
              <li>
                Transmission: {candidate.transmission}
                {candidate.transmission === "manual"
                  ? " — matches the standing manual preference."
                  : candidate.transmission === "automatic"
                    ? " — retained only as a clearly labeled automatic alternative."
                    : " — unresolved; treat as a blocker until confirmed."}
              </li>
              <li>
                Budget: {formatCurrency(candidate.askPrice)} against the $10,000–$15,000 target band
                {candidate.askPrice > 15000 ? " (above ceiling)." : "."}
              </li>
              <li>
                Distance: {candidate.distanceMiles !== undefined ? `${candidate.distanceMiles} mi from Congers, NY 10920` : "not yet computed"}.
              </li>
              <li>Generation: {candidate.generation} ({candidate.year}) — a primary target generation.</li>
              <li>Strength: {candidate.strength ?? "Not yet assessed."}</li>
            </ul>
          </Panel>

          <Panel title="3. Mechanical / service evidence">
            {CATEGORY_ORDER.filter((cat) => cat !== "logistics" && cat !== "title-and-history").map((cat) => (
              <div key={cat} className={styles.factCategory}>
                <h3>{CATEGORY_LABELS[cat]}</h3>
                {candidate.facts
                  .filter((f) => FACT_CATALOG.find((entry) => entry.id === f.id)?.category === cat)
                  .map((f) => (
                    <EvidenceFactRow key={f.id} fact={f} />
                  ))}
              </div>
            ))}
            <div className={styles.factCategory}>
              <h3>{CATEGORY_LABELS["title-and-history"]}</h3>
              {candidate.facts
                .filter((f) => FACT_CATALOG.find((entry) => entry.id === f.id)?.category === "title-and-history")
                .map((f) => (
                  <EvidenceFactRow key={f.id} fact={f} />
                ))}
              {candidate.facts.find((f) => f.id === "transmission-conflict") && (
                <EvidenceFactRow fact={candidate.facts.find((f) => f.id === "transmission-conflict")!} />
              )}
            </div>
            <div className={styles.factCategory}>
              <h3>{CATEGORY_LABELS.logistics}</h3>
              {candidate.facts
                .filter((f) => FACT_CATALOG.find((entry) => entry.id === f.id)?.category === "logistics")
                .map((f) => (
                  <EvidenceFactRow key={f.id} fact={f} />
                ))}
            </div>
            <div style={{ marginTop: "var(--space-3)" }}>
              <EvidenceMeter facts={candidate.facts} />
            </div>
          </Panel>

          <Panel title="4. Risks and contradictions">
            {candidate.risks.length === 0 ? (
              <p>None flagged yet.</p>
            ) : (
              candidate.risks.map((r) => (
                <div key={r.id} className={styles.riskCard}>
                  <div className={styles.riskHeader}>
                    <RiskFlagBadge risk={r} />
                    <strong>{r.title}</strong>
                  </div>
                  <p style={{ margin: "0 0 4px" }}>{r.evidence}</p>
                  {r.resolution && (
                    <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                      <strong>Resolution:</strong> {r.resolution}
                    </p>
                  )}
                  {r.linkedQuestionId && (
                    <p style={{ margin: "4px 0 0", color: "var(--color-text-secondary)", fontSize: "var(--font-size-small)" }}>
                      Linked to seller question {r.linkedQuestionId}
                    </p>
                  )}
                </div>
              ))
            )}
          </Panel>

          <Panel title="5. Listing history">
            <PriceHistorySparkline observations={candidate.priceHistory} />
            <h3 style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", textTransform: "uppercase", margin: "var(--space-4) 0 var(--space-2)" }}>
              Sightings
            </h3>
            <ul style={{ margin: 0, paddingLeft: "var(--space-4)", display: "grid", gap: "var(--space-1)" }}>
              {candidate.listings.map((l) => (
                <li key={l.id}>
                  <a href={l.url} target="_blank" rel="noreferrer">
                    {l.sourceId}
                  </a>{" "}
                  — first seen {formatDate(l.firstSeen)}, last checked {formatDate(l.lastCheckedAt)},{" "}
                  {l.active ? "active" : "inactive"}.
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="6. Seller communication">
            <p style={{ color: "var(--color-text-secondary)" }}>
              Sellers are never contacted automatically. Questions below are prepared and queued pending explicit approval.
            </p>
            {candidate.sellerQuestions.length === 0 ? (
              <p>No questions queued yet.</p>
            ) : (
              candidate.sellerQuestions.map((q) => (
                <div key={q.id} className={styles.questionRow}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{q.question}</p>
                    <p style={{ margin: "2px 0 0", fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}>
                      Status: {q.status}
                      {q.provenance ? ` · ${q.provenance}` : ""}
                    </p>
                    {q.answer && <p style={{ margin: "4px 0 0" }}>Answer: {q.answer}</p>}
                  </div>
                  <div className={styles.questionActions}>
                    {q.status === "queued" && (
                      <button type="button" className={styles.smallButton} onClick={() => setSellerQuestionStatus(candidate.id, q.id, "asked")}>
                        Mark asked
                      </button>
                    )}
                    {q.status !== "answered" && (
                      <>
                        <label className="visually-hidden" htmlFor={`answer-${q.id}`}>
                          Answer for: {q.question}
                        </label>
                        <input
                          id={`answer-${q.id}`}
                          placeholder="Record answer…"
                          value={answerDrafts[q.id] ?? ""}
                          onChange={(e) => setAnswerDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                          style={{ minHeight: 32, border: "1px solid var(--color-border)", borderRadius: "var(--radius-control)", padding: "0 var(--space-2)" }}
                        />
                        <button
                          type="button"
                          className={styles.smallButton}
                          onClick={() => setSellerQuestionStatus(candidate.id, q.id, "answered", answerDrafts[q.id])}
                        >
                          Mark answered
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </Panel>

          <Panel title="7. Feedback">
            <FeedbackPrompt
              options={CANDIDATE_FEEDBACK_OPTIONS}
              onSubmit={(type, note) => addCandidateFeedback(candidate.id, type, note)}
            />
            {candidate.feedback.length > 0 && (
              <ul style={{ marginTop: "var(--space-3)" }}>
                {candidate.feedback.map((f) => (
                  <li key={f.id}>
                    {formatDate(f.date)} — {f.type}
                    {f.note ? `: ${f.note}` : ""}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <aside className={styles.sticky} aria-label="Decision panel">
          <Panel title="Decision panel">
            <ScoreBadge score={candidate.score} showBreakdown={false} />
            <div className={styles.decisionPanelRow}>
              <span>Confidence</span>
              <ConfidenceLabel level={candidate.confidence} compact />
            </div>
            <div className={styles.decisionPanelRow}>
              <span>Unresolved blockers</span>
              <span>{blockingRisks.length}</span>
            </div>
            <div className={styles.decisionPanelRow}>
              <span>Est. round-trip drive</span>
              <span>{roundTripMinutes !== undefined ? formatDriveTime(roundTripMinutes) : "Unknown"}</span>
            </div>
            <div className={styles.decisionPanelRow} style={{ borderBottom: "none" }}>
              <span>PPI burden</span>
              <span>{candidate.distanceMiles !== undefined && candidate.distanceMiles > 150 ? "High (long-distance PPI)" : "Manageable"}</span>
            </div>
            <p style={{ marginTop: "var(--space-3)", fontWeight: 600 }}>Next: {nextAction(candidate)}</p>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

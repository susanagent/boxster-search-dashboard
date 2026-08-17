import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { CandidateTable } from "../components/CandidateTable";
import { DecisionQueue } from "../components/DecisionQueue";
import { SourceYieldList } from "../components/SourceYieldList";
import { EmptyState } from "../components/EmptyState";
import { CandidateThumbnail } from "../components/CandidateThumbnail";
import { ScoreBadge } from "../components/ScoreBadge";
import { ConfidenceLabel } from "../components/ConfidenceLabel";
import { EvidenceMeter } from "../components/EvidenceMeter";
import { buildDecisionQueue } from "../lib/decisionQueue";
import { daysSince, formatCurrency, formatDate, formatMileage } from "../lib/format";
import { nextAction } from "../lib/nextAction";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const { candidates, searchRuns, sources } = useAppData();
  const lastRun = searchRuns.reduce((latest, run) =>
    !latest || (run.completedAt ?? run.startedAt) > (latest.completedAt ?? latest.startedAt) ? run : latest
  , searchRuns[0]);
  const decisionQueue = useMemo(() => buildDecisionQueue(candidates), [candidates]);
  const topCandidate = useMemo(() => {
    const eligible = candidates.filter(
      (candidate) =>
        !["Rejected", "Sold", "Removed"].includes(candidate.status)
        && !candidate.risks.some((risk) => risk.severity === "blocking"),
    );
    const documented = eligible.filter((candidate) => candidate.confidence !== "low");
    return [...(documented.length > 0 ? documented : eligible)]
      .sort((a, b) => b.score.total - a.score.total)[0];
  }, [candidates]);
  const staleCandidates = candidates.filter((c) => daysSince(c.lastVerifiedAt) >= 21 || c.status === "Stale");
  const rejected = candidates.filter((c) => c.status === "Rejected");
  const allFeedback = candidates.flatMap((c) => c.feedback.map((f) => ({ ...f, candidateTitle: c.title })));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="See the strongest candidate, the evidence behind it, and the next decision to make."
      />

      {topCandidate && (
        <section className={styles.featured} aria-labelledby="featured-candidate-title">
          <div className={styles.featuredVisual}>
            <CandidateThumbnail candidate={topCandidate} size="hero" />
          </div>
          <div className={styles.featuredBody}>
            <span className={styles.eyebrow}>Best documented candidate</span>
            <h2 id="featured-candidate-title" className={styles.featuredTitle}>{topCandidate.title}</h2>
            <p className={styles.featuredSpec}>
              {formatCurrency(topCandidate.askPrice)} · {formatMileage(topCandidate.mileage)} · {topCandidate.transmission} · {topCandidate.location}
            </p>
            <div className={styles.featuredSignals}>
              <ScoreBadge score={topCandidate.score} showBreakdown={false} />
              <ConfidenceLabel level={topCandidate.confidence} compact />
              <EvidenceMeter facts={topCandidate.facts} />
            </div>
            <div className={styles.nextMove}>
              <span className={styles.nextMoveLabel}>Recommended next move</span>
              <strong>{nextAction(topCandidate)}</strong>
            </div>
            <div className={styles.featuredActions}>
              <Link className={styles.primaryAction} to={`/candidates/${topCandidate.id}`}>Review candidate</Link>
              {topCandidate.listings[0] && (
                <a className={styles.secondaryAction} href={topCandidate.listings[0].url} target="_blank" rel="noreferrer">Open listing ↗</a>
              )}
            </div>
          </div>
        </section>
      )}

      <div className={styles.grid}>
        <Panel title="Search pulse">
          {lastRun ? (
            <>
              <div className={styles.pulseStats}>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{lastRun.newCount}</span>
                  <span className={styles.statLabel}>New</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{lastRun.updatedCount}</span>
                  <span className={styles.statLabel}>Changed</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statValue}>{staleCandidates.length}</span>
                  <span className={styles.statLabel}>Stale / needs recheck</span>
                </div>
              </div>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-dense)" }}>
                Last run completed {formatDate(lastRun.completedAt ?? lastRun.startedAt)} (
                {daysSince(lastRun.completedAt ?? lastRun.startedAt)} days ago) via {lastRun.sourcesSucceeded.join(", ")}.
              </p>
              <Link to="/search-runs">View search run log →</Link>
            </>
          ) : (
            <EmptyState title="No search runs recorded yet" />
          )}
        </Panel>

        <Panel title="Decision queue">
          <DecisionQueue items={decisionQueue} />
        </Panel>
      </div>

      <Panel title="Ranked candidate ledger">
        <CandidateTable candidates={candidates} caption="Ranked candidate ledger" density="summary" />
        <div className={styles.ledgerFooter}>
          <span>Showing the fields needed for a first decision.</span>
          <Link to="/candidates">Open full candidate analysis →</Link>
        </div>
      </Panel>

      <div className={styles.gridThree}>
        <Panel title="Recent activity">
          {lastRun ? (
            <ul style={{ margin: 0, paddingLeft: "var(--space-4)", display: "grid", gap: "var(--space-2)", fontSize: "var(--font-size-dense)" }}>
              {lastRun.events.map((e) => (
                <li key={e.message}>
                  <span style={{ color: "var(--color-text-secondary)" }}>{formatDate(e.timestamp)}: </span>
                  {e.message}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No activity yet" />
          )}
        </Panel>

        <Panel title="Source yield">
          <SourceYieldList sources={sources} />
        </Panel>

        <Panel title="Rejections & feedback">
          <h3 style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
            Rejection reasons
          </h3>
          {rejected.length === 0 ? (
            <p style={{ marginTop: 0 }}>No permanent rejections yet.</p>
          ) : (
            <ul>
              {rejected.map((c) => (
                <li key={c.id}>{c.title}</li>
              ))}
            </ul>
          )}
          <h3 style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", textTransform: "uppercase", margin: "var(--space-3) 0 var(--space-2)" }}>
            Search-quality feedback
          </h3>
          {allFeedback.length === 0 ? (
            <p style={{ margin: 0 }}>
              None recorded yet — add feedback from a candidate's detail page or the{" "}
              <Link to="/feedback-rules">Feedback / Rules</Link> view.
            </p>
          ) : (
            <ul>
              {allFeedback.map((f) => (
                <li key={f.id}>
                  {f.candidateTitle}: {f.type} {f.note ? `— ${f.note}` : ""}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

    </div>
  );
}

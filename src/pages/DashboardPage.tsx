import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { CandidateTable } from "../components/CandidateTable";
import { CandidateQuickView } from "../components/CandidateQuickView";
import { DecisionQueue } from "../components/DecisionQueue";
import { SourceYieldList } from "../components/SourceYieldList";
import { EmptyState } from "../components/EmptyState";
import { buildDecisionQueue } from "../lib/decisionQueue";
import { daysSince, formatDate } from "../lib/format";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const { candidates, searchRuns, sources } = useAppData();
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  const lastRun = searchRuns.reduce((latest, run) =>
    !latest || (run.completedAt ?? run.startedAt) > (latest.completedAt ?? latest.startedAt) ? run : latest
  , searchRuns[0]);
  const decisionQueue = useMemo(() => buildDecisionQueue(candidates), [candidates]);
  const staleCandidates = candidates.filter((c) => daysSince(c.lastVerifiedAt) >= 21 || c.status === "Stale");
  const rejected = candidates.filter((c) => c.status === "Rejected");
  const allFeedback = candidates.flatMap((c) => c.feedback.map((f) => ({ ...f, candidateTitle: c.title })));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Which Boxster deserves the next call, inspection, or PPI? Every ranking below shows score and confidence separately — a low-confidence score should not outrank well-documented evidence."
      />

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
        <CandidateTable candidates={candidates} caption="Ranked candidate ledger" onQuickView={setQuickViewId} />
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

      <CandidateQuickView candidateId={quickViewId} onClose={() => setQuickViewId(null)} />
    </div>
  );
}

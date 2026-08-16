import { useAppData } from "../context/AppDataContext";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { EmptyState } from "../components/EmptyState";
import { formatDate } from "../lib/format";

export function SearchRunsPage() {
  const { searchRuns } = useAppData();

  return (
    <div>
      <PageHeader
        title="Search Runs"
        subtitle="Every search run is logged with sources attempted/succeeded/failed, counts, and a chronological event trail."
      />
      {searchRuns.length === 0 ? (
        <EmptyState title="No search runs recorded yet" description="See docs/DATA_IMPORT.md for how a run should be recorded." />
      ) : (
        <div style={{ display: "grid", gap: "var(--space-4)" }}>
          {[...searchRuns].reverse().map((run) => (
            <Panel key={run.id} title={`${run.id} — ${formatDate(run.startedAt)}`}>
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "var(--space-3)",
                  fontSize: "var(--font-size-dense)",
                }}
              >
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Radius</dt>
                  <dd style={{ margin: 0 }}>{run.radiusMiles} mi</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Rules version</dt>
                  <dd style={{ margin: 0 }}>{run.rulesVersion}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Sources succeeded</dt>
                  <dd style={{ margin: 0 }}>{run.sourcesSucceeded.join(", ") || "None"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Sources failed</dt>
                  <dd style={{ margin: 0 }}>{run.sourcesFailed.join(", ") || "None"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Listings scanned</dt>
                  <dd style={{ margin: 0 }}>{run.listingsScanned ?? "Not recorded"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Duration</dt>
                  <dd style={{ margin: 0 }}>{run.durationMinutes ? `${run.durationMinutes} min` : "Not recorded"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>New / updated</dt>
                  <dd style={{ margin: 0 }}>
                    {run.newCount} new, {run.updatedCount} updated
                  </dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Duplicate / stale / rejected</dt>
                  <dd style={{ margin: 0 }}>
                    {run.duplicateCount} / {run.staleCount} / {run.rejectedCount}
                  </dd>
                </div>
              </dl>

              {run.notes && <p style={{ marginTop: "var(--space-3)" }}>{run.notes}</p>}

              {run.errors && run.errors.length > 0 && (
                <div style={{ marginTop: "var(--space-3)", color: "var(--color-action)" }}>
                  <strong>Errors:</strong>
                  <ul>
                    {run.errors.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <h3 style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", textTransform: "uppercase", margin: "var(--space-4) 0 var(--space-2)" }}>
                Event log
              </h3>
              <ul style={{ margin: 0, paddingLeft: "var(--space-4)", display: "grid", gap: "4px", fontSize: "var(--font-size-dense)" }}>
                {run.events.map((e) => (
                  <li key={e.message}>
                    <span style={{ color: "var(--color-text-secondary)" }}>{formatDate(e.timestamp)}: </span>
                    {e.message}
                  </li>
                ))}
              </ul>

              <h3 style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", textTransform: "uppercase", margin: "var(--space-4) 0 var(--space-2)" }}>
                Change set
              </h3>
              <ul style={{ margin: 0, paddingLeft: "var(--space-4)", display: "grid", gap: "4px", fontSize: "var(--font-size-dense)" }}>
                {run.changeSet.map((cs, i) => (
                  <li key={i}>
                    {cs.candidateId}: {cs.change}
                  </li>
                ))}
              </ul>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

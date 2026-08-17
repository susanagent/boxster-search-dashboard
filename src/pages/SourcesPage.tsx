import { useAppData } from "../context/AppDataContext";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { FeedbackPrompt } from "../components/FeedbackPrompt";
import { formatDate } from "../lib/format";
import type { SourceFeedbackType } from "../data/types";

const SOURCE_FEEDBACK_OPTIONS: { value: SourceFeedbackType; label: string }[] = [
  { value: "useful", label: "Useful" },
  { value: "wrong-transmission", label: "Wrong transmission" },
  { value: "too-far", label: "Too far" },
  { value: "stale", label: "Stale" },
  { value: "poor-evidence", label: "Poor evidence" },
  { value: "duplicate", label: "Duplicate" },
  { value: "wrong-price-band", label: "Wrong price band" },
  { value: "promote-source", label: "Promote source" },
  { value: "note", label: "Note" },
];

export function SourcesPage() {
  const { sources, sourceFeedback, addSourceFeedback } = useAppData();

  return (
    <div>
      <PageHeader
        title="Sources"
        subtitle="Where candidates come from, how well each source performs, and feedback that should inform which sources to prioritize next run."
      />
      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        {sources.map((s) => {
          const feedbackForSource = sourceFeedback.filter((f) => f.sourceId === s.id);
          return (
            <Panel key={s.id} title={s.name}>
              <p style={{ color: "var(--color-text-secondary)", marginTop: 0 }}>
                Type: {s.type} · Priority: {s.priority}
                {s.url ? (
                  <>
                    {" · "}
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.url}
                    </a>
                  </>
                ) : null}
              </p>
              <p style={{ color: "var(--color-text-secondary)", marginTop: 0 }}>{s.accessNote}</p>
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "var(--space-3)",
                  fontSize: "var(--font-size-dense)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Listings scanned</dt>
                  <dd style={{ margin: 0 }}>{s.metrics.listingsScanned ?? "Not yet measured"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Active verified</dt>
                  <dd style={{ margin: 0 }}>{s.metrics.activeListingsVerified ?? "Not yet measured"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Unique / promoted</dt>
                  <dd style={{ margin: 0 }}>{s.metrics.uniqueCandidates !== undefined ? `${s.metrics.uniqueCandidates} / ${s.metrics.promotedCandidates ?? 0}` : "Not yet measured"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Qualified candidates</dt>
                  <dd style={{ margin: 0 }}>{s.metrics.qualifiedCandidates}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Duplicate rate</dt>
                  <dd style={{ margin: 0 }}>{s.metrics.duplicateRate !== undefined ? `${s.metrics.duplicateRate}%` : "Not yet measured"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Last successful check</dt>
                  <dd style={{ margin: 0 }}>{s.metrics.lastSuccessfulCheck ? formatDate(s.metrics.lastSuccessfulCheck) : "Not yet checked"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Median useful price</dt>
                  <dd style={{ margin: 0 }}>{s.metrics.medianUsefulPrice ?? "Not yet measured"}</dd>
                </div>
                <div>
                  <dt style={{ color: "var(--color-text-secondary)" }}>Geographic yield</dt>
                  <dd style={{ margin: 0 }}>{s.metrics.geographicYield ?? "Not yet measured"}</dd>
                </div>
              </dl>

              <h3 style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
                Add feedback
              </h3>
              <FeedbackPrompt options={SOURCE_FEEDBACK_OPTIONS} onSubmit={(type, note) => addSourceFeedback(s.id, type, note)} />

              {feedbackForSource.length > 0 && (
                <ul style={{ marginTop: "var(--space-3)" }}>
                  {feedbackForSource.map((f) => (
                    <li key={f.id}>
                      {formatDate(f.date)} — {f.type}
                      {f.note ? `: ${f.note}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

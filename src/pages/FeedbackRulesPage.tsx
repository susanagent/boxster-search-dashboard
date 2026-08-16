import { useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { PageHeader } from "../components/PageHeader";
import { Panel } from "../components/Panel";
import { EmptyState } from "../components/EmptyState";
import { formatDate } from "../lib/format";
import { KNOWN_TAGS } from "../data/rulesLog";

export function FeedbackRulesPage() {
  const { standingRules, rulesVersion, rulesChangeLog, ruleProposals, proposeRuleChange, candidates, sourceFeedback } = useAppData();
  const [summary, setSummary] = useState("");
  const [rationale, setRationale] = useState("");

  const allChangeLog = [...ruleProposals, ...rulesChangeLog].sort((a, b) => b.date.localeCompare(a.date));
  const candidateFeedback = candidates.flatMap((c) => c.feedback.map((f) => ({ ...f, candidateTitle: c.title })));

  return (
    <div>
      <PageHeader
        title="Feedback / Rules"
        subtitle="Standing search rules, the change log behind them, and every piece of feedback gathered so far. Rules never change silently — proposals require a rationale and stay Proposed until reviewed."
      />

      <div style={{ display: "grid", gap: "var(--space-4)" }}>
        <Panel title={`Standing rules (${rulesVersion})`}>
          <ul style={{ margin: 0, paddingLeft: "var(--space-4)", display: "grid", gap: "4px" }}>
            {standingRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </Panel>

        <Panel title="Rejection / learning tags">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {KNOWN_TAGS.map((tag) => (
              <span
                key={tag}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-control)",
                  padding: "2px var(--space-2)",
                  fontSize: "var(--font-size-small)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Propose a rule change">
          <p style={{ color: "var(--color-text-secondary)", marginTop: 0 }}>
            Proposals are recorded as <strong>Proposed</strong> and never take effect automatically — review and approve them
            explicitly before search behavior changes.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!summary.trim() || !rationale.trim()) return;
              proposeRuleChange(summary.trim(), rationale.trim());
              setSummary("");
              setRationale("");
            }}
            style={{ display: "grid", gap: "var(--space-2)", maxWidth: 480 }}
          >
            <label>
              Summary
              <input
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required
                style={{ display: "block", width: "100%", minHeight: 40, border: "1px solid var(--color-border)", borderRadius: "var(--radius-control)", padding: "0 var(--space-2)", marginTop: 4 }}
              />
            </label>
            <label>
              Rationale
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                required
                rows={3}
                style={{ display: "block", width: "100%", border: "1px solid var(--color-border)", borderRadius: "var(--radius-control)", padding: "var(--space-2)", marginTop: 4 }}
              />
            </label>
            <button
              type="submit"
              style={{ justifySelf: "start", minHeight: 40, padding: "var(--space-2) var(--space-4)", border: "none", borderRadius: "var(--radius-control)", background: "var(--color-action)", color: "var(--color-surface)", fontWeight: 600 }}
            >
              Submit proposal
            </button>
          </form>
        </Panel>

        <Panel title="Rules change log">
          <ul style={{ margin: 0, paddingLeft: "var(--space-4)", display: "grid", gap: "var(--space-2)" }}>
            {allChangeLog.map((entry) => (
              <li key={entry.id}>
                <strong>{formatDate(entry.date)}</strong> ({entry.version}, {entry.status}): {entry.summary}
                <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-small)" }}>{entry.rationale}</div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="All feedback">
          {candidateFeedback.length === 0 && sourceFeedback.length === 0 ? (
            <EmptyState title="No feedback recorded yet" description="Feedback can be added from any candidate detail page or the Sources view." />
          ) : (
            <>
              {candidateFeedback.length > 0 && (
                <>
                  <h3 style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
                    Candidate feedback
                  </h3>
                  <ul style={{ marginBottom: "var(--space-4)" }}>
                    {candidateFeedback.map((f) => (
                      <li key={f.id}>
                        {formatDate(f.date)} — {f.candidateTitle}: {f.type}
                        {f.note ? ` — ${f.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {sourceFeedback.length > 0 && (
                <>
                  <h3 style={{ fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: "var(--space-2)" }}>
                    Source feedback
                  </h3>
                  <ul>
                    {sourceFeedback.map((f) => (
                      <li key={f.id}>
                        {formatDate(f.date)} — {f.sourceId}: {f.type}
                        {f.note ? ` — ${f.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}

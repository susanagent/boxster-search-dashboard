import type { Source } from "../data/types";
import { formatDate } from "../lib/format";

function metric(value: number | string | undefined, suffix = ""): string {
  if (value === undefined) return "Not yet measured";
  return `${value}${suffix}`;
}

export function SourceYieldList({ sources }: { sources: Source[] }) {
  return (
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "var(--space-3)" }}>
      {sources.map((s) => (
        <li key={s.id} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-3)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-2)" }}>
            <strong>{s.name}</strong>
            <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-small)" }}>
              {s.metrics.lastSuccessfulCheck ? `Checked ${formatDate(s.metrics.lastSuccessfulCheck)}` : "Not yet checked"}
            </span>
          </div>
          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "var(--space-2)",
              marginTop: "var(--space-2)",
              fontSize: "var(--font-size-small)",
            }}
          >
            <div>
              <dt style={{ color: "var(--color-text-secondary)" }}>Qualified candidates</dt>
              <dd style={{ margin: 0 }}>{s.metrics.qualifiedCandidates}</dd>
            </div>
            <div>
              <dt style={{ color: "var(--color-text-secondary)" }}>Duplicate rate</dt>
              <dd style={{ margin: 0 }}>{metric(s.metrics.duplicateRate, "%")}</dd>
            </div>
            <div>
              <dt style={{ color: "var(--color-text-secondary)" }}>Manual-match rate</dt>
              <dd style={{ margin: 0 }}>{metric(s.metrics.manualMatchRate, "%")}</dd>
            </div>
            <div>
              <dt style={{ color: "var(--color-text-secondary)" }}>Median useful price</dt>
              <dd style={{ margin: 0 }}>{metric(s.metrics.medianUsefulPrice)}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

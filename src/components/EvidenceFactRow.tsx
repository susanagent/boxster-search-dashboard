import type { EvidenceFact } from "../data/types";
import { EVIDENCE_META } from "../lib/meta";
import { Tag } from "./Tag";
import { formatDate } from "../lib/format";

export function EvidenceFactRow({ fact }: { fact: EvidenceFact }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "var(--space-3)",
        padding: "var(--space-2) 0",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>{fact.label}</div>
        {fact.detail && <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-dense)" }}>{fact.detail}</div>}
        {fact.date && (
          <div style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-small)" }}>
            {fact.sourceId ? `${fact.sourceId} · ` : ""}
            {formatDate(fact.date)}
          </div>
        )}
      </div>
      <Tag tone={EVIDENCE_META[fact.status]} />
    </div>
  );
}

import type { EvidenceFact, EvidenceStatus } from "../data/types";
import { EVIDENCE_META } from "../lib/meta";
import styles from "./EvidenceMeter.module.css";

const ORDER: EvidenceStatus[] = ["confirmed", "claimed", "inferred", "contradicted", "unknown"];

export function EvidenceMeter({ facts }: { facts: EvidenceFact[] }) {
  const total = facts.length || 1;
  const counts = ORDER.map((status) => ({
    status,
    count: facts.filter((f) => f.status === status).length,
  }));
  const known = total - (counts.find((c) => c.status === "unknown")?.count ?? 0);
  const summary = counts
    .filter((c) => c.count > 0)
    .map((c) => `${c.count} ${EVIDENCE_META[c.status].label.toLowerCase()}`)
    .join(", ");

  return (
    <div className={styles.wrap}>
      <div
        className={styles.track}
        role="img"
        aria-label={`Evidence completeness: ${known} of ${total} facts known — ${summary}.`}
      >
        {counts.map(
          (c) =>
            c.count > 0 && (
              <span
                key={c.status}
                className={styles.segment}
                style={{ width: `${(c.count / total) * 100}%`, background: EVIDENCE_META[c.status].color }}
              />
            ),
        )}
      </div>
      <span className={styles.summary}>
        {known}/{total} facts known
      </span>
    </div>
  );
}

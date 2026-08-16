import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { PageHeader } from "../components/PageHeader";
import { EmptyState } from "../components/EmptyState";
import { useMediaQuery } from "../lib/useMediaQuery";
import { COMPARE_ROWS } from "../lib/compareRows";
import type { CompareRow } from "../lib/compareRows";
import type { Candidate } from "../data/types";
import { XIcon } from "../components/icons";
import styles from "./ComparePage.module.css";

export function ComparePage() {
  const { candidates, compareIds, toggleCompare, setCompareOrder, canAddToCompare } = useAppData();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [diffOnly, setDiffOnly] = useState(false);
  const [baselineId, setBaselineId] = useState<string | null>(null);
  const [challengerId, setChallengerId] = useState<string | null>(null);

  const selected = compareIds
    .map((id) => candidates.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const rows = useMemo(() => {
    if (!diffOnly) return COMPARE_ROWS;
    return COMPARE_ROWS.filter((row) => {
      const keys = selected.map((c) => row.diffKey(c));
      return new Set(keys).size > 1;
    });
  }, [diffOnly, selected]);

  if (selected.length < 2) {
    return (
      <div>
        <PageHeader title="Compare" subtitle="Select two to four candidates to compare side by side." />
        <EmptyState
          title="Not enough candidates selected"
          description="Choose at least two candidates from the Candidates ledger, or select some below."
        />
        <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-2)" }}>
          {candidates.map((c) => (
            <label key={c.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", minHeight: 44 }}>
              <input
                type="checkbox"
                checked={compareIds.includes(c.id)}
                disabled={!compareIds.includes(c.id) && !canAddToCompare}
                onChange={() => toggleCompare(c.id)}
              />
              {c.title} — {c.location}
            </label>
          ))}
        </div>
      </div>
    );
  }

  function moveCandidate(id: string, direction: -1 | 1) {
    const idx = compareIds.indexOf(id);
    const next = [...compareIds];
    const swapWith = idx + direction;
    if (swapWith < 0 || swapWith >= next.length) return;
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    setCompareOrder(next);
  }

  if (!isDesktop) {
    const baseline = selected.find((c) => c.id === baselineId) ?? selected[0];
    const challenger = selected.find((c) => c.id === challengerId) ?? selected[1];

    return (
      <div>
        <PageHeader title="Compare" subtitle="Comparing two candidates at a time on smaller screens." />
        <div className={styles.mobileSelectors}>
          <label>
            Baseline
            <select className={styles.mobileSelect} value={baseline.id} onChange={(e) => setBaselineId(e.target.value)}>
              {selected.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Challenger
            <select className={styles.mobileSelect} value={challenger.id} onChange={(e) => setChallengerId(e.target.value)}>
              {selected.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="visually-hidden">Comparing {baseline.title} and {challenger.title}</caption>
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">{baseline.title}</th>
                <th scope="col">{challenger.title}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.group + row.label}>
                  <th scope="row" className={styles.rowLabel}>
                    {row.label}
                  </th>
                  <td>{row.render(baseline)}</td>
                  <td>{row.render(challenger)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  let lastGroup = "";

  return (
    <div>
      <PageHeader title="Compare" subtitle="Compare up to four candidates. Unknown facts are shown as Unknown, never treated as zero or favorable." />
      <div className={styles.toolbar}>
        <label className={styles.toggle}>
          <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} />
          Differences only
        </label>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className="visually-hidden">Comparing {selected.map((c) => c.title).join(", ")}</caption>
          <thead>
            <tr>
              <th scope="col" className={styles.rowLabel}>
                Field
              </th>
              {selected.map((c, i) => (
                <th scope="col" key={c.id} className={styles.candidateHeader}>
                  {c.title}
                  <div className={styles.headerControls}>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => moveCandidate(c.id, -1)}
                      disabled={i === 0}
                      aria-label={`Move ${c.title} earlier`}
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => moveCandidate(c.id, 1)}
                      disabled={i === selected.length - 1}
                      aria-label={`Move ${c.title} later`}
                    >
                      →
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => toggleCompare(c.id)}
                      aria-label={`Remove ${c.title} from comparison`}
                    >
                      <XIcon size={12} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const showGroup = row.group !== lastGroup;
              lastGroup = row.group;
              return (
                <RowWithGroup key={row.group + row.label} row={row} showGroup={showGroup} selected={selected} />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowWithGroup({
  row,
  showGroup,
  selected,
}: {
  row: CompareRow;
  showGroup: boolean;
  selected: Candidate[];
}) {
  return (
    <>
      {showGroup && (
        <tr className={styles.groupRow}>
          <th scope="colgroup" colSpan={selected.length + 1}>
            {row.group}
          </th>
        </tr>
      )}
      <tr>
        <th scope="row" className={styles.rowLabel}>
          {row.label}
        </th>
        {selected.map((c) => (
          <td key={c.id}>{row.render(c)}</td>
        ))}
      </tr>
    </>
  );
}

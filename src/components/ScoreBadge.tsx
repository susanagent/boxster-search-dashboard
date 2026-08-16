import type { ScoreBreakdown } from "../data/types";
import { formatDate } from "../lib/format";
import styles from "./ScoreBadge.module.css";

const ROWS: { key: keyof ScoreBreakdown; label: string; max: number }[] = [
  { key: "maintenanceAndMechanicalRisk", label: "Maintenance & mechanical risk", max: 25 },
  { key: "conditionAndInspectionEvidence", label: "Condition & inspection evidence", max: 20 },
  { key: "priceValue", label: "Price / value", max: 15 },
  { key: "specificationDesirability", label: "Specification desirability", max: 15 },
  { key: "titleHistoryCredibility", label: "Title / history / credibility", max: 10 },
  { key: "mileageOwnership", label: "Mileage & ownership", max: 5 },
  { key: "distanceLogistics", label: "Distance / logistics", max: 5 },
  { key: "listingCompleteness", label: "Listing completeness", max: 5 },
];

export function ScoreBadge({ score, showBreakdown = true }: { score: ScoreBreakdown; showBreakdown?: boolean }) {
  return (
    <span className={styles.wrap}>
      <span className={styles.badge}>
        <span className={styles.value}>{score.total}</span>
        <span className={styles.max}>/100</span>
      </span>
      {showBreakdown && (
        <details className={styles.details}>
          <summary>How this score was calculated</summary>
          <ul className={styles.breakdown}>
            {ROWS.map((row) => (
              <li key={row.key}>
                <span>{row.label}</span>
                <span>
                  {score[row.key]}/{row.max}
                </span>
              </li>
            ))}
          </ul>
          <p className={styles.updated}>Updated {formatDate(score.updatedAt)}</p>
        </details>
      )}
    </span>
  );
}

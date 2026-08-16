import { Link } from "react-router-dom";
import type { DecisionQueueItem } from "../lib/decisionQueue";
import { Tag } from "./Tag";
import { RISK_META } from "../lib/meta";
import { EmptyState } from "./EmptyState";
import styles from "./DecisionQueue.module.css";

export function DecisionQueue({ items }: { items: DecisionQueueItem[] }) {
  if (items.length === 0) {
    return <EmptyState title="Decision queue is clear" description="No candidate currently needs verification, contact, or a PPI." />;
  }

  return (
    <ul className={styles.list}>
      {items.map((item, i) => (
        <li key={`${item.candidate.id}-${item.action}-${i}`} className={styles.item}>
          <div className={styles.itemMain}>
            <Link to={`/candidates/${item.candidate.id}`}>
              {item.label} — {item.candidate.title}
            </Link>
            <span className={styles.itemDetail}>{item.detail}</span>
          </div>
          {item.action === "verify-conflict" && <Tag tone={RISK_META.blocking} label="Blocking" />}
        </li>
      ))}
    </ul>
  );
}

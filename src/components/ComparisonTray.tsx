import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { XIcon } from "./icons";
import styles from "./ComparisonTray.module.css";

export function ComparisonTray() {
  const { compareIds, candidates, toggleCompare, clearCompare } = useAppData();
  if (compareIds.length === 0) return null;

  const selected = compareIds
    .map((id) => candidates.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className={styles.tray} role="region" aria-label="Comparison tray">
      <span className={styles.label}>Comparing {selected.length}/4</span>
      <ul className={styles.chips} style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {selected.map((c) => (
          <li key={c.id} className={styles.chip}>
            <span>{c.id}</span>
            <button type="button" onClick={() => toggleCompare(c.id)} aria-label={`Remove ${c.id} from comparison`}>
              <XIcon size={12} />
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.actions}>
        <button type="button" className={styles.clearButton} onClick={clearCompare}>
          Clear
        </button>
        <Link
          to="/compare"
          className={styles.compareLink}
          aria-disabled={selected.length < 2}
          onClick={(e) => {
            if (selected.length < 2) e.preventDefault();
          }}
        >
          Compare {selected.length >= 2 ? `(${selected.length})` : ""}
        </Link>
      </div>
    </div>
  );
}

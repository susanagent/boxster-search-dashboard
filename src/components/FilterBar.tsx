import { ALL_STATUSES, ALL_TRANSMISSIONS, type FilterState } from "../lib/filters";
import { SEARCH_BANDS } from "../lib/geo";
import styles from "./FilterBar.module.css";

export function FilterBar({
  filters,
  onChange,
  resultCount,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
}) {
  function toggleStatus(status: (typeof ALL_STATUSES)[number]) {
    const next = new Set(filters.statuses);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    onChange({ ...filters, statuses: next });
  }

  function toggleTransmission(t: (typeof ALL_TRANSMISSIONS)[number]) {
    const next = new Set(filters.transmissions);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    onChange({ ...filters, transmissions: next });
  }

  const hasActiveFilters = filters.statuses.size > 0 || filters.transmissions.size > 0 || filters.maxDistance !== undefined || filters.text.length > 0;

  return (
    <div className={styles.bar} role="group" aria-label="Filter candidates">
      <div className={styles.group}>
        <span className={styles.groupLabel} id="status-filter-label">
          Status
        </span>
        <div className={styles.checkList} role="group" aria-labelledby="status-filter-label">
          {ALL_STATUSES.map((status) => (
            <label key={status} className={styles.checkChip}>
              <input type="checkbox" checked={filters.statuses.has(status)} onChange={() => toggleStatus(status)} />
              {status}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel} id="transmission-filter-label">
          Transmission
        </span>
        <div className={styles.checkList} role="group" aria-labelledby="transmission-filter-label">
          {ALL_TRANSMISSIONS.map((t) => (
            <label key={t} className={styles.checkChip}>
              <input type="checkbox" checked={filters.transmissions.has(t)} onChange={() => toggleTransmission(t)} />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.groupLabel} htmlFor="distance-filter">
          Max distance
        </label>
        <select
          id="distance-filter"
          className={styles.select}
          value={filters.maxDistance ?? ""}
          onChange={(e) => onChange({ ...filters, maxDistance: e.target.value ? Number(e.target.value) : undefined })}
        >
          <option value="">Any distance</option>
          {SEARCH_BANDS.map((band) => (
            <option key={band} value={band}>
              Within {band} mi
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button type="button" className={styles.clear} onClick={() => onChange({ statuses: new Set(), transmissions: new Set(), maxDistance: undefined, text: filters.text })}>
          Clear filters
        </button>
      )}

      <span className={styles.count} aria-live="polite">
        {resultCount} candidate{resultCount === 1 ? "" : "s"}
      </span>
    </div>
  );
}

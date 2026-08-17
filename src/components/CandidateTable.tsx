import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Candidate, ConfidenceLevel } from "../data/types";
import { useAppData } from "../context/AppDataContext";
import { useMediaQuery } from "../lib/useMediaQuery";
import { formatCurrency, formatDate, formatDriveTime, formatMileage } from "../lib/format";
import { nextAction } from "../lib/nextAction";
import { StatusPill } from "./StatusPill";
import { ConfidenceLabel } from "./ConfidenceLabel";
import { ScoreBadge } from "./ScoreBadge";
import { EvidenceMeter } from "./EvidenceMeter";
import { RiskFlagBadge } from "./RiskFlagBadge";
import { CandidateThumbnail } from "./CandidateThumbnail";
import { ChevronDownIcon, ChevronUpIcon, ArrowUpDownIcon, ExternalLinkIcon } from "./icons";
import styles from "./CandidateTable.module.css";

type SortKey = "rank" | "title" | "transmission" | "askPrice" | "mileage" | "distance" | "score" | "confidence" | "status" | "lastVerified";
type SortDir = "asc" | "desc";

const CONFIDENCE_RANK: Record<ConfidenceLevel, number> = { low: 0, medium: 1, high: 2 };

export function CandidateTable({
  candidates,
  allowSort = true,
  allowSelection = true,
  density = "full",
  caption,
  onQuickView,
}: {
  candidates: Candidate[];
  allowSort?: boolean;
  allowSelection?: boolean;
  density?: "summary" | "full";
  caption: string;
  onQuickView?: (id: string) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isInCompare, toggleCompare, canAddToCompare } = useAppData();

  const sorted = useMemo(() => {
    if (!allowSort) return candidates;
    const copy = [...candidates];
    copy.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "title":
          return a.title.localeCompare(b.title) * dir;
        case "transmission":
          return a.transmission.localeCompare(b.transmission) * dir;
        case "askPrice":
          return (a.askPrice - b.askPrice) * dir;
        case "mileage":
          return (a.mileage - b.mileage) * dir;
        case "distance":
          return ((a.distanceMiles ?? Infinity) - (b.distanceMiles ?? Infinity)) * dir;
        case "score":
          return (a.score.total - b.score.total) * dir;
        case "confidence":
          return (CONFIDENCE_RANK[a.confidence] - CONFIDENCE_RANK[b.confidence]) * dir;
        case "status":
          return a.status.localeCompare(b.status) * dir;
        case "lastVerified":
          return a.lastVerifiedAt.localeCompare(b.lastVerifiedAt) * dir;
        default:
          return 0;
      }
    });
    return copy;
  }, [candidates, allowSort, sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "askPrice" || key === "distance" || key === "mileage" ? "asc" : "desc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (!allowSort || sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  function SortHeader({ column, label }: { column: SortKey; label: string }) {
    if (!allowSort) return <th scope="col">{label}</th>;
    return (
      <th scope="col" aria-sort={ariaSortFor(column)}>
        <button type="button" className={styles.sortButton} onClick={() => onSort(column)}>
          {label}
          {sortKey === column ? (
            sortDir === "asc" ? (
              <ChevronUpIcon size={13} />
            ) : (
              <ChevronDownIcon size={13} />
            )
          ) : (
            <ArrowUpDownIcon size={12} />
          )}
        </button>
      </th>
    );
  }

  if (sorted.length === 0) {
    return null;
  }

  if (!isDesktop) {
    return (
      <ul className={styles.mobileList} aria-label={caption} style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {sorted.map((c, i) => (
          <li key={c.id} className={styles.mobileCard}>
            <CandidateThumbnail candidate={c} />
            <div className={styles.mobileTop}>
              <div>
                <Link to={`/candidates/${c.id}`} className={styles.rowLink}>
                  #{i + 1} {c.title}
                </Link>
                <span className={styles.subtle}>{c.location}</span>
              </div>
              <StatusPill status={c.status} />
            </div>
            <div className={styles.mobileMeta}>
              <span>{formatCurrency(c.askPrice)}</span>
              <span>{formatMileage(c.mileage)}</span>
              <span>{c.transmission}</span>
              {c.distanceMiles !== undefined && <span>{c.distanceMiles} mi</span>}
            </div>
            <div className={styles.mobileBadges}>
              <ScoreBadge score={c.score} showBreakdown={false} />
              <ConfidenceLabel level={c.confidence} compact />
            </div>
            <EvidenceMeter facts={c.facts} />
            <p className={styles.subtle}>Next: {nextAction(c)}</p>
            <div className={styles.mobileActions}>
              {allowSelection && (
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isInCompare(c.id)}
                    disabled={!isInCompare(c.id) && !canAddToCompare}
                    onChange={() => toggleCompare(c.id)}
                  />
                  Compare
                </label>
              )}
              {onQuickView && (
                <button type="button" className={styles.expandButton} onClick={() => onQuickView(c.id)}>
                  Quick view
                </button>
              )}
              <Link to={`/candidates/${c.id}`} className={styles.rowLink}>
                View detail
              </Link>
              {c.listings[0] && (
                <a className={styles.listingLink} href={c.listings[0].url} target="_blank" rel="noreferrer">
                  View listing <ExternalLinkIcon size={14} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption className="visually-hidden">{caption}</caption>
        <thead>
          <tr>
            {allowSelection && <th scope="col" className={styles.checkboxCell}>
              <span className="visually-hidden">Compare</span>
            </th>}
            <th scope="col" className={styles.stickyCol}>
              Rank
            </th>
            <th scope="col">Visual</th>
            <SortHeader column="title" label="Year / Model" />
            {density === "full" && <SortHeader column="transmission" label="Transmission" />}
            <SortHeader column="askPrice" label="Price" />
            {density === "full" && <SortHeader column="mileage" label="Mileage" />}
            {density === "full" && <SortHeader column="distance" label="Distance" />}
            <SortHeader column="score" label="Score" />
            <SortHeader column="confidence" label="Confidence" />
            <th scope="col">Evidence</th>
            {density === "full" && <SortHeader column="status" label="Status" />}
            {density === "full" && <SortHeader column="lastVerified" label="Last verified" />}
            <th scope="col">Next action</th>
            <th scope="col">Listing</th>
            {density === "full" && onQuickView && <th scope="col">Quick view</th>}
            {density === "full" && <th scope="col"><span className="visually-hidden">Expand</span></th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((c, i) => (
            <CandidateRow
              key={c.id}
              candidate={c}
              rank={i + 1}
              expanded={expandedId === c.id}
              onToggleExpand={() => setExpandedId((id) => (id === c.id ? null : c.id))}
              allowSelection={allowSelection}
              onQuickView={density === "full" ? onQuickView : undefined}
              density={density}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CandidateRow({
  candidate: c,
  rank,
  expanded,
  onToggleExpand,
  allowSelection,
  onQuickView,
  density,
}: {
  candidate: Candidate;
  rank: number;
  expanded: boolean;
  onToggleExpand: () => void;
  allowSelection: boolean;
  onQuickView?: (id: string) => void;
  density: "summary" | "full";
}) {
  const { isInCompare, toggleCompare, canAddToCompare } = useAppData();
  const rowId = `candidate-row-${c.id}`;

  return (
    <>
      <tr>
        {allowSelection && (
          <td>
            <label className="visually-hidden" htmlFor={`compare-${c.id}`}>
              Add {c.id} to comparison
            </label>
            <input
              id={`compare-${c.id}`}
              type="checkbox"
              checked={isInCompare(c.id)}
              disabled={!isInCompare(c.id) && !canAddToCompare}
              onChange={() => toggleCompare(c.id)}
            />
          </td>
        )}
        <td className={styles.stickyCol}>{rank}</td>
        <td>
          <CandidateThumbnail candidate={c} />
        </td>
        <td className="wrap">
          <Link to={`/candidates/${c.id}`} className={styles.rowLink}>
            {c.title}
          </Link>
          <span className={styles.subtle}>{c.location}</span>
        </td>
        {density === "full" && <td style={{ textTransform: "capitalize" }}>{c.transmission}</td>}
        <td>{formatCurrency(c.askPrice)}</td>
        {density === "full" && <td>{formatMileage(c.mileage)}</td>}
        {density === "full" && <td>
          {c.distanceMiles !== undefined ? (
            <>
              {c.distanceMiles} mi
              <span className={styles.subtle}>
                {c.driveTimeMinutesEstimate !== undefined ? `~${formatDriveTime(c.driveTimeMinutesEstimate)}` : ""}
              </span>
            </>
          ) : (
            "Unknown"
          )}
        </td>}
        <td>
          <ScoreBadge score={c.score} showBreakdown={false} />
        </td>
        <td>
          <ConfidenceLabel level={c.confidence} compact />
        </td>
        <td>
          <EvidenceMeter facts={c.facts} />
        </td>
        {density === "full" && <td>
          <StatusPill status={c.status} />
        </td>}
        {density === "full" && <td>{formatDate(c.lastVerifiedAt)}</td>}
        <td className="wrap">{nextAction(c)}</td>
        <td>
          {c.listings[0] ? (
            <a className={styles.listingLink} href={c.listings[0].url} target="_blank" rel="noreferrer">
              View listing <ExternalLinkIcon size={14} />
            </a>
          ) : (
            <span className={styles.subtle}>No link</span>
          )}
        </td>
        {onQuickView && (
          <td>
            <button type="button" className={styles.expandButton} onClick={() => onQuickView(c.id)}>
              <span className="visually-hidden">Open quick view for </span>
              {c.id}
            </button>
          </td>
        )}
        {density === "full" && <td>
          <button
            type="button"
            className={styles.expandButton}
            aria-expanded={expanded}
            aria-controls={rowId}
            onClick={onToggleExpand}
          >
            {expanded ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
            <span className="visually-hidden">{expanded ? "Collapse" : "Expand"} details for {c.title}</span>
          </button>
        </td>}
      </tr>
      {density === "full" && expanded && (
        <tr className={styles.expandRow} id={rowId}>
          <td colSpan={20}>
            <div className={styles.expandGrid}>
              <div>
                <h3>Strength</h3>
                <p>{c.strength ?? "Not yet assessed."}</p>
              </div>
              <div>
                <h3>Risks</h3>
                {c.risks.length === 0 ? (
                  <p>None flagged yet.</p>
                ) : (
                  <ul>
                    {c.risks.map((r) => (
                      <li key={r.id}>
                        <RiskFlagBadge risk={r} /> {r.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3>Sources</h3>
                <ul>
                  {c.listings.map((l) => (
                    <li key={l.id}>
                      <a href={l.url} target="_blank" rel="noreferrer">
                        {l.sourceId} listing
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Missing evidence</h3>
                <ul>
                  {c.facts
                    .filter((f) => f.status === "unknown")
                    .slice(0, 8)
                    .map((f) => (
                      <li key={f.id}>{f.label}</li>
                    ))}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

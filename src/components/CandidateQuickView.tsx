import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { formatCurrency, formatMileage } from "../lib/format";
import { nextAction } from "../lib/nextAction";
import { StatusPill } from "./StatusPill";
import { ConfidenceLabel } from "./ConfidenceLabel";
import { ScoreBadge } from "./ScoreBadge";
import { EvidenceMeter } from "./EvidenceMeter";
import { RiskFlagBadge } from "./RiskFlagBadge";
import { ExternalLinkIcon, XIcon } from "./icons";
import { CandidateThumbnail } from "./CandidateThumbnail";
import styles from "./CandidateQuickView.module.css";

export function CandidateQuickView({ candidateId, onClose }: { candidateId: string | null; onClose: () => void }) {
  const { candidates } = useAppData();
  const closeRef = useRef<HTMLButtonElement>(null);
  const candidate = candidateId ? candidates.find((c) => c.id === candidateId) : undefined;

  useEffect(() => {
    if (candidate) closeRef.current?.focus();
  }, [candidate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!candidate) return null;

  return (
    <>
      <button type="button" className={styles.backdrop} onClick={onClose} aria-label="Close quick view" />
      <div className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
        <div className={styles.header}>
          <div>
            <h2 id="quick-view-title">{candidate.title}</h2>
            <p style={{ margin: "4px 0 0", color: "var(--color-text-secondary)" }}>
              {candidate.location} · {formatCurrency(candidate.askPrice)} · {formatMileage(candidate.mileage)}
            </p>
          </div>
          <button ref={closeRef} type="button" className={styles.closeButton} onClick={onClose} aria-label="Close quick view">
            <XIcon size={16} />
          </button>
        </div>
        <div className={styles.body}>
          <CandidateThumbnail candidate={candidate} size="hero" />
          <div className={styles.section}>
            <h3>Decision summary</h3>
            <div className={styles.badgeRow}>
              <StatusPill status={candidate.status} />
              <ConfidenceLabel level={candidate.confidence} />
            </div>
            <div style={{ marginTop: "var(--space-2)" }}>
              <ScoreBadge score={candidate.score} />
            </div>
            <p style={{ marginTop: "var(--space-2)" }}>
              <strong>Next action:</strong> {nextAction(candidate)}
            </p>
          </div>

          <div className={styles.section}>
            <h3>Evidence completeness</h3>
            <EvidenceMeter facts={candidate.facts} />
          </div>

          <div className={styles.section}>
            <h3>Risks</h3>
            {candidate.risks.length === 0 ? (
              <p>None flagged yet.</p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "var(--space-4)", display: "grid", gap: "var(--space-2)" }}>
                {candidate.risks.map((r) => (
                  <li key={r.id}>
                    <div className={styles.badgeRow}>
                      <RiskFlagBadge risk={r} />
                      <span>{r.title}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.section}>
            <h3>Strength</h3>
            <p>{candidate.strength ?? "Not yet assessed."}</p>
          </div>
        </div>
        <div className={styles.footer}>
          {candidate.listings[0] && (
            <a href={candidate.listings[0].url} target="_blank" rel="noreferrer" className={styles.listingLink}>
              View original listing <ExternalLinkIcon size={14} />
            </a>
          )}
          <Link to={`/candidates/${candidate.id}`} className={styles.detailLink} onClick={onClose}>
            Open full detail
          </Link>
        </div>
      </div>
    </>
  );
}

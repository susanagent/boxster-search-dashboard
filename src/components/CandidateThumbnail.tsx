import { useEffect, useState } from "react";
import type { Candidate } from "../data/types";
import styles from "./CandidateThumbnail.module.css";

function visualIdentity(candidate: Candidate) {
  const specification = candidate.specification?.toLowerCase() ?? "";
  if (specification.includes("speed yellow")) return { color: "#d6a51d", label: "Speed Yellow" };
  if (specification.includes("guards red")) return { color: "#a93630", label: "Guards Red" };
  if (specification.includes("pastel yellow")) return { color: "#d6bd56", label: "Pastel Yellow" };
  if (specification.includes("zenith blue")) return { color: "#456b8d", label: "Zenith Blue" };
  return { color: "#646a70", label: "Color unverified" };
}

export function CandidateThumbnail({ candidate, size = "compact" }: { candidate: Candidate; size?: "compact" | "hero" }) {
  const identity = visualIdentity(candidate);
  const [photoFailed, setPhotoFailed] = useState(false);
  const showPhoto = Boolean(candidate.imageUrl) && !photoFailed;

  useEffect(() => setPhotoFailed(false), [candidate.imageUrl]);

  return (
    <div
      className={`${styles.thumbnail} ${size === "hero" ? styles.hero : ""}`}
      role="img"
      aria-label={`${candidate.year} Porsche Boxster ${showPhoto ? "listing photo" : "visual identifier"}; ${identity.label}`}
    >
      <div className={styles.topline}>
        <span>{candidate.id}</span>
        <span>{candidate.year}</span>
      </div>
      {showPhoto ? (
        <img
          className={styles.photo}
          src={candidate.imageUrl}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setPhotoFailed(true)}
        />
      ) : <svg className={styles.car} viewBox="0 0 180 72" aria-hidden="true" focusable="false">
        <path d="M21 49c4-11 11-18 22-21l25-7h47c12 0 22 4 30 12l12 12c4 1 7 4 7 8v5H17v-3c0-3 1-5 4-6Z" fill={identity.color} />
        <path d="M69 25h43c9 0 17 3 23 9H57c3-4 7-7 12-9Z" fill="#f3f0e9" opacity="0.88" />
        <path d="M87 25v9" stroke="#555a5f" strokeWidth="2" />
        <circle cx="48" cy="58" r="10" fill="#25282b" />
        <circle cx="48" cy="58" r="4" fill="#aeb2b5" />
        <circle cx="139" cy="58" r="10" fill="#25282b" />
        <circle cx="139" cy="58" r="4" fill="#aeb2b5" />
      </svg>}
      <div className={styles.footer}>
        <span className={styles.swatch} style={{ backgroundColor: identity.color }} aria-hidden="true" />
        <span>{identity.label}</span>
        <span className={styles.transmission}>{candidate.transmission}</span>
      </div>
    </div>
  );
}

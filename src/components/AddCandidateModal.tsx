import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { XIcon } from "./icons";
import styles from "./AddCandidateModal.module.css";

export function AddCandidateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { addCandidate } = useAppData();
  const navigate = useNavigate();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="add-candidate-title"
      onClose={onClose}
      onCancel={onClose}
    >
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const data = new FormData(form);
          const id = addCandidate({
            title: String(data.get("title") || "Untitled candidate"),
            year: Number(data.get("year")) || new Date().getFullYear(),
            generation: (data.get("generation") as "986" | "987") || "986",
            location: String(data.get("location") || "Unknown location"),
            askPrice: Number(data.get("askPrice")) || 0,
            mileage: Number(data.get("mileage")) || 0,
            transmission: (data.get("transmission") as "manual" | "automatic" | "unknown") || "unknown",
            specification: String(data.get("specification") || "") || undefined,
            sellerType: (data.get("sellerType") as "private" | "dealer" | "unknown") || "unknown",
            url: String(data.get("url") || ""),
          });
          form.reset();
          onClose();
          navigate(`/candidates/${id}`);
        }}
      >
        <div className={styles.header}>
          <h2 id="add-candidate-title">Add candidate</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <XIcon size={18} />
          </button>
        </div>
        <div className={styles.body}>
          <p className={styles.hint}>
            All evidence facts start Unknown. Nothing is verified automatically — add records as they're gathered.
          </p>
          <div className={styles.field}>
            <label htmlFor="ac-title">Title</label>
            <input id="ac-title" name="title" required placeholder="e.g. 2001 Porsche Boxster S" />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="ac-year">Year</label>
              <input id="ac-year" name="year" type="number" min="1996" max="2012" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="ac-generation">Generation</label>
              <select id="ac-generation" name="generation" defaultValue="986">
                <option value="986">986</option>
                <option value="987">987</option>
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="ac-location">Location</label>
            <input id="ac-location" name="location" required placeholder="City, ST" />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="ac-price">Ask price ($)</label>
              <input id="ac-price" name="askPrice" type="number" min="0" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="ac-mileage">Mileage</label>
              <input id="ac-mileage" name="mileage" type="number" min="0" required />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="ac-transmission">Transmission</label>
              <select id="ac-transmission" name="transmission" defaultValue="unknown">
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="ac-seller">Seller type</label>
              <select id="ac-seller" name="sellerType" defaultValue="unknown">
                <option value="private">Private</option>
                <option value="dealer">Dealer</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="ac-spec">Specification (optional)</label>
            <input id="ac-spec" name="specification" placeholder="Color, top, notable options" />
          </div>
          <div className={styles.field}>
            <label htmlFor="ac-url">Listing URL</label>
            <input id="ac-url" name="url" type="url" required placeholder="https://" />
          </div>
        </div>
        <div className={styles.footer}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton}>
            Add candidate
          </button>
        </div>
      </form>
    </dialog>
  );
}

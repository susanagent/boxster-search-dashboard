import { useState } from "react";

export function FeedbackPrompt<T extends string>({
  options,
  onSubmit,
  submitLabel = "Add feedback",
}: {
  options: { value: T; label: string }[];
  onSubmit: (type: T, note?: string) => void;
  submitLabel?: string;
}) {
  const [type, setType] = useState<T>(options[0]?.value as T);
  const [note, setNote] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(type, note.trim() || undefined);
        setNote("");
      }}
      style={{ display: "grid", gap: "var(--space-2)" }}
    >
      <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
        <label className="visually-hidden" htmlFor="feedback-type">
          Feedback type
        </label>
        <select
          id="feedback-type"
          value={type}
          onChange={(e) => setType(e.target.value as T)}
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-control)",
            padding: "var(--space-2)",
            minHeight: 40,
            background: "var(--color-canvas)",
          }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <label className="visually-hidden" htmlFor="feedback-note">
          Note
        </label>
        <input
          id="feedback-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
          style={{
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-control)",
            padding: "var(--space-2)",
            minHeight: 40,
            flex: "1 1 160px",
            background: "var(--color-canvas)",
          }}
        />
        <button
          type="submit"
          style={{
            border: "none",
            borderRadius: "var(--radius-control)",
            padding: "var(--space-2) var(--space-4)",
            minHeight: 40,
            background: "var(--color-action)",
            color: "var(--color-surface)",
            fontWeight: 600,
          }}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

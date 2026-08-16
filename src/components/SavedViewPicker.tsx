import { SAVED_VIEWS } from "../lib/filters";

export function SavedViewPicker({
  activeId,
  onSelect,
}: {
  activeId: string | null;
  onSelect: (id: string | null) => void;
}) {
  return (
    <div role="group" aria-label="Saved views" style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginBottom: "var(--space-4)" }}>
      <ViewButton label="All candidates" active={activeId === null} onClick={() => onSelect(null)} />
      {SAVED_VIEWS.map((view) => (
        <ViewButton key={view.id} label={view.label} title={view.description} active={activeId === view.id} onClick={() => onSelect(view.id)} />
      ))}
    </div>
  );
}

function ViewButton({ label, title, active, onClick }: { label: string; title?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      style={{
        border: `1px solid ${active ? "var(--color-action)" : "var(--color-border)"}`,
        background: active ? "var(--color-action-tint)" : "var(--color-surface)",
        color: active ? "var(--color-action)" : "var(--color-text-primary)",
        borderRadius: "var(--radius-control)",
        padding: "var(--space-2) var(--space-3)",
        fontWeight: active ? 600 : 400,
        minHeight: 36,
        fontSize: "var(--font-size-dense)",
      }}
    >
      {label}
    </button>
  );
}

import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div
      style={{
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-panel)",
        padding: "var(--space-8) var(--space-5)",
        textAlign: "center",
        color: "var(--color-text-secondary)",
        background: "var(--color-surface)",
      }}
    >
      <p style={{ color: "var(--color-text-primary)", fontWeight: 600, margin: 0 }}>{title}</p>
      {description && <p style={{ margin: "var(--space-2) 0 0" }}>{description}</p>}
      {action && <div style={{ marginTop: "var(--space-3)" }}>{action}</div>}
    </div>
  );
}

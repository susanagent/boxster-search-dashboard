import type { ReactNode } from "react";
import styles from "./Panel.module.css";

export function Panel({ title, actions, children, as: As = "section" }: {
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  as?: "section" | "div";
}) {
  return (
    <As className={styles.panel}>
      {title && (
        <div className={styles.panelTitle}>
          <h2 style={{ fontSize: "inherit" }}>{title}</h2>
          {actions}
        </div>
      )}
      {children}
    </As>
  );
}

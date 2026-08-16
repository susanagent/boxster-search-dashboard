import type { Tone } from "../lib/meta";
import styles from "./Tag.module.css";

export function Tag({ tone, label }: { tone: Tone; label?: string }) {
  const Icon = tone.icon;
  return (
    <span className={styles.tag} style={{ color: tone.color, background: tone.tint }}>
      <Icon size={13} />
      <span>{label ?? tone.label}</span>
    </span>
  );
}

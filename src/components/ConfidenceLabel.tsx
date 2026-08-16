import type { ConfidenceLevel } from "../data/types";
import { CONFIDENCE_META } from "../lib/meta";
import { Tag } from "./Tag";

export function ConfidenceLabel({ level, compact = false }: { level: ConfidenceLevel; compact?: boolean }) {
  const tone = CONFIDENCE_META[level];
  return <Tag tone={tone} label={compact ? tone.label.replace(" confidence", "") : tone.label} />;
}

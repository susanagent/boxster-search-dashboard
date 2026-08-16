import type { RiskFlag } from "../data/types";
import { RISK_META } from "../lib/meta";
import { Tag } from "./Tag";

export function RiskFlagBadge({ risk }: { risk: RiskFlag }) {
  return <Tag tone={RISK_META[risk.severity]} />;
}

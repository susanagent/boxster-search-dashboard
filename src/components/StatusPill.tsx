import type { CandidateStatus } from "../data/types";
import { STATUS_META } from "../lib/meta";
import { Tag } from "./Tag";

export function StatusPill({ status }: { status: CandidateStatus }) {
  return <Tag tone={STATUS_META[status]} />;
}

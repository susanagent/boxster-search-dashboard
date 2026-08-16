import { describe, expect, it } from "vitest";
import { daysSince, formatDate } from "./format";

describe("date formatting", () => {
  it("supports date-only values", () => {
    expect(formatDate("2026-08-16")).toBe("Aug 16, 2026");
  });

  it("supports full ISO timestamps from search runs", () => {
    expect(formatDate("2026-08-16T16:47:00-04:00")).toBe("Aug 16, 2026");
    expect(daysSince("2026-08-16T16:47:00-04:00", new Date("2026-08-17T18:00:00-04:00"))).toBe(1);
  });
});

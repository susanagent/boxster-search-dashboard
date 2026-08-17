import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { CANDIDATES } from "../data/candidates";
import { AppDataProvider, useAppData } from "./AppDataContext";

function CandidateIds() {
  return <div>{useAppData().candidates.map((candidate) => candidate.id).join(",")}</div>;
}

describe("candidate seed cache migration", () => {
  beforeEach(() => window.localStorage.clear());

  it("replaces an obsolete browser cache with the latest canonical candidates", () => {
    window.localStorage.setItem("boxster.data", JSON.stringify({
      seedVersion: "2026-08-16.3",
      candidates: CANDIDATES.filter((candidate) => candidate.id !== "BX-009"),
    }));

    render(
      <AppDataProvider>
        <CandidateIds />
      </AppDataProvider>,
    );

    expect(screen.getByText(/BX-009/)).toBeInTheDocument();
  });
});

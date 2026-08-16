import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { PageHeader } from "../components/PageHeader";
import { CandidateTable } from "../components/CandidateTable";
import { CandidateQuickView } from "../components/CandidateQuickView";
import { SavedViewPicker } from "../components/SavedViewPicker";
import { FilterBar } from "../components/FilterBar";
import { EmptyState } from "../components/EmptyState";
import { applyFilters, emptyFilterState, SAVED_VIEWS, type FilterState } from "../lib/filters";

export function CandidatesPage() {
  const { candidates } = useAppData();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => ({ ...emptyFilterState(), text: searchParams.get("q") ?? "" }));
  const [savedViewId, setSavedViewId] = useState<string | null>(null);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);

  const savedView = SAVED_VIEWS.find((v) => v.id === savedViewId);

  const filtered = useMemo(() => {
    const base = savedView ? candidates.filter(savedView.predicate) : candidates;
    return applyFilters(base, filters);
  }, [candidates, savedView, filters]);

  return (
    <div>
      <PageHeader
        title="Candidates"
        subtitle="Dense, sortable, filterable ledger of every candidate. Expand a row for strengths, risks, sources, and missing evidence, or select up to four to compare."
      />

      <SavedViewPicker activeId={savedViewId} onSelect={setSavedViewId} />
      {savedView && (
        <p style={{ color: "var(--color-text-secondary)", marginTop: "calc(var(--space-4) * -1)", marginBottom: "var(--space-4)" }}>
          {savedView.description}
        </p>
      )}

      <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} />

      {filtered.length === 0 ? (
        <EmptyState
          title="No candidates match these filters"
          description="Try clearing a filter or choosing a different saved view."
        />
      ) : (
        <CandidateTable candidates={filtered} caption="All candidates" onQuickView={setQuickViewId} />
      )}

      <CandidateQuickView candidateId={quickViewId} onClose={() => setQuickViewId(null)} />
    </div>
  );
}

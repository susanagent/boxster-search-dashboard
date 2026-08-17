import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { CANDIDATES } from "../data/candidates";
import { SOURCES } from "../data/sources";
import { SEARCH_RUNS } from "../data/searchRuns";
import { RULES_CHANGE_LOG, STANDING_RULES, CURRENT_RULES_VERSION } from "../data/rulesLog";
import { useLocalStorage } from "../lib/useLocalStorage";
import { buildCandidate } from "../data/build";
import type {
  Candidate,
  CandidateFeedbackType,
  FeedbackEntry,
  Generation,
  RulesChangeLogEntry,
  SellerQuestionStatus,
  SourceFeedbackEntry,
  SourceFeedbackType,
  Transmission,
} from "../data/types";

export interface NewCandidateInput {
  title: string;
  year: number;
  generation: Generation;
  location: string;
  askPrice: number;
  mileage: number;
  transmission: Transmission;
  specification?: string;
  sellerType: Candidate["sellerType"];
  url: string;
}

// Bump whenever canonical candidate seed data changes so existing browsers
// receive new research results instead of retaining an obsolete local cache.
const SEED_VERSION = "2026-08-17.1";
const MAX_COMPARE = 4;

interface StoredState {
  seedVersion: string;
  candidates: Candidate[];
}

interface AppDataValue {
  candidates: Candidate[];
  sources: typeof SOURCES;
  searchRuns: typeof SEARCH_RUNS;
  rulesChangeLog: typeof RULES_CHANGE_LOG;
  standingRules: typeof STANDING_RULES;
  rulesVersion: string;
  compareIds: string[];
  toggleCompare: (id: string) => void;
  setCompareOrder: (ids: string[]) => void;
  isInCompare: (id: string) => boolean;
  canAddToCompare: boolean;
  clearCompare: () => void;
  addCandidateFeedback: (candidateId: string, type: CandidateFeedbackType, note?: string) => void;
  setSellerQuestionStatus: (candidateId: string, questionId: string, status: SellerQuestionStatus, answer?: string) => void;
  addCandidate: (input: NewCandidateInput) => string;
  resetData: () => void;
  sourceFeedback: SourceFeedbackEntry[];
  addSourceFeedback: (sourceId: string, type: SourceFeedbackType, note?: string, candidateId?: string) => void;
  ruleProposals: RulesChangeLogEntry[];
  proposeRuleChange: (summary: string, rationale: string) => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useLocalStorage<StoredState>("boxster.data", {
    seedVersion: SEED_VERSION,
    candidates: CANDIDATES,
  });
  const [compareIds, setCompareIds] = useLocalStorage<string[]>("boxster.compare", []);
  const [sourceFeedback, setSourceFeedback] = useLocalStorage<SourceFeedbackEntry[]>("boxster.sourceFeedback", []);
  const [ruleProposals, setRuleProposals] = useLocalStorage<RulesChangeLogEntry[]>("boxster.ruleProposals", []);

  const candidates = stored.seedVersion === SEED_VERSION ? stored.candidates : CANDIDATES;

  const updateCandidates = useCallback(
    (updater: (prev: Candidate[]) => Candidate[]) => {
      setStored((prev) => ({
        seedVersion: SEED_VERSION,
        candidates: updater(prev.seedVersion === SEED_VERSION ? prev.candidates : CANDIDATES),
      }));
    },
    [setStored],
  );

  const toggleCompare = useCallback(
    (id: string) => {
      setCompareIds((prev) => {
        if (prev.includes(id)) return prev.filter((c) => c !== id);
        if (prev.length >= MAX_COMPARE) return prev;
        return [...prev, id];
      });
    },
    [setCompareIds],
  );

  const addCandidateFeedback = useCallback(
    (candidateId: string, type: CandidateFeedbackType, note?: string) => {
      updateCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c;
          const entry: FeedbackEntry = {
            id: `${candidateId}-FB-${Date.now()}`,
            date: new Date().toISOString().slice(0, 10),
            type,
            note,
          };
          return { ...c, feedback: [entry, ...c.feedback] };
        }),
      );
    },
    [updateCandidates],
  );

  const addSourceFeedback = useCallback(
    (sourceId: string, type: SourceFeedbackType, note?: string, candidateId?: string) => {
      setSourceFeedback((prev) => [
        {
          id: `${sourceId}-SFB-${Date.now()}`,
          sourceId,
          candidateId,
          date: new Date().toISOString().slice(0, 10),
          type,
          note,
        },
        ...prev,
      ]);
    },
    [setSourceFeedback],
  );

  const setSellerQuestionStatus = useCallback(
    (candidateId: string, questionId: string, status: SellerQuestionStatus, answer?: string) => {
      updateCandidates((prev) =>
        prev.map((c) => {
          if (c.id !== candidateId) return c;
          return {
            ...c,
            sellerQuestions: c.sellerQuestions.map((q) =>
              q.id === questionId
                ? {
                    ...q,
                    status,
                    answer: answer ?? q.answer,
                    askedAt: status === "asked" ? new Date().toISOString().slice(0, 10) : q.askedAt,
                    answeredAt: status === "answered" ? new Date().toISOString().slice(0, 10) : q.answeredAt,
                  }
                : q,
            ),
          };
        }),
      );
    },
    [updateCandidates],
  );

  const addCandidate = useCallback(
    (input: NewCandidateInput) => {
      let newId = "";
      updateCandidates((prev) => {
        const maxNum = prev.reduce((max, c) => {
          const match = /^BX-(\d+)$/.exec(c.id);
          return match ? Math.max(max, Number(match[1])) : max;
        }, 0);
        newId = `BX-${String(maxNum + 1).padStart(3, "0")}`;
        const today = new Date().toISOString().slice(0, 10);
        const candidate = buildCandidate({
          id: newId,
          title: input.title,
          year: input.year,
          generation: input.generation,
          location: input.location,
          askPrice: input.askPrice,
          mileage: input.mileage,
          transmission: input.transmission,
          specification: input.specification,
          sellerType: input.sellerType,
          status: "New",
          risks: [],
          sellerQuestions: [],
          sourceId: "manual-entry",
          url: input.url,
          firstSeen: today,
          lastVerifiedAt: today,
          createdAt: today,
        });
        return [...prev, candidate];
      });
      return newId;
    },
    [updateCandidates],
  );

  const proposeRuleChange = useCallback(
    (summary: string, rationale: string) => {
      setRuleProposals((prev) => [
        {
          id: `RULES-PROPOSAL-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          version: `${CURRENT_RULES_VERSION}-proposed`,
          summary,
          rationale,
          proposedBy: "manual-review",
          status: "proposed",
        },
        ...prev,
      ]);
    },
    [setRuleProposals],
  );

  const resetData = useCallback(() => {
    setStored({ seedVersion: SEED_VERSION, candidates: CANDIDATES });
    setCompareIds([]);
  }, [setStored, setCompareIds]);

  const value = useMemo<AppDataValue>(
    () => ({
      candidates,
      sources: SOURCES,
      searchRuns: SEARCH_RUNS,
      rulesChangeLog: RULES_CHANGE_LOG,
      standingRules: STANDING_RULES,
      rulesVersion: CURRENT_RULES_VERSION,
      compareIds,
      toggleCompare,
      setCompareOrder: setCompareIds,
      isInCompare: (id: string) => compareIds.includes(id),
      canAddToCompare: compareIds.length < MAX_COMPARE,
      clearCompare: () => setCompareIds([]),
      addCandidateFeedback,
      setSellerQuestionStatus,
      addCandidate,
      resetData,
      sourceFeedback,
      addSourceFeedback,
      ruleProposals,
      proposeRuleChange,
    }),
    [
      candidates,
      compareIds,
      toggleCompare,
      addCandidateFeedback,
      setSellerQuestionStatus,
      addCandidate,
      resetData,
      setCompareIds,
      sourceFeedback,
      addSourceFeedback,
      ruleProposals,
      proposeRuleChange,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

// The provider and its colocated hook intentionally share one context module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAppData(): AppDataValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}

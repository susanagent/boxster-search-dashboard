# Data import / update path

This app's durable data lives as typed TypeScript modules in `src/data/`
(`candidates.ts`, `sources.ts`, `searchRuns.ts`, `rulesLog.ts`), built on the
shared shapes in `src/data/types.ts`. This document describes how a future
search run — automated or manual — should update that data.

## Why local TypeScript modules, not a database

The candidate set is small (currently 8, expected to stay in the dozens),
updates are infrequent (one search run at a time), and the canonical source
of truth is a pair of durable notes (Boxster Search, Candidate Ledger), not a
live external feed. A typed local data layer is the simplest thing that
satisfies "durable typed/local data structures" without adding a database,
server, or paid service. If/when search runs become fully automated and
frequent, promote `src/data/*.ts` to a JSON file (or SQLite) read at build or
runtime by the same types — the `Candidate`, `SearchRun`, `Source`, and
`RulesChangeLogEntry` shapes do not need to change.

## Status model

`CandidateStatus` uses the Candidate Ledger's canonical lifecycle states
verbatim (`New`, `Profiling`, `Qualified`, `Watchlist`, `Contact-ready`,
`PPI-ready`, `Rejected`, `Sold`, `Removed`, `Stale`) rather than the
Dashboard Specification's separate UI status list. Both documents describe
the same underlying lifecycle with different vocabularies; rather than invent
a lossy mapping between them, this app treats the ledger's states as the
single non-fabricated source of truth everywhere, and represents blocking
issues (the Spec's "Verify" concept — e.g. the BX-003 transmission conflict)
as a `RiskFlag` with `severity: "blocking"` instead of a tenth status value.
The decision queue and status pills surface blocking risks prominently
regardless of lifecycle status.

## Adding or updating a candidate from a new search run

1. **Deduplicate first.** If the listing has a VIN and it matches an existing
   `Candidate.vin`, update that candidate. Otherwise compare location, year,
   price, and mileage; if it looks like the same car re-listed, treat it as a
   probable match and record a reviewable note rather than auto-merging
   silently (this app does not yet have a UI for that review queue — add one
   before automating this step).
2. **Never fabricate.** Every `EvidenceFact` in `src/data/factCatalog.ts`
   should be present on the candidate; anything not explicitly stated by the
   listing/source stays `status: "unknown"`. Only mark `"confirmed"` when
   backed by a document (invoice, PPI, Carfax/title record), `"claimed"` for
   an unverified seller/dealer statement, `"inferred"` for a computed value
   (e.g. distance), and `"contradicted"` when two sources disagree.
3. **Append, don't overwrite, history.** Push a new `PriceObservation` onto
   `priceHistory` and a new `ListingOccurrence` onto `listings` (or update
   `lastCheckedAt`/`active` on an existing occurrence) instead of mutating
   past records.
4. **Recompute, don't hand-set, score and confidence.** Call
   `computeScore`/`computeConfidence` (`src/data/scoring.ts`) after facts
   change — both are pure functions of structured fields + evidence status,
   so they can't silently drift from the underlying evidence.
5. **Update `lastVerifiedAt`.**

## Recording a search run

Append a `SearchRun` to `src/data/searchRuns.ts` with `sourcesAttempted` /
`sourcesSucceeded` / `sourcesFailed`, the new/updated/duplicate/stale/rejected
counts, and an `events` timeline. Leave `listingsScanned`/`durationMinutes`
undefined if genuinely not tracked yet rather than guessing.

For each attempted source, also update `src/data/sources.ts` with measurable outcomes when known: listings scanned, active detail pages verified, unique candidates, promoted candidates, qualified candidates, duplicates, stale/false positives, blocked checks, zero-result checks, manual-match rate, evidence completeness, geographic yield, and useful-price range. Discovery aggregators and search snippets must point to a verified origin/detail page before promotion.

## Search-gap and import-health checks

After each run, identify useful gaps in the active inventory and generate targeted next-run queries by changing only the missing dimension (source, geography, price, generation, or transmission lane). Recheck promising watch/rejected vehicles when their price or evidence changes.

Before committing an import, verify that the canonical ledger count, `CANDIDATES.length`, candidate ID set, and rendered dashboard count agree. Run typecheck, tests, and build so malformed source metrics or candidate changes cannot silently hide records.

## Proposing a rule change

Search rules (`src/data/rulesLog.ts`) must not change silently. If a search
run or seller/PPI evidence suggests a rule should change (e.g. widening the
price band), add a `RulesChangeLogEntry` with `status: "proposed"` and a
`rationale`, surfaced in the Feedback / Rules view for review — only flip it
to `"approved"` once a person confirms it.

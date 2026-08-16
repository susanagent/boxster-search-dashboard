# Porsche Boxster Search Dashboard — Build Brief

Build a production-quality MVP in this directory.

Read these canonical sources in full before making product decisions:

- `/Users/agent_susan/Documents/Agent Knowledge Base/20-Compiled Wiki/Porsche Boxster Search.md`
- `/Users/agent_susan/Documents/Agent Knowledge Base/20-Compiled Wiki/Porsche Boxster Candidate Ledger.md`
- `/Users/agent_susan/Documents/Agent Knowledge Base/20-Compiled Wiki/Porsche Boxster Dashboard Specification.md`

Implement the evidence-first Driver's Logbook / Precision Workshop direction, seeded with the five canonical candidates. Provide responsive behavior at 375, 768, 1024, and 1440 pixels and accessible dashboard, candidate ledger/detail, comparison, search-runs, sources, and feedback/rules views. Keep scores separate from confidence and distinguish seller claims, verified facts, inferences, unknowns, and contradictions. Include durable typed/local data structures and a documented import/update path for future automated search runs. Never fabricate missing facts.

Use a sensible maintainable local web stack with no unnecessary paid services. Test proportionately with lint, typecheck, relevant tests, and a production build. Do not deploy, publish, contact sellers, or spend money.

## Execution safeguards

Work in bounded milestones and execute each milestone before expanding the next:

1. Inspect this directory and canonical sources.
2. Immediately create a minimal runnable scaffold and install dependencies.
3. Run an early typecheck/build checkpoint.
4. Implement the typed data layer and five canonical candidates; verify again.
5. Implement the required views incrementally.
6. Run accessibility/responsive review and final verification.
7. Review the diff and report files, commands/results, run instructions, risks, and decisions.

Do not spend extended time producing an exhaustive internal architecture plan before writing files. Prefer small verified increments. Use macOS-compatible commands and do not assume GNU utilities such as `timeout` are installed. If one optional tool is unavailable, record it and continue with the remaining verification rather than stalling.

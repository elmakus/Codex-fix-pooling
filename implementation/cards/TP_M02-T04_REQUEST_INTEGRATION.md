# TP_M02-T04 — Integrate pruning across initial and retry request construction

- Decision state: `ACCEPTED`
- Execution status: `PLANNED`
- Executor: `null`
- Milestone: `TP_M02`
- Priority: `HIGH`
- Complexity: `HIGH`
- Phase: `implementation`

## Dependencies

- `TP_M02-T03`

## Expected code locations

- `codex-rs/core/src/session/turn.rs`
- focused pruning module from T02/T03
- `codex-rs/core/tests/suite/` and/or focused session tests

## Canonical sources

- Requirements: R3, R7, R8, R13, R19
- TP_M01 T01/T02 request-path evidence
- Execution Prep: `implementation/evidence/TP_M02_EXECUTION_PREP.md`

## OpenSpec

- Required/candidate: `required`
- Change: `openspec/changes/tp-m02-tool-output-pruning/`

## Outcome

Apply one pruning policy point to every ordinary sampling attempt, including regenerated retry input, while proving canonical history remains unchanged by pruning.

## Scope

### Included

- invoke pruning inside the current `run_sampling_request` loop immediately after initial/regenerated prompt input selection;
- invoke it before executed-tool metadata attachment / `build_prompt` unless refreshed source proves an equivalent safer ordering;
- use the active validated feature/policy config;
- cover first request and retry reconstruction from `sess.clone_history().await.for_prompt(...)`;
- expose/capture internal result only as needed for deterministic tests/evidence;
- canonical-history snapshot preservation tests.

### Excluded

- compaction behavior changes;
- retry policy/network changes;
- provider API changes;
- Community runtime integration;
- TP_M03 behavioral model smoke tests.

## Constraints

- do not add a second request construction path;
- do not transform canonical `ContextManager`;
- retries cannot bypass pruning or protections;
- disabled/inert policy must preserve stock request content;
- upstream compaction/recovery remains separate.

## Acceptance

- first sampling attempt applies pruning exactly once when armed;
- regenerated retry input applies the same policy again;
- protected/eligible decisions do not differ merely because input was regenerated;
- disabled/inert feature request content stays stock-equivalent;
- canonical history snapshot before/after request preparation is unchanged by pruning;
- executed-tool metadata/request validity remains correct;
- no infinite/repeated destructive transformation is introduced across retries.

## Required tests / checks

- integration test for initial request;
- forced retry/regenerated-input test;
- disabled control;
- canonical-history before/after snapshot/assertion;
- request structural validity/pairing check;
- affected core format/check/tests.

## External write/readback needs

Project Git only; read back patch/evidence state before DONE.

## Independent review

`RECOMMENDED` — this card establishes the non-destructive boundary and retry coverage that prevent canonical-history loss or pruning bypass. Final integrated TP_M02 review remains REQUIRED.

## Refresh Gate

Re-read the exact current `run_sampling_request` loop, request regeneration and metadata attachment order immediately before coding. If request construction has materially moved, reconcile implementation design before mutation; strategic contract drift blocks the card.

## Result

- result_commit:
- result_pr:
- evidence:
- tests_summary:

## Definition of Done

- [ ] Included scope complete
- [ ] Acceptance satisfied
- [ ] Required tests/checks executed
- [ ] Tests green or authorized exception recorded
- [ ] Relevant OpenSpec satisfied
- [ ] No hidden blocker
- [ ] Result durable in Git
- [ ] Task Board reconciled
- [ ] Executor/result pointers recorded
- [ ] Evidence identifies exact verification
- [ ] Material external writes read back/verified where required
- [ ] No unassigned TODO in accepted scope

# TP_M02-T03 — Implement bounded request-payload pruning core

- Decision state: `ACCEPTED`
- Execution status: `PLANNED`
- Executor: `null`
- Milestone: `TP_M02`
- Priority: `HIGH`
- Complexity: `HIGH`
- Phase: `implementation`

## Dependencies

- `TP_M02-T02`

## Expected code locations

- focused core pruning module, expected `codex-rs/core/src/tool_output_prune.rs`
- current `context_manager::estimate_item_token_count` estimator seam
- focused core unit tests

## Canonical sources

- Requirements: R3, R4, R5, R7, R13, R19
- TP_M01 safety: `implementation/evidence/TP_M01-T03_SAFETY_CONTRACT.md`
- TP_M01 benchmark contract: `implementation/evidence/TP_M01-T04_BENCHMARK_AND_REGRESSION_MATRIX.md`
- Execution Prep: `implementation/evidence/TP_M02_EXECUTION_PREP.md`

## OpenSpec

- Required/candidate: `required`
- Change: `openspec/changes/tp-m02-tool-output-pruning/`

## Outcome

Implement the pure request-vector transformation that applies recency, newest-output protection and minimum-benefit semantics to T02-classified outputs, with deterministic observability and no session/history mutation.

## Scope

### Included

- newest-to-oldest scan with user-turn boundaries;
- minimum recency floor of two user-input boundaries, allowing only more conservative configured values;
- whole-output newest protected eligible-token budget;
- reuse current model-visible item token estimation;
- replacement-aware net-savings calculation;
- strict `net_savings > minimum_savings_tokens` gate;
- stable replacement marker `[Old tool result content cleared]`;
- preserve call/tool/success/structural metadata;
- deterministic `PruneResult` summary for tests/provenance;
- fail closed on estimator/accounting ambiguity/overflow.

### Excluded

- integration into `run_sampling_request`;
- canonical history mutation;
- provider/model calls;
- TP_M03 effectiveness/quality acceptance;
- final production threshold selection.

## Constraints

- classifier protection from T02 is authoritative;
- outputs are never partially split merely to hit protection budget;
- below-minimum behavior returns request content unchanged;
- no new tokenizer/accounting system;
- transformation must be pure with respect to session storage.

## Acceptance

- recent region stays intact;
- newest eligible output content remains intact through configured protection budget;
- older eligible output is replaced only when net savings exceeds minimum;
- below gate yields unchanged vector;
- standard/custom candidates obey identical threshold semantics;
- replacement preserves required metadata;
- estimator ambiguity returns unchanged vector;
- `PruneResult` exposes enough deterministic decision evidence for OpenSpec/R19 tests.

## Required tests / checks

Unit/property-style cases covering recency boundaries, whole-item protected budget boundaries, candidate ordering, replacement overhead, strict minimum gate, metadata preservation, standard/custom parity, no-candidate control and estimator/fail-closed paths; formatting/check for affected crates.

## External write/readback needs

Project Git only; read back patch/evidence state before DONE.

## Independent review

`RECOMMENDED` — this card contains the central pruning algorithm and token-safety gates. Final integrated TP_M02 review remains REQUIRED.

## Refresh Gate

Reconcile current user-turn boundary helper and item-estimator semantics, T02 classifier contract and OpenSpec before coding. Material estimator/context architecture drift blocks stale implementation.

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

# TP_M02-T05 — Complete R19 semantic/regression suite

- Decision state: `ACCEPTED`
- Execution status: `PLANNED`
- Executor: `null`
- Milestone: `TP_M02`
- Priority: `HIGH`
- Complexity: `HIGH`
- Phase: `verification`

## Dependencies

- `TP_M02-T04`

## Expected code locations

- pruning module unit tests
- relevant feature/config tests
- `codex-rs/core/tests/suite/`
- request-budget/fixture test support only if needed for deterministic observability

## Canonical sources

- Requirements: R3-R8, R19
- TP_M01 safety: `implementation/evidence/TP_M01-T03_SAFETY_CONTRACT.md`
- TP_M01 regression matrix: `implementation/evidence/TP_M01-T04_BENCHMARK_AND_REGRESSION_MATRIX.md`
- Execution Prep: `implementation/evidence/TP_M02_EXECUTION_PREP.md`

## OpenSpec

- Required/candidate: `required`
- Change: `openspec/changes/tp-m02-tool-output-pruning/`

## Outcome

Produce the complete deterministic TP_M02 semantic/regression evidence required by R19 and the JIT OpenSpec, without crossing into TP_M03 model-quality/effectiveness acceptance.

## Scope

### Included

Complete executable coverage for:

- feature disabled unchanged;
- incomplete/invalid policy fail-closed unchanged;
- current/recent user-turn protection;
- newest protected-output budget;
- old eligible successful standard output positive case;
- equivalent custom output positive case;
- below-minimum unchanged;
- failed standard/custom retained;
- `success == None` retained;
- `apply_patch` retained under current identity representations;
- unknown/unallowlisted tool retained;
- missing/ambiguous pairing retained;
- structured/media retained;
- `ToolSearchOutput` retained;
- standard/custom policy parity;
- replacement metadata/structural validity;
- canonical-history preservation;
- retry/regenerated input coverage;
- estimator ambiguity fail-closed;
- no-eligible-output control;
- request-level observable token estimate showing the positive fixture actually reduces the derived request after replacement overhead.

### Excluded

- live/stochastic model continuation tests Q1-Q8;
- selecting final production thresholds;
- proving material business/effectiveness benefit across benchmark distribution;
- Desktop/app-server compatibility.

## Constraints

- hard safety failures veto card completion regardless of observed token savings;
- test fixtures must be deterministic and identical-history where comparing enabled/disabled;
- historical 40k/20k may be tested explicitly as provenance anchors but cannot be silently promoted to defaults;
- no production/runtime mutation.

## Acceptance

- every OpenSpec section 13 / R19 case has a named passing test or explicit evidence-backed non-applicability;
- positive standard/custom fixture demonstrates actual derived-request reduction using current request accounting;
- all protection/control cases are unchanged where required;
- exact test commands and results are durable;
- no untested newly encountered output variant is made eligible.

## Required tests / checks

- complete focused pruning/config/session test set;
- appropriate affected-crate test suite(s);
- formatting/check/lint required by the established T00 lane;
- deterministic enabled/disabled request-estimate assertion on at least one positive fixture;
- Git diff/status and patch-carrier provenance readback.

## External write/readback needs

Project Git only; read back exact tests/evidence/patch state before DONE.

## Independent review

Focused card review is `RECOMMENDED` if test gaps or newly discovered output classes materially change the safety matrix. Integrated TP_M02 milestone review is REQUIRED regardless.

## Refresh Gate

Reconcile actual implemented behavior, current source variants, OpenSpec and T03/T04 result evidence before running/closing the suite. Any missing mandatory scenario creates corrective work rather than silently reducing R19 scope.

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

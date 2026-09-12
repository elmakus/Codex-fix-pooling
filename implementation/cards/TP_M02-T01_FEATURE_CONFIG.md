# TP_M02-T01 — Add opt-in feature and fail-closed pruning policy config

- Decision state: `ACCEPTED`
- Execution status: `PLANNED`
- Executor: `null`
- Milestone: `TP_M02`
- Priority: `HIGH`
- Complexity: `MEDIUM`
- Phase: `implementation`

## Dependencies

- `TP_M02-T00`

## Expected code locations

- `codex-rs/features/src/lib.rs`
- `codex-rs/features/src/feature_configs.rs`
- current core config/schema integration files as required by existing patterns
- relevant features/config unit tests

## Canonical sources

- Requirements: R4, R5, R8, R13, R19
- Master Plan: TP_M02
- TP_M01 safety contract: `implementation/evidence/TP_M01-T03_SAFETY_CONTRACT.md`
- Execution Prep: `implementation/evidence/TP_M02_EXECUTION_PREP.md`

## OpenSpec

- Required/candidate: `required`
- Change: `openspec/changes/tp-m02-tool-output-pruning/`

## Outcome

Provide an explicit off-by-default pruning feature plus validated policy configuration without yet changing request payloads.

## Scope

### Included

- register the pruning feature through current feature infrastructure;
- feature disabled by default;
- typed configuration for explicit replayable tool identities, `protected_recent_tokens`, `minimum_savings_tokens`, and user-turn floor;
- reject/disable invalid policy values;
- enforce user-turn floor >= 2;
- enabled feature without complete valid policy remains inert/fail-closed;
- config/schema tests.

### Excluded

- output classification logic;
- request transformation;
- retry integration;
- selecting final production thresholds;
- Community/Desktop settings UI or updater behavior.

## Constraints

- do not hardcode historical 40k/20k as implicit production defaults;
- config must use existing Codex feature/config patterns;
- no second config subsystem;
- no request behavior changes in this card.

## Acceptance

- default/disabled configuration produces no active pruning policy;
- explicit valid config resolves deterministically;
- missing/partial/invalid config cannot arm pruning;
- recency floor cannot be set below 2;
- historical 40k/20k can be supplied explicitly in tests but are not implicit defaults;
- config/schema behavior is covered by focused tests.

## Required tests / checks

- affected feature/config crate unit tests;
- schema/config parsing tests for disabled/default, valid and invalid cases;
- formatting/check for affected crates;
- patch diff review proving no request payload transform was introduced yet.

## External write/readback needs

Project Git only; read back patch carrier state and test evidence before DONE.

## Refresh Gate

Reconcile exact upstream source, current feature/config patterns, OpenSpec and T00 lane evidence before coding. Material feature/config architecture drift blocks stale implementation.

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

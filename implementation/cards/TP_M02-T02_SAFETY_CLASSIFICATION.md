# TP_M02-T02 — Implement fail-closed output classification and identity pairing

- Decision state: `ACCEPTED`
- Execution status: `PLANNED`
- Executor: `null`
- Milestone: `TP_M02`
- Priority: `HIGH`
- Complexity: `HIGH`
- Phase: `implementation`

## Dependencies

- `TP_M02-T01`

## Expected code locations

- new focused core pruning module, expected `codex-rs/core/src/tool_output_prune.rs`
- module wiring in current core crate
- current protocol `ResponseItem` model consumed but not changed unless strictly required
- focused core unit tests

## Canonical sources

- Requirements: R6, R7, R13, R19
- TP_M01 safety evidence: `implementation/evidence/TP_M01-T03_SAFETY_CONTRACT.md`
- TP_M01 acceptance: `implementation/evidence/TP_M01_ACCEPTANCE.md`
- Execution Prep: `implementation/evidence/TP_M02_EXECUTION_PREP.md`

## OpenSpec

- Required/candidate: `required`
- Change: `openspec/changes/tp-m02-tool-output-pruning/`

## Outcome

Create the pure fail-closed classifier/pairing foundation that can distinguish mandatory protected evidence from explicitly eligible replayable text output without changing outbound requests yet.

## Scope

### Included

- trusted request-local call/output identity recovery for standard/custom outputs;
- same semantic eligibility policy for standard/custom variants;
- explicit replayable-tool allowlist/config consumption;
- protection for failed outputs and `success == None`;
- mandatory `apply_patch` protection from output metadata or paired call identity;
- fail-closed handling for unknown tool names, new/unhandled output variants, malformed/missing/ambiguous pairing;
- structured/media protection;
- `ToolSearchOutput` protection;
- deterministic classification/protection reasons for tests/observability.

### Excluded

- recency/newest-token/minimum-benefit calculation;
- replacing payloads;
- sampling-request integration;
- broad automatic classification of shell commands by command text.

## Constraints

- protection always overrides allowlisting;
- there is no catch-all `success=true => eligible` rule;
- do not rely on historical standard-only call mapping;
- do not mutate canonical history or request items in this card.

## Acceptance

- explicitly allowlisted, successful, text-only standard/custom outputs can classify as potentially eligible;
- equivalent standard/custom cases classify consistently;
- failures, unknown success, apply_patch, unallowlisted/unknown tools, malformed pairing, structured/media and ToolSearch classify protected;
- contradictory/ambiguous identity fails closed;
- current custom-tool apply_patch representation is covered by a test;
- deterministic classification reason is assertable.

## Required tests / checks

Focused unit tests for each protected/eligible class plus standard/custom parity; affected crate format/check; regression against current `ResponseItem` variants.

## External write/readback needs

Project Git only; read back patch/evidence state before DONE.

## Independent review

`RECOMMENDED` — this card implements the core evidence-protection boundary and identity recovery used by all later pruning decisions. Final integrated TP_M02 review remains REQUIRED.

## Refresh Gate

Reconcile current `ResponseItem` variants, success metadata, apply_patch representation, pairing/normalization behavior and OpenSpec immediately before coding. New/uncovered output classes must default protected rather than expanding scope silently.

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

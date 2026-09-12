# M02-T02 Evidence — OpenSpec feature/settings/provenance contract

Date: 2026-09-12
Executor: ChatGPT
OpenSpec change: `openspec/changes/custom-codex-runtime-m02`
Input seam: candidate-tree replacement of `resources/codex` from M02-T01.

## Refresh / consistency review

Reviewed against:
- M02-T01 runtime-selection evidence;
- requirements R1/R2/R3/R6/R7/R8/R10/R11/R12/R13;
- Master Plan frozen architecture and M02 acceptance;
- workflow OpenSpec contract;
- current Community feature/update-builder model carried from M01.

The only durable-state mismatch at start was that Task Board had T02 `ready` while the card file still said `planned`. It was reconciled to `in_progress` before specification work. No material architecture drift or strategic contradiction was found.

## Frozen contract

The active OpenSpec freezes:

1. feature id `custom-codex-runtime`, disabled by default;
2. controlled source/build settings, with no free-form arbitrary binary path or shell command as the trust mechanism;
3. exact official package identity and original stock `resources/codex` identity captured before substitution;
4. exact custom source/upstream/patch-or-equivalence/build/toolchain/result provenance;
5. three-state compatibility gate: PASS / FAIL / UNKNOWN;
6. PASS-only replacement of candidate-tree `resources/codex`;
7. FAIL and UNKNOWN reject the custom-enabled candidate;
8. no normal live-tree overwrite and no second updater;
9. feature disabled means stock reconstruction from the verified official payload with original `resources/codex` untouched;
10. previous-managed-package rollback remains separate and unchanged;
11. any new official package tuple or stock runtime digest invalidates previous PASS;
12. explicit runtime overrides must be diagnosed so package-level authority is not falsely claimed;
13. diagnostics must make package, stock runtime, custom runtime, gate state and final candidate identity recoverable.

## Scope discipline

The spec deliberately does not close:
- M03 R4/R14 wakeup behavior verification;
- M04 complete Desktop/app-server integration acceptance;
- M05 changed-baseline updater persistence and refresh acceptance;
- production install/deployment.

The M02 spec permits a controlled PASS fixture to prove gate/package mechanics, but requires it to be labeled as such rather than as production compatibility authorization.

## Downstream mapping

`tasks.md` maps implementation work to:
- M02-T03: controlled carrier + reproducible runtime provenance;
- M02-T04: feature implementation + fail-closed candidate substitution;
- M02-T05: package-level verification + rollback readiness.

M03-M05 responsibilities are explicitly deferred rather than absorbed into M02.

## Acceptance review

GREEN.

Configuration/provenance fields are testable, enabled/disabled behavior is unambiguous, FAIL/UNKNOWN prohibit custom substitution, official verification remains prerequisite, stock restoration and rollback are distinct and explicit, and no implementation code or external runtime mutation was performed in this card.

# Proposal — custom-codex-runtime M02

## Why

M02 must freeze the behavior and package contract for an opt-in custom Codex runtime before implementation. M02-T01 proved that a single `CODEX_CLI_PATH` override is not universal on the current Community baseline because the native remote-mobile cold-start path independently resolves `$CODEX_LINUX_APP_DIR/resources/codex`. The M02 substitution seam is therefore candidate-tree replacement of `resources/codex` after verification and compatibility PASS.

## What changes

Introduce a Community feature named `custom-codex-runtime`, disabled by default, whose enabled package-build path may replace only the candidate tree's `resources/codex` after:

1. the official OpenAI Linux package has passed the existing verification path;
2. the exact official package and original bundled runtime identity have been captured;
3. the custom source/build provenance is complete;
4. the required compatibility gate returns PASS.

FAIL or UNKNOWN prevents custom runtime substitution. The feature must never perform a normal post-install overwrite of the active application tree.

Disabling the feature rebuilds from the verified official payload and leaves its original `resources/codex` untouched. Existing Community candidate construction, atomic promotion, journal recovery and previous-managed-package rollback remain authoritative.

## Scope boundaries

This change owns M02 feature configuration, provenance, candidate substitution, fail-closed package behavior, stock restoration and package-level diagnostics.

It does not claim:
- strict R4 background wakeup behavior verification (M03);
- complete Desktop/app-server integration acceptance (M04);
- changed-official-baseline updater persistence acceptance (M05);
- production installation or live-tree mutation.

## Affected requirements

Primary: R1, R2, R3, R6, R7, R8, R10, R11, R12, R13.

Related but verified later: R4/R14 in M03, R15 in M04, R5/R9/R16 in M05.

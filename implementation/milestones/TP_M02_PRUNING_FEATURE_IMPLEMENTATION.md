# TP_M02 — Pruning feature implementation

- Execution status: `BLOCKED`
- Preparation status: `COMPLETE`
- Required prior checkpoint: `TP_M01_DISCOVERY_GREEN`
- Branch: `tool-output-pruning`
- Execution policy: `chatgpt_only`
- Strategy: `REIMPLEMENT_EQUIVALENT_BEHAVIOR`
- Refreshed upstream base: `openai/codex@53ff712a48379ce8df605e292afd6046ca88ae9b`
- Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- Official Linux package baseline: `26.908.40834`
- Active OpenSpec: `openspec/changes/tp-m02-tool-output-pruning/`
- Execution Prep evidence: `implementation/evidence/TP_M02_EXECUTION_PREP.md`
- Blocking capability evidence: `implementation/blockers/TP_M02_CAPABILITY_GATE.md`
- Target checkpoint after future GREEN acceptance: `TP_M02_PATCH_GREEN`

## Outcome

Implement the minimal current-baseline request-time tool-output pruning capability on an owned project patch carrier while preserving canonical history and the accepted fail-closed safety contract.

TP_M02 implementation has **not** started. This milestone is blocked only by the current lack of a normal-ChatGPT-accessible Rust/Cargo compile/test lane.

## Accepted refreshed inputs

- Fresh upstream drift from accepted `944d6fd1...` to `53ff712a...` is one direct-child TUI-only commit; relevant core request seam blob is unchanged.
- `NOT_EQUIVALENT` remains valid.
- `REIMPLEMENT_EQUIVALENT_BEHAVIOR` remains valid.
- Community/package baseline has not drifted.
- JIT OpenSpec is coherent and limited to TP_M02.

## Required cards

1. `TP_M02-T00 — Establish verifiable exact-upstream Rust patch/test lane` — BLOCKED
2. `TP_M02-T01 — Add opt-in feature and fail-closed pruning policy config` — PLANNED
3. `TP_M02-T02 — Implement fail-closed output classification and identity pairing` — PLANNED
4. `TP_M02-T03 — Implement bounded request-payload pruning core` — PLANNED
5. `TP_M02-T04 — Integrate pruning across initial and retry request construction` — PLANNED
6. `TP_M02-T05 — Complete R19 semantic/regression suite` — PLANNED
7. `TP_M02-T06 — Freeze patch provenance and integrated acceptance package` — PLANNED

All later cards depend transitively on T00. No card containing pruning behavior may become READY until T00 is DONE.

## Implementation boundary

Expected upstream code seams after T00 establishes the executable patch carrier:

- `codex-rs/features/src/lib.rs`
- `codex-rs/features/src/feature_configs.rs`
- current config/schema files as required by existing patterns
- new focused `codex-rs/core/src/tool_output_prune.rs`
- `codex-rs/core/src/session/turn.rs`
- `codex-rs/core/src/context_manager/history.rs` estimator seam (reuse, not duplicate)
- `codex-rs/core/src/guardian/request_budget.rs` request-estimator seam for tests/provenance as needed
- `codex-rs/core/tests/suite/` and relevant feature/config unit tests

## Acceptance

TP_M02 may reach `TP_M02_PATCH_GREEN` only when:

- feature disabled leaves request construction stock-equivalent for tool-output content;
- feature enabled with valid policy prunes only explicitly eligible old output;
- mandatory protected categories remain intact;
- canonical history remains unchanged by normal pruning;
- initial and regenerated retry requests apply the same policy;
- all R19 semantic tests pass;
- exact upstream base and project patch/change provenance are recorded;
- integrated fresh independent milestone acceptance review is GREEN.

TP_M03 effectiveness/quality acceptance is not part of TP_M02 completion.

## Independent review

**REQUIRED at integrated milestone acceptance.**

Rationale: the feature intentionally suppresses model-visible evidence and implements a protection boundary around failure, mutation and durability-sensitive output. Review must be performed in a fresh normal ChatGPT chat from durable branch/spec/test evidence, not executor narrative.

## Current blocker

See `implementation/blockers/TP_M02_CAPABILITY_GATE.md`.

The executing session must have Rust/Cargo and exact-source test capability, or an equivalent project CI lane that ChatGPT can invoke and read back. Under `chatgpt_only`, do not route to Codex and do not change policy automatically.

## Stop boundary of this prep

No pruning code, patch file, build artifact, custom runtime, Community source change, installation or deployment was produced.

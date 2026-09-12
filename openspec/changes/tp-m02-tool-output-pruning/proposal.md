# TP_M02 Tool Output Pruning — Proposal

Status: `BEST_EFFORT STATIC PATCH AUTHORING / DOWNSTREAM CODEX VALIDATION PENDING`
Milestone: `TP_M02 — Tool-output pruning patch`
Required prior checkpoint: `TP_M01_DISCOVERY_GREEN`
Current exact upstream base: `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
Current Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
Community package baseline: `26.908.40834`
Historical behavior provenance: `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`
Strategy: `REIMPLEMENT_EQUIVALENT_BEHAVIOR`

## Why

TP_M01 established and independently accepted `NOT_EQUIVALENT`: current official Codex has several context-reduction mechanisms but not the required request-time old-tool-output pruning contract as a semantic whole. TP_M02 therefore carries a minimal current-architecture reimplementation.

The prior execution-prep requirement for a local Rust/Cargo validation lane has been superseded as an authoring blocker. The current strategy deliberately produces a `BEST_EFFORT / STATICALLY_REVIEWED / UNCOMPILED / UNTESTED` patch for Codex to inspect, adapt, build, test and integrate later.

## Product decision — always on

Pruning is intentionally unconditional in the patched runtime.

TP_M02 MUST NOT add:

- a feature flag;
- `/experimental` integration;
- a config enable/disable setting;
- a config schema solely for pruning activation;
- a runtime off path.

Historical `Feature::ToolOutputPrune` / `Stage::Experimental` / `default_enabled: false` is provenance only and is not reproduced.

## What

TP_M02 implements only the bounded Codex-side request transform:

- operate on derived `Vec<ResponseItem>` request input;
- run inside every `run_sampling_request` loop attempt after first/regenerated input materialization and before executed-tool metadata attachment / `build_prompt`;
- preserve canonical `ContextManager` history;
- fail closed for failures, unknown success, unknown/ambiguous pairing, mutation evidence, structured/media content, `ToolSearchOutput` and unknown/new variants;
- require two user-input boundaries before age eligibility;
- retain a newest otherwise-eligible token budget;
- require meaningful replacement-aware net savings;
- replace whole eligible output bodies with `[Old tool result content cleared]` while preserving structural metadata;
- use current Codex item-token estimation rather than a second accounting subsystem;
- prepare unexecuted semantic tests and exact downstream handoff.

## Initial positive eligibility policy

Only `exec_command` can become eligible, and only when its JSON `cmd` is statically classified as one simple read-only command from the bounded list frozen in the patch/evidence. `exec_command` is not globally disposable. Unknown, composed, redirecting, mutating or execution-extending command forms are protected.

The initial constants are compile-time policy:

- `40_000` estimated tokens newest otherwise-eligible protection target;
- `20_000` estimated aggregate net-savings minimum;
- `2` user-input boundaries.

These remain conservative provenance-based starting values, not a claim of benchmark optimality.

## Patch package

Canonical patch-series pointer: `implementation/patches/TP_M02_SERIES.md`.

Static review: `implementation/evidence/TP_M02_STATIC_REVIEW.md`.
Prepared tests: `implementation/evidence/TP_M02_PREPARED_TESTS.md`.
Fresh exact source freeze: `implementation/evidence/TP_M02_REFRESH_BASELINE.md`.

## Out of scope for this ChatGPT session

- modifying `openai/codex`, `tekacs/codex` or `ilysenko/codex-desktop-linux`;
- local compile/test/build;
- CE update/install/deployment;
- custom runtime installation;
- final runtime GREEN;
- TP_M03;
- unrelated context-management redesign.

Downstream Codex may later inspect the current CE update/build/install mechanism and attempt controlled integration only under the durable handoff and with rollback preserved.

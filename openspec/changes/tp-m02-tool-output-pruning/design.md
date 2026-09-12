# TP_M02 Tool Output Pruning — Design

## Baseline reconciliation

Refresh Gate source baseline: `openai/codex@53ff712a48379ce8df605e292afd6046ca88ae9b`.

This commit is the direct child of TP_M01's accepted `944d6fd1ba4baab69dbedd205282dc72ec20abb5`. Its diff is confined to TUI agent-overview model grouping; the core `codex-rs/core/src/session/turn.rs` blob is unchanged. Community remains `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676` / official package `26.908.40834`.

Therefore the TP_M01 semantic `NOT_EQUIVALENT` verdict, safety contract and `REIMPLEMENT_EQUIVALENT_BEHAVIOR` strategy remain applicable after bounded Refresh Gate reconciliation.

## Current source seams

### Request construction and retry

Current `codex-rs/core/src/session/turn.rs`:

- `run_turn` derives `sampling_request_input` from `sess.clone_history().await.for_prompt(...)`;
- `run_sampling_request` uses that initial vector on the first attempt;
- on retry, `run_sampling_request` re-clones canonical history and calls `for_prompt(...)` again;
- executed-tool-call metadata is then attached;
- `build_prompt` receives the resulting vector.

Design: apply one pruning helper inside the `run_sampling_request` loop immediately after initial/regenerated `prompt_input` selection and before executed-tool metadata attachment / `build_prompt`. This avoids a second context-management system and guarantees identical policy placement on initial and retry requests.

### Canonical history boundary

`ContextManager` remains canonical in-memory history. `for_prompt` creates the model-facing vector. The pruning API therefore operates on a derived vector/slice and returns an owned transformed vector/result; it receives no mutable `ContextManager` reference.

### Response/output model

Relevant current variants remain:

- `FunctionCall` / `FunctionCallOutput`;
- `CustomToolCall` / `CustomToolCallOutput`;
- `ToolSearchCall` / `ToolSearchOutput`.

Standard/custom output payloads carry success metadata and can be text or structured content. `ToolSearchOutput` is protected in TP_M02.

### Pairing and tool identity

The classifier builds request-local trusted identity information from call items and output metadata. It must reject ambiguous/malformed pairing. Current source/tests confirm `apply_patch` can use custom-tool representation, so protection must inspect both current output metadata and paired call identity rather than assume a standard-function-only path.

### Token accounting

Policy-level per-item estimation should reuse `codex-rs/core/src/context_manager/history.rs::estimate_item_token_count` (re-exported by `context_manager`). Request-level verification/provenance tests may reuse `codex-rs/core/src/guardian/request_budget.rs::estimate_request_tokens` or the same underlying request-accounting path where visibility requires a small test-oriented extraction.

No second tokenizer/accounting subsystem should be introduced.

### Feature/config seam

Current feature registry is `codex-rs/features/src/lib.rs`; typed feature configuration patterns live in `codex-rs/features/src/feature_configs.rs`, with core config/schema integration where required. TP_M02 should follow those existing patterns rather than add an independent settings mechanism.

The feature is off by default. To avoid inventing final product thresholds, an enabled feature without complete valid pruning policy remains inert/fail-closed. Initial policy configuration supplies explicit replayable tool identities, recent protection budget and minimum savings; user-turn recency cannot be configured below the accepted safety floor of two boundaries.

## Proposed module boundary

Add one focused core module, expected as `codex-rs/core/src/tool_output_prune.rs` (exact module wiring may follow current crate conventions).

Suggested internal API shape, not a frozen Rust signature:

- input: derived `Vec<ResponseItem>` or borrowed slice + validated policy;
- output: transformed `Vec<ResponseItem>` plus `PruneResult`/summary;
- pure with respect to session/canonical history;
- no I/O, no rollout writes, no global mutable state.

Logical stages:

1. validate/resolve active policy;
2. build trusted call/tool identity map;
3. scan newest-to-oldest with user-turn boundaries;
4. classify each relevant output fail-closed;
5. account newest protected eligible-output budget;
6. collect older eligible candidates;
7. compute replacement-aware net savings;
8. if minimum benefit is not exceeded, return original input unchanged;
9. otherwise clone/replace only selected payloads while preserving metadata;
10. return deterministic summary.

## Patch carrier

The project workflow prefers one project repository. TP_M02 therefore uses an owned **patch carrier in this repository**, not a new project repository/fork unless a later explicit topology decision changes that.

Durable target shape after coding begins:

- exact upstream base SHA recorded: `53ff712a48379ce8df605e292afd6046ca88ae9b`;
- pruning changes represented as isolated reproducible patch/change material under this project repository (exact path finalized by the capability-lane card);
- test worktree/checkout may be ephemeral and based exactly on the upstream SHA;
- no write to `openai/codex`, `tekacs/codex` or `ilysenko/codex-desktop-linux`;
- provenance records the resulting patch/change commit(s) and tested source identity.

## Test placement

Expected layers:

1. core module unit tests for classification, thresholds, recency, replacement and fail-closed behavior;
2. current config/features tests for disabled/default/validation semantics;
3. `codex-rs/core/tests/suite/` integration tests for initial request, retry regeneration and canonical-history preservation where private unit seams are insufficient;
4. request-estimator assertions for observable savings/provenance, without performing TP_M03 effectiveness acceptance.

## Independent review

Because this feature deliberately suppresses model-visible evidence and defines a safety/protection boundary around failures and mutation evidence, integrated TP_M02 milestone acceptance requires a fresh independent normal ChatGPT review before `TP_M02_PATCH_GREEN`.

Individual implementation cards may receive recommended focused review, but the required gate is the integrated intended-final implementation state after all R19 tests are green.

## Capability blocker

The current preparation session has Git/GitHub access but no `cargo`, `rustc`, `rustup`, Docker or Podman executable. Under `chatgpt_only`, coding cannot start until a normal ChatGPT session has a verifiable Rust execution/test lane or an equivalent repository CI path that ChatGPT can trigger and read back. This is execution capability state, not a change to the approved pruning architecture.

# TP_M02 Execution Prep Evidence

Date: 2026-09-12
Branch: `tool-output-pruning`
Start HEAD: `91366ae4a0a2060f7e26662e19201159aa15a46b`
Required checkpoint: `TP_M01_DISCOVERY_GREEN`
Execution policy: `chatgpt_only`

## Verdict

**PREPARED / CODING BLOCKED BY CAPABILITY GATE**

The Refresh Gate and OpenSpec reconciliation are GREEN. The implementation package is bounded and strategically coherent. Coding cannot start in the current normal ChatGPT session because no Rust/Cargo or equivalent verifiable test lane is available. Corrective card `TP_M02-T00` owns that blocker.

No pruning implementation, upstream repository mutation, Community mutation, custom runtime build/install/substitution, deployment or TP_M03 work occurred.

## Workflow inputs refreshed

Current workflow `main` was read using progressive disclosure, including:

- `CHATGPT.md`;
- `workflow/CONTEXT_ROUTING.md`;
- `workflow/EXECUTION_PREP.md`;
- `workflow/EXECUTION.md`;
- `workflow/REVIEW_AND_HANDOFF.md`;
- `workflow/chatgpt/CAPABILITY_GATE.md`;
- `workflow/contracts/PROJECT_REPOSITORY.md`;
- `workflow/contracts/GITHUB_STATE.md`;
- `workflow/contracts/TASK_CARDS.md`;
- `workflow/contracts/OPENSPEC.md`.

## Durable TP_M01 inputs verified

Canonical evidence, not only handoff narrative, was re-read:

- `project-handoffs/TP_M01_HANDOFF.md`;
- `PROJECT.md`;
- `planning/MASTER_PLAN.md`;
- `requirements/REQUIREMENTS.md`;
- `implementation/TASK_BOARD.yaml`;
- `implementation/milestones/TP_M01_CURRENT_BASELINE_PRUNING_DISCOVERY.md`;
- `implementation/evidence/TP_M01_ACCEPTANCE.md`;
- T01-T05 canonical evidence files.

Start branch HEAD matched the expected `91366ae4a0a2060f7e26662e19201159aa15a46b` before prep writes.

## Refresh Gate

### Official Codex source

Accepted TP_M01 source baseline:

`openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`

Fresh `main`:

`openai/codex@53ff712a48379ce8df605e292afd6046ca88ae9b`

Drift classification: **BOUNDED / NON-MATERIAL TO TP_M02 CONTRACT**.

Evidence:

- `53ff712a...` is the direct child of `944d6fd1...`;
- commit purpose is TUI agent command-center model grouping;
- changed files are in `codex-rs/tui/src/app/agents_overview_*`;
- `codex-rs/core/src/session/turn.rs` has the same blob SHA (`777dc8963b86e9ff1f8047edb19747c479e1d0fc`) at both accepted and refreshed source refs;
- current request materialization/retry seams therefore remain the accepted TP_M01 seams.

No evidence of a new semantically equivalent pruning mechanism was introduced by this one-commit drift.

### Community Desktop

Fresh `ilysenko/codex-desktop-linux:main` remains exactly:

`249cd4b64d42434f51417fec4a318750d461b676`

Official package baseline remains `26.908.40834` from the accepted Community commit/evidence.

### Refresh verdict

**GREEN**

Accepted `NOT_EQUIVALENT` remains valid for the refreshed source state because the only upstream delta is TUI-only and the relevant core blob is unchanged. The accepted safety contract remains current. `REIMPLEMENT_EQUIVALENT_BEHAVIOR` remains the correct strategy.

The exact bundled `resources/codex` -> upstream source-SHA mapping is still not claimed and remains a later Desktop compatibility concern, not a TP_M02 source-implementation blocker.

## Current exact source seams

### Request construction

`codex-rs/core/src/session/turn.rs`:

1. `run_turn` clones canonical history and calls `for_prompt(...)` to materialize `sampling_request_input`;
2. `run_sampling_request` consumes the initial vector on the first sampling attempt;
3. on a retry, it calls `sess.clone_history().await.for_prompt(...)` again;
4. it attaches executed-tool-call metadata;
5. it calls `build_prompt`.

Implementation placement: apply the pruning transform inside the `run_sampling_request` loop immediately after selecting/materializing `prompt_input` and before metadata attachment / `build_prompt`. This single point covers initial and regenerated retry requests.

### Canonical history boundary

`ContextManager` remains canonical history; `for_prompt` creates the derived model-facing vector. The pruning core must operate only on that derived vector and must not receive mutable canonical history.

### Response classes / safety inputs

Current classes relevant to TP_M02 remain `FunctionCallOutput`, `CustomToolCallOutput`, and `ToolSearchOutput`. Standard/custom payloads carry optional success and can contain structured content. Current source/tests still demonstrate custom-tool `apply_patch`, so mandatory protection must use current identity metadata/pairing, not a historical standard-only assumption.

### Token accounting

- policy item estimation: `codex-rs/core/src/context_manager/history.rs::estimate_item_token_count`;
- request-level test/provenance estimate: `codex-rs/core/src/guardian/request_budget.rs::estimate_request_tokens` or the same request-accounting path if a small test visibility extraction is required.

No separate tokenizer/accounting subsystem is justified.

### Feature/config

Use the current registry/config patterns in:

- `codex-rs/features/src/lib.rs`;
- `codex-rs/features/src/feature_configs.rs`;
- current core config/schema integration as required.

The TP_M02 feature stays off by default. Enabling without complete valid pruning policy is inert/fail-closed. Final production token thresholds are not selected in TP_M02 prep.

## Minimal architecture

One focused request-time pruning core, expected at `codex-rs/core/src/tool_output_prune.rs`, should:

- validate policy;
- recover trusted current-request tool identity/pairing;
- fail closed on unknown/ambiguous/unsupported content;
- protect mandatory evidence categories;
- enforce >=2 user-boundary recency floor;
- protect a configured newest eligible-output token budget;
- require replacement-aware net savings to exceed configured minimum;
- replace only eligible text payloads while preserving item metadata;
- return deterministic internal `PruneResult` observability;
- remain pure with respect to canonical history/session storage.

Eligibility uses an explicit replayable-tool identity set. No newly encountered successful tool becomes eligible automatically. Mandatory protections override allowlisting.

## Patch carrier decision

To preserve the workflow's one-project/one-repository topology, TP_M02 will use a project-owned patch carrier in `elmakus/Codex-fix-pooling` against exact upstream base `53ff712a...`, with an ephemeral exact-upstream checkout/worktree for compile/tests when the capability lane exists. No second project repository/fork is created by prep.

The exact durable patch-series path is finalized by T00 before behavior coding.

## JIT OpenSpec

Active change:

`openspec/changes/tp-m02-tool-output-pruning/`

Files:

- `proposal.md`;
- `specs/tool-output-pruning.md`;
- `design.md`;
- `tasks.md`.

Scope is limited to TP_M02 behavior/config/testing. Community package/updater/runtime-selection contracts remain outside this change.

## Task ordering

1. `TP_M02-T00` — establish verifiable exact-upstream Rust patch/test lane — **BLOCKED** in this session.
2. `TP_M02-T01` — add opt-in feature and fail-closed policy config.
3. `TP_M02-T02` — implement fail-closed output classification and identity pairing.
4. `TP_M02-T03` — implement request-payload pruning core: recency, newest budget, minimum benefit, observability.
5. `TP_M02-T04` — integrate one policy point across initial and retry/regenerated request construction; prove canonical-history preservation.
6. `TP_M02-T05` — complete R19 semantic/regression suite.
7. `TP_M02-T06` — freeze exact patch provenance and integrated TP_M02 acceptance package.

All implementation cards depend transitively on T00. None is started by this prep session.

## Independent review

Integrated TP_M02 milestone acceptance: **REQUIRED** in a fresh normal ChatGPT chat before `TP_M02_PATCH_GREEN` because pruning deliberately suppresses model-visible evidence and implements a material safety/protection boundary for failures and mutation evidence.

Focused review is marked `RECOMMENDED` on the safety-classifier/core/integration cards. It does not replace the required integrated final review.

## Capability Gate

Current command probe:

```text
git=git version 2.47.3
cargo=
rustc=
rustup=
docker=
podman=
```

Verdict: **BLOCKED FOR CODING** under `chatgpt_only`.

Durable blocker: `implementation/blockers/TP_M02_CAPABILITY_GATE.md`.

No executor fallback is authorized. T00 must first establish a normal-ChatGPT-accessible Rust/Cargo execution lane or equivalent triggerable/readable CI path.

## Requirement coverage

- R3 canonical/request-time invariant: OpenSpec + T03/T04/T05.
- R4 recent protection: OpenSpec + T03/T05.
- R5 minimum benefit: OpenSpec + T03/T05.
- R6 safety protections: OpenSpec + T02/T05.
- R7 standard/custom parity: OpenSpec + T02/T03/T05.
- R8 explicit feature control: T01/T05.
- R19 patch-level semantic tests: T05.
- R14 implementation provenance relevant to TP_M02: T06 (full runtime/build provenance remains later when a runtime artifact exists).

## Stop boundary

Preparation stops before the first implementation write. No source patch is created in this session.

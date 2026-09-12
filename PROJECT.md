# Codex Fix Pooling — Tool Output Pruning workstream

Repository: `elmakus/Codex-fix-pooling`
Branch: `tool-output-pruning`

## Current state

- phase: TP_M02 execution preparation complete; implementation not started
- goal: deliver a maintainable opt-in integration of request-time tool-output pruning for ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`), based on behavior introduced by `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`
- status: `TP_M02 — Pruning feature implementation` is prepared but `BLOCKED` before coding by the current ChatGPT-session Rust/Cargo test-capability gate
- execution_policy: chatgpt_only
- required prior checkpoint: `TP_M01_DISCOVERY_GREEN` (logical checkpoint)
- TP_M02 preparation start HEAD: `91366ae4a0a2060f7e26662e19201159aa15a46b`

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan: `planning/MASTER_PLAN.md`
- current milestone: `implementation/milestones/TP_M02_PRUNING_FEATURE_IMPLEMENTATION.md`
- task board: `implementation/TASK_BOARD.yaml`
- TP_M02 Execution Prep evidence: `implementation/evidence/TP_M02_EXECUTION_PREP.md`
- current blocker: `implementation/blockers/TP_M02_CAPABILITY_GATE.md`
- latest cumulative handoff: `project-handoffs/TP_M01_HANDOFF.md`
- active OpenSpec change: `openspec/changes/tp-m02-tool-output-pruning/`

## Fresh Capability / Refresh Gate state

### Capability Gate

Verdict: `BLOCKED FOR CODING` under `chatgpt_only`.

The preparation session has Git/GitHub read/write/readback, but no `cargo`, `rustc`, `rustup`, Docker or Podman and no established equivalent project Rust CI lane. TP_M02-T00 is the bounded corrective card; do not route to Codex or change policy automatically.

### Refresh Gate

Verdict: `GREEN` after bounded reconciliation.

- refreshed official source: `openai/codex@53ff712a48379ce8df605e292afd6046ca88ae9b`
- previous accepted source: `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- relationship: refreshed SHA is the direct child of accepted SHA
- drift: TUI agent command-center model grouping only; relevant `codex-rs/core/src/session/turn.rs` blob remains exactly unchanged
- refreshed Community source: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676` (unchanged)
- official Linux package baseline: `26.908.40834` (unchanged from accepted Community evidence)

Therefore accepted `NOT_EQUIVALENT`, the TP_M01 safety contract and `REIMPLEMENT_EQUIVALENT_BEHAVIOR` remain current.

## TP_M02 OpenSpec contract

Active change: `openspec/changes/tp-m02-tool-output-pruning/`.

It freezes only TP_M02 behavior/config/testing:

- explicit off-by-default feature control;
- enabled-with-incomplete-policy => fail-closed no-prune;
- request-time transformation of derived prompt input only;
- canonical history remains unchanged by pruning;
- only explicitly configured replayable tool identities can become eligible;
- failures, unknown success, `apply_patch`/mutation evidence, unknown/new/unclassifiable classes, malformed/ambiguous pairing, structured/media, `ToolSearchOutput`, recent region and newest protected budget remain protected;
- standard/custom semantic parity;
- >=2 user-boundary recency floor;
- configurable newest protected-output budget and minimum net-savings gate;
- historical 40k/20k are anchors, not implicit production defaults;
- initial and retry/regenerated requests use the same policy;
- deterministic internal pruning observability for R19/provenance tests.

Community updater/package/runtime-selection contracts remain outside TP_M02.

## Current implementation design

Current exact request seam on `53ff712a...`:

`ContextManager clone -> for_prompt(...) -> run_sampling_request loop -> initial/regenerated prompt_input -> executed-tool metadata -> build_prompt`

The intended pruning integration point is inside the `run_sampling_request` loop after prompt input is selected/materialized and before metadata attachment / `build_prompt`. This covers first and retry requests without mutating canonical history and avoids creating a second context-management system.

Current accounting/config seams:

- item token estimate: `codex-rs/core/src/context_manager/history.rs::estimate_item_token_count`
- request estimate for tests/provenance: `codex-rs/core/src/guardian/request_budget.rs::estimate_request_tokens`
- feature registry: `codex-rs/features/src/lib.rs`
- typed feature config: `codex-rs/features/src/feature_configs.rs`

Patch-carrier direction: keep an owned exact-upstream-based patch carrier in this project repository, with an ephemeral exact-source checkout/worktree for compile/tests once T00 establishes the execution lane. Do not create a second project repository/fork without explicit topology authority.

## TP_M02 Task Cards

Ordered durable cards:

1. `TP_M02-T00_RUST_PATCH_TEST_LANE.md` — BLOCKED corrective capability card
2. `TP_M02-T01_FEATURE_CONFIG.md` — PLANNED
3. `TP_M02-T02_SAFETY_CLASSIFICATION.md` — PLANNED
4. `TP_M02-T03_PRUNING_CORE.md` — PLANNED
5. `TP_M02-T04_REQUEST_INTEGRATION.md` — PLANNED
6. `TP_M02-T05_R19_REGRESSION.md` — PLANNED
7. `TP_M02-T06_PROVENANCE_ACCEPTANCE.md` — PLANNED

All coding cards depend transitively on T00. No implementation card is READY while the capability blocker remains.

## Independent review

Integrated TP_M02 milestone acceptance requires a fresh independent normal ChatGPT review before `TP_M02_PATCH_GREEN`, because pruning deliberately suppresses model-visible evidence and implements a material failure/mutation-evidence protection boundary.

Focused review is recommended for T02-T04; it does not replace the required integrated final review.

## TP_M01 accepted results retained

- checkpoint: `TP_M01_DISCOVERY_GREEN`
- TP_M01 acceptance: `implementation/evidence/TP_M01_ACCEPTANCE.md`
- upstream equivalence verdict: `NOT_EQUIVALENT`
- safety posture: unknown/ambiguous/durability-sensitive outputs fail closed and remain protected
- canonical-history invariant: normal pruning transforms derived request payload only
- retry/regenerated request inputs receive the same policy
- `ToolSearchOutput` protected initially
- historical `40k protected / 20k minimum` values are benchmark anchors only
- strategy: `REIMPLEMENT_EQUIVALENT_BEHAVIOR`
- exact public bundled `resources/codex` -> `openai/codex` source-SHA mapping remains unavailable and must not be guessed

## Prohibited / not started

- no pruning implementation exists yet;
- no writes to `openai/codex`, `tekacs/codex` or `ilysenko/codex-desktop-linux`;
- no custom runtime build/install/substitution;
- no production/local deployment;
- no TP_M03 work;
- no ChatGPT Work;
- no Codex delegation.

## Exact next durable step

Resolve/execute `implementation/cards/TP_M02-T00_RUST_PATCH_TEST_LANE.md` in a normal ChatGPT session that can provide a verifiable Rust/Cargo execution lane (or equivalent triggerable/readable project CI). T00 must not write pruning behavior. After T00 is DONE, `TP_M02-T01` becomes the first pruning implementation card.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

# Master Plan — Tool Output Pruning for ChatGPT Community

## 1. Goal

Deliver a maintainable, opt-in Codex runtime capability for ChatGPT Community for Linux that reduces repeated request-context cost from old, large tool outputs while preserving task continuity, diagnostic value, package provenance and Desktop/runtime compatibility.

Reference behavior comes from `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213` (`core: add request-time tool output pruning`).

This workstream is independent from the background-exec wakeup/polling fix. Shared delivery infrastructure may be reused later, but behavior contracts and acceptance remain separate.

## 2. Verified baseline

### Historical pruning patch

The reference patch:

- adds request-time pruning before sampling rather than destructively rewriting canonical rollout/history;
- is guarded by `Feature::ToolOutputPrune`;
- protects recent tool-output content using a `40_000` token budget;
- only rewrites candidates when more than `20_000` eligible tokens can be removed;
- replaces removed content with `[Old tool result content cleared]`;
- protects failed function-call outputs;
- explicitly protects `apply_patch` outputs;
- handles both standard and custom tool-call outputs;
- avoids considering outputs from the most recent user-turn region.

These details are the historical behavioral baseline, not automatically frozen product constants for current Codex.

### Current upstream freshness note

As of research on 2026-09-12, code search against current `openai/codex` did not find the historical `tool_output_prune` marker or exact replacement marker. Therefore the historical implementation has not simply landed unchanged.

M01 must still perform a strict equivalence audit against the exact current official bundled/runtime baseline because upstream may now implement equivalent context reduction through another mechanism.

### ChatGPT Community delivery boundary

The wakeup workstream already established that `ilysenko/codex-desktop-linux` uses the verified official OpenAI Linux package as its baseline, carries bundled `resources/codex`, supports opt-in Linux features and preserves selected feature configuration across native updater rebuilds.

That architecture is reusable context, but this branch must independently verify any current facts it relies on before implementation.

## 3. Target state

An independently controlled pruning capability that:

1. starts from the exact current official Desktop/bundled Codex baseline;
2. detects whether equivalent upstream behavior already exists;
3. when still needed, refreshes/reimplements only the pruning behavior rather than consuming the entire `tekacs/custom-cli` stack;
4. keeps pruning explicitly feature-controlled;
5. proves measurable context/token reduction on representative tool-heavy histories;
6. proves acceptable continuation/diagnostic behavior after pruning;
7. selects the custom runtime only after compatibility and pruning-safety gates pass;
8. re-runs those gates after every relevant upstream/Desktop refresh;
9. can be disabled or retired independently from the wakeup patch.

## 4. Frozen architecture decisions

### A1 — Separate behavior contract
Tool-output pruning is an independent capability. Shared packaging/runtime-selection infrastructure does not merge its acceptance criteria with background-exec wakeup.

### A2 — Do not import the whole custom stack
Do not consume `tekacs/custom-cli` wholesale. Carry only explicitly approved pruning-related changes and unavoidable dependencies.

### A3 — Behavior over historical diff
`d70b903` is provenance and reference semantics. If current Codex architecture has changed, a behaviorally equivalent reimplementation is preferred over forcing an unsafe cherry-pick.

### A4 — Request-time, non-destructive intent
Normal pruning should alter model-request payload construction, not erase canonical conversation/rollout history merely to reduce request size.

### A5 — Safety classification required
Old tool output is not assumed disposable. Protected categories and threshold policy require current-baseline evidence and regression tests.

### A6 — Effectiveness must be measurable
The project will not carry custom divergence solely because the patch compiles. It must demonstrate material context/token reduction.

### A7 — Compatibility before runtime selection
The same fail-closed custom-runtime compatibility principle applies: unknown Desktop/runtime compatibility prohibits substitution.

### A8 — Upstream-first retirement
If current official Codex proves functionally equivalent and sufficiently safe/effective, retire the custom pruning divergence.

### A9 — Generic runtime delivery boundary
Prefer reusing the generic `custom-codex-runtime` delivery mechanism established by the sibling workstream rather than designing a second package replacement system.

## 5. Non-goals

- Importing unrelated `tekacs/custom-cli` patches.
- Treating pruning as a substitute for polling/wakeup improvements.
- Permanently pinning to `d70b903`.
- Arbitrarily truncating all tool output.
- Destructively mutating canonical history solely for savings.
- Tuning server-side account/model behavior.

## 6. Global invariants

- Exact current upstream/Desktop/runtime identity must be known before patch refresh or compatibility claims.
- Canonical history preservation semantics must be explicit and tested.
- Protected-output policy must be evidence-backed for the current tool model.
- Thresholds are baseline-relative configuration/design decisions, not sacred historical constants.
- Effectiveness and quality are both acceptance dimensions; optimizing only one is insufficient.
- Failed/unknown compatibility or pruning-safety verdicts fail closed.
- Each new official runtime baseline requires an upstream-equivalence check before carrying custom divergence forward.
- Pruning provenance must be recoverable from durable build/test evidence.
- The capability must remain independently disableable and retireable.

## 7. Known source seams

Historical patch seams:

- `codex-rs/core/src/session/turn.rs` around sampling request construction;
- `codex-rs/core/src/tool_output_prune.rs` in the reference implementation;
- feature registration/config schema for `ToolOutputPrune`;
- response item types for standard/custom tool outputs;
- token-estimation utilities used by request-context accounting.

Current exact seams must be rediscovered during M01 because upstream architecture may have moved.

Likely Community integration seams remain the generic custom-runtime feature/build selection path, official `resources/codex`, update-builder/update-manager persistence and runtime compatibility gate.

## 8. Milestones

### M01 — Current-baseline pruning discovery

Outcome: establish whether custom pruning is still needed and define the exact current behavior/safety/effectiveness contract before implementation.

Work includes:

- pin exact current `openai/codex`, `ilysenko/codex-desktop-linux` and official bundled Codex baseline identities relevant to this workstream;
- inspect current upstream context manager, request construction, tool-output truncation/pruning, compaction and token-budget logic;
- issue a strict equivalence verdict for `d70b903` behavior on the exact tested baseline;
- map current standard/custom tool output types and identify durability-sensitive tool classes;
- analyze the historical 40k protection / 20k minimum thresholds against current context-window/accounting behavior;
- define non-destructive history invariant and observable request-time pruning semantics;
- define measurable effectiveness criteria and representative benchmark fixtures;
- define quality/regression matrix covering continuation, failures, patch evidence and interaction with current compaction/context-management;
- determine whether direct rebase, adapted reimplementation or no custom patch is the correct M02 path;
- refresh the shared custom-runtime compatibility/delivery assumptions needed by this branch.

Acceptance:

- exact tested baselines are recorded;
- upstream equivalence verdict is explicit: `EQUIVALENT`, `NOT_EQUIVALENT`, or `UNKNOWN`, with `UNKNOWN` blocking implementation selection;
- current request/context/tool-output architecture is evidence-backed;
- protected-output policy candidate is documented with rationale;
- threshold decision inputs are documented without prematurely freezing numbers;
- canonical-history vs request-payload semantics are explicit;
- effectiveness benchmark and quality/regression acceptance matrix are defined;
- M02 implementation strategy has one evidence-backed path or an explicit blocker;
- no pruning implementation has been started.

Checkpoint: `TP_M01_DISCOVERY_GREEN`.

### M02 — Pruning feature implementation

Outcome: implement the minimal current-baseline pruning capability in a controlled Codex patch carrier when M01 proves custom divergence is still required.

Work includes:

- feature/config gating;
- request-time pruning implementation against current response-item architecture;
- protected-output classification;
- threshold/config behavior selected from M01 evidence;
- provenance/build identity;
- unit/property/regression tests for pruning semantics.

Acceptance:

- feature disabled leaves request construction unchanged;
- feature enabled prunes only eligible old output according to the approved contract;
- canonical history remains consistent with the approved invariant;
- all R19 semantic tests pass;
- exact patch provenance is recorded.

Checkpoint: `TP_M02_PATCH_GREEN`.

### M03 — Effectiveness and quality validation

Outcome: prove the patch is worth carrying and does not create unacceptable reasoning/diagnostic regressions.

Work includes paired disabled/enabled benchmark fixtures on identical histories, token/context measurement, long-session continuation checks, diagnostic failure retention, patch evidence retention and interaction with current compaction behavior.

Acceptance:

- pruning demonstrates the M01-defined material context reduction threshold;
- continuation/regression matrix passes;
- any known quality trade-offs are bounded and documented;
- feature is rejected/retired if benefits do not justify divergence.

Checkpoint: `TP_M03_EFFECTIVENESS_GREEN`.

### M04 — Community Desktop integration

Outcome: prove a pruning-capable custom Codex runtime works with ChatGPT Community through the generic runtime-delivery boundary without production mutation.

Work includes current Desktop/app-server compatibility gate, controlled package artifact, startup/session initialization, ordinary tool workflow, pruning-enabled workflow and feature-disable fallback.

Acceptance:

- Desktop/runtime compatibility passes for the exact tested package;
- pruning remains independently controllable;
- stock-runtime fallback/disable path works;
- no unrelated custom stack is required.

Checkpoint: `TP_M04_DESKTOP_GREEN`.

### M05 — Update refresh and retirement lifecycle

Outcome: prove pruning does not become a stale permanent fork obligation.

Work includes updater feature-state persistence, new baseline equivalence check, patch refresh/reimplementation gate, safety/effectiveness rerun and rollback/retirement behavior.

Acceptance:

- a controlled baseline refresh re-runs all required gates;
- stale pruning runtime is never silently reused;
- upstream equivalence can retire custom divergence cleanly;
- failed refresh preserves the previous known-good package/runtime.

Checkpoint: `TP_M05_UPDATE_GREEN`.

### M06 — Consolidation with sibling runtime patches

Outcome: decide whether pruning and background-exec wakeup should ship in one maintained custom runtime artifact while remaining independently traceable, testable and retireable.

This milestone must not be interpreted as approval to merge behavior contracts. Consolidation is packaging/maintenance only.

Acceptance:

- shared vs independent runtime-artifact decision is recorded;
- each capability has independent provenance and acceptance evidence;
- enabling/disabling/retiring one capability does not silently change the other's contract;
- final maintenance model is documented.

Checkpoint: `TP_M06_CONSOLIDATION_GREEN`.

## 9. Requirement coverage

- R1, R2 → M01 + M06
- R3–R8 → M01 + M02
- R9, R10, R20, R21 → M01 + M03
- R11 → M01 + M05
- R12–R15 → M01 + M04 + M05
- R16–R18 → M04 + M05
- R19 → M02
- R22 → M04
- R23 → M05

Before execution of any milestone, its owned requirements must be decomposed into Task Cards according to the current Project Workflow.

## 10. Verification strategy

Verification layers:

1. exact baseline/source identity;
2. upstream equivalence audit;
3. request-time semantic/unit tests;
4. canonical-history preservation tests;
5. protected-output classification/regression tests;
6. paired context/token effectiveness benchmark;
7. continuation/quality smoke matrix;
8. Desktop/app-server compatibility and package integration;
9. update refresh/retirement scenario;
10. final combined-runtime maintenance decision.

## 11. Deployment strategy

No production deployment is part of planning. Implementation and validation use controlled branches/artifacts. Any later production install requires explicit approval after M04/M05 evidence.

## 12. OpenSpec policy

M01 is discovery and does not require OpenSpec. Re-evaluate immediately before M02. If pruning configuration, threshold semantics, persisted feature settings or cross-package updater behavior form durable external contracts, create the minimal OpenSpec required by the current workflow.

## 13. Task decomposition policy

Do not reuse the wakeup workstream's inherited M01 Task Cards. After a GREEN pre-implementation audit, prepare fresh pruning-specific M01 cards only.

Later milestones remain outcome-specific until their Refresh Gate confirms the current source/runtime seams.

## 14. Fresh-context boundaries

Each milestone begins from its accepted prior GREEN checkpoint and freshly verified upstream/runtime state. Historical patch internals are reference evidence, not authority over newer source structure.

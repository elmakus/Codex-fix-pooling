# Research — request-time tool output pruning

## Research question

Should `tekacs/codex` request-time tool-output pruning be carried as a separate custom Codex runtime patch for ChatGPT Community for Linux, and what behavior must be preserved before implementation is planned?

## Source patch

Authoritative source commit:

- repository: `tekacs/codex`
- commit: `d70b903a4edbbb02c5009ae8e6194f2128d80213`
- title: `core: add request-time tool output pruning`

The patch is independent from the background-exec wakeup commit `9ffcf8db9078eae43d4111ff94259795c1e962c9` even though both appear in the author's broader `custom-cli` stack.

## Verified behavior from the patch

The patch adds a feature-gated transformation immediately before a model sampling request. It does not delete rollout/history state on disk; it derives a pruned request payload from the in-memory response-item list.

Observed constants and policy in the source patch:

- `PRUNE_MINIMUM_TOKENS = 20_000`
- `PRUNE_PROTECT_TOKENS = 40_000`
- replacement marker: `[Old tool result content cleared]`
- pruning is gated by `Feature::ToolOutputPrune`
- the newest tool-output budget is protected first;
- pruning candidates are collected only after at least two user turns have been encountered while scanning backwards;
- failed function-call outputs (`success == Some(false)`) are protected;
- `apply_patch` outputs are explicitly protected;
- pruning occurs only when total candidate content exceeds the minimum pruning threshold;
- both standard `FunctionCallOutput` and `CustomToolCallOutput` are handled.

The intended effect is to reduce repeated transmission of old, large tool results to the model while keeping recent and semantically important tool results available.

## What the patch does not prove by itself

The source patch alone does not establish:

- actual token savings under ChatGPT Desktop workloads;
- absence of quality regressions for long-running coding sessions;
- whether current upstream OpenAI Codex has introduced an equivalent but differently named mechanism;
- whether the constants are appropriate for the current model/context-window behavior;
- whether all tool classes that should be protected remain covered as Codex evolves;
- whether Desktop/app-server requires any special integration beyond selecting a compatible patched Codex runtime.

## Current upstream observation — 2026-09-12

Code search against current `openai/codex` did not find `tool_output_prune` or the exact replacement marker used by the patch. This is evidence that the exact implementation has not simply landed unchanged upstream.

This is not sufficient for a strict equivalence verdict. Before implementation, the project must inspect current upstream context-management, truncation, compaction and tool-output handling to determine whether equivalent behavior now exists under a different design.

## Relationship to the background-exec wakeup workstream

The two patches address different causes of context/token waste:

- background-exec wakeup reduces unnecessary polling turns while waiting for long-running commands;
- request-time tool-output pruning reduces repeated transmission of older large tool results in later model requests.

They may eventually be carried by the same generic `custom-codex-runtime` delivery mechanism, but they require separate behavior contracts, acceptance tests and upstream-equivalence checks.

The `tool-output-pruning` branch therefore treats pruning as an independent workstream. It must not assume that wakeup-fix cards, evidence or acceptance automatically satisfy pruning requirements.

## Architecture candidates

### A — Independent patch module on a controlled Codex fork

Maintain the pruning patch as an independently traceable commit/change set on an owned Codex fork, rebased only onto a verified compatible upstream baseline.

Advantages:
- clean provenance;
- patch can be enabled/retired independently from wakeup;
- compatibility and regression testing can target pruning directly.

### B — Consume `tekacs/custom-cli` wholesale

Not recommended as the default. That branch contains unrelated patches and downstream-specific changes. Consuming the full stack would enlarge the trusted/maintenance surface without evidence that all changes are wanted.

### C — Reimplement equivalent behavior after upstream refresh

Potentially preferable if current Codex architecture has moved enough that a direct cherry-pick is no longer appropriate. Behavioral equivalence should matter more than preserving the exact historical diff.

## Recommended planning direction

Use the same generic custom-runtime delivery boundary envisioned for the wakeup workstream, but model tool-output pruning as an independent optional patch capability.

Before implementation:

1. establish the exact current official bundled Codex baseline used by ChatGPT Community;
2. audit current upstream context-management/tool-output code for equivalent behavior;
3. define the pruning behavior contract independent of implementation details;
4. validate safety/protection rules and threshold semantics against current source;
5. define measurable effectiveness and regression tests;
6. decide whether the historical patch can be rebased directly or should be reimplemented against current architecture.

## Open questions

- Is request-time pruning already functionally covered by newer upstream context-management or compaction logic?
- Should thresholds remain fixed constants or become configuration/feature settings?
- Which current tools require explicit protection beyond `apply_patch` and failed outputs?
- Should pruning preserve metadata about removed output size/type for diagnostics?
- What minimum measurable context/token reduction is required to justify carrying the patch?
- Can the pruning feature be safely combined with the wakeup patch in one custom runtime artifact while keeping both independently testable and retireable?

# TP_M02 Tool Output Pruning — Proposal

Status: JIT execution-preparation contract
Milestone: `TP_M02 — Pruning feature implementation`
Required prior checkpoint: `TP_M01_DISCOVERY_GREEN`
Current refreshed upstream source baseline: `openai/codex@53ff712a48379ce8df605e292afd6046ca88ae9b`
Historical behavior provenance: `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`
Strategy: `REIMPLEMENT_EQUIVALENT_BEHAVIOR`

## Why

TP_M01 established that the current official Codex baseline does not provide the required request-time old-tool-output pruning behavior as a semantic whole. TP_M02 therefore needs a minimal current-architecture implementation that reduces repeated model-request context while preserving diagnostic, mutation and durability-sensitive evidence.

The implementation contract is safety-sensitive because removing model-visible tool output can change later reasoning. The change must therefore be explicit, request-time only, fail closed, testable on initial and regenerated retry requests, and non-destructive to canonical history.

## What

TP_M02 will implement only the Codex-side pruning behavior needed by R3-R8 and R19:

- an explicit opt-in feature/config control;
- a pure/bounded transformation of derived `Vec<ResponseItem>` request input;
- explicit protected and eligible output classification;
- recent-turn and newest-output protection;
- minimum-benefit gating;
- standard/custom output parity;
- the same policy on initial and retry/regenerated sampling requests;
- observable pruning results sufficient for deterministic semantic/provenance tests;
- exact upstream/change provenance.

## Safety posture

Eligibility is proven, not assumed. The initial implementation only considers explicitly configured/classified replayable tool names and text-only successful standard/custom outputs. Mandatory protected categories always win over allowlisting. Unknown, ambiguous, malformed, structured/media, failed, discovery/capability and mutation-sensitive evidence remains intact.

No historical token constant is promoted to a production default by this OpenSpec. `40_000` protected tokens and `20_000` minimum removable tokens remain benchmark/provenance anchors only.

## Current implementation boundary

The refreshed `openai/codex@53ff712a...` keeps the accepted TP_M01 core request seam unchanged from `944d6fd1...`: `run_turn` materializes prompt input from `ContextManager::for_prompt`, and `run_sampling_request` regenerates prompt input from canonical history on retry before `build_prompt`.

The intended integration point is therefore inside the `run_sampling_request` request loop, after the current request input has been selected/materialized and before executed-tool metadata attachment / `build_prompt`. One policy application at that point covers both initial and regenerated retry inputs without mutating `ContextManager`.

## Out of scope

- ChatGPT Community package/updater/runtime-selection behavior (TP_M04/TP_M05);
- production install or runtime substitution;
- TP_M03 effectiveness/quality acceptance beyond the observability required to test TP_M02 semantics;
- importing unrelated `tekacs/custom-cli` changes;
- destructive canonical-history compaction/rewrite as a pruning mechanism;
- selecting final production threshold values from the historical 40k/20k anchors.

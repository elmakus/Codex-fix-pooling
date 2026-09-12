# Codex Fix Pooling — Tool Output Pruning workstream

Repository: `elmakus/Codex-fix-pooling`
Branch: `tool-output-pruning`

## Current state

- phase: TP_M01 complete; TP_M02 not started
- goal: deliver a maintainable opt-in integration of request-time tool-output pruning for ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`), based on the behavior introduced by `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`
- status: `TP_M01 — Current-baseline pruning discovery` is GREEN after required fresh independent review; pruning implementation has not started
- execution_policy: chatgpt_only
- TP_M01 checkpoint: `TP_M01_DISCOVERY_GREEN` (logical checkpoint; no pushed Git tag is claimed because the active GitHub connector exposes no tag-creation action)
- TP_M01 reviewed implementation/discovery head: `506c7f38bd4d71aeb0be50d0d70b8922b8ca4e60`

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan: `planning/MASTER_PLAN.md`
- completed milestone: `TP_M01 — Current-baseline pruning discovery`
- milestone file: `implementation/milestones/TP_M01_CURRENT_BASELINE_PRUNING_DISCOVERY.md`
- task board: `implementation/TASK_BOARD.yaml`
- TP_M01 acceptance: `implementation/evidence/TP_M01_ACCEPTANCE.md`
- latest cumulative handoff: `project-handoffs/TP_M01_HANDOFF.md`
- active OpenSpec changes: none

## TP_M01 accepted results

- official source baseline: `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux package baseline: `26.908.40834`
- upstream pruning-equivalence verdict: `NOT_EQUIVALENT`
- safety policy: unknown/ambiguous/durability-sensitive outputs fail closed and remain protected
- canonical-history invariant: normal pruning transforms derived request payload only; canonical history is not destroyed for savings
- retries/regenerated request inputs must receive the same pruning policy
- `ToolSearchOutput` is protected in the initial implementation
- historical `40k protected / 20k minimum` values are benchmark anchors, not frozen constants
- effectiveness contract: paired identical-history request-token measurement plus hard and behavioral regression matrix
- TP_M02 strategy: `REIMPLEMENT_EQUIVALENT_BEHAVIOR`
- preferred carrier: minimal isolated change on an owned exact-upstream-based Codex patch carrier/fork
- Community delivery direction: verified official package + opt-in Linux feature/runtime seam + compatibility-gated `CODEX_CLI_PATH`, with stock `resources/codex` fallback
- exact public bundled `resources/codex` binary -> `openai/codex` source-SHA mapping remains unavailable and must not be guessed
- JIT OpenSpec is required immediately before TP_M02 coding, limited to the TP_M02 behavior contract

## Relevant research/evidence

- `research/tool-output-pruning.md`
- `research/pre-implementation-plan-audit-tool-output-pruning-2026-09-12.md`
- `implementation/evidence/TP_M01-T01_BASELINE_ARCHITECTURE.md`
- `implementation/evidence/TP_M01-T02_PRUNING_EQUIVALENCE.md`
- `implementation/evidence/TP_M01-T03_SAFETY_CONTRACT.md`
- `implementation/evidence/TP_M01-T04_BENCHMARK_AND_REGRESSION_MATRIX.md`
- `implementation/evidence/TP_M01-T05_STRATEGY_AND_COMPATIBILITY.md`
- `implementation/evidence/TP_M01_ACCEPTANCE.md`
- `project-handoffs/TP_M01_HANDOFF.md`

`research/background-exec-wakeup-and-community-integration.md` remains shared architectural context only; it is not pruning behavior authority.

## Accepted decisions

- Treat tool-output pruning as a separate workstream from background-exec wakeup.
- Namespace pruning milestones/cards/checkpoints with `TP_` to avoid collisions with the wakeup workstream.
- Do not consume the entire `tekacs/custom-cli` patch stack merely to obtain pruning.
- Preserve the generic `custom-codex-runtime` delivery concept so both workstreams may eventually share package/build infrastructure without coupling their behavior contracts.
- The historical source patch is authoritative provenance, but behavioral equivalence on the current Codex baseline is more important than preserving the exact old diff.
- Any replacement Codex runtime must remain compatibility-gated against the exact current Desktop/bundled Codex baseline.
- Unknown compatibility or unknown pruning safety fails closed.
- No production/runtime mutation is authorized by TP_M01 completion.

## Open questions / later gates

The following are intentionally deferred and are not TP_M01 blockers:

- final numeric pruning thresholds;
- actual effectiveness/quality results after implementation;
- exact custom-runtime compatibility with the official Desktop/bundled runtime;
- controlled updater refresh proof;
- exact bundled-binary -> upstream source-SHA mapping if it remains unavailable.

## Next durable starting point

TP_M02 is **not started**.

A fresh TP_M02 execution-preparation session should start from `project-handoffs/TP_M01_HANDOFF.md` / `TP_M01_DISCOVERY_GREEN`, re-read current workflow `main`, refresh exact upstream/Community baselines, run Capability/Refresh Gate, and create/reconcile the minimal JIT OpenSpec before any pruning implementation.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

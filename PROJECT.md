# Codex Fix Pooling — Tool Output Pruning workstream

Repository: `elmakus/Codex-fix-pooling`
Branch: `tool-output-pruning`

## Current state

- phase: execution preparation complete; implementation not started
- goal: design a maintainable opt-in integration of request-time tool-output pruning for ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`), based on the behavior introduced by `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`
- status: pre-implementation plan audit GREEN after milestone-namespace correction; `TP_M01` prepared and READY; no Task Card has been executed
- execution_policy: chatgpt_only

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan: `planning/MASTER_PLAN.md`
- current milestone: `TP_M01 — Current-baseline pruning discovery`
- milestone file: `implementation/milestones/TP_M01_CURRENT_BASELINE_PRUNING_DISCOVERY.md`
- task board: `implementation/TASK_BOARD.yaml`
- first ready card: `implementation/cards/TP_M01-T01.md`
- latest cumulative handoff: none
- active OpenSpec changes: none

## Relevant research

- `research/tool-output-pruning.md`
- `research/pre-implementation-plan-audit-tool-output-pruning-2026-09-12.md`
- `research/background-exec-wakeup-and-community-integration.md` is shared architectural context only; it is not pruning behavior authority.

## Accepted decisions

- Treat tool-output pruning as a separate workstream from background-exec wakeup.
- Namespace pruning milestones/cards/checkpoints with `TP_` to avoid collisions with the wakeup workstream.
- Do not consume the entire `tekacs/custom-cli` patch stack merely to obtain pruning.
- Preserve the generic `custom-codex-runtime` delivery concept so both workstreams may eventually share package/build infrastructure without coupling their behavior contracts.
- The historical source patch is authoritative provenance, but behavioral equivalence on the current Codex baseline is more important than preserving the exact old diff.
- Any replacement Codex runtime must remain compatibility-gated against the exact current Desktop/bundled Codex baseline.
- Unknown compatibility or unknown pruning equivalence fails closed.
- Historical `40k protected / 20k minimum` values are evidence inputs, not frozen constants.
- No production/runtime mutation is authorized during TP_M01.
- TP_M01 requires no OpenSpec; re-evaluate just-in-time before TP_M02.

## Open questions / blockers

- Whether current upstream OpenAI Codex already provides equivalent pruning under a different implementation remains unresolved and is owned by TP_M01-T02.
- Current upstream tool-output/context-management architecture is owned by TP_M01-T01.
- Thresholds and protected-tool policy require current-baseline validation in TP_M01-T03.
- A measurable effectiveness criterion and quality matrix are owned by TP_M01-T04.
- No strategic blocker currently prevents TP_M01-T01 from starting; execution itself has not begun.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

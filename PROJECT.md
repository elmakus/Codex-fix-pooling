# Codex Fix Pooling — Tool Output Pruning workstream

Repository: `elmakus/Codex-fix-pooling`
Branch: `tool-output-pruning`

## Current state

- phase: planning
- goal: design a maintainable opt-in integration of request-time tool-output pruning for ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`), based on the behavior introduced by `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`
- status: research captured; requirements and Master Plan defined; pre-implementation plan audit not yet performed; implementation not started
- execution_policy: chatgpt_only

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan candidate: `planning/MASTER_PLAN.md`
- current milestone: none in execution
- task board: none for this workstream
- active OpenSpec changes: none

## Relevant research

- `research/tool-output-pruning.md`
- `research/background-exec-wakeup-and-community-integration.md` is shared architectural context only; it is not the pruning behavior authority.

## Accepted decisions

- Treat tool-output pruning as a separate workstream from background-exec wakeup.
- Do not consume the entire `tekacs/custom-cli` patch stack merely to obtain pruning.
- Preserve the generic `custom-codex-runtime` delivery concept so both workstreams may eventually share package/build infrastructure without coupling their behavior contracts.
- The historical source patch is authoritative provenance, but behavioral equivalence on the current Codex baseline is more important than preserving the exact old diff.
- Any replacement Codex runtime must remain compatibility-gated against the exact current Desktop/bundled Codex baseline.
- Unknown compatibility or unknown pruning equivalence fails closed.
- No production/runtime mutation is authorized during research or planning.

## Open questions / blockers

- Whether current upstream OpenAI Codex already provides equivalent pruning under a different implementation remains unresolved.
- Current upstream tool-output/context-management architecture must be refreshed before freezing implementation seams.
- Thresholds and protected-tool policy from the historical patch require current-baseline validation.
- A measurable effectiveness criterion is needed so the project can prove that pruning materially reduces request context without unacceptable task-quality regressions.

## Next workflow step

Perform the pre-implementation plan audit required by `workflow/PLANNING.md`. If GREEN, prepare Execution Prep for M01 only. Do not implement M01 during that step.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

# Codex Fix Pooling

Repository: `elmakus/Codex-fix-pooling`

## Current state

- phase: planning
- goal: design a maintainable opt-in integration that makes the `tekacs/codex` background-exec completion wakeup patch usable from ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`) without manual binary replacement after every update
- status: initial research captured; implementation not started
- execution_policy: chatgpt_only

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan: `planning/MASTER_PLAN.md`
- current milestone: none
- task board: none
- latest cumulative handoff: none
- active OpenSpec changes: none

## Relevant research

- `research/background-exec-wakeup-and-community-integration.md`

## Accepted decisions

- Implement the capability as an opt-in feature/integration for `codex-desktop-linux`, not as a recurring manual replacement under `/opt/codex-desktop`.
- Preserve the verified official OpenAI package as the baseline source; custom Codex runtime substitution must happen explicitly after upstream verification/build staging.
- The design must not permanently pin the desktop to a stale Codex revision.
- Compatibility between the Desktop/app-server protocol and replacement Codex runtime must be verified before substitution.

## Open questions / blockers

- Exact upstream Codex revision/version corresponding to each signed OpenAI Linux Desktop package must be deterministically discoverable or otherwise compatibility-gated.
- Decide whether the first implementation should build `tekacs/codex` directly or use an owned `elmakus/codex` fork carrying the patch.
- Determine whether this is acceptable upstream as a generic `custom-codex-runtime` feature or should remain a private/local feature.
- Confirm the minimal compatibility/acceptance test matrix for Desktop ↔ replacement Codex app-server behavior.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

# Codex Fix Pooling

Repository: `elmakus/Codex-fix-pooling`

## Current state

- phase: execution preparation complete; implementation not started
- goal: design a maintainable opt-in integration that makes the `tekacs/codex` background-exec completion wakeup patch usable from ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`) without manual binary replacement after every update
- status: pre-implementation plan audit GREEN after P1 corrections; M01 prepared and READY; no Task Card has been executed
- execution_policy: chatgpt_only

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan: `planning/MASTER_PLAN.md`
- current milestone: `M01 — Baseline and compatibility discovery`
- milestone file: `implementation/milestones/M01_BASELINE_AND_COMPATIBILITY_DISCOVERY.md`
- task board: `implementation/TASK_BOARD.yaml`
- first ready card: `implementation/cards/M01-T01.md`
- latest cumulative handoff: none
- active OpenSpec changes: none

## Relevant research

- `research/background-exec-wakeup-and-community-integration.md`
- `research/pre-implementation-plan-audit-2026-09-12.md`

## Accepted decisions

- Implement the capability as an opt-in feature/integration for `codex-desktop-linux`, not as a recurring manual replacement under `/opt/codex-desktop`.
- Preserve the verified official OpenAI package as the baseline source; custom Codex runtime substitution must happen explicitly after upstream verification/build staging.
- The design must not permanently pin the desktop to a stale Codex revision.
- Compatibility between the Desktop/app-server protocol and replacement Codex runtime must be verified before substitution; `UNKNOWN` compatibility fails closed.
- Prefer an owned `elmakus/codex` fork as the controlled patch carrier unless M01 evidence establishes a better approach; do not create/rebase that fork during M01 discovery.
- M01 is research/discovery and requires no OpenSpec. Re-evaluate OpenSpec just-in-time before M02.

## Open questions / blockers

- Exact upstream Codex revision/version corresponding to each signed OpenAI Linux Desktop package must be deterministically discoverable or otherwise compatibility-gated.
- M01 must determine the exact protocol/app-server drift surfaces and minimum compatibility proof.
- M01 must give a strict upstream-equivalence verdict for the exact tested baseline.
- No strategic blocker currently prevents M01-T01 from starting; execution itself has not begun.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

# Codex Fix Pooling

Repository: `elmakus/Codex-fix-pooling`

## Current state

- phase: M02 execution preparation complete; implementation not started
- goal: design a maintainable opt-in integration that makes the `tekacs/codex` background-exec completion wakeup patch usable from ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`) without manual binary replacement after every update
- status: `M01_BASELINE_GREEN`; M02 prepared and READY; no M02 Task Card has been executed
- execution_policy: chatgpt_only

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan: `planning/MASTER_PLAN.md`
- completed milestone: `M01 — Baseline and compatibility discovery`
- completed checkpoint: `M01_BASELINE_GREEN`
- current milestone: `M02 — Feature contract and build path`
- milestone file: `implementation/milestones/M02_FEATURE_CONTRACT_AND_BUILD_PATH.md`
- task board: `implementation/TASK_BOARD.yaml`
- first ready card: `implementation/cards/M02-T01.md`
- latest cumulative handoff: `project-handoffs/M01_HANDOFF.md`
- active OpenSpec changes: none; M02-T02 will create the required JIT change after T01 freezes the concrete seam

## Relevant research / evidence

- `research/background-exec-wakeup-and-community-integration.md`
- `research/pre-implementation-plan-audit-2026-09-12.md`
- `implementation/evidence/M01-T01_BASELINE.md`
- `implementation/evidence/M01-T02_SOURCE_PROTOCOL.md`
- `implementation/evidence/M01-T03_INTEGRATION_SEAMS.md`
- `implementation/evidence/M01-T04_EQUIVALENCE_REFRESH.md`
- `implementation/evidence/M01-T05_COMPATIBILITY_GATE.md`
- `implementation/evidence/M01_ACCEPTANCE.md`

## Accepted decisions

- Implement the capability as an opt-in feature/integration for `codex-desktop-linux`, not as a recurring manual replacement under `/opt/codex-desktop`.
- Preserve the verified official OpenAI package as the baseline source; custom Codex runtime substitution must happen explicitly after upstream verification/build staging.
- The design must not permanently pin the desktop to a stale Codex revision.
- Compatibility between the Desktop/app-server protocol and replacement Codex runtime must be verified before substitution; only `PASS` permits substitution. `FAIL` and `UNKNOWN` fail closed.
- Exact bundled Codex source ancestry must not be guessed from Desktop version/date proximity. Dynamic exact-Desktop compatibility evidence can compensate when deterministic source mapping is unavailable.
- Use an owned `elmakus/codex` fork as controlled patch carrier when divergence is required; retain `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` as source provenance. No fork has been created yet.
- Current preferred M02 seam is a feature-staged managed runtime selected with package-level `CODEX_CLI_PATH`, subject to M02-T01 exact launch-path verification. Candidate-tree `resources/codex` replacement is the fallback seam.
- Reuse the existing Linux feature framework and `codex-update-manager`; do not create a second updater or normal post-install overwrite mechanism.
- Every new official Desktop package tuple invalidates prior custom-runtime compatibility and requires refresh/revalidation.
- M01 required no OpenSpec. M02 requires a just-in-time OpenSpec after T01 proves the concrete runtime-selection seam.

## Refreshed M02 prep baseline

- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux Desktop baseline: `26.908.40834`
- `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- no upstream drift since M01 requires strategic replanning before M02-T01

## Current compatibility state

- exact bundled-runtime source mapping: unavailable with current evidence
- current public OpenAI baseline inspected by M01: not strictly equivalent to the reference patch
- patch retirement: not authorized on current evidence
- actual custom-runtime substitution: `UNKNOWN / NOT AUTHORIZED`; no candidate has been built or admitted

## Open questions / blockers

- No strategic blocker prevents M02-T01 from starting.
- M02-T01 must prove whether all relevant Desktop-owned Codex/app-server launch paths honor `CODEX_CLI_PATH`; otherwise it must select the candidate-tree replacement fallback.
- M02-T03 requires GitHub mutation capability for the owned carrier plus an isolated Codex build environment. Those capabilities must be re-checked when the card becomes ready; under `chatgpt_only`, missing capability blocks rather than routing to Codex.
- M02-T04/T05 require an isolated Community build/package test environment and authorized owned development branch/fork; capability must be proved before execution.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

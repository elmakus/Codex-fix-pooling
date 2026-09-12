# Codex Fix Pooling

Repository: `elmakus/Codex-fix-pooling`

## Current state

- phase: M02 execution in progress
- goal: design a maintainable opt-in integration that makes the `tekacs/codex` background-exec completion wakeup patch usable from ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`) without manual binary replacement after every update
- status: `M01_BASELINE_GREEN`; M02-T01 and M02-T02 complete; M02-T03 READY
- execution_policy: chatgpt_only

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan: `planning/MASTER_PLAN.md`
- completed milestone: `M01 — Baseline and compatibility discovery`
- completed checkpoint: `M01_BASELINE_GREEN`
- current milestone: `M02 — Feature contract and build path`
- milestone file: `implementation/milestones/M02_FEATURE_CONTRACT_AND_BUILD_PATH.md`
- task board: `implementation/TASK_BOARD.yaml`
- completed M02 cards: `implementation/cards/M02-T01.md`, `implementation/cards/M02-T02.md`
- first ready card: `implementation/cards/M02-T03.md`
- latest cumulative handoff: `project-handoffs/M01_HANDOFF.md`
- active OpenSpec change: `openspec/changes/custom-codex-runtime-m02`

## Relevant research / evidence

- `research/background-exec-wakeup-and-community-integration.md`
- `research/pre-implementation-plan-audit-2026-09-12.md`
- `implementation/evidence/M01-T01_BASELINE.md`
- `implementation/evidence/M01-T02_SOURCE_PROTOCOL.md`
- `implementation/evidence/M01-T03_INTEGRATION_SEAMS.md`
- `implementation/evidence/M01-T04_EQUIVALENCE_REFRESH.md`
- `implementation/evidence/M01-T05_COMPATIBILITY_GATE.md`
- `implementation/evidence/M01_ACCEPTANCE.md`
- `implementation/evidence/M02-T01_RUNTIME_SELECTION.md`
- `implementation/evidence/M02-T02_OPENSPEC.md`

## Accepted decisions

- Implement the capability as an opt-in feature/integration for `codex-desktop-linux`, not as a recurring manual replacement under `/opt/codex-desktop`.
- Preserve the verified official OpenAI package as the baseline source; custom Codex runtime substitution must happen explicitly after upstream verification/build staging.
- The design must not permanently pin the desktop to a stale Codex revision.
- Compatibility between the Desktop/app-server protocol and replacement Codex runtime must be verified before substitution; only `PASS` permits substitution. `FAIL` and `UNKNOWN` fail closed.
- Exact bundled Codex source ancestry must not be guessed from Desktop version/date proximity. Dynamic exact-Desktop compatibility evidence can compensate when deterministic source mapping is unavailable.
- Use an owned `elmakus/codex` fork as controlled patch carrier when divergence is required; retain `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` as source provenance. No fork has been created yet.
- **M02 runtime substitution seam is frozen as candidate-tree replacement of `resources/codex`.** M02-T01 proved that `CODEX_CLI_PATH` does not govern every relevant runtime authority path: `remote-mobile-control` has a separate cold-start path that defaults directly to `$CODEX_LINUX_APP_DIR/resources/codex` and uses `CODEX_REMOTE_CONTROL_CODEX_PATH` for explicit override.
- Candidate-tree replacement must occur only during candidate construction after official baseline capture and PASS compatibility/provenance/behavior gates; FAIL/UNKNOWN must abort custom substitution.
- Feature disabled must rebuild from the verified official payload with stock `resources/codex` untouched.
- Reuse the existing Linux feature framework and `codex-update-manager`; do not create a second updater or normal post-install overwrite mechanism.
- Every new official Desktop package tuple invalidates prior custom-runtime compatibility and requires refresh/revalidation.
- Active OpenSpec `custom-codex-runtime-m02` freezes feature enablement, controlled source/build settings, official/custom provenance, PASS/FAIL/UNKNOWN semantics, candidate-tree substitution, stock reconstruction, diagnostics, override detection, and M02 scope boundaries.
- M02 OpenSpec does not claim M03 wakeup semantics, M04 full Desktop integration, or M05 changed-baseline update acceptance.

## Refreshed M02 baseline

- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux Desktop baseline: `26.908.40834`
- M02-T01 result commit: `8632f2f7ee8d04ec0024a8c4b37d02bdffd6b4e4`
- M02-T02 result commit: `818688cd49058d5b52fdfdf3d2ddcc0524a7d746`

## Current compatibility state

- exact bundled-runtime source mapping: unavailable with current evidence
- current public OpenAI baseline inspected by M01: not strictly equivalent to the reference patch
- patch retirement: not authorized on current evidence
- actual custom-runtime substitution: `UNKNOWN / NOT AUTHORIZED`; no candidate has been built or admitted
- substitution mechanism contract: candidate-tree `resources/codex` replacement governed by active M02 OpenSpec

## Open questions / blockers

- M02-T03 is READY and must re-run Refresh/Capability Gate before any owned-carrier mutation.
- M02-T03 requires GitHub mutation capability for the owned carrier plus an isolated Codex build environment. Under `chatgpt_only`, missing capability blocks rather than routing to Codex.
- M02-T04/T05 require an isolated Community build/package test environment and authorized owned development branch/fork; capability must be proved before execution.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

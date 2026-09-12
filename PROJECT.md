# Codex Fix Pooling

Repository: `elmakus/Codex-fix-pooling`

## Current state

- phase: milestone M01 complete; ready for M02 execution preparation
- goal: design a maintainable opt-in integration that makes the `tekacs/codex` background-exec completion wakeup patch usable from ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`) without manual binary replacement after every update
- status: `M01_BASELINE_GREEN`; no custom runtime implementation has started
- execution_policy: chatgpt_only

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved plan: `planning/MASTER_PLAN.md`
- completed milestone: `M01 — Baseline and compatibility discovery`
- checkpoint: `M01_BASELINE_GREEN`
- task board: `implementation/TASK_BOARD.yaml`
- latest cumulative handoff: `project-handoffs/M01_HANDOFF.md`
- acceptance evidence: `implementation/evidence/M01_ACCEPTANCE.md`
- next milestone: `M02 — Feature contract and build path`
- M02 execution prep: not yet created
- active OpenSpec changes: none

## Relevant research / evidence

- `research/background-exec-wakeup-and-community-integration.md`
- `research/pre-implementation-plan-audit-2026-09-12.md`
- `implementation/evidence/M01-T01_BASELINE.md`
- `implementation/evidence/M01-T02_SOURCE_PROTOCOL.md`
- `implementation/evidence/M01-T03_INTEGRATION_SEAMS.md`
- `implementation/evidence/M01-T04_EQUIVALENCE_REFRESH.md`
- `implementation/evidence/M01-T05_COMPATIBILITY_GATE.md`

## Accepted decisions

- Implement the capability as an opt-in feature/integration for `codex-desktop-linux`, not as a recurring manual replacement under `/opt/codex-desktop`.
- Preserve the verified official OpenAI package as the baseline source; custom Codex runtime substitution must happen explicitly after upstream verification/build staging.
- The design must not permanently pin the desktop to a stale Codex revision.
- Compatibility between the Desktop/app-server protocol and replacement Codex runtime must be verified before substitution; only `PASS` permits substitution. `FAIL` and `UNKNOWN` fail closed.
- Exact bundled Codex source ancestry must not be guessed from Desktop version/date proximity. Dynamic exact-Desktop compatibility evidence can compensate when deterministic source mapping is unavailable.
- Use an owned `elmakus/codex` fork as controlled patch carrier when divergence is required; retain `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` as source provenance. No fork has been created yet.
- Current preferred M02 seam is a feature-staged managed runtime selected with package-level `CODEX_CLI_PATH`, subject to exact Desktop launch-path verification. Candidate-tree `resources/codex` replacement is the fallback seam.
- Reuse the existing Linux feature framework and `codex-update-manager`; do not create a second updater or normal post-install overwrite mechanism.
- Every new official Desktop package tuple invalidates prior custom-runtime compatibility and requires refresh/revalidation.
- M01 required no OpenSpec. Re-evaluate OpenSpec just-in-time during M02 execution prep/Refresh Gate because feature settings, provenance and updater behavior may establish durable cross-component contracts.

## Current compatibility state

- exact official Desktop baseline audited in M01: `26.908.40834`
- exact bundled-runtime source mapping: unavailable with current evidence
- public OpenAI main inspected by M01-T04: not strictly equivalent to the reference patch
- patch retirement: not authorized on current evidence
- actual custom-runtime substitution: `UNKNOWN / NOT AUTHORIZED` because no candidate has been built or exact Desktop integration-tested

## Open questions / blockers

- No strategic blocker prevents M02 execution preparation.
- M02 must refresh current `ilysenko/codex-desktop-linux`, `openai/codex`, and official package baseline before freezing implementation details.
- M02 must verify whether all exact Desktop-owned Codex/app-server launch paths honor `CODEX_CLI_PATH`; otherwise use the candidate-tree replacement fallback.
- M02 must decide/create the just-in-time OpenSpec boundary if feature settings/provenance/update contracts require it.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

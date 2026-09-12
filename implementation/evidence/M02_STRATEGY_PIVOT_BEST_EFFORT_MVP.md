# M02 Strategy Pivot — Best-Effort MVP for Codex

Date: 2026-09-12
Decision authority: user

## Decision

M02 is re-scoped from proving a locally built, locally verified custom runtime/package path inside the current ChatGPT session to preparing the strongest possible **best-effort MVP handoff for Codex**.

The purpose of the handoff is to minimize Codex's work: ChatGPT should perform source analysis, freeze invariants, prepare the runtime patch provenance, prepare the Community Edition integration patch, and provide exact apply/build/test/fix instructions. Codex then performs the environment-dependent work that ChatGPT cannot prove here: reconcile any source drift, build the runtime and Community package, run tests/smokes, diagnose incompatibilities, and make the final implementation operational.

## Trust boundary

This pivot does **not** convert missing evidence into PASS.

- A patch prepared by ChatGPT is `best-effort / unverified` until Codex builds and tests it.
- Runtime build identity, package artifact identity, exact Desktop compatibility, wakeup behavior, and update persistence remain UNKNOWN until verified in the execution environment.
- FAIL and UNKNOWN still prohibit claiming production-compatible custom-runtime selection.
- No production installation is authorized by this pivot.
- Official OpenAI package verification and candidate-tree `resources/codex` substitution remain frozen architectural invariants.

## Execution policy

Project execution policy changes from `chatgpt_only` to `mixed` for the remainder of this workstream.

ChatGPT owns preparation work it can complete correctly from source and durable repository state. Codex may be explicitly assigned the environment-dependent implementation/verification continuation after the MVP handoff is ready.

This is an explicit user-authorized executor-policy change, not automatic fallback from the prior Capability Gate.

## M02 re-scope

M02 checkpoint changes from `M02_FEATURE_GREEN` to `M02_MVP_HANDOFF_READY`.

M02 now means:

1. T01/T02 remain accepted and unchanged: substitution seam and OpenSpec contract are valid inputs.
2. T03 prepares exact runtime patch provenance and an apply/rebase recipe without requiring a local Rust build or owned carrier to exist first.
3. T04 prepares the best-effort Community `custom-codex-runtime` implementation patch against the refreshed source baseline, with static/source-level checks where possible.
4. T05 assembles a single Codex handoff package containing patches, known UNKNOWNs, invariants, exact execution instructions, and the acceptance checklist Codex must run.

M02 completion must not be described as feature verification or production readiness.

## Codex handoff contract

Codex should be told to:

1. inspect the supplied patches before applying them;
2. refresh exact upstream/current branch state;
3. adapt only where current APIs/source drift require it while preserving frozen invariants;
4. establish or use the controlled `elmakus/codex` carrier if divergence is still required;
5. build the selected Codex runtime and record exact source/toolchain/version/SHA-256/architecture;
6. apply the Community feature patch and build the CE candidate/package;
7. run PASS/FAIL/UNKNOWN package-selection tests and the downstream wakeup/Desktop/update checks as applicable;
8. repair concrete incompatibilities rather than restarting the architecture from zero unless the supplied design is proven fundamentally incompatible;
9. return exact symptoms/evidence if unresolved failures remain.

## Historical blocker

`implementation/evidence/M02-T03_CAPABILITY_BLOCKER.md` remains valid historical evidence for why the previous locally-proven T03 contract could not run in this ChatGPT session. It is no longer an active project blocker because the user changed the intended outcome and execution policy.

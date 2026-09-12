# Codex Fix Pooling

Repository: `elmakus/Codex-fix-pooling`

## Current state

- phase: M02 best-effort MVP preparation in progress
- goal: prepare the strongest practical MVP that lets Codex inspect/apply/adapt/build/test the background-exec wakeup integration for ChatGPT Community for Linux without restarting the architecture work from zero
- status: `M01_BASELINE_GREEN`; M02-T01 and M02-T02 complete; M02-T03 READY under revised best-effort contract
- execution_policy: mixed

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved master plan: `planning/MASTER_PLAN.md`
- accepted M02 plan addendum: `planning/M02_BEST_EFFORT_MVP_PIVOT.md`
- strategy decision evidence: `implementation/evidence/M02_STRATEGY_PIVOT_BEST_EFFORT_MVP.md`
- current milestone: `M02 — Best-effort MVP preparation and Codex handoff`
- checkpoint target: `M02_MVP_HANDOFF_READY`
- milestone file: `implementation/milestones/M02_FEATURE_CONTRACT_AND_BUILD_PATH.md`
- task board: `implementation/TASK_BOARD.yaml`
- completed M02 cards: `implementation/cards/M02-T01.md`, `implementation/cards/M02-T02.md`
- first ready card: `implementation/cards/M02-T03.md`
- active OpenSpec change: `openspec/changes/custom-codex-runtime-m02`

## Accepted strategy pivot

The user explicitly changed the M02 objective after the previous ChatGPT-only Capability Gate blocked local build proof.

M02 no longer requires ChatGPT to prove a Rust runtime build or Community package build before useful work can continue. ChatGPT prepares the runtime patch/provenance recipe, Community integration patch, and deterministic Codex handoff. Codex is then the intended environment-dependent executor for reconcile/apply/build/debug/test/verification.

The historical blocker remains valid evidence for the former acceptance contract but is no longer an active project blocker:
`implementation/evidence/M02-T03_CAPABILITY_BLOCKER.md`.

This strategy change does not turn missing evidence into success. Runtime build identity, package artifact identity, exact Desktop compatibility, wakeup behavior and changed-baseline persistence remain UNKNOWN until Codex produces evidence.

## Frozen architecture / safety invariants

- Keep the verified official OpenAI package as provenance baseline.
- Runtime substitution seam remains candidate-tree replacement of `resources/codex` during managed package construction.
- Do not introduce normal live-tree overwrite or a second updater.
- Feature disabled reconstructs stock official runtime behavior.
- Compatibility states remain exactly PASS / FAIL / UNKNOWN; FAIL and UNKNOWN cannot support a production-compatibility claim.
- Every new official Desktop package tuple invalidates prior compatibility evidence.
- Preserve immutable reference provenance `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` unless strict upstream equivalence is later proven.
- Prefer controlled `elmakus/codex` carrier when divergence remains necessary, but Codex may establish it during execution rather than blocking MVP preparation.
- No production installation is authorized by M02.

## Refreshed source baseline

- `openai/codex:main@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`
- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux Desktop baseline: `26.908.40834`

Each preparation card still runs its own Refresh Gate.

## M02 card intent

- `M02-T03`: prepare exact runtime patch provenance and current-baseline carrier/rebase/build recipe; no local Rust build claim required.
- `M02-T04`: prepare best-effort Community `custom-codex-runtime` source patch against exact refreshed source; no package-build claim required.
- `M02-T05`: assemble one Codex handoff with patch pointers, invariants, UNKNOWNs and ordered inspect/apply/adapt/build/test/fix/report instructions.

## Current compatibility state

- exact bundled-runtime source mapping: unavailable with current evidence
- strict upstream equivalence to the reference wakeup semantics: not established
- patch retirement: not authorized on current evidence
- actual custom-runtime build/substitution: UNKNOWN / NOT VERIFIED
- source-level substitution contract: candidate-tree `resources/codex` replacement governed by active M02 OpenSpec

## Handoff boundary

`M02_MVP_HANDOFF_READY` means the preparation package is strong enough for Codex to execute efficiently. It does **not** mean feature/runtime/package/Desktop/update acceptance is green.

Codex should inspect the supplied changes, refresh exact source state, adapt only for concrete drift, establish/use the owned carrier if needed, build and identify the runtime, build Community candidate/package, run gate/behavior/integration/update checks, repair incompatibilities while preserving frozen invariants, and return exact evidence for anything unresolved.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- ChatGPT Work: out of scope

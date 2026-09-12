# Codex Fix Pooling

Repository: `elmakus/Codex-fix-pooling`

## Current state

- phase: M02 best-effort MVP preparation complete
- goal: hand the strongest practical source-level MVP to Codex so it can finish the environment-dependent build/test/debug/verification work without restarting architecture discovery
- status: `M02_MVP_HANDOFF_READY`
- accepted implementation head: `1298fae794050c40894ad9abfa69d5556d3790dd`
- execution_policy: mixed

## Canonical authority

- requirements: `requirements/REQUIREMENTS.md`
- approved master plan: `planning/MASTER_PLAN.md`
- accepted M02 plan addendum: `planning/M02_BEST_EFFORT_MVP_PIVOT.md`
- strategy decision evidence: `implementation/evidence/M02_STRATEGY_PIVOT_BEST_EFFORT_MVP.md`
- completed milestone: `M02 — Best-effort MVP preparation and Codex handoff`
- checkpoint: `M02_MVP_HANDOFF_READY`
- milestone file: `implementation/milestones/M02_FEATURE_CONTRACT_AND_BUILD_PATH.md`
- task board: `implementation/TASK_BOARD.yaml`
- M02 acceptance: `implementation/evidence/M02_ACCEPTANCE.md`
- integrated static review: `implementation/evidence/M02-T05_STATIC_MVP_REVIEW.md`
- cumulative Codex handoff: `project-handoffs/M02_HANDOFF.md`
- active implementation contract: `openspec/changes/custom-codex-runtime-m02`

## Accepted strategy pivot

M02 intentionally uses a BEST-EFFORT / STATICALLY REVIEWED MVP contract. ChatGPT was required to maximize real source-level preparation even though the final Rust/Cargo and Community package build lanes are unavailable in this environment.

The former local-build capability blocker remains historical evidence only. Missing environment-dependent evidence remains UNKNOWN rather than becoming a preparation blocker or a fabricated PASS.

## Frozen architecture / safety invariants

- Keep the verified official OpenAI package as provenance baseline.
- Runtime substitution seam is candidate-tree replacement of `resources/codex` during managed package construction.
- Official verification and stock `resources/codex` identity capture occur before custom substitution.
- Do not redesign around `CODEX_CLI_PATH` alone; explicit `CODEX_CLI_PATH` and `CODEX_REMOTE_CONTROL_CODEX_PATH` bypasses are diagnosed.
- Feature id is `custom-codex-runtime`; it is opt-in and disabled by default.
- Do not introduce normal live-tree overwrite, post-install replacement, a second updater, or a background replacement service.
- Feature disabled reconstructs the stock runtime from the newly verified official payload.
- Feature-off restoration and package rollback are distinct concepts.
- Compatibility states remain exactly PASS / FAIL / UNKNOWN; only PASS authorizes custom substitution.
- Every new official Desktop package tuple invalidates prior custom-runtime admission evidence.
- Preserve immutable reference provenance `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` unless strict upstream equivalence is later proven.
- Prefer controlled `elmakus/codex` carrier when divergence remains necessary.
- No production installation is authorized by M02.

## Refreshed source baseline at M02 acceptance

- `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
- reference `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`
- reference parent `ba573b4b10937d955559e6b45e8a199276b7424d`
- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux Desktop provenance baseline: `26.908.40834`

Codex must refresh external repositories again at execution time and adapt only where concrete current source/build/runtime evidence requires it.

## Prepared runtime material

- evidence: `implementation/evidence/M02-T03_RUNTIME_PATCH_PREPARATION.md`
- current-source adaptation: `implementation/patches/M02-T03_CODEX_C4017A87_WAKEUP_ADAPTATION.md`

The refreshed public OpenAI baseline was not strictly equivalent to all four required wakeup semantics. The prepared adaptation covers completion input, model-facing anti-completion-poll guidance, wake-on-exit/duplicate suppression, watcher integration, carrier/build/provenance recipe and tests.

The current active-or-idle turn-start API binding remains deliberately UNKNOWN until Codex compiles and tests the adaptation.

## Prepared Community material

- evidence: `implementation/evidence/M02-T04_COMMUNITY_PATCH_PREPARATION.md`
- actual overlay: `implementation/community-overlay/linux-features/custom-codex-runtime/`

The overlay implements controlled settings, exact official/community provenance binding, stock runtime capture, PASS/FAIL/UNKNOWN admission, architecture and digest checks, candidate-only replacement, final digest verification, success/rejection diagnostics, explicit override diagnostics and prepared tests while reusing the existing Community candidate/update architecture.

## M02 cards

- `M02-T01` — DONE
- `M02-T02` — DONE
- `M02-T03` — DONE, runtime source/provenance package prepared
- `M02-T04` — DONE, Community source overlay prepared
- `M02-T05` — DONE, integrated static review and deterministic Codex handoff prepared

## Current verification state

### PREPARED / STATICALLY REVIEWED

Runtime adaptation, Community feature overlay, provenance/admission logic, package-mechanics test material, frozen invariants and ordered Codex execution package.

### VERIFIED PASS

Only source/readback facts recorded in M02 acceptance evidence. No environment-dependent build/runtime/package/Desktop result is claimed PASS.

### UNKNOWN / requires Codex

- Rust compile/tests and resulting runtime identity;
- exact active-or-idle wake implementation;
- Community tests/candidate/native package build;
- real package PASS/FAIL/UNKNOWN mechanics;
- strict wakeup semantics;
- exact Desktop/app-server compatibility;
- changed-baseline update persistence/re-admission;
- production suitability.

## Handoff boundary

`M02_MVP_HANDOFF_READY` means the preparation package is strong enough for Codex to execute efficiently. It does **not** mean feature/runtime/package/Desktop/update acceptance is green.

Codex starts from `project-handoffs/M02_HANDOFF.md`, runs a fresh Refresh Gate, uses the prepared implementation as the default solution, repairs only concrete incompatibilities, records exact evidence, and does not install into production unless the user separately authorizes that action.

## Workflow

- authority: `elmakus/chatgpt-codex-project-workflow:main`
- ChatGPT entrypoint: `CHATGPT.md`
- Codex durable start pointer: `project-handoffs/M02_HANDOFF.md`

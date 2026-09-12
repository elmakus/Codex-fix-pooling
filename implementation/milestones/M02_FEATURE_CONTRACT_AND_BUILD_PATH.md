# M02 — Best-effort MVP preparation and Codex handoff

## Status

Execution status: DONE
Checkpoint: `M02_MVP_HANDOFF_READY`
Accepted implementation head: `1298fae794050c40894ad9abfa69d5556d3790dd`
Required prior checkpoint: `M01_BASELINE_GREEN`
Execution policy: `mixed`
OpenSpec: `openspec/changes/custom-codex-runtime-m02`
Plan addendum: `planning/M02_BEST_EFFORT_MVP_PIVOT.md`
Acceptance evidence: `implementation/evidence/M02_ACCEPTANCE.md`
Integrated static review: `implementation/evidence/M02-T05_STATIC_MVP_REVIEW.md`
Cumulative handoff: `project-handoffs/M02_HANDOFF.md`

## Outcome

M02 prepared the strongest practical source-level MVP for Codex without touching the installed production Community runtime. It produced the refreshed runtime patch provenance/current-source adaptation recipe, a real Community `custom-codex-runtime` source overlay, prepared tests, integrated static review and one deterministic Codex continuation handoff.

This milestone is GREEN only for the preparation checkpoint `M02_MVP_HANDOFF_READY`. It does not claim `FEATURE GREEN`, a successful runtime/package build, wakeup acceptance, exact Desktop compatibility or changed-baseline update persistence.

## Refreshed baseline at acceptance

- `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
- `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`
- reference parent `ba573b4b10937d955559e6b45e8a199276b7424d`
- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux Desktop provenance baseline: `26.908.40834`

Codex must refresh these external repositories again before execution.

## Task structure

1. `M02-T01` — Verify Desktop runtime-selection coverage and freeze substitution seam — DONE
2. `M02-T02` — Freeze feature/settings/provenance contract in OpenSpec — DONE
3. `M02-T03` — Prepare runtime patch provenance and carrier recipe — DONE
4. `M02-T04` — Prepare best-effort `custom-codex-runtime` Community patch — DONE
5. `M02-T05` — Assemble Codex MVP handoff package — DONE

## Prepared deliverables

### Runtime

- `implementation/evidence/M02-T03_RUNTIME_PATCH_PREPARATION.md`
- `implementation/patches/M02-T03_CODEX_C4017A87_WAKEUP_ADAPTATION.md`

The refreshed public OpenAI source was not strictly equivalent to all four frozen wakeup semantics, so the handoff retains a controlled divergence recipe. The historical `Session::inject_or_start` API has drifted; the exact current active-or-idle turn-start binding remains explicitly UNKNOWN for Codex to compile/test rather than being guessed.

### Community

- `implementation/evidence/M02-T04_COMMUNITY_PATCH_PREPARATION.md`
- `implementation/community-overlay/linux-features/custom-codex-runtime/`

The overlay is opt-in/default-off and performs exact official/community/provenance admission, stock runtime capture, PASS/FAIL/UNKNOWN fail-closed selection, target-architecture and runtime-digest validation, candidate-only `resources/codex` replacement, final digest readback, durable diagnostics and explicit runtime-override diagnostics through the existing feature/update architecture.

### Review and handoff

- `implementation/evidence/M02-T05_STATIC_MVP_REVIEW.md`
- `implementation/evidence/M02_ACCEPTANCE.md`
- `project-handoffs/M02_HANDOFF.md`

Static review corrected current manifest-schema drift, target architecture binding and rejected-candidate diagnostics before accepting the implementation head.

## Frozen invariants

- official OpenAI package verification remains first and unchanged;
- stock `resources/codex` identity is captured before custom substitution;
- candidate-tree replacement of `resources/codex` is the normal package-owned runtime authority;
- no `CODEX_CLI_PATH`-only design;
- feature id is `custom-codex-runtime`, opt-in and default-off;
- no live-tree overwrite, post-install replacement, second updater or background replacement service;
- feature OFF reconstructs stock official runtime;
- feature-off restoration and package rollback remain distinct;
- PASS/FAIL/UNKNOWN remain fail-closed and only PASS may authorize substitution;
- every new official Desktop tuple invalidates prior compatibility evidence;
- immutable reference provenance is preserved unless strict upstream equivalence is proven;
- no production installation is authorized by M02.

## Verification state

### PREPARED / STATICALLY REVIEWED

Runtime patch/adaptation, carrier/build recipe, Community feature source, package-mechanics tests, source invariants and Codex execution package.

### VERIFIED PASS

Only source/readback facts listed in `implementation/evidence/M02_ACCEPTANCE.md`. No unexecuted build/runtime/package test is marked PASS.

### UNKNOWN / transferred to Codex

- Rust compilation/tests and runtime identity;
- active-or-idle wake API implementation;
- Community Node/shell tests and package build;
- real package selection/rejection mechanics;
- wakeup/duplicate-suppression behavior;
- exact Desktop/app-server integration;
- changed-baseline update persistence/re-admission;
- production suitability.

## Milestone acceptance

All source-level M02 preparation acceptance criteria are satisfied. The checkpoint means **handoff-ready**, not build-verified, package-verified, wakeup-verified, Desktop-compatible or production-ready.

## Codex continuation

Codex should start from `project-handoffs/M02_HANDOFF.md`, run the workflow Refresh Gate, inspect the prepared implementation, adapt only for concrete current source/build/runtime evidence, build and identify the runtime, apply/build the Community overlay through the managed candidate path, execute the supplied gates/tests, repair concrete incompatibilities while preserving frozen invariants, and persist exact PASS/FAIL/UNKNOWN evidence.

## Scope boundary

M02 does not close the downstream runtime behavior, exact Desktop integration or changed-baseline updater verification. Those remain environment-dependent evidence work. Production deployment/install remains unauthorized until separately approved by the user.

# M02 — Best-effort MVP preparation and Codex handoff

## Status

Execution status: IN PROGRESS
Checkpoint target: `M02_MVP_HANDOFF_READY`
Required prior checkpoint: `M01_BASELINE_GREEN`
Execution policy: `mixed`
OpenSpec: active at `openspec/changes/custom-codex-runtime-m02`
Plan addendum: `planning/M02_BEST_EFFORT_MVP_PIVOT.md`

## Outcome

Prepare the strongest practical source-level MVP for Codex without touching the installed production Community runtime. M02 now produces the runtime patch provenance/rebase recipe, Community `custom-codex-runtime` integration patch, and one deterministic Codex handoff. Build/runtime/package/Desktop verification that cannot be proved in the current ChatGPT environment remains explicitly UNKNOWN and is delegated to Codex.

This milestone no longer claims `FEATURE GREEN` merely because source patches are prepared.

## Refreshed baseline

- `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`
- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux Desktop baseline: `26.908.40834`

Every card still runs its own Refresh Gate before source preparation.

## Task structure

1. `M02-T01` — Verify Desktop runtime-selection coverage and freeze substitution seam — DONE
2. `M02-T02` — Freeze feature/settings/provenance contract in OpenSpec — DONE
3. `M02-T03` — Prepare runtime patch provenance and carrier recipe — READY
4. `M02-T04` — Prepare best-effort `custom-codex-runtime` Community patch — PLANNED
5. `M02-T05` — Assemble Codex MVP handoff package — PLANNED

Dependencies remain linear: T03 → T04 → T05 after the accepted T01/T02 foundation.

## Frozen invariants

- official OpenAI package verification remains first and unchanged;
- candidate-tree replacement of `resources/codex` remains the selected runtime substitution seam;
- no live-tree overwrite or second updater is introduced;
- feature disabled reconstructs stock official runtime behavior;
- PASS/FAIL/UNKNOWN semantics remain fail-closed for compatibility claims;
- UNKNOWN is never reported as PASS;
- new official Desktop package identity invalidates prior compatibility evidence;
- reference wakeup provenance remains `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` unless strict upstream equivalence is later proven.

## Milestone acceptance

M02 reaches `M02_MVP_HANDOFF_READY` only when:

- refreshed runtime and Community source baselines are exact and durable;
- a best-effort current-baseline runtime patch/rebase recipe exists with immutable reference provenance;
- a best-effort Community feature patch/change set exists against an exact Community base;
- source-level logic preserves stock-off behavior, official verification and FAIL/UNKNOWN rejection semantics;
- known build/runtime/package assumptions are explicitly listed as UNKNOWN rather than silently assumed;
- a single Codex handoff provides exact inspect/apply/adapt/build/test/fix/report steps;
- no production installation or live runtime is modified.

This checkpoint means **handoff-ready**, not build-verified, package-verified, wakeup-verified, Desktop-compatible or production-ready.

## Codex continuation

After T05, Codex is the intended environment-dependent executor. It must inspect the supplied patches, refresh source state, create/use the controlled carrier if required, build the runtime, record binary identity, apply/build the Community patch, run package gates and downstream behavioral/integration/update checks, and repair concrete incompatibilities while preserving the frozen invariants.

## Scope boundary

M02 preparation does not close M03 wakeup semantics, M04 exact Desktop integration or M05 changed-baseline updater acceptance. Those remain evidence-producing execution stages after the MVP handoff.

No production deployment/install is authorized by M02.
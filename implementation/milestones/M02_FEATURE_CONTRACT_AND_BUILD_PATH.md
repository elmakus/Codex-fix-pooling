# M02 — Feature contract and build path

## Status

Execution status: READY
Checkpoint target: `M02_FEATURE_GREEN`
Required prior checkpoint: `M01_BASELINE_GREEN`
Execution policy: `chatgpt_only`
OpenSpec: required just-in-time after M02-T01 resolves the concrete substitution seam

## Outcome

Define and implement the opt-in `custom-codex-runtime` feature boundary in a controlled development branch/fork without touching the installed production Community runtime. M02 must produce a managed package-level path that preserves the verified official runtime baseline, records exact custom-runtime provenance, selects custom runtime only on compatibility PASS, fails closed on FAIL/UNKNOWN, and restores stock behavior when disabled.

## Refreshed baseline at prep

- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux Desktop baseline from M01: `26.908.40834`
- `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- no upstream drift since M01 requires architecture replanning before M02 execution

Every card must still run its own Refresh Gate immediately before execution.

## Task structure

1. `M02-T01` — Verify Desktop runtime-selection coverage and freeze substitution seam
2. `M02-T02` — Freeze feature/settings/provenance contract in OpenSpec
3. `M02-T03` — Establish controlled Codex carrier and reproducible runtime build provenance
4. `M02-T04` — Implement `custom-codex-runtime` feature and fail-closed package selection
5. `M02-T05` — Verify M02 package-level acceptance and rollback readiness

Dependencies:

- T01 starts from `M01_BASELINE_GREEN`.
- T02 depends on T01 because OpenSpec must describe the actual verified seam rather than a guessed interface.
- T03 depends on T02 because carrier/build provenance must satisfy the frozen contract.
- T04 depends on T02 and T03.
- T05 depends on T04.

## Milestone acceptance

M02 is GREEN only when:

- feature disabled produces stock official-runtime package behavior;
- feature enabled can select the exact expected managed custom runtime only when the M01 compatibility gate yields PASS for the tested candidate/baseline pair or a controlled test fixture proves the gate mechanics without falsely claiming production compatibility;
- FAIL/UNKNOWN cannot silently select a custom runtime;
- exact source/upstream/patch/carrier/binary identity is durable in build/package evidence;
- official package verification remains first and unchanged;
- package construction remains atomic and production install is not mutated during development;
- feature-off restoration and previous-package rollback paths remain practical;
- OpenSpec and implementation agree;
- no M03 claim is made for strict background-wakeup semantics beyond any build/test fixture needed by M02.

## Scope boundary

M02 may implement the feature/build-selection infrastructure and controlled carrier/build path. It does not close R4/R14 wakeup semantics (M03), exact end-to-end Desktop compatibility (M04), or update refresh persistence across a changed official baseline (M05).

No production deployment/install is authorized in M02.
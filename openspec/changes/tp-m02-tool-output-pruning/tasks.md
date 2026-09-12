# TP_M02 Tool Output Pruning — OpenSpec Tasks

Active strategy: `BEST_EFFORT / STATICALLY_REVIEWED / UNCOMPILED / UNTESTED` authoring, followed by downstream Codex validation/integration.

Historical local-Rust-lane blocker and off-by-default feature/config work are superseded. They remain preserved in historical evidence/task state and are not silently erased.

- [x] Run Fresh Refresh Gate and freeze exact `openai/codex`, Community and package baselines.
- [x] Reconfirm request integration seam on exact fresh upstream source.
- [x] Freeze current output/success/tool-identity/apply-patch/token-estimator representations.
- [x] Select always-on activation; add no feature flag/config/off switch.
- [x] Freeze conservative compile-time policy and positive eligibility classification.
- [x] Author project-owned exact-base patch carrier.
- [x] Implement fail-closed standard/custom output classification and unambiguous call pairing in the patch.
- [x] Protect failed/unknown-success outputs, `apply_patch`, unknown/new classes, structured/media output, `ToolSearchOutput`, ambiguous pairing and non-allowlisted tools.
- [x] Implement two-user-boundary recency floor, whole-output newest protection budget and replacement-aware minimum net benefit.
- [x] Integrate the unconditional transform inside each `run_sampling_request` loop attempt before executed-tool metadata attachment / `build_prompt`.
- [x] Author semantic unit tests covering the required static matrix.
- [x] Perform adversarial static implementation review and repair findings in the patch series.
- [x] Record explicitly that no compile/test/runtime execution occurred in ChatGPT.
- [ ] Downstream Codex: critically inspect patch against execution-time source and adapt drift/API mismatches.
- [ ] Downstream Codex: format/compile/run focused and integration tests; persist exact commands/results.
- [ ] Downstream Codex: inspect current ChatGPT Community Edition update/build/install mechanism and preserve rollback.
- [ ] Downstream Codex: update CE and integrate/install patched Codex runtime if validation remains coherent.
- [ ] Downstream Codex: perform basic smoke and record exact runtime/package/source provenance.
- [ ] Fresh independent final acceptance after downstream build/test/install/smoke evidence; do not declare runtime milestone GREEN before then.

Patch-series pointer: `implementation/patches/TP_M02_SERIES.md`.
Static review: `implementation/evidence/TP_M02_STATIC_REVIEW.md`.
Prepared tests: `implementation/evidence/TP_M02_PREPARED_TESTS.md`.
Execution handoff: `project-handoffs/TP_M02_CODEX_EXECUTION_HANDOFF.md`.

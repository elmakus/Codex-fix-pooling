# TP_M02 Tool Output Pruning — OpenSpec Tasks

These are implementation subtasks inside the OpenSpec change. Global execution ownership remains in `implementation/cards/TP_M02-*`.

- [ ] Add off-by-default feature/config plumbing using current feature/config patterns.
- [ ] Validate explicit pruning policy: replayable-tool identities, positive recent-token budget, positive minimum-savings gate, user-turn floor >= 2.
- [ ] Add focused request-time pruning core with deterministic `PruneResult` observability.
- [ ] Implement trusted standard/custom call-output identity recovery and fail-closed ambiguity handling.
- [ ] Protect failed/unknown-success outputs, `apply_patch`/mutation evidence, unknown/new classes, structured/media output and `ToolSearchOutput`.
- [ ] Implement recent user-turn floor and newest-output protection budget using current item token estimation.
- [ ] Implement replacement-aware minimum-benefit gate and stable replacement marker while preserving item metadata.
- [ ] Integrate the same pruning call into each `run_sampling_request` attempt after initial/regenerated prompt input selection and before prompt construction.
- [ ] Prove canonical history is unchanged by both initial and retry request preparation.
- [ ] Add complete R19 semantic/regression coverage listed in `specs/tool-output-pruning.md`.
- [ ] Record exact upstream base, patch/change provenance, policy settings and exact test evidence.
- [ ] Run fresh independent integrated TP_M02 acceptance review before declaring `TP_M02_PATCH_GREEN`.

Execution is currently blocked before the first coding subtask by `implementation/blockers/TP_M02_CAPABILITY_GATE.md`; no checkbox above is started in this preparation session.

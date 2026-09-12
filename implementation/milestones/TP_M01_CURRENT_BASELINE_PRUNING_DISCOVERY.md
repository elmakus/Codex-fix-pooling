# TP_M01 — Current-baseline pruning discovery

- Execution status: `READY`
- Checkpoint on GREEN: `TP_M01_DISCOVERY_GREEN`
- Implementation: research/discovery only; no pruning code or production/runtime mutation
- Branch: `tool-output-pruning`

## Outcome

Establish whether custom tool-output pruning is still needed on the exact current Codex/Desktop baseline and define the behavior, safety, effectiveness and compatibility contract required before TP_M02 may implement anything.

## Required cards

1. `TP_M01-T01 — Pin baselines and map current request/context architecture`
2. `TP_M01-T02 — Issue strict upstream pruning-equivalence verdict`
3. `TP_M01-T03 — Define protected-output and threshold safety contract`
4. `TP_M01-T04 — Define effectiveness benchmark and quality regression matrix`
5. `TP_M01-T05 — Select TP_M02 strategy and refresh runtime-delivery compatibility assumptions`

## Integrated acceptance

TP_M01 is GREEN only when:

- exact `openai/codex`, Community Desktop and relevant bundled runtime/package identities are durable;
- current request/context/tool-output architecture is source-grounded;
- pruning equivalence verdict is `EQUIVALENT`, `NOT_EQUIVALENT`, or `UNKNOWN`, with `UNKNOWN` blocking TP_M02 implementation selection;
- protected-output policy candidate and threshold decision inputs are explicit;
- canonical-history vs request-payload semantics are explicit;
- repeatable effectiveness metric/fixture and quality-regression matrix are defined;
- direct rebase vs adapted reimplementation vs no-custom-patch has an evidence-backed verdict or explicit blocker;
- shared `custom-codex-runtime` delivery/compatibility assumptions used by this branch are refreshed;
- no pruning implementation has started.

## OpenSpec

Skip for TP_M01. Re-evaluate just-in-time before TP_M02.

## External side effects

None beyond durable GitHub project-state writes. No production install, package replacement, Codex fork creation/rebase, or runtime mutation is authorized.

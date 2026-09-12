# TP_M01 — Current-baseline pruning discovery

- Execution status: `DONE`
- Verdict: `GREEN`
- Checkpoint: `TP_M01_DISCOVERY_GREEN`
- Checkpoint kind: logical (no pushed Git tag claimed; active connector exposes no tag-creation action)
- Reviewed implementation/discovery head: `506c7f38bd4d71aeb0be50d0d70b8922b8ca4e60`
- Acceptance evidence: `implementation/evidence/TP_M01_ACCEPTANCE.md`
- Cumulative handoff: `project-handoffs/TP_M01_HANDOFF.md`
- Implementation: research/discovery only; no pruning code or production/runtime mutation
- Branch: `tool-output-pruning`

## Outcome

Establish whether custom tool-output pruning is still needed on the exact current Codex/Desktop baseline and define the behavior, safety, effectiveness and compatibility contract required before TP_M02 may implement anything.

Outcome achieved. Required fresh independent review accepted T02/T03/T05 and integrated milestone acceptance is GREEN.

## Required cards

1. `TP_M01-T01 — Pin baselines and map current request/context architecture` — DONE
2. `TP_M01-T02 — Issue strict upstream pruning-equivalence verdict` — DONE / independent review GREEN
3. `TP_M01-T03 — Define protected-output and threshold safety contract` — DONE / independent review GREEN
4. `TP_M01-T04 — Define effectiveness benchmark and quality regression matrix` — DONE
5. `TP_M01-T05 — Select TP_M02 strategy and refresh runtime-delivery compatibility assumptions` — DONE / independent review GREEN

## Integrated acceptance

TP_M01 is GREEN because:

- exact `openai/codex`, Community Desktop and relevant package identities are durable;
- current request/context/tool-output architecture is source-grounded;
- pruning equivalence verdict is independently accepted as `NOT_EQUIVALENT` on the pinned official source baseline;
- protected-output policy candidate and threshold decision inputs are explicit;
- canonical-history vs request-payload semantics are explicit;
- repeatable effectiveness metric/fixture and quality-regression matrix are defined;
- strategy is evidence-backed as `REIMPLEMENT_EQUIVALENT_BEHAVIOR`;
- shared `custom-codex-runtime` delivery/compatibility assumptions are refreshed;
- no pruning implementation has started.

Canonical integrated evidence: `implementation/evidence/TP_M01_ACCEPTANCE.md`.

## OpenSpec

Skipped for TP_M01 as research/discovery. Fresh independent review confirmed that a minimal JIT OpenSpec is required immediately before TP_M02 coding because TP_M02 introduces a new safety-sensitive behavior contract and retry semantics.

## External side effects

None beyond durable GitHub project-state writes. No production install, package replacement, Codex fork creation/rebase, Community source mutation, or runtime substitution occurred.

## Next boundary

TP_M02 is not started. Begin a fresh TP_M02 execution-preparation session from `project-handoffs/TP_M01_HANDOFF.md` / `TP_M01_DISCOVERY_GREEN`, refresh current baselines, run Capability/Refresh Gate, and create/reconcile the minimal JIT OpenSpec before implementation.

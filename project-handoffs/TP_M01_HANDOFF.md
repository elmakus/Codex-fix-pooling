# TP_M01 Handoff — Current-baseline pruning discovery

Date: 2026-09-12
Status: `GREEN / COMPLETE`
Checkpoint: `TP_M01_DISCOVERY_GREEN`
Reviewed implementation/discovery head: `506c7f38bd4d71aeb0be50d0d70b8922b8ca4e60`
Branch: `tool-output-pruning`
Execution policy: `chatgpt_only`

## Goal completed

TP_M01 established whether custom request-time tool-output pruning is still required on the current Codex/Community baseline and froze the discovery-level safety, effectiveness, strategy and compatibility inputs required before TP_M02 implementation.

No pruning implementation, Codex fork mutation, Community source mutation, local runtime substitution, install or production deployment occurred.

## Accepted baseline

- `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux package `26.908.40834`
- historical reference `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`

The exact public mapping from the official package's bundled `resources/codex` binary to an `openai/codex` source SHA remains unknown and must not be guessed.

## Independent review results

Required fresh independent review passed:

- `TP_M01-T02`: GREEN; `NOT_EQUIVALENT` independently confirmed.
- `TP_M01-T03`: GREEN; protected-output and threshold safety contract accepted.
- `TP_M01-T05`: GREEN; `REIMPLEMENT_EQUIVALENT_BEHAVIOR` accepted.
- Integrated TP_M01 milestone acceptance: GREEN.

Canonical review evidence: `implementation/evidence/TP_M01_ACCEPTANCE.md`.

## Accepted architecture findings

Current official Codex has substantial context-management mechanisms, including per-tool truncation, `ContextManager::for_prompt` normalization, local/remote/token-budget compaction, and context-window recovery rewriting. These do not collectively provide the required historical request-time pruning semantics.

The desired normal pruning boundary remains a derived model-request payload, not destructive canonical-history mutation. A future implementation must cover initial and retry/regenerated request construction.

Current relevant output representations include:

- `FunctionCallOutput`;
- `CustomToolCallOutput`;
- `ToolSearchOutput`.

Standard/custom outputs have richer payload/metadata than the historical patch. `apply_patch` can use custom-tool representation.

## Accepted safety contract

Initial implementation must fail closed.

Protected categories include:

- failed standard/custom outputs;
- ambiguous/unknown success unless explicitly classified safe;
- `apply_patch` and equivalent durability-sensitive mutation evidence;
- unknown/new/unclassifiable tool/output classes;
- malformed or ambiguous call/output pairing;
- structured/media output not explicitly supported;
- current/recent user-turn region;
- newest protected output budget;
- `ToolSearchOutput` in the initial implementation;
- any future output classified as durability-sensitive.

Only explicitly classified replayable verbose text output may become eligible.

Historical `40k protected / 20k minimum` values are benchmark anchors, not frozen constants.

## Effectiveness and regression contract

Use paired identical-history disabled/enabled request measurement.

Primary effectiveness metric: current request-token estimator over the actual request shape. Record absolute tokens saved, reduction ratio, replacement overhead and protected/eligible classification.

Hard structural safety matrix is veto-capable regardless of savings. Behavioral continuation cases cover old verbose success, retained failure diagnostics, retained patch evidence, standard/custom parity, tool-discovery continuity, retries, compaction interaction and no-prune control.

Canonical benchmark/evidence: `implementation/evidence/TP_M01-T04_BENCHMARK_AND_REGRESSION_MATRIX.md`.

## Selected TP_M02 strategy

`REIMPLEMENT_EQUIVALENT_BEHAVIOR`

Use a minimal isolated change on an owned patch carrier/fork based on an exact selected upstream Codex SHA. Preserve `d70b903` as provenance/reference semantics, not as a required historical diff.

Do not import the full `tekacs/custom-cli` stack.

## Community runtime-delivery boundary

At the pinned/current Community baseline:

- verified official package remains baseline provenance;
- official bundled `resources/codex` remains stock/default runtime;
- `CODEX_CLI_PATH` remains the alternate runtime-selection seam;
- Linux features remain opt-in and can provide hooks/resources/settings;
- updater rebuilds preserve enabled feature IDs/settings;
- feature intent may persist across updates, but compatibility/equivalence verdicts may not;
- unknown/red compatibility must fail closed to stock `resources/codex`.

Desktop compatibility must later be proven against the exact official package/runtime; source recency alone is insufficient.

## OpenSpec gate before TP_M02

JIT OpenSpec is required immediately before TP_M02 coding.

Keep it minimal and limited to TP_M02 behavior:

- enable/disable semantics;
- request-time/non-destructive history invariant;
- protected/eligible classification and fail-closed behavior;
- threshold semantics without unsupported frozen values;
- retry/regenerated request coverage;
- standard/custom parity;
- observable pruning/provenance test evidence.

Do not pull later Community updater/package-selection contracts into TP_M02 unless implementation actually crosses that boundary.

## Known deferred items

Not blockers for TP_M01:

- exact bundled runtime -> upstream source-SHA mapping;
- final numeric thresholds;
- actual measured effectiveness;
- exact custom-runtime/Desktop compatibility;
- update-path operational proof.

These are later milestone gates.

## Durable provenance

Card evidence:

- `implementation/evidence/TP_M01-T01_BASELINE_ARCHITECTURE.md`
- `implementation/evidence/TP_M01-T02_PRUNING_EQUIVALENCE.md`
- `implementation/evidence/TP_M01-T03_SAFETY_CONTRACT.md`
- `implementation/evidence/TP_M01-T04_BENCHMARK_AND_REGRESSION_MATRIX.md`
- `implementation/evidence/TP_M01-T05_STRATEGY_AND_COMPATIBILITY.md`

Final independent acceptance:

- `implementation/evidence/TP_M01_ACCEPTANCE.md`

## Checkpoint note

Logical checkpoint: `TP_M01_DISCOVERY_GREEN`.

The active GitHub connector supports branch/file writes and readback but does not expose tag creation, so no pushed Git tag is claimed. Use the exact final `tool-output-pruning` branch HEAD recorded in Task Board/project state after closure reconciliation.

## Exact next step

Start a fresh TP_M02 execution-preparation session from this handoff/checkpoint. Re-read current workflow `main`, refresh exact upstream/Community baselines, run Capability/Refresh Gate, then create/reconcile the minimal JIT OpenSpec. Do not write pruning code until that gate/spec is coherent.

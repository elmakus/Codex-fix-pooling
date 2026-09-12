# Pre-implementation Plan Audit — Tool Output Pruning — 2026-09-12

## Scope

Independent review of the `tool-output-pruning` workstream before Execution Prep for `TP_M01 — Current-baseline pruning discovery`.

Audited authority:

- `PROJECT.md`
- `requirements/REQUIREMENTS.md`
- `planning/MASTER_PLAN.md`
- `research/tool-output-pruning.md`
- current `elmakus/chatgpt-codex-project-workflow:main`

Fresh external baseline sampled during audit:

- `openai/codex:main` = `944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- `ilysenko/codex-desktop-linux:main` = `249cd4b64d42434f51417fec4a318750d461b676`
- latest Community commit identifies official Linux package `26.908.40834`

## Verdict

`GREEN AFTER P1 CORRECTION`

No blocker requires a new architecture decision or user choice before TP_M01 Execution Prep.

## P1 finding — milestone namespace collision

The pruning plan initially used headings `M01`–`M06` while checkpoints already used `TP_M01_*`–`TP_M06_*`. The sibling wakeup workstream also uses `M01`–`M06` in the same repository. If durable artifacts from both workstreams are ever compared, merged or referenced together, ambiguous `M01-T01`, milestone files and handoff names would be unsafe.

Resolution:

- namespace all pruning milestones as `TP_M01`–`TP_M06`;
- pruning Task Cards must use `TP_M01-Txx` etc.;
- pruning milestone/handoff/evidence filenames must use the `TP_` namespace.

The Master Plan was corrected before Execution Prep.

## Architecture audit

### Separate capability boundary — GREEN

Keeping pruning independent from background-exec wakeup is correct. They solve different causes of context/token waste and need independent upstream-equivalence, safety and regression evidence.

### Whole custom stack exclusion — GREEN

The plan correctly rejects consuming `tekacs/custom-cli` wholesale. Only pruning behavior and proven dependencies may be carried.

### Behavior over historical diff — GREEN

Treating `d70b903a4edbbb02c5009ae8e6194f2128d80213` as provenance/reference semantics rather than a mandatory cherry-pick is appropriate because current Codex architecture may have moved.

### Non-destructive request-time intent — GREEN

The plan correctly distinguishes model-request transformation from canonical rollout/history mutation. This is a material safety invariant and must be verified in TP_M01/TP_M02.

### Generic runtime delivery reuse — GREEN

Reusing the sibling workstream's generic custom-runtime delivery boundary is preferable to designing a second package replacement mechanism. TP_M01 must refresh the relevant Community/runtime assumptions before depending on them.

## Requirement and acceptance audit

### Requirement coverage — GREEN

R1–R23 all have milestone ownership. TP_M01 owns the discovery inputs needed to decide whether custom implementation is justified and safe.

### Upstream-equivalence gate — GREEN

The plan correctly requires `EQUIVALENT | NOT_EQUIVALENT | UNKNOWN`, with `UNKNOWN` blocking implementation selection. Absence of the old source marker is not treated as proof of non-equivalence.

### Protected-output semantics — GREEN

The plan does not prematurely freeze `apply_patch`, failure, recency and tool-class handling beyond requiring explicit current-baseline analysis and tests.

### Threshold semantics — GREEN

Historical `40k protected / 20k minimum` values are treated as inputs, not product constants. This avoids cargo-culting values that may be wrong for current model/context behavior.

### Effectiveness acceptance — GREEN

The plan requires paired disabled/enabled measurement on identical representative histories and rejects divergence that does not show material benefit. TP_M01 must define the concrete metric/threshold before TP_M03.

### Quality/regression acceptance — GREEN

The plan correctly requires continuation, diagnostics, patch evidence and compaction/context-management interaction tests rather than optimizing token reduction alone.

## Dependency and milestone audit

Dependency order is sound:

`TP_M01 discovery → TP_M02 implementation → TP_M03 effectiveness/quality → TP_M04 Desktop integration → TP_M05 update lifecycle → TP_M06 consolidation`

TP_M04 intentionally follows semantic/effectiveness proof so Desktop integration does not validate an unjustified patch. TP_M05 follows Desktop integration because updater persistence applies to a known-compatible runtime. TP_M06 is last because consolidation is maintenance/package architecture, not behavior definition.

## OpenSpec audit

TP_M01 is research/discovery and does not justify OpenSpec. Re-evaluate immediately before TP_M02. A minimal OpenSpec is likely justified if implementation introduces durable feature settings, threshold/config contracts, provenance metadata or cross-package updater semantics.

## Security / integrity / rollback audit

GREEN with explicit later gates:

- official package provenance remains required;
- unknown compatibility fails closed;
- production runtime mutation is excluded from TP_M01;
- rollback/disable path is owned by later integration/update milestones;
- no destructive canonical-history mutation is allowed merely for savings.

## Overengineering audit

GREEN. The plan contains no separate pruning package system, no generic DAG engine, no speculative OpenSpec and no premature fixed threshold API. Later work remains outcome-specific until refreshed.

## TP_M01 readiness conclusion

TP_M01 is suitable for Execution Prep. It should be decomposed into bounded discovery cards covering:

1. exact baseline identity + current request/context architecture;
2. strict upstream-equivalence analysis;
3. protected-output and threshold safety contract;
4. effectiveness + quality benchmark contract;
5. implementation-strategy and shared runtime-delivery/compatibility synthesis.

No pruning implementation should occur during TP_M01.

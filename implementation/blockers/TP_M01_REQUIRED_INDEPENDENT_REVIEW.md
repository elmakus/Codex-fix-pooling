# TP_M01 — Required fresh independent review gate

Date: 2026-09-12
Status: `REVIEW REQUIRED BEFORE MILESTONE GREEN`
Execution policy: `chatgpt_only`

## Why execution stops here

All five TP_M01 discovery cards now have durable executor evidence, but terminal TP_M01 acceptance cannot be claimed in the executing chat because:

- `TP_M01-T02` marks independent review `REQUIRED`;
- `TP_M01-T03` marks independent review `REQUIRED`;
- `TP_M01-T05` marks independent review `REQUIRED`;
- current workflow `workflow/REVIEW_AND_HANDOFF.md` defines required independent review as a fresh independent normal ChatGPT chat reading durable repository/evidence rather than relying on executor narrative.

The same executing session cannot satisfy that independence requirement.

## Durable review inputs

Read current workflow `main`, then project durable state on `tool-output-pruning`.

Primary project pointers:

- `PROJECT.md`
- `implementation/TASK_BOARD.yaml`
- `implementation/milestones/TP_M01_CURRENT_BASELINE_PRUNING_DISCOVERY.md`
- cards `TP_M01-T01` through `TP_M01-T05`

Executor evidence:

1. `implementation/evidence/TP_M01-T01_BASELINE_ARCHITECTURE.md`
2. `implementation/evidence/TP_M01-T02_PRUNING_EQUIVALENCE.md`
3. `implementation/evidence/TP_M01-T03_SAFETY_CONTRACT.md`
4. `implementation/evidence/TP_M01-T04_BENCHMARK_AND_REGRESSION_MATRIX.md`
5. `implementation/evidence/TP_M01-T05_STRATEGY_AND_COMPATIBILITY.md`

Canonical requirements/plan:

- `requirements/REQUIREMENTS.md`
- `planning/MASTER_PLAN.md`
- `research/tool-output-pruning.md`
- `research/pre-implementation-plan-audit-tool-output-pruning-2026-09-12.md`

## Findings awaiting independent acceptance

- pinned `openai/codex` source baseline: `944d6fd1ba4baab69dbedd205282dc72ec20abb5`;
- pinned Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`;
- official Linux package baseline: `26.908.40834`;
- strict pruning-equivalence verdict: `NOT_EQUIVALENT`;
- safety policy: unknown/ambiguous/durability-sensitive outputs fail closed and remain protected;
- benchmark contract: paired identical-history request-token measurement plus hard and behavioral regression matrix;
- selected TP_M02 strategy: `REIMPLEMENT_EQUIVALENT_BEHAVIOR`;
- preferred carrier: minimal isolated change on an owned exact-upstream-based Codex patch carrier/fork;
- Community delivery direction: reuse verified official package + opt-in feature/update framework + compatibility-gated `CODEX_CLI_PATH`; do not create a pruning-specific second replacement mechanism;
- JIT OpenSpec: `REQUIRED` immediately before TP_M02 implementation;
- exact public bundled `resources/codex` binary -> `openai/codex` source-SHA mapping remains unavailable; this does not block source-level TP_M02 but forbids premature Desktop compatibility/runtime-substitution claims.

## Independent review scope

Fresh review must independently verify at minimum:

### T02 verdict

- historical `d70b903` semantics were represented accurately;
- current upstream mechanisms considered are sufficient to support `NOT_EQUIVALENT`;
- verdict does not rest only on missing names/markers;
- no current equivalent mechanism was overlooked.

### T03 safety contract

- R6/R19 protected categories are fully covered;
- failure, `apply_patch`, recent output, unknown/new tool class and only-model-visible evidence protections are safe and source-grounded;
- current standard/custom/ToolSearch representations are handled correctly;
- threshold analysis does not freeze unsupported historical constants;
- fail-closed semantics are coherent.

### T05 strategy

- T02/T03/T04 logically support `REIMPLEMENT_EQUIVALENT_BEHAVIOR` rather than no-patch/direct historical carry;
- Community `resources/codex`, feature framework, `CODEX_CLI_PATH` and updater persistence assumptions remain current at the pinned Community ref;
- compatibility gate/fallback semantics satisfy R12-R18/R22/R23;
- JIT OpenSpec requirement before TP_M02 is appropriate and scoped minimally.

## Integrated TP_M01 acceptance review

After independent card review, evaluate every milestone acceptance item from `implementation/milestones/TP_M01_CURRENT_BASELINE_PRUNING_DISCOVERY.md`.

If RED:

- persist exact review evidence;
- reopen/create bounded corrective work;
- do not create GREEN checkpoint.

If GREEN:

1. write `implementation/evidence/TP_M01_ACCEPTANCE.md` with explicit independent review verdict;
2. write cumulative `project-handoffs/TP_M01_HANDOFF.md`;
3. reconcile `PROJECT.md` to TP_M01 complete / TP_M02 not started;
4. reconcile Task Board milestone to `done` with exact `implementation_head`, acceptance evidence and handoff;
5. create/push checkpoint/tag `TP_M01_DISCOVERY_GREEN` if supported by project branch/checkpoint policy;
6. verify all writes/readback and exact final branch state;
7. do not start TP_M02 in the review chat unless a separate execution-prep/current workflow step explicitly authorizes it.

## Fresh-session start instruction

Use a fresh normal ChatGPT chat with this request:

> Use `elmakus/chatgpt-codex-project-workflow:main`. Continue `elmakus/Codex-fix-pooling` on branch `tool-output-pruning` from `implementation/blockers/TP_M01_REQUIRED_INDEPENDENT_REVIEW.md`. Perform the required fresh independent review for TP_M01-T02, T03 and T05 and then the integrated TP_M01 Milestone Acceptance Review. Do not implement pruning or start TP_M02. If GREEN, finalize TP_M01 acceptance evidence, cumulative handoff, Task Board/PROJECT reconciliation and checkpoint `TP_M01_DISCOVERY_GREEN` according to the current workflow. If RED, persist exact corrective evidence and reopen/create bounded corrective work.

## Safety state

No pruning implementation, Codex fork mutation, Community package modification, local installation, runtime substitution or production deployment occurred during TP_M01 execution.

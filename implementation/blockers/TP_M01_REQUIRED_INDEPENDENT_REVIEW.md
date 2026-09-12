# TP_M01 — Required fresh independent review gate

Date opened: 2026-09-12
Date resolved: 2026-09-12
Status: `RESOLVED / GREEN`
Execution policy: `chatgpt_only`

## Resolution

A fresh independent normal ChatGPT chat completed the required review for:

- `TP_M01-T02` — GREEN; `NOT_EQUIVALENT` independently confirmed;
- `TP_M01-T03` — GREEN; protected-output and threshold safety contract accepted;
- `TP_M01-T05` — GREEN; `REIMPLEMENT_EQUIVALENT_BEHAVIOR` accepted.

The same fresh review then completed integrated TP_M01 milestone acceptance with verdict `GREEN`.

Canonical final review evidence:

- `implementation/evidence/TP_M01_ACCEPTANCE.md`
- `project-handoffs/TP_M01_HANDOFF.md`

Checkpoint: `TP_M01_DISCOVERY_GREEN`.

The active GitHub connector does not expose tag creation, so the checkpoint is recorded as a durable logical checkpoint and no pushed Git tag is claimed.

## Reviewed baseline

- project discovery/review start head: `506c7f38bd4d71aeb0be50d0d70b8922b8ca4e60`
- `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux package `26.908.40834`
- historical reference `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`

## Accepted findings

- current official source is not semantically equivalent to the historical request-time pruning contract;
- current safety contract appropriately fails closed for failed, ambiguous, mutation-sensitive, structured/media, discovery/capability and unknown/new output classes;
- normal pruning must be request-only with canonical history preserved for savings purposes;
- retry/regenerated request construction must receive the same pruning policy;
- historical 40k/20k values remain benchmark anchors rather than frozen constants;
- current Community runtime-selection/update assumptions remain valid at the pinned/current baseline;
- TP_M02 should use a minimal isolated current-baseline reimplementation, not no-patch and not a forced historical cherry-pick;
- minimal JIT OpenSpec is required before TP_M02 coding.

## Safety state

No pruning implementation, Codex fork mutation, Community package/source modification, local installation, runtime substitution or production deployment occurred during TP_M01 review/closure.

## Next step

Do not treat this file as an active blocker. Start future work from `project-handoffs/TP_M01_HANDOFF.md` and the terminal TP_M01 state in `implementation/TASK_BOARD.yaml`. TP_M02 remains not started.

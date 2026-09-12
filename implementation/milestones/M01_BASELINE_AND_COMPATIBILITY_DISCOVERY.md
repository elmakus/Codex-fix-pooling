# M01 — Baseline and compatibility discovery

## Status

Execution status: READY
Checkpoint target: `M01_BASELINE_GREEN`
Required prior checkpoint: none (initial milestone; starts from current canonical planning state)
Execution policy: `chatgpt_only`
OpenSpec: not required for M01 discovery

## Outcome

Produce evidence sufficient to design M02 without guessing how the official Desktop package obtains/uses Codex, how Desktop/app-server compatibility can drift, whether upstream already contains the wakeup behavior, or how a replacement runtime can be safely admitted.

## Task structure

1. `M01-T01` — Trace official package and bundled Codex baseline
2. `M01-T02` — Map bundled runtime to Codex source and protocol baseline
3. `M01-T03` — Audit runtime override, feature, and update persistence seams
4. `M01-T04` — Determine upstream equivalence and patch-carrier refresh strategy
5. `M01-T05` — Freeze compatibility gate and minimum M02 test matrix

T01 is the only initially READY card. T02 and T03 depend on T01. T04 depends on T02. T05 depends on T02, T03 and T04.

## Milestone acceptance

M01 is GREEN only when all card evidence is durable and the Master Plan M01 acceptance conditions are met, including exact audited package/source identities, explicit source-mapping verdict, protocol-risk inventory, strict upstream-equivalence verdict, patch-carrier/refresh decision, and a fail-closed compatibility gate with minimum M02 prerequisite tests.

No custom runtime is built, forked, rebased, cherry-picked, substituted, packaged into Community, installed, or deployed during M01.

# M01 — Baseline and compatibility discovery

## Status

Execution status: DONE
Checkpoint: `M01_BASELINE_GREEN`
Implementation head: `8191b7a5664beb371bf62dbe6ec66175d362457b`
Acceptance evidence: `implementation/evidence/M01_ACCEPTANCE.md`
Cumulative handoff: `project-handoffs/M01_HANDOFF.md`
Required prior checkpoint: none (initial milestone)
Execution policy: `chatgpt_only`
OpenSpec: not required for M01 discovery

## Outcome

Produce evidence sufficient to design M02 without guessing how the official Desktop package obtains/uses Codex, how Desktop/app-server compatibility can drift, whether upstream already contains the wakeup behavior, or how a replacement runtime can be safely admitted.

Outcome achieved. Integrated acceptance is GREEN.

## Task structure

1. `M01-T01` — Trace official package and bundled Codex baseline — DONE
2. `M01-T02` — Map bundled runtime to Codex source and protocol baseline — DONE
3. `M01-T03` — Audit runtime override, feature, and update persistence seams — DONE
4. `M01-T04` — Determine upstream equivalence and patch-carrier refresh strategy — DONE
5. `M01-T05` — Freeze compatibility gate and minimum M02 test matrix — DONE

## Milestone acceptance

M01 is GREEN. All card evidence is durable and the Master Plan M01 acceptance conditions are met:

- exact audited package/source identities are recorded;
- source-mapping verdict is explicit and no source commit is guessed;
- protocol-risk inventory is durable;
- strict upstream-equivalence verdict is explicit;
- patch-carrier/refresh decision is recorded;
- fail-closed compatibility gate and minimum downstream test matrix are defined.

No custom runtime was built, forked, rebased, cherry-picked, substituted, packaged into Community, installed, or deployed during M01.

Next phase: Execution Prep for `M02 — Feature contract and build path` from checkpoint `M01_BASELINE_GREEN`.
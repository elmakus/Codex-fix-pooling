# M02 Plan Addendum — Best-Effort MVP and Codex Handoff

Status: accepted
Date: 2026-09-12
Supersedes: M02 execution/acceptance details in `planning/MASTER_PLAN.md` where they require ChatGPT-local build proof before a handoff can be prepared.

## Outcome

Prepare the strongest source-level MVP for Codex: runtime patch provenance/recipe, Community Edition feature patch, and a single execution handoff. Environment-dependent build/test evidence is delegated to Codex and remains UNKNOWN until produced.

## Cards

- `M02-T03` — Prepare runtime patch carrier recipe and provenance bundle.
- `M02-T04` — Prepare best-effort `custom-codex-runtime` Community integration patch.
- `M02-T05` — Assemble Codex apply/build/fix/verify handoff package.

## Checkpoint

`M02_MVP_HANDOFF_READY`

This checkpoint means the handoff is complete enough for Codex to attempt implementation efficiently. It does not mean the feature, runtime, package, Desktop integration, or wakeup behavior has been verified.

## Execution policy

`mixed`.

ChatGPT performs preparation that can be grounded from source and durable repo state. Codex is the intended executor for environment-dependent application/build/debug/verification after T05.

## Frozen invariants retained

- official OpenAI package verification remains first;
- candidate-tree `resources/codex` replacement remains the selected substitution seam;
- no live production-tree overwrite mechanism;
- feature disabled means stock official runtime path;
- PASS/FAIL/UNKNOWN semantics remain fail-closed for claims of compatibility;
- every new official package tuple invalidates prior compatibility evidence;
- reference wakeup provenance remains `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` unless strict upstream equivalence is later proven.

## Acceptance

M02 is complete when:

1. exact refreshed source baselines and patch provenance are recorded;
2. a best-effort runtime patch/rebase recipe is durable;
3. a best-effort Community feature patch is durable and source-reviewed against the refreshed baseline;
4. known UNKNOWNs and non-claims are explicit;
5. Codex receives deterministic instructions to inspect, apply/adapt, build, test, repair, and report exact failures;
6. no production installation was modified.

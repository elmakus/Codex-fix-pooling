# M01 Handoff — Baseline and compatibility discovery

Status: GREEN
Checkpoint: `M01_BASELINE_GREEN`
Acceptance head: `8191b7a5664beb371bf62dbe6ec66175d362457b`
Acceptance evidence: `implementation/evidence/M01_ACCEPTANCE.md`

## What became true

M01 established the evidence needed to design the custom Codex runtime integration without guessing Desktop/runtime compatibility.

### Official package baseline

Audited Community source: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`.

Official Linux Desktop baseline: `26.908.40834`.

The Community trust path verifies OpenAI's signed stable APT `InRelease`, verifies the indexed `Packages` file digest, verifies the selected architecture-specific `.deb` SHA-256, validates package name/version/architecture, extracts `/usr/lib/chatgpt`, requires executable `resources/codex`, and copies the official application payload into Community staging.

The stock Community `resources/codex` therefore originates from the verified official `.deb`; it is not separately downloaded by Community.

### Source ancestry

The exact bundled Codex runtime cannot currently be deterministically mapped to a public `openai/codex` Git revision from repository metadata alone. Desktop version proximity must not be used as a substitute.

A safe mapping procedure is documented in `implementation/evidence/M01-T02_SOURCE_PROTOCOL.md`: bind the exact official `.deb`, inspect bundled binary `--version` and SHA-256, resolve matching public release/tag when present, and require uniquely matching artifact/source evidence before declaring deterministic ancestry.

### Desktop/app-server compatibility

Current app-server initialization uses `clientInfo` and capability declarations but does not negotiate a general top-level wire protocol version. Compatibility can therefore drift across invocation, initialize, thread, turn, notification/item, feature/extension, auth/account/config/model and tool surfaces even when the process launches successfully.

Exact-baseline dynamic Desktop/app-server smoke testing is mandatory before a replacement runtime may PASS compatibility.

### Current upstream-equivalence state

Reference behavior remains `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`.

Strict R4 equivalence requires:

1. idle-session wake on yielded unified-exec completion;
2. active-turn pushed completion delivery;
3. no duplicate pushed completion when terminal result returned inline;
4. model-facing guidance discouraging completion-only empty polling while preserving valid interaction/intermediate-output polling.

The exact current Desktop-bundled runtime is `UNKNOWN` because it is not source-mapped.

The public OpenAI main inspected in M01-T04 was not strictly equivalent; patch retirement is not authorized on current evidence.

### Patch carrier

Accepted maintenance direction: use an owned `elmakus/codex` fork as the controlled patch carrier when divergence is required, while retaining the tekacs commit as immutable provenance for the original fix.

No fork/rebase/cherry-pick/build occurred in M01.

### Integration seam

Best current M02 design candidate:

- keep official bundled `resources/codex` as stock baseline;
- build/acquire a controlled candidate runtime only inside managed candidate construction;
- run compatibility gate before selection;
- stage custom runtime at a feature-owned path;
- use package-level `CODEX_CLI_PATH` to select it after PASS.

This must still prove that the exact Desktop launch paths honor `CODEX_CLI_PATH`. If they do not, candidate-tree replacement of `resources/codex` remains the fallback package-level seam.

Do not introduce a second updater or post-install binary overwrite mechanism.

### Updater persistence

`linux-features/` is the correct disabled-by-default integration boundary. Native update-builder snapshots preserve enabled feature IDs/settings, rebuild from newly verified official packages, reject feature drift/build failures before promotion, defer promotion until the app exits, perform atomic candidate exchange, and retain the immediately previous managed package as rollback target.

Every new official package tuple invalidates any prior custom-runtime compatibility PASS.

### Compatibility gate

Only `PASS` authorizes custom-runtime selection. `FAIL` and `UNKNOWN` both prohibit it.

Required gate layers are documented in `implementation/evidence/M01-T05_COMPATIBILITY_GATE.md`:

- G0 exact official baseline identity;
- G1 custom candidate provenance;
- G2 source relation and strict upstream-equivalence state;
- G3 build/patch integrity;
- G4 strict wakeup behavior;
- G5 exact Desktop/app-server compatibility;
- G6 feature selection and rollback readiness;
- G7 per-update refresh.

Current substitution state is `UNKNOWN / NOT AUTHORIZED` because no candidate runtime was built or Desktop integration-tested during M01.

## Durable evidence

- `implementation/evidence/M01-T01_BASELINE.md`
- `implementation/evidence/M01-T02_SOURCE_PROTOCOL.md`
- `implementation/evidence/M01-T03_INTEGRATION_SEAMS.md`
- `implementation/evidence/M01-T04_EQUIVALENCE_REFRESH.md`
- `implementation/evidence/M01-T05_COMPATIBILITY_GATE.md`
- `implementation/evidence/M01_ACCEPTANCE.md`

## Side effects / external state

No production installation, runtime state, `codex-desktop-linux`, `tekacs/codex`, `openai/codex`, or Codex fork was modified. External repositories were researched read-only. Project repository durable state was updated on `main` according to `chatgpt_only` policy.

## OpenSpec

None for M01. Re-evaluate just-in-time during M02 execution prep; a durable feature/settings/provenance/update contract is likely to justify OpenSpec once exact implementation seams are refreshed.

## Architecture reopen assessment

No strategic architecture reopen is required after M01. The original direction remains valid:

- generic opt-in `custom-codex-runtime` feature;
- signed official package remains provenance baseline;
- compatibility before substitution;
- fail closed;
- retire divergence when strict upstream equivalence is proven;
- atomic managed-package delivery and rollback.

The only intentionally unresolved implementation choice is Rank 1 (`CODEX_CLI_PATH` staged runtime) versus Rank 2 (candidate-tree `resources/codex` replacement), with Rank 1 preferred pending exact launch-path verification.

## Requirements status

M01 provides accepted research/design inputs for R6/R7/R8/R9. No downstream feature behavior is claimed implemented yet. R11 was satisfied throughout M01.

Implementation ownership remains:

- M02 — R1/R2/R3/R6/R7/R8/R10/R12/R13 portions;
- M03 — R4/R14;
- M04 — R15 and exact Desktop integration;
- M05 — R5/R7/R9/R13/R16 update/refresh portions;
- M06 — upstreamability/release decision.

## Next durable starting point

Next phase: Execution Prep for `M02 — Feature contract and build path`.

Fresh session should read:

1. workflow `CHATGPT.md` and execution-prep routing modules;
2. project `PROJECT.md`;
3. this handoff;
4. `planning/MASTER_PLAN.md` M02;
5. `requirements/REQUIREMENTS.md` M02-owned requirements;
6. M01-T03 and M01-T05 evidence in particular;
7. then refresh current `ilysenko/codex-desktop-linux`, `openai/codex`, and exact official package baseline before creating M02 cards/OpenSpec.

Do not start M02 implementation from stale M01 source paths without Refresh Gate.
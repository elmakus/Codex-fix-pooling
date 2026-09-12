# M01 Integrated Acceptance — Baseline and compatibility discovery

Date: 2026-09-12
Verdict: GREEN
Acceptance head reviewed: `8191b7a5664beb371bf62dbe6ec66175d362457b`
Execution policy: `chatgpt_only`

## Scope reviewed

Integrated review covered all completed M01 cards and their durable evidence:

- M01-T01 — exact official Desktop/package baseline and `resources/codex` provenance chain;
- M01-T02 — bundled-runtime source-mapping verdict and Desktop/app-server protocol drift inventory;
- M01-T03 — runtime override, Linux feature framework and updater persistence seams;
- M01-T04 — strict upstream-equivalence verdict, patch refresh lifecycle and patch-carrier decision;
- M01-T05 — fail-closed compatibility gate and minimum downstream acceptance matrix.

No custom runtime was built, forked, rebased, cherry-picked, substituted, installed or deployed during M01.

## Acceptance checks

### Exact audited identities — PASS

Audited Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`.

Official Desktop package baseline: `26.908.40834` with architecture-specific signed repository paths and SHA-256 values recorded in M01-T01 evidence.

Current source research also pinned exact `openai/codex` revisions where used. Exact bundled-runtime source ancestry was deliberately not guessed.

### Source mapping verdict — PASS

The exact Desktop-bundled runtime cannot currently be deterministically mapped to a public `openai/codex` commit from repository metadata alone. M01 classifies the mapping as unavailable with current evidence and documents a reproducible derivation procedure for when exact artifact bytes are available.

This satisfies the milestone requirement that no implementation assumption depend on an unverified version mapping.

### Protocol-risk inventory — PASS

M01 documents the relevant Desktop/app-server compatibility surfaces: process/transport invocation, initialize/capabilities, thread lifecycle, turn lifecycle, notifications/items, experimental/extension behavior, and account/auth/config/model operations.

Current app-server initialize exposes client capability negotiation but no general top-level wire-protocol version negotiation; therefore successful process startup alone cannot establish compatibility.

### Upstream-equivalence verdict — PASS

For the exact official Desktop bundled runtime, strict R4 equivalence remains `UNKNOWN` because exact source/runtime mapping is unavailable.

For the refreshed public `openai/codex:main` inspected by M01-T04, strict equivalence is `NOT EQUIVALENT`: the four-part reference behavior is not proven and the required no-empty-poll model guidance is absent. Patch retirement is therefore not authorized on current evidence.

### Patch carrier / refresh decision — PASS

When divergence remains necessary, use an owned `elmakus/codex` fork as the controlled patch carrier while retaining `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` as immutable source provenance. No fork was created during M01.

Every new official Desktop package tuple invalidates prior compatibility and requires source/equivalence refresh, patch refresh if still needed, patch-level behavior verification and exact Desktop compatibility verification.

### Integration/update architecture evidence — PASS

The current Community project provides suitable seams without a second updater or post-install mutation path:

- official `resources/codex` remains the stock baseline;
- `CODEX_CLI_PATH` is an existing runtime-selection seam;
- `linux-features/` is the correct disabled-by-default integration boundary;
- packaged update-builder preserves validated enabled feature IDs/settings;
- update candidate construction is fail-closed and atomic;
- previous managed package rollback already exists.

Preferred first M02 seam is a feature-staged managed runtime selected via package-level `CODEX_CLI_PATH`, subject to verifying exact Desktop launch-path coverage. Candidate-tree replacement of `resources/codex` remains the fallback seam.

### Compatibility gate — PASS

M01 freezes a three-state gate:

- `PASS` — replacement may be selected for the exact baseline/candidate pair;
- `FAIL` — replacement prohibited;
- `UNKNOWN` — replacement prohibited.

The gate binds official package identity, custom candidate provenance, source/equivalence state, patch/build integrity, strict wakeup behavior, exact Desktop/app-server compatibility, package feature/rollback behavior and per-update refresh.

For the current baseline there is no admitted custom runtime; actual substitution remains `UNKNOWN / NOT AUTHORIZED`, which is the expected M01 outcome.

### Minimum downstream test matrix — PASS

The required M02-M05 checks are assigned and explicit, including feature on/off selection, fail-closed rejection, provenance, patch semantics, Desktop startup/initialize/thread/turn/tool flow, background wake path, updater persistence, baseline invalidation, equivalence retirement, refresh failure rejection and rollback.

## Requirement coverage review

M01 supplies discovery/design evidence for R6, R7, R8 and R9 and constrains later implementation of R1-R5 and R10-R16. It does not claim implementation completion of downstream requirements.

R11 was respected: no installed production runtime or external source repository was modified.

## OpenSpec review

No OpenSpec was required for M01 because the milestone was research/discovery only. OpenSpec must be re-evaluated just-in-time before M02 implementation because the feature settings, compatibility metadata and updater behavior may establish durable cross-component contracts.

## Independent review classification

Independent fresh-chat review: OPTIONAL for this milestone. M01 performed only read-only external research plus durable project documentation; there were no production writes, security/auth changes, destructive migrations or difficult-to-reverse state changes. The integrated acceptance review was therefore performed in the active ChatGPT execution session.

## Verdict

`M01_BASELINE_GREEN`

M01 is complete. M02 may begin execution preparation from this checkpoint. M02 must not treat the current custom-runtime admission state as PASS and must re-run Refresh Gate against then-current upstream source before implementation.
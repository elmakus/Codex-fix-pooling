# Master Plan — Custom Codex Runtime for ChatGPT Community

## 1. Goal

Deliver a maintainable, opt-in integration for ChatGPT Community for Linux that can use a Codex runtime carrying the background-exec completion wakeup behavior from `tekacs/codex` commit `9ffcf8db9078eae43d4111ff94259795c1e962c9`, without manual replacement after every update and without silently running an incompatible stale Codex build.

## 2. Verified baseline

### ChatGPT Community

`ilysenko/codex-desktop-linux` verifies and repackages OpenAI's signed official Linux `.deb` and normally reuses the official bundled Codex executable at `resources/codex`.

Its Linux feature framework supports opt-in staged resources, runtime hooks, package hooks and custom build/install hooks. Native update reconstruction preserves selected feature configuration. As of audited upstream `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`, the packaged update-builder extracts the newly verified official payload and applies only locally enabled features; update promotion is atomic and retains the immediately previous managed package as rollback target.

### Source patch

`tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` adds pushed completion input for background unified-exec commands, waking idle sessions and delivering completion to active turns while avoiding duplicate completion when the initial call already returned the terminal result. Tool descriptions are also changed to discourage empty polling.

The patch is explicitly maintenance-only until upstream provides strictly equivalent behavior.

### Current upstream freshness note

The pre-implementation audit observed `openai/codex@89c8bcf37d64be69e4c8286f4541c1a84ed312a4` on 2026-09-12. Current source still exposes the ordinary unified-exec tool description rather than the patch's completion-notification guidance, so strict upstream equivalence is not established by source inspection. M01 must perform the complete behavioral/source equivalence check against the exact baseline it acquires; absence of one marker is evidence against equivalence, not a substitute for the full gate.

## 3. Target state

An opt-in Community Edition feature, provisionally named `custom-codex-runtime`, that:

1. keeps the verified OpenAI Linux package as the baseline;
2. identifies the current bundled Codex baseline;
3. determines whether the wakeup behavior is already present upstream;
4. when needed, builds/selects a compatible Codex runtime carrying the patch;
5. verifies provenance and compatibility;
6. stages that runtime into the rebuilt Community package or directs Desktop to it through an equally controlled package-level mechanism;
7. persists the feature configuration through Community updater rebuilds;
8. fails closed rather than installing a stale/incompatible replacement.

## 4. Frozen architecture decisions

### A1 — Feature, not post-install hack
The normal mechanism must be an opt-in Community build/package feature. Manual edits under `/opt/codex-desktop` are not the target architecture.

### A2 — Generic runtime override boundary
The integration is generic `custom-codex-runtime` infrastructure. `tekacs/codex` is the reference patch source, not a permanent hard-coded dependency.

### A3 — Official package remains provenance baseline
Do not bypass or weaken the existing signed OpenAI package verification path.

### A4 — Compatibility before substitution
Replacement runtime selection is conditional on a deterministic compatibility gate. Unknown compatibility means no replacement.

### A5 — Upstream-first retirement
If current official Codex proves behaviorally equivalent to the patch, do not maintain unnecessary divergence.

### A6 — Atomic delivery
Normal deployment is through a rebuilt package/app artifact with rollback, not piecemeal mutation of a running installation.

### A7 — Controlled patch carrier
Unless M01 discovers a concrete reason not to, prefer an owned `elmakus/codex` fork as the maintained patch carrier. `tekacs/codex` remains authoritative provenance for the original fix, while an owned fork gives the project explicit control over baseline rebases, provenance, CI and retirement. This is not authorization to create/rebase the fork during M01 discovery.

## 5. Non-goals

- Forking the full Electron application merely to carry this fix.
- Pinning Desktop forever to the exact historical `tekacs` commit.
- Weakening package signature/provenance checks.
- General arbitrary CLI injection without compatibility controls.
- Enabling unrelated server-side ChatGPT features.

## 6. Global invariants

- Official upstream payload must be verified before any custom substitution occurs.
- Exact custom runtime provenance must be recoverable from durable build metadata/evidence.
- A failed patch/rebase/compatibility/test gate must never silently fall back to installing an unverified custom binary.
- Disabling the feature must restore the stock bundled runtime path on the next rebuild.
- Updates must re-evaluate compatibility; prior compatibility cannot be assumed for a new official package.
- Runtime behavior equivalent to R4 must be testable independently from the GUI.
- Compatibility is tied to an exact official Desktop package identity and bundled-runtime identity, not merely a human-readable version string.
- A custom runtime is eligible only when its upstream source baseline is deterministically tied to, or otherwise proven compatible with, the official bundled runtime by the M01 gate. Ambiguous mapping is not success.
- Patch refresh is baseline-relative: each new official package requires upstream-equivalence detection first, then patch application/rebase and the full compatibility/acceptance gate if divergence is still needed.

## 7. Known source seams

Current likely integration seams in `ilysenko/codex-desktop-linux`:

- upstream package metadata, trust verification and extraction path;
- official runtime location `resources/codex`;
- `linux-features/` feature framework and build/install hooks;
- `packaging/update-builder/` plus `codex-update-manager` rebuild/promotion/rollback flow;
- existing `CODEX_CLI_PATH` handling in Nix and selected features such as shared app-server socket.

These are candidate seams only. Exact implementation seams must be refreshed against current `main` immediately before implementation.

## 8. Milestones

### M01 — Baseline and compatibility discovery

Outcome: establish the evidence and deterministic gate needed before any custom runtime feature is designed or implemented.

Work includes:

- trace exactly how current `codex-desktop-linux` discovers, verifies, extracts, stages and packages official `resources/codex`, including architecture-specific package identity;
- establish the relationship between official Linux Desktop package identity and bundled Codex runtime identity/version;
- determine whether the bundled runtime can be mapped deterministically to an `openai/codex` source revision; if not, define the strongest safe alternative identity/compatibility proof and treat unresolved ambiguity as fail-closed;
- inventory the Desktop/app-server protocol surface actually exercised by the current Desktop baseline and identify drift-sensitive seams relevant to runtime substitution;
- inspect `CODEX_CLI_PATH`, the Linux feature framework and `codex-update-manager`/packaged update-builder to establish the later substitution and update-persistence constraints without implementing them;
- perform strict upstream-equivalence analysis for the referenced wakeup patch against the exact current source/runtime baseline;
- define the patch refresh/rebase lifecycle for each new official baseline, including the upstream-equivalence retirement check;
- confirm the controlled patch-carrier decision (`elmakus/codex` preferred unless evidence favors another approach);
- define a concrete compatibility gate and the minimum acceptance/test matrix required before M02 may design substitution.

Acceptance:

- exact audited `codex-desktop-linux` commit and official package identity are recorded;
- the path by which `resources/codex` reaches the Community package is evidence-backed;
- bundled runtime identity and source-revision mapping have an explicit verdict: deterministic, safely derivable by a documented procedure, or unavailable;
- protocol/app-server compatibility risks and drift-sensitive surfaces are documented for the tested baseline;
- `CODEX_CLI_PATH`, feature persistence and update-builder/update-manager constraints are documented from current source;
- strict upstream-equivalence verdict is explicit for the tested baseline and covers all R4 semantics, not only source-patch presence;
- patch-carrier and refresh strategy are explicit;
- compatibility gate has concrete inputs, pass/fail/unknown semantics and fail-closed behavior;
- minimum M02 prerequisite test matrix is documented;
- no implementation assumption depends on an unverified version mapping.

Checkpoint: `M01_BASELINE_GREEN` when all acceptance evidence is durable.

### M02 — Feature contract and build path

Outcome: define and implement the opt-in `custom-codex-runtime` feature boundary in a development fork/branch without touching the user's installed production Community runtime.

Work includes feature manifest/settings contract, source/ref/provenance configuration, build or artifact acquisition path, substitution/redirection mechanism, fail-closed handling, build metadata recording and feature disable/stock-runtime restoration path.

Acceptance:
- feature disabled => stock package behavior;
- feature enabled with compatible custom runtime => rebuilt artifact selects expected runtime;
- incompatible/unknown runtime => build/update refuses custom substitution;
- exact source/ref/patch metadata is recorded.

Checkpoint: `M02_FEATURE_GREEN`.

### M03 — Patch behavior verification

Outcome: prove the replacement runtime implements the intended wakeup semantics rather than merely compiling.

Work includes patch-level tests, short inline command, yielding background command, idle wakeup, active-turn pushed completion, duplicate suppression and interactive/intermediate-output `write_stdin`.

Acceptance:
- all R4/R14 behavior is demonstrated with repeatable tests;
- failure output distinguishes protocol failure from wakeup-behavior failure.

Checkpoint: `M03_WAKEUP_GREEN`.

### M04 — Desktop integration verification

Outcome: verify the patched runtime works with ChatGPT Community Desktop/app-server on a controlled test artifact.

Work includes Desktop startup, app-server handshake/session initialization, ordinary command execution, background completion wakeup through the Desktop-owned session path, `write_stdin` regression check and feature-disable rollback check.

Acceptance:
- integration smoke matrix passes;
- no production install is required if a safe test environment can provide evidence;
- protocol/runtime skew failure is detected rather than masked.

Checkpoint: `M04_DESKTOP_GREEN`.

### M05 — Update persistence and refresh gate

Outcome: prove that a new official OpenAI package preserves feature intent while re-running equivalence, patch refresh and compatibility decisions instead of blindly reusing an old runtime.

Work includes updater feature-state persistence, changed-upstream compatibility re-evaluation, patch rebase/refresh, upstream-equivalence retirement and rollback to previous known-good package.

Acceptance:
- at least one controlled update/rebuild scenario passes;
- stale custom runtime cannot be silently carried across an incompatible baseline;
- upstream equivalence can retire custom divergence cleanly;
- failed refresh leaves the current working package intact and produces diagnostic evidence.

Checkpoint: `M05_UPDATE_GREEN`.

### M06 — Upstreamability decision and release

Outcome: decide whether the generic feature is suitable for contribution to `ilysenko/codex-desktop-linux` or should remain private/local, then prepare the chosen delivery path.

Acceptance:
- design/maintenance burden and security implications are reviewed;
- upstream/local decision is recorded;
- documentation covers enable/disable, provenance, compatibility failures, update behavior and rollback;
- final integrated test evidence is green.

Checkpoint: `M06_RELEASE_GREEN`.

## 9. Requirement coverage

- R1, R2, R3, R10, R12 → M02
- R4, R14 → M03
- R6, R7, R8, R9 → M01 + M02 + M05
- R5, R16 → M05
- R11 → all implementation milestones
- R13 → M02 + M05
- R15 → M04

Before executing any milestone, decompose its owned requirements into Task Cards according to the current Project Workflow.

## 10. Deployment / migration strategy

There is no production migration in the planning phase. Implementation and testing use isolated branches/build artifacts first. Production installation, if later approved, happens only after M04/M05 evidence establishes Desktop compatibility and update behavior. Rollback retains either the stock official-runtime Community build or the immediately previous known-good managed package.

## 11. Verification strategy

Verification layers:
1. exact official package/runtime identity and source-baseline evidence;
2. protocol/schema/app-server compatibility checks;
3. source/patch unit tests;
4. custom-runtime build identity and provenance verification;
5. CLI/unified-exec behavioral tests;
6. Desktop/app-server integration smoke tests;
7. package feature on/off tests;
8. update/rebuild compatibility refresh test;
9. final controlled install/readback only when explicitly approved.

The compatibility gate must distinguish `PASS`, `FAIL`, and `UNKNOWN`; both `FAIL` and `UNKNOWN` prohibit custom substitution.

## 12. OpenSpec policy

Do not create OpenSpec merely for planning or research completeness. M01 is investigation/contract discovery and does not require OpenSpec. Re-evaluate just-in-time before M02; the durable feature settings/provenance/compatibility contract and updater semantics are likely OpenSpec candidates once actual source seams are known.

## 13. Task decomposition policy

M01 is decomposed during Execution Prep into near-term research/discovery Task Cards. Later milestones remain outcome-specific until refreshed against current upstream source/runtime.

## 14. Fresh-context boundaries

Use a fresh execution context at milestone boundaries when practical. Every milestone begins from its accepted prior GREEN checkpoint and current upstream state, not from stale chat assumptions.

# Master Plan — Custom Codex Runtime for ChatGPT Community

## 1. Goal

Deliver a maintainable, opt-in integration for ChatGPT Community for Linux that can use a Codex runtime carrying the background-exec completion wakeup behavior from `tekacs/codex` commit `9ffcf8db9078eae43d4111ff94259795c1e962c9`, without manual replacement after every update and without silently running an incompatible stale Codex build.

## 2. Verified baseline

### ChatGPT Community

`ilysenko/codex-desktop-linux` verifies and repackages OpenAI's signed official Linux `.deb` and normally reuses the official bundled Codex executable at `resources/codex`.

Its Linux feature framework supports opt-in staged resources, runtime hooks, package hooks and custom build/install hooks. Native update reconstruction preserves selected feature configuration.

### Source patch

`tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` adds pushed completion input for background unified-exec commands, waking idle sessions and delivering completion to active turns while avoiding duplicate completion when the initial call already returned the terminal result. Tool descriptions are also changed to discourage empty polling.

The patch is explicitly maintenance-only until upstream provides strictly equivalent behavior.

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

The integration is generic `custom-codex-runtime` infrastructure. `tekacs/codex` is the initial source/preset, not a permanent hard-coded dependency.

### A3 — Official package remains provenance baseline

Do not bypass or weaken the existing signed OpenAI package verification path.

### A4 — Compatibility before substitution

Replacement runtime selection is conditional on a deterministic compatibility gate. Unknown compatibility means no replacement.

### A5 — Upstream-first retirement

If current official Codex proves behaviorally equivalent to the patch, do not maintain unnecessary divergence.

### A6 — Atomic delivery

Normal deployment is through a rebuilt package/app artifact with rollback, not piecemeal mutation of a running installation.

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

## 7. Known source seams

Current likely integration seams in `ilysenko/codex-desktop-linux`:

- upstream payload verification/extraction in `scripts/lib/upstream-linux-package.sh`;
- official runtime location `resources/codex`;
- `linux-features/` feature framework and build/install hooks;
- package/update reconstruction which preserves enabled feature configuration;
- existing `CODEX_CLI_PATH` handling in selected integrations such as shared app-server socket / Nix paths.

These are candidate seams only. Exact implementation seams must be refreshed against current `main` immediately before implementation.

## 8. Milestones

### M01 — Baseline and compatibility discovery

Outcome: establish a deterministic mapping/check between the official bundled Codex runtime shipped with the current OpenAI Linux Desktop package and a source/runtime baseline suitable for carrying the patch.

Work includes:

- inspect current official bundled `resources/codex` metadata/version/build identity;
- determine whether a source revision can be mapped reliably;
- verify whether current official Codex already contains equivalent wakeup behavior;
- define the compatibility gate inputs and failure modes;
- decide whether initial source ownership remains `tekacs/codex` or moves to an owned `elmakus/codex` fork.

Acceptance:

- compatibility strategy is evidence-backed and documented;
- no implementation assumption depends on an unverified version mapping;
- upstream-equivalence verdict is explicit for the tested baseline.

Checkpoint: `M01_BASELINE_GREEN` when all acceptance evidence is durable.

### M02 — Feature contract and build path

Outcome: define and implement the opt-in `custom-codex-runtime` feature boundary in a development fork/branch without touching the user's installed production Community runtime.

Work includes:

- feature manifest/settings contract;
- source/ref/provenance configuration;
- build or artifact acquisition path;
- substitution/redirection mechanism;
- fail-closed handling;
- build metadata recording;
- feature disable/stock-runtime restoration path.

Acceptance:

- feature disabled => stock package behavior;
- feature enabled with compatible custom runtime => rebuilt artifact selects expected runtime;
- incompatible/unknown runtime => build/update refuses custom substitution;
- exact source/ref/patch metadata is recorded.

Checkpoint: `M02_FEATURE_GREEN`.

### M03 — Patch behavior verification

Outcome: prove the replacement runtime implements the intended wakeup semantics rather than merely compiling.

Work includes:

- carry/reproduce patch-level tests;
- short inline command case;
- yielding background command case;
- idle wakeup and active-turn pushed completion;
- duplicate suppression;
- interactive/intermediate-output `write_stdin` case.

Acceptance:

- all R4/R14 behavior is demonstrated with repeatable tests;
- failure output is diagnostic enough to distinguish protocol failure from wakeup-behavior failure.

Checkpoint: `M03_WAKEUP_GREEN`.

### M04 — Desktop integration verification

Outcome: verify the patched runtime works with ChatGPT Community Desktop/app-server on a controlled test artifact.

Work includes:

- Desktop startup;
- app-server handshake/session initialization;
- ordinary command execution;
- background completion wakeup through the Desktop-owned session path;
- no regression in explicit `write_stdin` interaction;
- feature disable rollback check.

Acceptance:

- integration smoke matrix passes;
- no production install is required to obtain evidence if a safe test environment is available;
- protocol/runtime skew failure is detected rather than masked.

Checkpoint: `M04_DESKTOP_GREEN`.

### M05 — Update persistence and refresh gate

Outcome: prove that a new official OpenAI package causes the Community rebuild path to preserve feature intent while re-running compatibility/patch decisions rather than blindly reusing an old runtime.

Work includes:

- updater feature-state persistence;
- changed-upstream compatibility re-evaluation;
- patch rebase/refresh behavior;
- upstream-equivalence retirement path;
- rollback to previous known-good package.

Acceptance:

- at least one controlled update/rebuild scenario passes;
- stale custom runtime cannot be silently carried across an incompatible baseline;
- upstream equivalence can disable/remove the custom divergence cleanly.

Checkpoint: `M05_UPDATE_GREEN`.

### M06 — Upstreamability decision and release

Outcome: decide whether the generic feature is suitable for contribution to `ilysenko/codex-desktop-linux` or should remain a private/local feature, then prepare the chosen delivery path.

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

There is no production migration in the planning phase.

Implementation and testing should use isolated branches/build artifacts first. Production installation, if later approved, should happen only after M04/M05 evidence establishes Desktop compatibility and update behavior.

Rollback must retain either the stock official-runtime Community build or the immediately previous known-good managed package.

## 11. Verification strategy

Verification layers:

1. source/patch unit tests;
2. custom-runtime build identity and provenance verification;
3. CLI/unified-exec behavioral tests;
4. Desktop/app-server integration smoke tests;
5. package feature on/off tests;
6. update/rebuild compatibility refresh test;
7. final controlled install/readback only when explicitly approved.

## 12. OpenSpec policy

Do not create OpenSpec merely for planning completeness.

Create an OpenSpec change just-in-time if implementation introduces a durable behavior/configuration/schema contract across components, especially the feature settings schema, compatibility metadata contract or updater behavior. The Refresh Gate at execution prep decides the exact OpenSpec need against then-current source state.

## 13. Task decomposition policy

No Task Board or implementation cards are created yet. The next workflow stage is pre-implementation plan audit, then Execution Prep for M01. M01 cards should be detailed; later milestones should remain outcome-specific until refreshed against current upstream source/runtime.

## 14. Fresh-context boundaries

Use a fresh execution context at milestone boundaries when practical. Every milestone begins from its accepted prior GREEN checkpoint and current upstream state, not from stale chat assumptions.

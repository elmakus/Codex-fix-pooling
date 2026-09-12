# Requirements — Tool Output Pruning custom runtime

## Scope

Provide a maintainable way to use request-time tool-output pruning behavior, based on `tekacs/codex` commit `d70b903a4edbbb02c5009ae8e6194f2128d80213`, from ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`) without carrying unrelated `tekacs/custom-cli` changes and without silently running an incompatible stale Codex build.

## Functional requirements

### R1 — Independent optional capability

Tool-output pruning must be independently identifiable, testable and retireable from the background-exec wakeup capability even if both later share the same custom-runtime build/package mechanism.

### R2 — No whole-stack dependency

The solution must not require consuming the entire `tekacs/custom-cli` patch stack. Only pruning behavior and explicitly approved dependencies may be carried.

### R3 — Request-time transformation

Pruning must reduce model-request context without destructively deleting canonical rollout/history state merely to obtain the savings.

### R4 — Recent-output protection

The mechanism must preserve a bounded amount of recent tool-output content before older eligible output becomes prunable. The historical patch's `PRUNE_PROTECT_TOKENS = 40_000` is a baseline to validate, not a permanently frozen product value.

### R5 — Minimum-benefit gate

Pruning must not rewrite old tool outputs unless the eligible removable content exceeds a meaningful minimum. The historical `PRUNE_MINIMUM_TOKENS = 20_000` is a baseline to validate against the current runtime.

### R6 — Safety protections

At minimum, current-baseline analysis must explicitly decide and test protection semantics for:

- failed tool outputs;
- `apply_patch` outputs;
- recent turns/tool results;
- outputs whose removal would destroy the only model-visible record needed to reason safely about later work;
- any newly introduced tool classes with similar durability/diagnostic importance.

### R7 — Standard and custom tool outputs

If current Codex still has equivalent standard and custom tool-output item classes, pruning must handle both consistently or document an evidence-backed reason for divergence.

### R8 — Explicit feature control

Pruning must be controlled by an explicit feature/configuration decision. It must not silently alter every custom-runtime request without traceable enablement.

### R9 — Measurable effectiveness

Acceptance must include evidence that pruning materially reduces repeated request context/token load on representative long-running tool-heavy sessions.

### R10 — Quality/regression guard

Context reduction alone is insufficient. Tests must show that pruning does not create unacceptable regressions in task continuation, error diagnosis, patch verification or other protected workflows.

### R11 — Upstream equivalence detection

Before refreshing/carrying the patch onto a new upstream baseline, determine whether official Codex already provides equivalent behavior. If equivalence is proven, retire unnecessary custom divergence.

### R12 — Compatibility gate

A custom Codex runtime carrying pruning must not be selected by ChatGPT Community unless compatibility with the exact current Desktop/bundled Codex baseline is established.

### R13 — Fail closed

Unknown compatibility, failed patch refresh/reimplementation, failed tests, or unresolved pruning-safety semantics must prevent custom-runtime substitution.

### R14 — Provenance

Every custom runtime carrying pruning must record sufficient provenance to identify:

- upstream/source revision;
- pruning patch/change-set revision;
- whether it is a direct rebase or behaviorally equivalent reimplementation;
- resulting runtime build identity;
- acceptance evidence used for the selected Desktop baseline.

### R15 — Update persistence with re-evaluation

If the feature is enabled across a Community updater rebuild, feature intent may persist but compatibility and pruning equivalence/safety must be re-evaluated against the new official baseline. A prior GREEN verdict must not be reused blindly.

## Safety / integrity requirements

### R16 — Preserve official package provenance

The signed official OpenAI Linux package remains the verified baseline source for ChatGPT Community. Pruning integration must not weaken existing package verification.

### R17 — No hidden production mutation

Research, planning and development validation must not mutate the user's installed production ChatGPT Community runtime unless an explicit deployment/install step is later approved.

### R18 — Rollback / disable path

Disabling pruning or failing a refresh gate must provide a practical path back to the official bundled runtime or prior known-good Community package.

## Verification requirements

### R19 — Patch-level semantic tests

Tests must cover, as applicable on the refreshed baseline:

- recent output remains intact;
- old eligible successful tool output becomes prunable only after the threshold conditions are met;
- below-threshold context is unchanged;
- failed output remains available;
- `apply_patch` output remains available unless a later approved design proves another safe invariant;
- standard/custom outputs follow the intended policy;
- canonical rollout/history is not destructively rewritten merely by preparing a model request.

### R20 — Effectiveness benchmark

A repeatable benchmark/fixture must compare request-context size or an equivalent token estimate with pruning disabled vs enabled on the same representative conversation/tool history.

### R21 — Continuation smoke tests

Representative sessions must continue correctly after pruning, including at least:

- code/test workflow with old verbose command output;
- a prior tool failure that remains diagnostically visible;
- a prior patch/change result whose durable evidence must remain available;
- subsequent compaction or context-management behavior relevant to the current baseline.

### R22 — Desktop integration smoke

Verify that ChatGPT Community starts and communicates normally with the selected pruning-capable runtime and that enabling/disabling pruning does not break app-server initialization or ordinary command execution.

### R23 — Update-path verification

At least one controlled package refresh/rebuild scenario must demonstrate that the pruning feature is re-evaluated rather than blindly carrying a stale runtime forward.

## Non-goals

- Importing all `tekacs/custom-cli` customizations.
- Treating tool-output pruning as a substitute for background-exec wakeup/polling fixes.
- Permanently pinning to the historical `d70b903` source baseline.
- Destructively rewriting conversation history solely for token savings.
- Arbitrary removal of tool outputs without safety classification and regression evidence.
- Unlocking server-side ChatGPT account features or model limits.

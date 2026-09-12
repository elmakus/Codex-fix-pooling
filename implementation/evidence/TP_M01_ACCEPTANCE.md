# TP_M01 Acceptance — Independent Review and Integrated Milestone Verdict

Date: 2026-09-12
Review session: fresh normal ChatGPT chat
Execution policy: `chatgpt_only`
Reviewed branch: `tool-output-pruning`
Reviewed implementation/discovery head: `506c7f38bd4d71aeb0be50d0d70b8922b8ca4e60`
Milestone: `TP_M01 — Current-baseline pruning discovery`

## Final verdict

**GREEN**

Required fresh independent review passed for `TP_M01-T02`, `TP_M01-T03`, and `TP_M01-T05`. Integrated TP_M01 acceptance also passed. No pruning implementation, Codex fork mutation, Community source mutation, runtime substitution, local deployment, or production mutation was performed.

## Independent review — TP_M01-T02

Verdict: **GREEN — `NOT_EQUIVALENT` independently confirmed.**

The historical reference `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213` was re-read directly. It implements request-time transformation of a derived `Vec<ResponseItem>`, two-user-turn recency gating, a newest eligible-output protection budget, a minimum aggregate savings gate, failed standard-output protection, `apply_patch` protection, standard/custom output handling, explicit feature control, and non-destructive request-vector replacement.

The current official source baseline was independently refreshed and remains exactly `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`.

Current mechanisms independently checked include:

- per-tool/model-facing truncation;
- `ContextManager::for_prompt` normalization;
- context-window recovery rewriting in `compact_remote_history.rs`;
- local/remote/token-budget compaction;
- current request reconstruction paths;
- current `ResponseItem` model including `FunctionCallOutput`, `CustomToolCallOutput`, and `ToolSearchOutput`.

None supplies the historical behavior contract as a semantic whole. The conclusion does not depend on missing historical names or markers. In particular, current emergency context-window trimming has a materially different trigger and mutation contract and lacks the recency, recent-output budget, minimum-benefit, failed-output, `apply_patch`, and ordinary request-only guarantees required by this workstream.

Therefore `NOT_EQUIVALENT` is accepted for the pinned official source baseline. The exact official Desktop `resources/codex` binary -> `openai/codex` source-SHA mapping remains unknown and is not inferred.

## Independent review — TP_M01-T03

Verdict: **GREEN — protected-output and threshold safety contract accepted.**

The contract is consistent with the current data model and is deliberately stricter than the historical patch where current architecture is richer.

Accepted safety rules:

- failed standard/custom outputs remain protected;
- `success == None` fails closed unless a separately accepted safe family contract exists;
- `apply_patch` and equivalent mutation evidence remain protected;
- missing/ambiguous call identity or new/unknown output classes remain protected;
- structured/media output remains protected until explicitly supported and tested;
- current/recent turns remain protected;
- a newest-output protection budget is required;
- `ToolSearchOutput` remains protected in the first implementation;
- only explicitly classifiable replayable verbose text outputs may become eligible;
- normal pruning may alter only derived request payload, not canonical history solely for savings;
- retry/regenerated request paths must apply the same policy again;
- token/accounting ambiguity fails closed by retaining content.

Current source independently confirms richer standard/custom output payloads and the additional `ToolSearchOutput` class. Current tests/source also confirm `apply_patch` can use custom-tool representation, so protection cannot rely on the old standard-only call correlation assumption.

The historical `40k protected / 20k minimum` values are correctly retained as benchmark anchors, not frozen product constants. Final numeric policy remains intentionally deferred to implementation/benchmark evidence.

## Independent review — TP_M01-T05

Verdict: **GREEN — `REIMPLEMENT_EQUIVALENT_BEHAVIOR` accepted.**

`NO_CUSTOM_PATCH` is not justified because T02 independently confirms that current official source is not semantically equivalent.

A direct historical cherry-pick/rebase is not the preferred strategy because the request/retry path, output model, context accounting, output classes, truncation and compaction architecture have materially evolved, while T03 intentionally strengthens fail-closed safety. Preserving the old diff would be less maintainable and easier to misapply than implementing the accepted behavior against current seams.

The selected strategy is therefore an isolated current-baseline reimplementation on an owned exact-upstream-based patch carrier, with `d70b903` retained as provenance/reference behavior rather than as a diff that must be preserved.

### Refreshed Community assumptions

The current `ilysenko/codex-desktop-linux:main` was independently refreshed and remains exactly `249cd4b64d42434f51417fec4a318750d461b676`.

At that baseline:

- official package provenance remains the package baseline;
- bundled `resources/codex` remains the default CLI/runtime;
- `CODEX_CLI_PATH` remains a supported selection seam;
- the Linux feature framework remains opt-in and can supply runtime hooks/resources/settings;
- native update-builder/update-manager flow preserves enabled feature IDs/settings across rebuilds;
- persistence of feature intent does not justify persistence of an old compatibility verdict;
- failure/unknown compatibility must fall back to verified stock `resources/codex`.

The exact bundled-binary -> upstream-source mapping remains unavailable from public source alone, so Desktop compatibility/runtime substitution remains a later empirical gate.

## JIT OpenSpec review

Verdict: **REQUIRED before TP_M02 coding, with minimal scope.**

Current workflow requires/justifies OpenSpec for new/changed behavior contracts, retry semantics, safety-sensitive behavior, and technical contracts that should be frozen before implementation. TP_M02 meets those criteria.

Minimal TP_M02 OpenSpec scope is accepted as:

- explicit feature enable/disable semantics;
- request-time/non-destructive canonical-history invariant;
- eligible/protected classification and fail-closed behavior;
- threshold semantics without freezing unsupported numbers;
- retry/regenerated-request application;
- standard/custom parity;
- observable provenance/pruning evidence required by tests.

Community updater/package-selection contracts remain outside TP_M02 OpenSpec unless implementation actually crosses that boundary.

## Integrated TP_M01 acceptance

All milestone acceptance items are satisfied:

- exact official-source, Community and package-level baselines are durable;
- current request/context/tool-output architecture is source-grounded;
- strict equivalence verdict is explicit and independently accepted as `NOT_EQUIVALENT`;
- protected-output policy and threshold decision inputs are explicit;
- canonical-history vs request-payload semantics are explicit;
- repeatable effectiveness metric/fixtures and hard/behavioral regression matrix are defined;
- strategy decision is evidence-backed as `REIMPLEMENT_EQUIVALENT_BEHAVIOR`;
- shared runtime delivery/compatibility assumptions are independently refreshed;
- no pruning implementation has started.

## Deferred facts that are not TP_M01 blockers

- exact public mapping from official bundled `resources/codex` binary to an `openai/codex` source SHA is still unknown;
- final pruning threshold numbers are not selected;
- custom runtime/Desktop compatibility is not yet proven;
- effectiveness has not yet been measured because implementation/validation belongs to later milestones.

These are explicitly owned by later gates and do not invalidate TP_M01 discovery acceptance.

## Checkpoint semantics

Checkpoint name: `TP_M01_DISCOVERY_GREEN`.

The current GitHub connector can persist branch commits and read them back but exposes no tag-creation action, so this review records the durable logical checkpoint in project state rather than falsely claiming a pushed Git tag. Exact final closure branch HEAD is recorded after final durable-state reconciliation/readback.

## Next step

Do not start TP_M02 in this review session. The next session should begin TP_M02 execution preparation from `TP_M01_DISCOVERY_GREEN`, run a fresh Refresh/Capability Gate, and create/reconcile the minimal JIT OpenSpec before any pruning code is written.

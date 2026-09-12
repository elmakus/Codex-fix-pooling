# TP_M02 Codex Execution / CE Integration Handoff

Date prepared: 2026-09-12
Workflow authority: `elmakus/chatgpt-codex-project-workflow:main`
Project repository: `elmakus/Codex-fix-pooling`
Branch: `tool-output-pruning`
Milestone: `TP_M02 — tool-output pruning best-effort patch -> downstream validation/integration`
Required prior checkpoint: `TP_M01_DISCOVERY_GREEN`

## Mandatory status label

**BEST_EFFORT / STATICALLY_REVIEWED / NOT COMPILED BY CHATGPT**

The existence of this patch package is **not proof that it compiles, tests pass, installs, or is compatible with the current ChatGPT Community Edition runtime**.

ChatGPT authored and statically reviewed the patch without local `cargo`, `rustc`, `rustfmt`, Docker or Podman. No build, CE update, installation, runtime substitution, deployment or smoke execution occurred in the authoring session.

## Durable start pointers

Read first:

1. `PROJECT.md`
2. `implementation/TASK_BOARD.yaml`
3. `implementation/evidence/TP_M02_REFRESH_BASELINE.md`
4. `implementation/patches/TP_M02_SERIES.md`
5. `implementation/evidence/TP_M02_STATIC_REVIEW.md`
6. `implementation/evidence/TP_M02_PREPARED_TESTS.md`
7. `openspec/changes/tp-m02-tool-output-pruning/`

Historical inputs when needed:

- `implementation/evidence/TP_M01_ACCEPTANCE.md`;
- `project-handoffs/TP_M01_HANDOFF.md`;
- TP_M01 T01-T05 evidence referenced there;
- `implementation/evidence/TP_M02_EXECUTION_PREP.md` and `implementation/blockers/TP_M02_CAPABILITY_GATE.md` as historical superseded-authoring-blocker evidence.

## Authoring baseline

At authoring Fresh Refresh Gate:

- `openai/codex:main` = `c4017a87aacc7558002b7cb510025e967c1d765e`;
- `ilysenko/codex-desktop-linux:main` = `249cd4b64d42434f51417fec4a318750d461b676`;
- official Linux package baseline = `26.908.40834`.

Historical pruning provenance only:

- `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`.

Do not assume these are still current when executing. Run a fresh Refresh Gate first.

## Product/architecture decisions Codex must preserve

### ALWAYS ON

Pruning is intentionally unconditional in the patched Codex runtime.

Do **not** add:

- feature flag;
- `/experimental` integration;
- config enable/disable;
- pruning activation schema;
- runtime disable path.

Historical `Feature::ToolOutputPrune` is not part of this design.

### Exact intended request seam

The accepted authoring seam is inside `run_sampling_request` after each initial/regenerated `prompt_input` has been selected/materialized and before executed-tool metadata attachment / `build_prompt`.

This must continue to cover both first-attempt and retry-regenerated requests while keeping canonical `ContextManager` history unchanged.

If upstream has materially changed this path, reconcile the architecture before applying the old hunk. Do not blindly preserve line numbers.

### Safety policy

Fail closed. Protection overrides eligibility.

Protect at minimum:

- failed standard/custom outputs;
- `success == None`;
- `apply_patch` and mutation/durability-sensitive evidence;
- unknown/new/unclassifiable tools or output variants;
- missing/ambiguous/contradictory call-output identity;
- structured/media output;
- `ToolSearchOutput`;
- current/recent region until >=2 real user-input boundaries are crossed;
- newest otherwise-eligible protected-output token budget;
- only-model-visible evidence where safe replayability cannot be justified;
- any classification/accounting uncertainty.

The authored positive policy permits only paired `exec_command` output whose `cmd` is a narrowly statically recognized simple read-only command. Treat that allowlist critically during review; broaden only with explicit evidence and never by `success == Some(true)` alone.

### Current compile-time starting constants

- newest otherwise-eligible protection target: `40_000` estimated tokens;
- minimum aggregate **net** savings: `20_000` estimated tokens;
- recent floor: `2` real user-input boundaries;
- replacement marker: `[Old tool result content cleared]`.

The patch uses current Codex `estimate_item_token_count` for original and replacement items. Whole outputs only. Checked arithmetic must remain fail closed.

## Patch package

Apply/inspect the series in:

`implementation/patches/TP_M02_SERIES.md`

The second patch is mandatory; it contains adversarial-review fixes.

The patch should be treated as a proposed source delta against exact base `c4017a87...`, not as a trusted binary artifact.

## Codex execution sequence

Codex's later job is exactly:

1. **Recover durable project/workflow state.** Verify project branch/HEAD and read the pointers above.
2. **Run Fresh Refresh Gate.** Record exact current `openai/codex:main`, Community `main`, official package/update baseline and relevant source blobs/seams.
3. **Critically inspect the patch before applying it.** Compare current source types/request path/token accounting/tool representation to the authoring assumptions.
4. **Adapt drift/API mismatches if necessary.** Preserve the approved behavior/safety/product contract; do not force stale hunks.
5. **Apply the complete patch series in a controlled checkout/worktree.** Do not overwrite public upstream repositories as project state.
6. **Format and compile/check using the current repository's documented tooling.** Persist exact commands/output.
7. **Run focused unit tests and relevant integration tests.** At minimum cover the prepared matrix plus a real forced retry/regeneration test, canonical-history non-mutation, executed-tool metadata interaction and compaction interaction.
8. **Measure actual request-token effect on a realistic tool-heavy fixture.** Do not infer effectiveness from source shape alone.
9. **Inspect the current ChatGPT Community Edition update/build/install mechanism at execution time.** Do not assume the 2026-09-12 mechanics are unchanged.
10. **Update CE through its current verified mechanism.** Preserve official package provenance and a rollback path.
11. **Integrate/install the patched Codex runtime together with that update only if source/build/test compatibility remains coherent.** Keep the stock official bundled runtime available for rollback.
12. **Perform a basic smoke test.** Verify app/runtime start, ordinary turn, tool call/output roundtrip, pruning-capable path, and restart/rollback behavior as practical.
13. **Persist exact final provenance/evidence.** Include source SHA, patch state, formatter/compiler/tests, CE package identity, custom binary hash/version if built, install path/runtime selection, smoke result and rollback state.
14. **Return for independent final acceptance.** Do not self-promote the final runtime milestone to GREEN without the required review/evidence.

## Required test semantics

At minimum verify executable evidence for:

- recent output retained;
- newest token-budget outputs retained;
- old eligible standard output pruned;
- equivalent eligible custom output pruned;
- below-minimum benefit unchanged;
- failed standard output retained;
- failed custom output retained;
- unknown success retained;
- `apply_patch` retained;
- unknown/unallowlisted tool retained;
- ambiguous pairing retained;
- structured/media retained;
- `ToolSearchOutput` retained;
- metadata preserved;
- canonical history unchanged;
- actual retry-regenerated input pruned again;
- no eligible output unchanged;
- mutating/composed exec excluded;
- checked accounting fails closed;
- current context management/compaction remains valid.

The prepared Rust tests are a starting point, not a passed result.

## CE/update/install constraints

- Do not weaken official-package verification merely to install the custom runtime.
- Preserve stock `resources/codex` or equivalent current official-runtime fallback.
- Prefer the Community project's current supported runtime-selection/integration seam after inspecting it; do not invent a second unrelated updater system.
- Record exactly how rollback restores the stock runtime.
- If current CE architecture makes the old integration direction unsafe or obsolete, stop before install and report the changed contract.

## Stop/report rule on failure

If Codex cannot repair a failure confidently, it must stop dependent integration work and report/persist:

- exact command;
- exact error/output;
- affected file/function;
- current source SHA;
- patch-series state/applied commits;
- what it already tried;
- whether stock CE/runtime remains untouched or has been restored;
- recommended next decision, without guessing.

Do not mask a compile/test/install failure by weakening safety rules, deleting tests, broadening the allowlist, adding an off switch, bypassing official package verification or silently falling back to stale code.

## Acceptance boundary

Static authoring package: **ready for Codex execution**.

Runtime/build/install acceptance: **PENDING**.

The later build/install/smoke result is required final acceptance evidence. This handoff does not authorize marking final TP_M02/production runtime GREEN merely because the patch files exist.

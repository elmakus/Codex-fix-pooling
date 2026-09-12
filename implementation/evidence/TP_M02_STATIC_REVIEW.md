# TP_M02 Adversarial Static Implementation Review

Date: 2026-09-12
Review target: patch series in `implementation/patches/TP_M02_SERIES.md`
Upstream base: `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
Verdict: **STATIC REVIEW ACCEPTED FOR DOWNSTREAM BUILD/TEST — NOT COMPILE GREEN**

Label: **BEST_EFFORT / STATICALLY_REVIEWED / NOT COMPILED BY CHATGPT**.

No Rust compiler, formatter, test runner, container runtime or equivalent execution lane was available in this ChatGPT session. No patch was applied to `openai/codex`, no binary was built and no runtime was executed.

## Review method

The implementation was checked against exact current source blobs for `session/turn.rs`, `lib.rs`, `context_manager/history.rs`, `context_manager/mod.rs`, `protocol/models.rs`, core `Cargo.toml`, current tool namespace/`ExecCommandArgs` definitions, current contextual-user detection and the historical `tekacs/codex@d70b903...` reference.

A second adversarial pass was performed after the initial patch carrier was written. Findings were repaired in mandatory series member `TP_M02_0002_STATIC_REVIEW_FIXES.patch` rather than hidden or discarded.

## Findings repaired during review

### SR-01 — token aggregate overflow was not fail closed

Initial draft used saturating aggregate arithmetic. A theoretical overflow could therefore convert accounting uncertainty into a very large apparent removable budget.

Fix: protection and net-savings aggregates now use `checked_add`; accounting failure marks the request invalid for pruning and returns the original request vector unchanged.

### SR-02 — contextual user messages could over-count recency

Initial draft followed historical content-kind logic but did not additionally use current upstream contextual-user detection. A legacy/injected contextual user message without useful content-kind metadata could therefore count toward the two-user-boundary floor.

Fix: current `crate::event_mapping::is_contextual_user_message_content` is consulted before counting a user boundary. This can only make pruning more conservative.

### SR-03 — namespace treatment

Current Codex has default top-level namespace `functions`; treating only `None` as built-in would make classification unnecessarily brittle.

Fix: the positive identity classifier accepts only `None` or `DEFAULT_FUNCTION_NAMESPACE` (`functions`). Non-default namespaces remain protected.

### SR-04 — broad read/discovery allowlist rejected

Resource/tool discovery outputs can be capability evidence. They were considered during design review but deliberately not admitted to the initial positive allowlist.

Final eligible identity is only `exec_command` with a narrow statically recognized read-only command shape. `ToolSearchOutput`, MCP resource discovery/read output, dynamic tools and unknown tools remain protected.

## Rust syntax / API plausibility

**Plausible, uncompiled.** Static checks:

- `serde_json` is already a `codex-core` dependency.
- `pretty_assertions` is already a `codex-core` dev-dependency.
- current protocol exports `DEFAULT_FUNCTION_NAMESPACE`.
- current core re-exports `context_manager::estimate_item_token_count` as `pub(crate)`.
- current `event_mapping::is_contextual_user_message_content` is `pub(crate)` and used by sibling core modules.
- current `ResponseItem` fields used by the patch match the exact pinned model: standard output optional `call_id`/name/namespace; custom output required `call_id`, optional name; shared `FunctionCallOutputPayload`; `ToolSearchOutput` separate.
- current payload exposes `success: Option<bool>` and `FunctionCallOutputBody::{Text, ContentItems}`.
- current `ExecCommandArgs` uses JSON field `cmd: String`, matching the patch's conservative JSON extraction.
- current upstream already uses `Option::is_none_or`, so the method/toolchain assumption is source-consistent.

Unresolved compile risk remains because none of these observations substitutes for `cargo check`/test compilation.

## Ownership / borrowing

The transform consumes an owned derived `Vec<ResponseItem>` and returns an owned vector. It only borrows that vector during candidate analysis, clones individual candidate items for possible replacement, and mutates the owned request vector only after the scan and minimum-benefit gate.

No mutable `ContextManager`, session history or rollout object is passed into the pruning core. Canonical-history mutation is therefore not part of the implementation surface.

Call descriptors own cloned name/namespace/input strings, avoiding borrowed-map lifetimes across the later reverse scan.

## Enum exhaustiveness / unknown variants

The classifier positively matches only `FunctionCallOutput` and `CustomToolCallOutput`. Every other `ResponseItem` variant falls through protected. New/unknown variants therefore remain protected automatically.

`ToolSearchOutput` is never a candidate.

## Standard/custom parity

Both output variants share all substantive gates:

- exact `success == Some(true)`;
- text-only body;
- required unambiguous call pairing;
- optional output-name corroboration;
- positive tool policy;
- same recency floor;
- same newest-output budget;
- same replacement-aware minimum benefit;
- same marker replacement preserving shared payload success metadata.

The custom representation lacks an output namespace field in current protocol, so namespace trust comes from the paired custom call. Non-default paired namespaces remain protected.

## Call/output identity pairing

A map is built from current-request standard and custom calls. Duplicate call IDs are marked ambiguous regardless of whether the duplicated names happen to agree. Missing standard output `call_id`, missing paired call, duplicate pairing, output-name contradiction or output-namespace contradiction all protect the output.

This is intentionally stricter than using output `name` alone.

## `apply_patch` / mutation evidence

`apply_patch` is not in the positive allowlist and therefore remains protected in standard or custom form. The tests explicitly model current custom-tool representation.

`exec_command` itself is not globally allowlisted. Eligibility requires a JSON `cmd` and a single simple read-only executable from the bounded list. Shell composition/redirection/control operators, command substitution, unknown executables and malformed JSON are rejected. `tail` follow/pid modes and `rg --pre` execution are rejected.

Residual semantic risk: even a read-only command may observe transient or historically unique information. The policy reduces that risk through the two-user-boundary floor, the newest-output token budget, the large minimum net benefit and the narrow command set, but static code cannot prove that old read output is never semantically important. This is a principal downstream behavioral-test risk.

## Failure / unknown success

Only `Some(true)` can become a candidate. `Some(false)` and `None` are protected for both standard and custom output variants.

There is no `success == true => disposable` catch-all; success is necessary but not sufficient.

## Structured/media output

Only `FunctionCallOutputBody::Text` is eligible. `ContentItems` remains protected regardless of the content items inside it. Image/audio/structured output therefore cannot be rewritten by this feature.

## Recency counting

Reverse scan requires at least two user-input boundaries before candidate analysis. Contextual user messages recognized by current upstream are not counted. Content-kind metadata, when present, must contain a `user.*` kind; absent content-kind metadata is retained as compatibility behavior for ordinary historical user messages.

Risk posture: uncertain contextual classification delays pruning rather than deliberately broadening eligibility; downstream tests should include representative reconstructed histories.

## Token arithmetic / thresholds

The current Codex item estimator is reused. No second tokenizer exists.

For each older otherwise-eligible output:

1. original item tokens are estimated;
2. whole newest candidates are retained until the protected budget is met or exceeded;
3. a full marker-replacement item is constructed;
4. replacement tokens are estimated with the same estimator;
5. candidate benefit uses checked `original - replacement`;
6. aggregate savings uses checked addition;
7. any accounting failure retains the original request;
8. replacement occurs only when aggregate **net** savings is greater than `20_000`.

Protection target is `40_000` estimated tokens. Because whole items are protected until the target is met, retained eligible evidence can exceed 40k; the implementation does not partially chop a crossing output.

## Replacement metadata preservation

The patch clones the entire `ResponseItem` and changes only `output.body` to `Text("[Old tool result content cleared]")`. It therefore preserves item ID, call ID, output name, namespace when present, `success`, and internal passthrough metadata.

## Initial and retry/regenerated request paths

The unconditional call is placed inside the `run_sampling_request` loop after the branch that chooses `initial_input` versus `sess.clone_history().await.for_prompt(...)`, and before executed-tool metadata attachment and `build_prompt`.

Static path review therefore confirms the same transform executes for the first request and every regenerated retry request. The embedded pure-transform test re-applies the transform to a regenerated canonical clone, but **no live retry integration test was executed here**.

## Interaction with executed-tool metadata

Pruning happens before `executed_tool_calls.attach_to_prompt`. The replacement keeps output identity/metadata fields already present. Executed-tool metadata attachment therefore sees the same output items/call IDs rather than a structurally deleted or reordered history.

Downstream compilation/integration tests must confirm no new metadata-dependent assumption has appeared since the exact pinned base.

## Interaction with current context management / compaction

The patch does not change `ContextManager`, `for_prompt`, normalization, compaction, token-budget mode or context-window recovery. It operates on the derived sampling input after current normalization. Upstream compaction remains independent and may still run before sampling or later under its own rules.

## Test coverage authored in the patch

Embedded Rust tests cover:

- recent output retained;
- newest old eligible output retained by token budget;
- old eligible standard output pruned;
- equivalent eligible custom output pruned;
- below-minimum net benefit unchanged;
- failed standard output retained;
- failed custom output retained;
- unknown success retained for both variants;
- custom `apply_patch` retained;
- unknown/unallowlisted tool retained;
- duplicate/ambiguous pairing retained;
- structured output retained;
- `ToolSearchOutput` retained;
- metadata/success/identity preserved after replacement;
- canonical input clone unchanged;
- regenerated retry input gets same transform when reapplied;
- mutating/composed `exec_command` rejected;
- no eligible output unchanged.

These tests were **not run**.

## Remaining unresolved risks for Codex

1. Compile/API risk: static inspection cannot prove the patch compiles on the downstream checkout.
2. Formatter/lint risk: no `rustfmt` or Clippy execution occurred.
3. Patch-application risk: line/context drift after `c4017a87...` must be reconciled, not forced.
4. Behavioral risk: the read-only `exec_command` allowlist may still discard old information later useful to the model; behavioral continuation tests are required.
5. Effectiveness risk: the narrow allowlist plus upstream per-tool truncation may yield modest real savings; measure rather than assume.
6. Retry integration risk: source placement is correct by inspection, but a real forced retry test is still required.
7. Desktop/runtime compatibility risk: exact Community package bundled-runtime compatibility is not proven by this source patch.

## Static review verdict

**ACCEPTED AS A BEST-EFFORT DOWNSTREAM CANDIDATE, NOT AS A COMPILED OR TESTED PATCH.**

The patch series is coherent enough to hand to Codex for critical inspection, drift adaptation, formatting, compilation, tests, CE update-path inspection, controlled integration and smoke. Runtime/final milestone GREEN remains prohibited until that downstream evidence exists.

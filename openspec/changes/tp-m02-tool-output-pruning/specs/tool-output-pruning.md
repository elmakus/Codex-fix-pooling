# Tool Output Pruning — TP_M02 Best-Effort Behavior Contract

## 1. Activation semantics

1. In the project-patched Codex runtime, request-time tool-output pruning MUST be active unconditionally at the selected request-construction seam.
2. TP_M02 MUST NOT introduce a feature flag, `/experimental` toggle, user-facing enable/disable option, or config-schema key solely to disable pruning.
3. Historical `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213` used an experimental `Feature::ToolOutputPrune` with `default_enabled: false`; that toggle is provenance only and is intentionally not reproduced.
4. Always-on activation does not make ambiguous content eligible. Classification and accounting uncertainty MUST fail closed by retaining content.

## 2. Request-time transformation boundary

1. Pruning MUST operate only on the derived model-request `Vec<ResponseItem>` after prompt-input materialization and before executed-tool metadata attachment / `build_prompt`.
2. Pruning MUST NOT mutate canonical `ContextManager`, rollout/history storage, or persisted conversation state solely to save request tokens.
3. Every sampling attempt MUST apply the same contract. A retry input regenerated from canonical history MUST be pruned again before request construction.
4. Upstream compaction/context-window recovery remains separate and MUST NOT be treated as satisfying or weakening this contract.

## 3. Candidate classes and fail-closed classification

Only these variants may become candidates in the first best-effort implementation:

- `ResponseItem::FunctionCallOutput`;
- `ResponseItem::CustomToolCallOutput`.

All other output classes are protected by default, including `ToolSearchOutput`.

A candidate MUST be:

- text-only and safely replaceable;
- `success == Some(true)`;
- associated with a trustworthy, unambiguous tool identity;
- outside every mandatory protected category;
- structurally valid after replacement.

Standard and custom outputs MUST follow equivalent semantic rules.

There MUST NOT be a catch-all rule that treats every successful output as disposable when tool identity/safety is unknown.

## 4. Mandatory protected evidence

The first best-effort implementation MUST retain:

- failed standard/custom outputs (`success == Some(false)`);
- outputs with absent/unknown success (`success == None`);
- `apply_patch`, whether identified from output metadata or an unambiguous paired call;
- mutation/durability-sensitive evidence where removal could hide the only useful record of a state change;
- unknown/new/unclassifiable variants or tools whose safety is not established;
- missing, malformed, contradictory, or ambiguous call/output pairing;
- unsupported structured/media output;
- `ToolSearchOutput`;
- output in the current/recent user-turn region;
- output inside the newest protected-output budget;
- only-model-visible evidence required for safe continuation;
- content affected by classification or token-accounting ambiguity.

Protection takes precedence over pruning benefit.

## 5. Recency and newest-output protection

1. Candidate discovery MUST retain outputs until at least two user-input boundaries have been crossed from the newest end of the request history.
2. Among older otherwise eligible outputs, evaluation proceeds newest to oldest.
3. Whole outputs are retained while satisfying the newest-output protected-token budget; outputs are never partially split to hit the budget.
4. Token-estimation failure or invalid accounting retains the affected content.

The implementation SHOULD reuse the current Codex item-token estimator rather than create a second tokenization subsystem when that estimator can be imported without invasive refactoring.

## 6. Minimum-benefit semantics

1. Pruning MUST have a nontrivial minimum-benefit gate so small savings do not rewrite history payloads unnecessarily.
2. Replacement-marker overhead SHOULD be included when practical with the existing estimator.
3. If benefit cannot be estimated safely, no rewrite occurs for that candidate/request.
4. Historical `40_000` protected tokens and `20_000` minimum removable tokens are design/provenance anchors. Because this project intentionally has no user-facing pruning config, the first best-effort patch MAY use conservative compile-time constants. Those constants MUST be obvious in source and called out in the Codex handoff for downstream adjustment.

## 7. Replacement semantics

1. Selected eligible payload text is replaced with the stable marker `[Old tool result content cleared]`, unless exact current types require a structurally equivalent representation.
2. Required call identity, tool metadata, and success metadata MUST be preserved.
3. Paired calls and unrelated response items MUST not be rewritten.

## 8. `apply_patch`, identity, structured output and unknown classes

1. Tool identity SHOULD use trustworthy output metadata where present and unambiguous paired calls where needed.
2. Contradictory or ambiguous identity is protected.
3. If the output or paired call identifies `apply_patch`, retain the output.
4. The implementation MUST account for `apply_patch` potentially appearing through custom-tool machinery.
5. Structured/media output is protected unless the implementation can prove the replacement is text-only and structurally safe.
6. New/unknown output variants remain protected automatically.

## 9. Static-authoring validation status

The current ChatGPT authoring environment lacks Rust/Cargo execution capability. Therefore:

- the patch MAY be authored from exact-source static analysis;
- it MUST be labeled `BEST_EFFORT / UNCOMPILED / UNTESTED` until a downstream executor validates it;
- no compile/test GREEN claim may be inferred from static review;
- likely API/ownership/typing assumptions and uncertain points MUST be documented in the Codex handoff.

## 10. Downstream Codex review/integration contract

Before installation, Codex receiving the handoff SHOULD:

1. compare the exact patch base with its checkout/current upstream;
2. review whether the implementation still matches current source semantics;
3. run an apply check or equivalent and repair obvious drift/API errors;
4. compile/test to the extent useful/available;
5. inspect the current ChatGPT Community for Linux update/build/runtime-substitution path;
6. attempt CE update plus patched runtime installation only after the review is coherent;
7. preserve a rollback path;
8. return exact compile/runtime/integration symptoms if the assumptions fail.

## 11. Recommended semantic checks for downstream validation

The handoff SHOULD include tests or at least executable test intent covering:

1. recent outputs retained;
2. newest protected budget retained;
3. old safe successful standard output pruned after gates pass;
4. custom output parity;
5. below-minimum benefit retained;
6. failed standard/custom retained;
7. `success == None` retained;
8. `apply_patch` retained;
9. unknown/ambiguous identity retained;
10. structured/media retained;
11. `ToolSearchOutput` retained;
12. replacement preserves structural/success metadata;
13. canonical history unchanged;
14. retry/regenerated input receives the same transform;
15. estimator/classification ambiguity fails closed;
16. no-eligible-output control remains unchanged.

A separate disabled-feature test is intentionally absent because this project variant has no disable path.

## 12. Scope

TP_M02 best-effort preparation now includes the downstream handoff needed for Codex to inspect the current Community update/build mechanism and attempt patched-runtime installation with the CE update. This does not authorize this ChatGPT authoring environment to modify upstream/community repositories or claim deployment success itself.

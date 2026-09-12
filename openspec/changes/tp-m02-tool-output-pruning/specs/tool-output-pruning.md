# Tool Output Pruning — TP_M02 Behavior Contract

## 1. Enable / disable semantics

1. Pruning MUST be controlled by an explicit feature/config decision and MUST be disabled by default.
2. When the feature is disabled, request construction MUST remain stock-equivalent with respect to tool-output content.
3. Enabling the feature without a complete valid policy MUST fail closed: no output is removed. The implementation MAY expose an internal skipped reason for tests/diagnostics.
4. A complete initial policy MUST provide:
   - an explicit set of tool identities classified as replayable/eligible;
   - `protected_recent_tokens` greater than zero;
   - `minimum_savings_tokens` greater than zero;
   - a user-turn recency floor of at least two user-input boundaries.
5. Historical `40_000` / `20_000` values MUST NOT become implicit production defaults in TP_M02. They remain test/benchmark anchors.

## 2. Request-time transformation boundary

1. Normal pruning MUST operate only on the derived model-request `Vec<ResponseItem>` after prompt-input materialization and before request construction/sampling.
2. Pruning MUST NOT mutate canonical `ContextManager`, rollout/history storage, or persisted conversation state solely to save request tokens.
3. Every sampling attempt MUST apply the same contract. A regenerated retry input rebuilt from canonical history MUST be pruned again before the retry request is constructed.
4. Upstream compaction/context-window recovery remains a separate mechanism and MUST NOT be treated as satisfying or weakening this contract.

## 3. Canonical-history invariant

For a deterministic canonical-history snapshot, preparing an enabled pruning request MAY alter only eligible output payloads in the derived request. The canonical snapshot MUST remain semantically unchanged by pruning itself.

Tests MUST prove this invariant on ordinary initial request preparation and on retry/regenerated request preparation.

## 4. Candidate output classes

Only these variants can be candidates in TP_M02:

- `ResponseItem::FunctionCallOutput`;
- `ResponseItem::CustomToolCallOutput`.

All other variants are protected by default, including `ToolSearchOutput`.

A candidate MUST satisfy all of the following before threshold/recency evaluation:

1. payload is text-only and safely replaceable without losing structured/media content;
2. `success == Some(true)`;
3. tool identity is trusted from output metadata and/or an unambiguous paired call;
4. the resolved tool identity appears in the explicit replayable-tool allowlist/configuration;
5. the tool is not in a mandatory protected category;
6. call/output structure remains valid after replacement.

Standard and custom output variants MUST use the same semantic policy.

## 5. Mandatory protected output

The following MUST remain intact even if a tool name is mistakenly allowlisted:

- any failed standard/custom output (`success == Some(false)`);
- any output with absent/unknown success (`success == None`) in TP_M02;
- `apply_patch`, resolved either from output metadata or its paired call;
- any direct mutation/durability-sensitive evidence identified by the implementation's mandatory protected set;
- unknown/new/unclassifiable output variants;
- missing, malformed or ambiguous call/output pairing when identity is required;
- structured/media output not explicitly supported by this spec;
- `ToolSearchOutput`;
- output in the current/recent user-turn region;
- output inside the newest protected-output token budget;
- evidence classified as the only model-visible fact required for safe continuation;
- any item affected by token-estimation/classification ambiguity.

Protection takes precedence over eligibility.

## 6. Recent-turn protection

1. Candidate discovery MUST scan with user-turn boundaries visible.
2. No output becomes age-eligible until at least two user-input boundaries have been crossed from the newest end of the request history.
3. A policy MAY require a more conservative floor, but TP_M02 MUST NOT allow a value below two.
4. The current user-turn region and the immediately preceding protected region therefore remain intact independent of token thresholds.

## 7. Newest-output protection budget

1. Among otherwise eligible age-qualified outputs, evaluation proceeds newest to oldest.
2. Whole outputs are retained until the configured `protected_recent_tokens` budget has been satisfied/exceeded; outputs are never partially split to hit the budget.
3. Only older otherwise eligible outputs can enter the removable candidate set.
4. Estimation failure, overflow, negative/invalid accounting, or inability to establish the budget MUST retain the affected content and fail closed.

The policy token estimator SHOULD reuse the current model-visible item estimator (`context_manager::estimate_item_token_count`) rather than introduce a second token-accounting system.

## 8. Minimum-benefit semantics

1. After protected/recent filtering, compute the estimated net request savings of replacing all candidate payloads, including replacement-marker overhead.
2. No candidate is rewritten unless net savings are strictly greater than configured `minimum_savings_tokens`.
3. If savings cannot be estimated safely, no pruning occurs for that request.
4. Below-gate behavior MUST be request-equivalent to the unpruned control.

## 9. Replacement semantics

1. An eligible payload selected for pruning is replaced by one stable textual marker; TP_M02 uses `[Old tool result content cleared]` as the provenance-compatible marker unless implementation evidence proves a structural necessity to use an equivalent marker and updates this OpenSpec before coding that behavior.
2. The replacement MUST preserve all required item identity/structural metadata, including call identity, tool name/namespace where present, and success metadata.
3. The replacement MUST NOT alter paired calls or unrelated response items.

## 10. Tool identity and `apply_patch`

1. Standard/custom outputs MUST resolve identity using current output metadata where trustworthy and paired calls where required.
2. An ambiguous or contradictory identity is protected.
3. If either trustworthy output metadata or the unambiguous paired call identifies `apply_patch`, the output is protected.
4. The implementation MUST account for current Codex representing `apply_patch` through custom-tool machinery.

## 11. Unknown/new tools and output classes

1. New or unknown output variants are protected automatically.
2. New tool names are protected unless explicitly added to the replayable-tool eligibility configuration/classification.
3. Adding a name to that set MUST NOT bypass mandatory protected categories.
4. There is no catch-all rule that treats successful output as disposable.

## 12. Observable pruning result

The pruning core MUST expose an internal deterministic result/summary sufficient for tests and provenance, without requiring a new public API. It MUST make test assertions possible for at least:

- whether pruning occurred or was skipped;
- number of pruned outputs;
- estimated source/candidate/net-saved tokens when valid;
- classification/protection reason per relevant candidate or an equivalently precise deterministic representation;
- active policy parameters needed to reproduce the decision.

Observability MUST NOT require mutating canonical history.

## 13. R19 semantic requirements

TP_M02 tests MUST cover at minimum:

1. disabled feature => unchanged request content;
2. incomplete/invalid policy => fail-closed unchanged request;
3. recent outputs remain intact;
4. newest protected-output budget remains intact;
5. old explicitly eligible successful standard output prunes only after all gates pass;
6. equivalent custom output follows the same semantics;
7. below minimum-benefit => unchanged request;
8. failed standard output retained;
9. failed custom output retained;
10. `success == None` retained;
11. `apply_patch` retained through current standard/custom identity paths as applicable;
12. unknown/unallowlisted tool retained;
13. missing/ambiguous pairing retained;
14. structured/media output retained;
15. `ToolSearchOutput` retained;
16. replacement preserves structural/identity/success metadata;
17. canonical history unchanged by request preparation;
18. retry/regenerated prompt input receives the same policy;
19. estimator ambiguity/overflow fails closed;
20. no-eligible-output control remains unchanged.

## 14. Scope boundary

This specification does not define Community package selection, updater persistence, Desktop compatibility, production threshold selection or final TP_M03 effectiveness/quality acceptance. Those remain later milestone contracts.

# TP_M02 Tool Output Pruning — Design

## Exact baseline

Fresh authoring base: `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`.
Community: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`.
Official Linux package baseline: `26.908.40834`.

Fresh branch reads matched the planning-pivot observations. Accepted `NOT_EQUIVALENT` and `REIMPLEMENT_EQUIVALENT_BEHAVIOR` therefore remain current.

## Activation

Pruning is **always on** in the patched Codex runtime. There is no feature flag, `/experimental` entry, config enable/disable field, schema key or runtime off path.

Historical `tekacs/codex@d70b903...` activation plumbing is provenance only.

## Request seam

Current `run_sampling_request` keeps a loop that:

1. consumes supplied `initial_input` on the first attempt or regenerates from `sess.clone_history().await.for_prompt(...)` on a retry;
2. makes that vector mutable;
3. attaches executed-tool metadata;
4. calls `build_prompt`.

TP_M02 replaces step 2 with an unconditional pure transform:

`let mut prompt_input = crate::tool_output_prune::prune(prompt_input);`

This placement is after current request materialization and before executed-tool metadata attachment / `build_prompt`, so first attempts and retry-regenerated attempts share one policy point.

`ContextManager` remains canonical history. The pruning module receives only the owned derived `Vec<ResponseItem>` and has no session/history mutation API.

## Candidate representation

Only current `FunctionCallOutput` and `CustomToolCallOutput` can become candidates. They must satisfy all of:

- `success == Some(true)`;
- `FunctionCallOutputBody::Text`;
- unambiguous request-local paired call ID;
- no contradiction between available output name/namespace metadata and paired call identity;
- default tool namespace only;
- positive bounded replayability policy;
- outside the recent user-turn region;
- outside the newest protected eligible-output budget;
- positive replacement-aware savings contributing to aggregate net benefit above the minimum.

Everything else is protected automatically, including `ToolSearchOutput` and future/new `ResponseItem` variants.

## Tool policy

The initial positive identity set is intentionally one tool: `exec_command`.

Even `exec_command` is eligible only when the paired call's JSON `cmd` is one simple read-only command. The implementation accepts a bounded executable set (`cat`, `head`, non-following `tail`, `wc`, `ls`, `pwd`, `stat`, `grep`, `rg` without `--pre`) and rejects shell composition/redirection/control operators, command/process substitution, malformed arguments, unknown executables, follow modes and external preprocess execution.

`apply_patch` cannot become eligible because it is not positively allowlisted. The same is true for MCP discovery/read tools, tool search, dynamic tools, mutation tools and unknown future identities.

Duplicate call IDs make that relationship ambiguous and protected.

## Recency

Reverse scan counts only user messages that are not recognized by current upstream as contextual user content. When content-kind metadata exists, at least one `user.*` kind must be present. Two such user-input boundaries must be crossed before candidate analysis begins.

This deliberately prefers false-negative pruning over prematurely aging injected/contextual evidence.

## Token accounting and thresholds

Use `crate::context_manager::estimate_item_token_count` for both original and replacement items.

Compile-time starting policy:

- `PRUNE_PROTECT_TOKENS = 40_000`;
- `PRUNE_MINIMUM_NET_TOKENS = 20_000`;
- `PRUNE_RECENT_USER_BOUNDARIES = 2`.

Newest otherwise-eligible whole outputs are retained until the 40k target is met; a crossing output is retained whole, so actual protected content may exceed 40k.

For older candidates, clone the complete item, replace only `output.body` with `[Old tool result content cleared]`, estimate that replacement with the same upstream estimator, and calculate checked `original - replacement` net savings. Aggregate token arithmetic uses checked addition. Any accounting failure returns the original request unchanged. Rewrite occurs only when aggregate net savings is greater than 20k.

No partial output chopping is added by this feature.

## Metadata preservation

Replacement mutates only `FunctionCallOutputPayload.body`. All item/call IDs, name, namespace, `success` and internal passthrough metadata remain present exactly as cloned.

## Static patch carrier

Canonical series: `implementation/patches/TP_M02_SERIES.md`.

It contains:

1. exact-base implementation + unit tests;
2. mandatory static-review corrections for checked fail-closed token aggregation and current contextual-user recency handling.

The series is authored against the exact `c4017a87...` source base. Downstream Codex must inspect/apply/adapt rather than force stale hunks if source changed.

## Testing model

Unit tests embedded in the patch cover the required core matrix. See `implementation/evidence/TP_M02_PREPARED_TESTS.md`.

The authoring session did not compile or execute them. Downstream validation still needs at least formatter/check, focused unit tests, a real retry/regeneration integration test, canonical-history assertion, executed-metadata interaction, compaction interaction, request-token measurement and continuation smoke.

## Static review

Canonical review: `implementation/evidence/TP_M02_STATIC_REVIEW.md`.

The review explicitly checks syntax/API plausibility, imports/module visibility, ownership, enum handling, output representation, standard/custom parity, pairing, `apply_patch`, failures/`None`, unknown variants, structured/media output, `ToolSearchOutput`, recency, checked token arithmetic, benefit logic, metadata preservation, canonical-history boundary, first/retry request paths, executed-tool metadata and current compaction/context management.

The verdict is suitable for downstream critical build/test work, **not compile/test GREEN**.

## Capability strategy supersession

The historical local-Rust-lane capability blocker remains valid as a record of what the previous execution strategy required, but it is superseded as a blocker to static patch authoring. Lack of local Rust/Cargo/container capability now changes the evidence label to `UNCOMPILED / UNTESTED`; it does not prohibit authoring.

Final runtime acceptance still requires downstream executable evidence. No final runtime milestone may be marked GREEN from this static package alone.

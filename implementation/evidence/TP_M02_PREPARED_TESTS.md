# TP_M02 Prepared Tests — Unexecuted

Date: 2026-09-12
Patch series: `implementation/patches/TP_M02_SERIES.md`
Status: **AUTHORED / NOT COMPILED / NOT EXECUTED**

The Rust unit-test code is embedded in the new `codex-rs/core/src/tool_output_prune.rs` carried by the patch series. This evidence maps the required semantics to the authored tests and separates authored coverage from later executable acceptance.

| Required case | Authored test / evidence |
|---|---|
| recent output retained | `recent_output_is_retained` |
| newest token-budget outputs retained | `newest_old_output_budget_is_retained_whole` |
| old eligible standard output pruned | `old_eligible_standard_output_is_pruned` |
| equivalent eligible custom output pruned | `equivalent_old_eligible_custom_output_is_pruned` |
| below minimum benefit unchanged | `below_minimum_net_benefit_is_unchanged` |
| failed standard output retained | `failed_standard_output_is_retained` |
| failed custom output retained | `failed_custom_output_is_retained` |
| unknown success retained when representable | `unknown_success_is_retained_for_standard_and_custom_outputs` |
| `apply_patch` retained | `apply_patch_is_retained_in_custom_tool_form` |
| unknown/unallowlisted tool retained | `unknown_tool_is_retained` |
| ambiguous pairing retained | `ambiguous_pairing_is_retained` |
| structured/media retained | `structured_output_is_retained`; policy matches only `Text`, so all `ContentItems` including media stay protected |
| `ToolSearchOutput` retained | `tool_search_output_is_retained` |
| metadata preserved | `replacement_preserves_output_metadata` |
| canonical history/request source unchanged | `canonical_input_clone_is_not_mutated`; architectural proof also comes from the pure owned-vector seam |
| retry-regenerated input receives pruning again | `regenerated_retry_input_receives_the_same_transform_when_reapplied`; loop placement statically covers actual retry regeneration, but downstream must add/run a forced retry integration test |
| no eligible output unchanged | `no_eligible_output_is_unchanged` |
| mutation-sensitive exec excluded | `mutating_or_shell_composed_exec_command_is_not_allowlisted` |

## Additional downstream tests required before acceptance

Codex should run the embedded unit tests after adapting any API drift and add/use an existing integration harness for these execution-path assertions:

1. force a retryable sampling failure and prove regenerated `for_prompt(...)` input is pruned again;
2. capture canonical `ContextManager` before/after first-attempt and retry request construction and prove pruning does not mutate it;
3. verify executed-tool metadata attachment still succeeds after replacement;
4. exercise at least one later compaction/context-window path after a pruned request;
5. measure request-token savings using current request accounting on a realistic tool-heavy fixture;
6. run continuation smoke with old read-only output pruned, failure diagnostics retained, `apply_patch` evidence retained and `ToolSearchOutput` retained.

## Suggested commands — verify against current checkout before use

The authoring session did not execute commands. On the exact/up-to-date Codex checkout, Codex should first inspect workspace conventions and then run the smallest applicable formatter/check/test lane, for example the repository's normal equivalents of:

- format the touched Rust files;
- compile/check `codex-core`;
- run the focused `tool_output_prune` unit tests;
- run relevant core/session integration tests;
- run broader tests only as justified by failures or repository guidance.

Do not report these tests as passed until command output is durably captured.

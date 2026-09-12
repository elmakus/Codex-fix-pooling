# TP_M02 best-effort patch series

Status: `BEST_EFFORT / STATICALLY_REVIEWED / NOT COMPILED BY CHATGPT`
Exact upstream base: `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`

Apply in this order against the exact base (or inspect/adapt if upstream has drifted):

1. `implementation/patches/TP_M02_OPENAI_CODEX_c4017a87_TOOL_OUTPUT_PRUNING.patch`
2. `implementation/patches/TP_M02_0002_STATIC_REVIEW_FIXES.patch`

The second patch is not optional. It contains findings from the adversarial static review: fail-closed checked token aggregation and stricter contextual-user boundary handling.

The resulting intended source change is minimal:

- add `codex-rs/core/src/tool_output_prune.rs`;
- register the module in `codex-rs/core/src/lib.rs`;
- invoke pruning unconditionally inside each `run_sampling_request` loop iteration immediately after initial/regenerated prompt-input materialization and before executed-tool metadata attachment / `build_prompt`.

No feature flag, `/experimental` entry, config key, config schema or runtime disable path is part of this patch series.

The tests are embedded in `tool_output_prune.rs` under `#[cfg(test)]`. They were authored but were **not executed** in the ChatGPT authoring environment.

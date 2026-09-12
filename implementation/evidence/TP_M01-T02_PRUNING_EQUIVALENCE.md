# TP_M01-T02 Evidence — Strict upstream pruning-equivalence verdict

Date: 2026-09-12
Executor: ChatGPT
Upstream baseline: `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
Historical reference: `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`
T01 evidence: `implementation/evidence/TP_M01-T01_BASELINE_ARCHITECTURE.md`

## Verdict

**NOT_EQUIVALENT**

Current official Codex contains multiple context-reduction/truncation/compaction mechanisms, but none identified on the pinned baseline satisfies the historical request-time tool-output pruning contract as a whole. This verdict is based on semantic comparison, not merely absence of the historical feature name or placeholder string.

The verdict is about `openai/codex@944d6fd...` source semantics. T01 separately records that the exact public mapping from the official Desktop package's bundled `resources/codex` binary to an `openai/codex` source SHA is unavailable and must not be guessed.

## Reference behavior dimensions

Historical `d70b903` adds `Feature::ToolOutputPrune` and transforms only the derived sampling-request `Vec<ResponseItem>`. It:

- scans tool outputs from newest toward oldest;
- does not consider outputs until at least two user turns have been crossed;
- protects the newest `40_000` approximate tool-output tokens;
- only performs replacement if more than `20_000` candidate tokens would be removed;
- protects failed standard function-call outputs (`success == Some(false)`);
- protects outputs from `apply_patch` by correlating output call IDs to call names;
- handles both `FunctionCallOutput` and `CustomToolCallOutput`;
- replaces eligible old output content with `[Old tool result content cleared]`;
- leaves canonical history unchanged because `prune(&input)` returns a transformed request vector.

## Current-baseline semantic comparison

| Dimension | `d70b903` reference | Current `openai/codex@944d6fd...` | Equivalent? |
|---|---|---|---|
| Ordinary request-time reduction of old outputs | Yes; runs before sampling on derived request input | Regular `run_turn` materializes `ContextManager::for_prompt`; `run_sampling_request` builds the prompt but has no age-based old-output pruning transform | **No** |
| Recent-turn protection | Requires crossing at least two user turns before candidates | Per-tool truncation is applied when output is constructed; context-window rewrite scans from newest backwards based on overflow, not user-turn age protection | **No** |
| Recent-output token protection | Preserves newest 40k eligible output tokens | No equivalent protected recent-output budget found in request construction/context-window rewrite | **No** |
| Minimum-benefit gate | No rewrite unless candidates exceed 20k | Per-tool truncation uses per-output limits; context-window recovery rewrites only as needed to fit context, not an equivalent candidate-savings minimum | **No** |
| Failed-output protection | Explicit for standard `FunctionCallOutput` | Context-window rewrite recreates output with preserved `success` field but does not exclude `success == Some(false)` from rewriting | **No** |
| `apply_patch` protection | Explicit call-name protection | Context-window rewrite does not inspect tool name/call correlation and has no `apply_patch` exclusion | **No** |
| Standard output coverage | `FunctionCallOutput` | Current truncation/recovery handles standard output | Partial |
| Custom output coverage | `CustomToolCallOutput` | Current truncation/recovery handles custom output | Partial |
| New output classes | Not present in historical policy | Current source also has `ToolSearchOutput`; context-window recovery can clear its tools vector | Different architecture |
| Canonical-history preservation for ordinary pruning | Request vector only; canonical history unchanged | Per-tool truncation affects the stored/model-facing response payload; compaction/history recovery can rewrite a `ContextManager`; no equivalent ordinary request-only old-output transform found | **No** |
| Explicit pruning feature control | `Feature::ToolOutputPrune`, off by default | No equivalent old-output-pruning feature/control contract identified | **No** |

## Current mechanisms considered

### 1. Per-tool output truncation

`codex-rs/core/src/tools/context.rs` keeps raw exec bytes but produces model/history-facing output under a `TruncationPolicy`, with warnings and original-token/omission metadata where available. This is useful output bounding but occurs at tool-output construction time. It does not later reclaim repeated request context from old already-recorded outputs based on age, recent-output protection or aggregate removable-token benefit.

Therefore it is not equivalent to historical request-time pruning.

### 2. `ContextManager::for_prompt` normalization

The prompt path clones canonical context and calls `for_prompt`, which normalizes call/output pairing and strips unsupported media. This creates a derived model-visible request vector but contains no identified old-output age/budget pruning semantics.

The architectural seam needed for a future request-only transform still exists, but the behavior itself is not present.

### 3. Context-window recovery rewrite

`codex-rs/core/src/compact_remote_history.rs::trim_function_call_history_to_fit_context_window` estimates history size and, when above the context window, can replace `FunctionCallOutput` and `CustomToolCallOutput` content with `Output exceeded the available model context and was truncated`, and clear `ToolSearchOutput.tools`.

This mechanism is materially different:

- trigger is context overflow rather than ordinary repeated request-context reduction;
- it has no historical two-user-turn candidate gate;
- it has no 40k recent-output protection budget;
- it has no 20k minimum-benefit gate;
- it does not skip failed standard outputs;
- it does not protect `apply_patch` outputs;
- it rewrites the supplied `ContextManager` in compaction/recovery processing instead of applying a transient transform to the normal sampling request vector.

Its unit test confirms rewrite semantics and metadata preservation, not historical safety protections.

### 4. Compaction / TokenBudget

Current `turn.rs` can invoke pre-sampling compaction for model compaction-hash changes, model downshift/context limits, token-budget mode, remote compaction V2 or local compaction. These mechanisms reduce/reset broader conversation context and may preserve summaries/retained context, but high-level context reduction is insufficient for equivalence: the project requirement is specifically safe reclamation of old tool-output payload from repeated requests with the reference safety dimensions.

No evidence was found that compaction implements the reference recent-output/minimum-benefit/failure/`apply_patch` semantics as an equivalent tool-output policy.

## Non-destructive intent check

Current architecture still offers a clean request-time seam:

`ContextManager clone -> for_prompt(...) -> Vec<ResponseItem> -> run_sampling_request -> build_prompt`

A transform applied to that derived vector can remain non-destructive with respect to canonical `ContextManager`. However, current upstream does not presently apply the historical-equivalent tool-output policy at that seam.

On retries, `run_sampling_request` can reconstruct prompt input from `sess.clone_history().await.for_prompt(...)`; therefore a future adapted implementation must apply its transform to every model-request input, including regenerated retry inputs, not only the initial vector.

## Missing semantics proving NOT_EQUIVALENT

The verdict would remain `NOT_EQUIVALENT` even if exact source names changed, because current identified behavior lacks multiple independently material reference guarantees:

1. ordinary request-time old-output reclamation before context-window emergency;
2. user-turn recency exclusion;
3. protected recent tool-output token budget;
4. minimum aggregate pruning-benefit gate;
5. failed standard output protection;
6. `apply_patch` durability protection;
7. explicit independently controllable pruning feature semantics;
8. request-only/non-destructive behavior as the normal pruning path.

Any one missing safety/behavior dimension could defeat strict equivalence. Multiple are absent.

## Independent consistency review

A second-pass check was performed against T01's architecture map and current source paths rather than relying only on marker search:

- re-read current `openai/codex:main`; it remains exactly `944d6fd...`;
- re-inspected current context-window output rewrite and its test;
- re-checked the historical commit diff for the actual reference policy;
- compared trigger, mutation target, protection rules, output classes and control semantics dimension-by-dimension;
- confirmed the conclusion does not depend on the historical placeholder string or feature name being absent.

Result: `NOT_EQUIVALENT` is internally consistent with T01 evidence.

## Implications for TP_M01

- T03 must now define the current-baseline protected-output and threshold safety contract; historical 40k/20k remain inputs, not frozen values.
- T04 must define a paired effectiveness benchmark and quality regression matrix.
- T05 may consider a custom pruning implementation strategy because upstream equivalence has been rejected for the pinned source baseline, but it must still respect the unresolved exact bundled-binary/source mapping from T01 and refresh runtime-delivery compatibility assumptions.
- No pruning implementation is authorized in TP_M01.

## Checks

- exact current upstream ref refreshed and matched T01;
- all required reference behavior dimensions addressed;
- current source mechanisms compared against exact historical semantics;
- T01 architecture consistency review completed;
- no public source repository or runtime modified;
- durable writes limited to project branch.

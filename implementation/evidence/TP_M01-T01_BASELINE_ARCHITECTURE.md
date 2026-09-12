# TP_M01-T01 Evidence — Current baseline and request/context architecture

Date: 2026-09-12
Executor: ChatGPT
Scope: discovery only; no pruning implementation/runtime mutation

## 1. Exact pinned baselines

### Project

- repository: `elmakus/Codex-fix-pooling`
- branch: `tool-output-pruning`
- prepared start HEAD: `3b350df1928182205f47044237b32206954e0402`
- start commit message: `prep: mark pruning TP_M01 ready`

### Official Codex source

- repository: `openai/codex`
- branch: `main`
- pinned commit: `944d6fd1ba4baab69dbedd205282dc72ec20abb5`
- parent: `89c8bcf37d64be69e4c8286f4541c1a84ed312a4`
- sampled commit is unrelated to pruning (voice-caption change), so the pre-execution audit baseline did not drift.

### Community Desktop

- repository: `ilysenko/codex-desktop-linux`
- branch: `main`
- pinned commit: `249cd4b64d42434f51417fec4a318750d461b676`
- commit: `Repair official Linux 26.908.40834 drift (#1471)`
- official Linux package version: `26.908.40834`
- official release ID recorded by Community commit: `d46153659a7cfa05b113fe80952feec0b7b43676e17f7fd23128c1951e4e59c8`
- amd64 official package path: `pool/main/c/chatgpt/chatgpt_26.908.40834_amd64.deb`
- amd64 SHA-256: `da37b8e7bcefaaea019c478cacbe6c73ee1ddd15e0e1ebb3c7ef0a42dd818ac2`
- arm64 official package path: `pool/main/c/chatgpt/chatgpt_26.908.40834_arm64.deb`
- arm64 SHA-256: `bae5c5ca585625a116a8877dedc455e4c27ca02063ea93dbd6a0506ed6a12d31`

### Historical pruning reference

- repository: `tekacs/codex`
- commit: `d70b903a4edbbb02c5009ae8e6194f2128d80213`
- title: `core: add request-time tool output pruning`
- historical insertion seam: `codex-rs/core/src/session/turn.rs::run_sampling_request`
- historical implementation module: `codex-rs/core/src/tool_output_prune.rs`

## 2. Community Desktop → official package → bundled Codex

At Community commit `249cd4b...`, the official signed Linux package is the baseline payload. `scripts/lib/upstream-linux-package.sh` requires the extracted official package to contain executable `resources/codex`; packaging/launcher code keeps that bundled executable and defaults `CODEX_CLI_PATH` to it. Nix packaging likewise exposes `${desktopPackage}/opt/codex-desktop/resources/codex` as the bundled CLI by default.

Identity verdict for bundled Codex:

- package-level identity: **DETERMINISTIC** — official package version/path/SHA-256 are pinned by Community source;
- bundled binary provenance: **DETERMINISTIC TO PACKAGE** — `resources/codex` comes directly from that verified official package unless an explicit override is selected;
- bundled binary version/revision: **UNAVAILABLE FROM PUBLIC SOURCE ALONE IN T01** — Community source does not publish a separate binary SHA/version-to-`openai/codex` commit mapping for the extracted `resources/codex` executable;
- mapping bundled binary → exact `openai/codex` source commit: **UNKNOWN**. Do not infer that package `26.908.40834` was built from current `openai/codex:main` merely because both are current.

This distinction is important for T02: current upstream source can be audited for equivalence, while exact bundled-runtime equivalence requires a safely derived runtime/source mapping or must remain unknown.

## 3. Current model request construction path

At `openai/codex@944d6fd...` the regular turn path is:

1. `codex-rs/core/src/session/turn.rs::run_turn` records accepted inputs/context in session history.
2. Immediately before a sampling request, it clones `ContextManager` and calls `for_prompt(model_info.input_modalities)` to produce `Vec<ResponseItem>`.
3. `run_sampling_request` receives that vector. On retry it may re-clone history and call `for_prompt` again.
4. Executed-tool-call metadata is attached to the prompt input.
5. `build_prompt` places the resulting vector into `Prompt { input, tools, ... }`.
6. The model client sends that prompt through the configured provider path.

The historical `d70b903` seam still exists conceptually: its old patch transformed the `Vec<ResponseItem>` at the beginning of `run_sampling_request`, after history-to-prompt materialization and before `Prompt` construction. Current `run_sampling_request` has no such historical call at that location.

Important architectural change: current `run_sampling_request` can reconstruct `prompt_input` from `sess.clone_history().await.for_prompt(...)` inside its retry loop. A current request-time pruning design would therefore need to account for both initial input and regenerated retry input; blindly restoring the historical one-time pre-loop insertion may not cover all current request construction paths.

## 4. Canonical history / response representation

`ContextManager` is the current in-memory transcript authority. It stores oldest-first `Arc<Vec<ResponseItemEnvelope>>`, retained host context, token info and history/user-message revisions. Cloning shares immutable state until mutation. `for_prompt` returns a model-facing `Vec<ResponseItem>` after normalization and modality filtering.

This preserves a useful seam for R3: a transformation performed only on the derived `Vec<ResponseItem>` can be non-destructive with respect to the canonical `ContextManager`.

However, not all current context reduction is request-only. Compaction and context-window recovery may rewrite/replace history intentionally. T02/T03 must distinguish these mechanisms from the desired ordinary request-time pruning invariant.

## 5. Current tool-output item model

The historical standard/custom classes still exist:

- `ResponseItem::FunctionCall { name, namespace, arguments, call_id, ... }`
- `ResponseItem::FunctionCallOutput { call_id: Option<String>, name, namespace, output: FunctionCallOutputPayload, ... }`
- `ResponseItem::CustomToolCall { call_id, name, namespace, input, ... }`
- `ResponseItem::CustomToolCallOutput { call_id, name, output: FunctionCallOutputPayload, ... }`

Both output variants use `FunctionCallOutputPayload`, which can carry text or structured content and preserves optional success metadata. Current normalization explicitly reasons about standard and custom call/output pairing.

The current model has additional relevant output-like classes absent from the historical patch's narrow policy, notably `ToolSearchOutput`. These must be considered by later protected-output classification rather than assumed eligible or irrelevant.

## 6. Output truncation mechanisms

### Per-tool/model-facing truncation

`codex-rs/core/src/tools/context.rs` retains raw exec bytes in `ExecCommandToolOutput::raw_output` but constructs model/history-facing response text under a `TruncationPolicy`. It records original token count/omitted-byte metadata where available and emits an explicit truncation warning. This limits individual command outputs before/while they enter model-facing history; it is not age-based pruning of already-recorded older outputs.

### History normalization / modality stripping

`ContextManager::normalize_history` ensures call/output pairing and strips unsupported image/audio content. `for_prompt` applies normalization to a cloned history used for model input. This is payload shaping but not historical large-output pruning.

### Context-window recovery rewrite

`codex-rs/core/src/compact_remote_history.rs::trim_function_call_history_to_fit_context_window` is materially relevant. When estimated history + base instructions exceed the model context window, it scans from newest backwards and can replace function/custom tool outputs (and clear `ToolSearchOutput.tools`) with a fixed `Output exceeded the available model context and was truncated` marker until the context fits. It mutates the supplied `ContextManager`; callers use it as part of compaction/recovery flows. This is threshold-by-overflow recovery, not the historical age/recent-budget/minimum-benefit request-only behavior.

## 7. Compaction and token-budget architecture

Current `turn.rs` performs pre-sampling compaction before new-turn sampling. It can compact when the prior model's compaction hash changes or when downshifting to a smaller context window. `run_auto_compact` selects among:

- token-budget inline compaction when `Feature::TokenBudget` is enabled;
- remote compaction V2 when provider capabilities support it;
- local inline compaction otherwise.

The context-window status uses `Session::get_total_token_usage()`, backed by `ContextManager` token info plus estimates for locally added items not yet reflected in server usage. `ContextManager::estimate_item_token_count` uses model-visible byte estimates converted through the shared approximate-token heuristic.

These mechanisms overlap the problem domain (keeping requests within useful context limits) but operate at different lifecycle points and with different semantics from `d70b903`. T01 intentionally does not issue the final equivalence verdict.

## 8. Historical patch seams versus current source

Historical seam → current status:

- `session/turn.rs::run_sampling_request`: **still exists**, but request reconstruction/retry logic is more complex; one historical insertion point may be insufficient.
- `tool_output_prune.rs`: **absent** from current upstream at the historical path/marker.
- `Feature::ToolOutputPrune`: **historical feature not observed as the same marker** in current upstream research.
- `ResponseItem::FunctionCallOutput`: **still exists**, richer metadata/structured content.
- `ResponseItem::CustomToolCallOutput`: **still exists**, richer metadata/structured content.
- token estimate utility: shared output-truncation/token-estimation utilities still exist, while `ContextManager` now has broader model-visible accounting.
- context reduction: current upstream has substantial compaction, per-output truncation, context-window recovery rewrite, token-budget and retained-context machinery not represented by the historical patch.

## 9. T01 conclusions (non-verdict)

T01 establishes enough source architecture for T02 without deciding `EQUIVALENT / NOT_EQUIVALENT / UNKNOWN`.

Evidence inputs for T02:

- exact historical pruning code is not present unchanged at the old sampling seam;
- current source still derives a model-request `Vec<ResponseItem>` from canonical history, so request-only transformation remains architecturally possible;
- current source has several other context-reduction mechanisms that must be compared behaviorally, not by name;
- current standard/custom output classes remain relevant, and new output classes broaden safety classification;
- current retry/request reconstruction means any adapted request-time mechanism must cover regenerated prompt inputs;
- exact public mapping from official package `resources/codex` to an `openai/codex` source SHA is not established and must not be guessed.

## 10. Checks performed

- Read back project branch ref before execution: exact prepared HEAD matched `3b350df...`.
- Read Task Board: T01 was sole READY card; no in-progress recovery existed.
- Read current `openai/codex:main` and `ilysenko/codex-desktop-linux:main`; both matched Execution Prep baselines.
- Retrieved historical `tekacs/codex@d70b903...` commit and diff.
- Cross-checked cited current source paths at exact pinned refs using GitHub file/code reads.
- No source/public input repository was modified.
- No local/production ChatGPT Community or Codex runtime was installed, replaced or executed.
- Durable writes were limited to `elmakus/Codex-fix-pooling:tool-output-pruning`.

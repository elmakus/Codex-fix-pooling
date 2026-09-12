# TP_M02 Fresh Refresh Gate and Source Baseline

Date: 2026-09-12
Authoring mode: `BEST_EFFORT / STATICALLY_REVIEWED / UNCOMPILED / UNTESTED`
Project start HEAD: `bb89f62d2e2b4a5834dcd8f27fee469b468699e9`
Branch: `tool-output-pruning`

## Refresh Gate verdict

**GREEN FOR BEST-EFFORT STATIC AUTHORING.**

Fresh public branch reads on 2026-09-12 resolved to:

- `openai/codex:main` -> `c4017a87aacc7558002b7cb510025e967c1d765e`;
- `ilysenko/codex-desktop-linux:main` -> `249cd4b64d42434f51417fec4a318750d461b676`;
- Community official Linux package baseline -> `26.908.40834`.

These exactly match the observations recorded at the planning pivot. No source-HEAD drift was found between the pivot and this authoring session.

`NOT_EQUIVALENT` remains valid and `REIMPLEMENT_EQUIVALENT_BEHAVIOR` remains the selected strategy. No current upstream mechanism observed in the accepted TP_M01 comparison supplies the requested ordinary request-time, two-user-boundary, protected-newest-output-budget, minimum-benefit, failure/ambiguity/apply-patch-safe contract as a semantic whole.

## Exact current source blobs used for authoring

Against `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`:

- `codex-rs/core/src/session/turn.rs` blob `777dc8963b86e9ff1f8047edb19747c479e1d0fc`;
- `codex-rs/core/src/lib.rs` blob `55d1f474e51b33b0ecfdede491ba2beb72741037`;
- `codex-rs/core/src/context_manager/history.rs` blob `f9ad849516f0e8a424f10104ac27320fefeda71b`;
- `codex-rs/core/src/context_manager/mod.rs` blob `af520df6cfe6f01ce77c62b6c879e6d7460a2054`;
- `codex-rs/protocol/src/models.rs` blob `faff4b9824b442057a64a511a9d2fa452ceeeeef`;
- `codex-rs/core/Cargo.toml` blob `24c6640cc1d43da00a8a0a3d0525d210f90c17ac`.

## Current request integration seam

The exact current sampling loop is:

`canonical ContextManager`
-> `clone_history()` / derived history projection
-> `for_prompt(...)`
-> `run_sampling_request`
-> choose first-attempt `initial_input` or retry-regenerated `prompt_input`
-> **TP_M02 pruning transform here**
-> `executed_tool_calls.attach_to_prompt(...)`
-> `build_prompt(...)`
-> sampling request.

The selected seam is inside the `run_sampling_request` loop immediately after `prompt_input` has been selected/materialized and immediately before executed-tool metadata attachment. Because it is inside the loop, both first-attempt and regenerated retry inputs receive the same transform. The transform receives only the derived `Vec<ResponseItem>` and does not receive mutable canonical `ContextManager` state.

## Current ResponseItem/output model relevant to TP_M02

Current `ResponseItem` includes:

- `FunctionCall { name, namespace, arguments, call_id, ... }`;
- `FunctionCallOutput { call_id: Option<String>, name: Option<String>, namespace: Option<String>, output: FunctionCallOutputPayload, ... }`;
- `CustomToolCall { call_id: String, name, namespace, input, ... }`;
- `CustomToolCallOutput { call_id: String, name: Option<String>, output: FunctionCallOutputPayload, ... }`;
- `ToolSearchCall` / `ToolSearchOutput`;
- other message/reasoning/search/media/compaction/control variants, all outside the first pruning candidate set.

`FunctionCallOutputPayload` currently contains:

- `body: FunctionCallOutputBody`;
- `success: Option<bool>`.

`FunctionCallOutputBody` is untagged and currently supports `Text(String)` and `ContentItems(Vec<FunctionCallOutputContentItem>)`.

Therefore the static policy treats only `Text` with `success == Some(true)` as even potentially eligible. `Some(false)`, `None`, structured/media content and `ToolSearchOutput` are protected.

## Tool identity and apply_patch

Current output metadata is not sufficient to justify broad pruning by itself. The patch requires an unambiguous paired call ID and corroborates output name/namespace when those are present. Duplicate call IDs are classified ambiguous and protected.

`apply_patch` is treated as protected. Current Codex can represent it through custom-tool machinery, so the policy does not assume standard `FunctionCall` representation. In practice it is also excluded by the positive allowlist, so future/unknown mutation tools remain protected rather than relying on a blacklist.

The current default top-level tool namespace is `functions`; the static identity check accepts only the default namespace (`None` or `functions`) for the sole initial eligible tool identity.

## Initial eligible identity policy

The first best-effort patch deliberately has one bounded positive identity:

- `exec_command`, **only** when its JSON `cmd` argument can be statically classified as one simple read-only command.

Allowed simple executables are limited to:

- `cat`;
- `head`;
- `tail` without follow/pid modes;
- `wc`;
- `ls`;
- `pwd`;
- `stat`;
- `grep`;
- `rg` without `--pre` execution.

The classifier rejects command composition/redirection/control characters (`;`, `|`, `&`, `>`, `<`, backticks, newlines), command/process substitutions, unknown executables and malformed/non-JSON arguments. This means `exec_command` is not treated as globally disposable; mutation or ambiguity fails closed.

MCP resource listing/reading, `ToolSearchOutput`, `apply_patch`, image/media tools, control tools, dynamic tools and all unknown identities are protected in this first patch.

## Recency and accounting

Age eligibility begins only after two user-input boundaries have been crossed from the newest end. The boundary recognizer follows current Codex content-kind conventions and does not count a classified contextual user message unless its content kinds include a `user.*` kind; absent kind metadata is treated as an ordinary user message for compatibility.

The patch reuses `crate::context_manager::estimate_item_token_count`. No second tokenizer/accounting subsystem is introduced.

Compile-time starting constants:

- newest otherwise-eligible output protection target: `40_000` estimated tokens;
- minimum aggregate **net** savings: `20_000` estimated tokens;
- user-boundary floor: `2`.

The 40k/20k values remain reasonable conservative provenance anchors because the new policy is substantially narrower than the historical patch, keeps at least two user boundaries intact, protects a whole newest eligible output even when that output crosses the 40k target, and calculates the minimum against current model-visible item estimates after replacement-marker overhead. Whole outputs only are replaced.

## Historical provenance

Behavioral provenance remains `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213` (`core: add request-time tool output pruning`). Its feature flag/config plumbing, older token estimator and broader success handling are not copied. In particular, this project intentionally does **not** add `Feature::ToolOutputPrune`, `/experimental`, config schema or a runtime disable path.

## Capability verdict

Local authoring probes in this ChatGPT execution environment returned no `cargo`, `rustc`, `rustfmt`, Docker or Podman executable. Under the superseding project strategy this does **not** block static patch authoring.

It does mean this baseline/evidence package must not claim compilation or runtime execution. Downstream Codex must independently inspect, apply/adapt, format, compile, test and smoke the patch before any runtime acceptance claim.

# Codex Fix Pooling — Tool Output Pruning workstream

Repository: `elmakus/Codex-fix-pooling`
Branch: `tool-output-pruning`

## Current state

- phase: TP_M02 downstream Codex validation / CE integration pending
- ChatGPT static authoring: **COMPLETE**
- patch label: `BEST_EFFORT / STATICALLY_REVIEWED / NOT COMPILED BY CHATGPT`
- runtime/build/install acceptance: **PENDING**
- prior checkpoint retained: `TP_M01_DISCOVERY_GREEN`
- exact authoring upstream: `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
- exact authoring Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- Linux package baseline: `26.908.40834`
- equivalence verdict: `NOT_EQUIVALENT`
- strategy: `REIMPLEMENT_EQUIVALENT_BEHAVIOR`, always on
- historical behavior provenance: `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`

No Rust/Cargo/container execution lane was available in the ChatGPT authoring environment. That limitation was deliberately accepted for static patch authoring and remains a hard limit on compile/test claims.

No build, CE update, install, custom runtime substitution, deployment or runtime smoke was performed by ChatGPT.

## Active authority and durable pointers

- plan: `planning/TP_M02_BEST_EFFORT_CODEX_HANDOFF_PLAN.md`
- active OpenSpec: `openspec/changes/tp-m02-tool-output-pruning/`
- exact source freeze: `implementation/evidence/TP_M02_REFRESH_BASELINE.md`
- patch series: `implementation/patches/TP_M02_SERIES.md`
- prepared unexecuted tests: `implementation/evidence/TP_M02_PREPARED_TESTS.md`
- adversarial static review: `implementation/evidence/TP_M02_STATIC_REVIEW.md`
- downstream Codex start pointer: `project-handoffs/TP_M02_CODEX_EXECUTION_HANDOFF.md`
- routing state: `implementation/TASK_BOARD.yaml`
- accepted discovery/safety evidence: `implementation/evidence/TP_M01_ACCEPTANCE.md`

Historical capability-gated TP_M02 prep/blocker remains evidence of the superseded execution strategy. It is no longer an authoring blocker, but still correctly proves that ChatGPT did not have a local compilation/test lane.

## Product decision — pruning is ALWAYS ON

The patched-runtime behavior intentionally does **not** reproduce the historical feature toggle.

Do not add:

- a feature flag;
- `/experimental` integration;
- a config enable/disable setting;
- a pruning activation schema;
- a runtime disable path.

Historical `Feature::ToolOutputPrune` / `Stage::Experimental` / `default_enabled: false` is provenance only.

## Accepted architecture

Current source was re-read at the exact fresh baseline. The selected request path remains:

`canonical ContextManager`
-> clone/history projection
-> `for_prompt(...)`
-> `run_sampling_request`
-> first or regenerated retry `prompt_input`
-> **unconditional pruning transform**
-> executed-tool metadata attachment
-> `build_prompt`
-> sampling request.

The patch places pruning inside the `run_sampling_request` loop after input materialization and before metadata attachment. This covers both first attempts and retry-regenerated requests without mutating canonical history.

## Final static policy

Candidate variants only:

- `FunctionCallOutput`;
- `CustomToolCallOutput`.

Mandatory gates/protections:

- `success == Some(true)` only; false/None retained;
- text-only body; structured/media retained;
- required unambiguous paired call identity;
- contradictions/duplicates/missing pairing retained;
- `apply_patch`, mutation evidence, discovery/capability output, unknown/new tools/variants retained;
- `ToolSearchOutput` retained;
- at least two real non-contextual user-input boundaries before age eligibility;
- newest otherwise-eligible whole-output protection target: `40_000` estimated tokens;
- aggregate replacement-aware net savings must exceed `20_000` estimated tokens;
- checked arithmetic; accounting ambiguity retains the original request;
- stable marker: `[Old tool result content cleared]`;
- existing Codex `estimate_item_token_count`; no second tokenizer/accounting system;
- whole-output replacement only.

Positive tool policy is deliberately narrow: only paired `exec_command` can become eligible, and only when its JSON `cmd` is statically classified as one simple bounded read-only command. `exec_command` as a category is not globally disposable.

## Static review result

The initial patch was adversarially re-reviewed. Findings were fixed in mandatory patch-series member `TP_M02_0002_STATIC_REVIEW_FIXES.patch`, including:

- fail-closed checked token aggregation rather than saturating overflow;
- use of current upstream contextual-user recognition for recency boundaries;
- current default `functions` namespace handling;
- rejection of broader resource/discovery allowlisting.

Static verdict: **coherent enough for downstream critical build/test work, not compile/test GREEN**.

## Exact next task

**Codex must execute `project-handoffs/TP_M02_CODEX_EXECUTION_HANDOFF.md`.**

Codex must first refresh source/package state, inspect the patch critically, adapt drift/API errors, then format/compile/test. If coherent, it should inspect the current Community Edition update/build/install mechanism, update CE, integrate/install the patched Codex runtime with rollback preserved, and perform a basic smoke test.

If Codex cannot confidently repair a failure, it must stop and persist/report exact command, exact error, affected file/function, current source SHA and what it already tried.

After downstream evidence exists, return to ChatGPT for reconciliation and independent final acceptance. Do **not** start TP_M03 and do **not** mark final runtime GREEN before compile/runtime/install evidence exists.

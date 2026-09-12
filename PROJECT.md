# Codex Fix Pooling — Tool Output Pruning workstream

Repository: `elmakus/Codex-fix-pooling`
Branch: `tool-output-pruning`

## Current state

- phase: TP_M02 best-effort patch authoring/handoff
- goal: prepare the strongest statically reviewed always-on request-time tool-output-pruning patch possible, then hand it to Codex to inspect, fix if necessary, and attempt to integrate/install together with the ChatGPT Community for Linux update path
- validation status: authoring environment has no Rust/Cargo lane; resulting patch must remain explicitly `BEST_EFFORT / UNCOMPILED / UNTESTED` until downstream validation
- prior checkpoint retained: `TP_M01_DISCOVERY_GREEN`
- historical behavior reference: `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213`

## Active authority

- best-effort plan: `planning/TP_M02_BEST_EFFORT_CODEX_HANDOFF_PLAN.md`
- requirements: `requirements/REQUIREMENTS.md`
- accepted discovery/safety evidence: `implementation/evidence/TP_M01_ACCEPTANCE.md`
- historical handoff: `project-handoffs/TP_M01_HANDOFF.md`
- behavior contract: `openspec/changes/tp-m02-tool-output-pruning/specs/tool-output-pruning.md`

The previous capability-gated TP_M02 execution-prep material remains historical evidence. It no longer blocks static patch authoring. It still accurately records that this ChatGPT environment cannot itself prove compile/test success.

## Product decision — pruning is always on

This project variant intentionally does **not** reproduce the historical feature toggle.

Historical `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213` exposed `Feature::ToolOutputPrune` as an experimental feature with `default_enabled: false`. Our target behavior is different:

- pruning runs whenever the patched runtime constructs an eligible request;
- no feature flag;
- no `/experimental` switch;
- no user-facing enable/disable option;
- no config key solely for turning pruning on/off.

Always-on does not weaken the safety boundary: uncertain or protected evidence remains intact.

## Fresh baseline at strategy pivot

- `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- Linux package baseline: `26.908.40834`

Current upstream still has the selected single integration seam inside `run_sampling_request`:

`initial/regenerated prompt_input -> [pruning transform] -> executed-tool metadata -> build_prompt`

A retry rebuilds prompt input from canonical history, so applying the transform at that seam covers both first attempt and regenerated retries without using pruning to mutate canonical history.

## Safety contract retained

- request-time derived-input transformation only;
- canonical history not destroyed solely for token savings;
- standard/custom output parity;
- preserve failed outputs and unknown success;
- preserve `apply_patch` and mutation/durability-sensitive evidence;
- preserve unknown/new/unclassifiable classes;
- preserve malformed/ambiguous pairing;
- preserve unsupported structured/media output;
- preserve `ToolSearchOutput`;
- preserve current/recent user-turn region and a newest-output budget;
- fail closed when identity/accounting/safety is ambiguous;
- retry/regenerated requests receive the same pruning contract.

Historical `40_000` protected / `20_000` minimum values are provenance/design anchors. In the new no-config variant, conservative compile-time constants may be used for the first handoff patch if explicitly documented for Codex review.

## New ordered work

1. **BE-01 — Refresh/freeze exact source seams.**
2. **BE-02 — Author minimal always-on patch against exact upstream.**
3. **BE-03 — Static adversarial review and correction; no false compile/test claims.**
4. **BE-04 — Produce Codex execution packet, including CE update/install/rollback instructions.**
5. **BE-05 — Reconcile whatever compile/runtime/install evidence Codex reports back.**

The handoff target after BE-04 is: “this is the strongest patch we could prepare from exact-source static analysis; inspect it, change anything that is wrong, then attempt build/integration/install.”

## Codex downstream responsibility

Codex receiving the bundle must not blindly trust it. It should:

1. compare the exact patch base with its checkout and current upstream;
2. review the implementation for coherence and safety;
3. apply-check and fix API/compile mismatches when obvious;
4. compile/test as useful and available;
5. inspect the current `ilysenko/codex-desktop-linux` update/build/runtime substitution mechanism rather than guessing how `resources/codex` maps to upstream source;
6. attempt the ChatGPT CE update plus patched Codex installation only after that review;
7. keep a rollback path to stock CE/runtime;
8. if an architectural assumption fails, return exact errors, source context and symptoms for reconciliation.

## Current restrictions

- do not write to `openai/codex`, `tekacs/codex` or `ilysenko/codex-desktop-linux` repositories;
- do not claim that this authoring environment compiled/tested the patch;
- do not claim installation success before Codex actually reports it;
- preserve exact provenance for every patch base and handoff revision.

## Exact next task

Execute **BE-01**, immediately followed by **BE-02** if refresh shows no architectural blocker: freeze current source seams and author the best-effort always-on patch against `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e` (or a newer exact HEAD if upstream moves before authoring begins).

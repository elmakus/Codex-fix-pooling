# TP_M02 — Best-effort Codex handoff plan

Status: ACTIVE
Branch: `tool-output-pruning`
Decision date: 2026-09-12

## Goal

Prepare the strongest static implementation package possible for a downstream Codex executor, without requiring this ChatGPT session to have a Rust/Cargo test environment.

The deliverable is deliberately **not** a locally validated release. It is a best-effort patch/handoff that Codex must independently inspect, apply-check, compile/test as it judges necessary, and then attempt to integrate/install together with the ChatGPT Community for Linux update path.

## Product decision: always-on pruning

The project-specific pruning behavior is **always enabled** once the patched Codex runtime is used.

- no feature flag;
- no `/experimental` toggle;
- no user-facing enable/disable setting;
- no config-schema key solely for pruning enablement;
- no disabled-path implementation burden.

Historical provenance is different: `tekacs/codex@d70b903a4edbbb02c5009ae8e6194f2128d80213` implemented `Feature::ToolOutputPrune` as an experimental feature with `default_enabled: false`. That historical toggle is provenance only and is intentionally not carried into this project variant.

## Safety policy

Always-on does **not** mean broadly destructive. Pruning remains request-time only and must not mutate canonical history solely to save request tokens.

The first best-effort implementation should remain conservative/fail-closed:

- candidate classes: standard and custom tool-call outputs only;
- preserve failures and unknown success;
- preserve `apply_patch` and other mutation/durability-sensitive evidence;
- preserve unknown/new/unclassifiable classes;
- preserve malformed/ambiguous call-output pairing;
- preserve structured/media outputs unless explicitly proven safe;
- preserve `ToolSearchOutput`;
- preserve the current/recent user-turn region;
- preserve a newest-output budget;
- preserve evidence whose removal would make safe continuation ambiguous;
- apply the same transform to initial and retry/regenerated request inputs;
- never mutate canonical `ContextManager` history as the pruning mechanism.

Historical `40_000` protected tokens / `20_000` minimum removable tokens remain design anchors. Because there is intentionally no user-facing config surface, the best-effort patch may use conservative compile-time constants if static analysis supports them; the handoff must identify those constants explicitly so Codex can adjust them during validation.

## Current source baselines

Refresh at plan pivot:

- `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
- `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- Community/official Linux package baseline: `26.908.40834`

The selected request seam remains valid on current upstream: inside `run_sampling_request`, after each initial/regenerated `prompt_input` is materialized and before executed-tool metadata is attached and `build_prompt` is called.

## Deliverable bundle

The project should prepare all of the following before handing work to Codex:

1. **Exact-base patch**
   - patch targets the refreshed exact upstream SHA;
   - minimal source touch set;
   - no feature/config toggle layer;
   - request-time pruning module plus one integration seam;
   - tests may be included as compile-ready intent even though this environment cannot execute them.

2. **Static review record**
   - source files and symbols inspected;
   - invariants checked manually;
   - known API/compile assumptions;
   - likely failure points;
   - explicit statement `UNCOMPILED / UNTESTED IN AUTHORING ENVIRONMENT`.

3. **Codex handoff**
   - exact upstream and Community SHAs;
   - exact patch location and expected affected files;
   - rationale for always-on behavior;
   - safety contract;
   - apply/check/build/test suggestions, but no requirement that Codex blindly trust or preserve the patch;
   - instruction to modify/fix the patch if current source/API evidence requires it;
   - instruction to return exact compile/runtime symptoms if an architectural assumption is wrong.

4. **Community integration/install handoff**
   - Codex must inspect the current Community update/build mechanism rather than assume an upstream-source-to-bundled-runtime mapping;
   - determine the correct way to substitute/build the patched Codex runtime while updating ChatGPT CE;
   - attempt installation/update only after its own review concludes the patch is coherent;
   - preserve an easy rollback path to the stock Community/runtime state.

5. **Provenance**
   - exact patch base SHA;
   - project commit containing the handoff bundle;
   - historical reference commit;
   - note any drift discovered by Codex before installation.

## Authoring mode and validation semantics

The missing local Rust toolchain is no longer a blocker to **authoring** the patch. It remains a limitation on validation.

Therefore:

- Capability Gate state for local compile/test remains `UNAVAILABLE`;
- patch authoring may proceed;
- no project document may claim compile/test GREEN from this session;
- the patch must be labeled `BEST_EFFORT / UNVERIFIED` until downstream validation;
- Codex is explicitly the downstream reviewer/integrator for the handoff, not a source of retroactive evidence for this authoring session.

## Ordered work

### BE-01 — Refresh and freeze exact source seams

Refresh upstream/Community heads, inspect current request construction, response variants, call/output identity, token estimation, module registration, and CE integration surfaces. Freeze exact refs used by the patch.

### BE-02 — Author minimal always-on patch

Create the smallest coherent patch against the exact upstream base. Prefer reusing current accounting/types and the single request-time seam. Do not add a second context-management system or feature/config subsystem.

### BE-03 — Static adversarial review

Review the patch line-by-line without executing it. Check ownership/borrowing/API assumptions, standard/custom parity, retry behavior, call-output pairing, structured outputs, apply_patch protection, recent-region logic, token accounting, replacement metadata, canonical-history isolation, and likely compile hazards. Correct what can be corrected statically.

### BE-04 — Prepare Codex execution packet

Produce one concise handoff that tells Codex to:

1. re-check the patch against its actual checkout;
2. reject/fix anything that does not make sense;
3. run `git apply --check` or equivalent;
4. compile/test to the extent useful/available;
5. inspect the Community update/build/runtime substitution path;
6. try the CE update plus patched Codex installation;
7. preserve rollback;
8. if it fails, fix locally when obvious, otherwise return exact errors, changed source context, and runtime symptoms to this project.

### BE-05 — Downstream result reconciliation

Only after Codex reports back, reconcile compile/runtime/install evidence. This is where the project may revise the patch, thresholds, or CE integration instructions. No local authoring claim is upgraded merely because the patch looked plausible statically.

## Definition of prepared-for-Codex

The handoff is ready when BE-01 through BE-04 are complete and durable, even if no Rust compile/test occurred in the authoring environment.

The handoff must not say “works”. It should say, in substance: **this is the strongest patch we could prepare from exact-source static analysis; inspect it, fix it if needed, and attempt integration/install.**

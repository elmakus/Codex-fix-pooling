# Requirements — Custom Codex Runtime integration

## Scope

Provide a maintainable way to use the background-exec completion wakeup behavior from `tekacs/codex` commit `9ffcf8db9078eae43d4111ff94259795c1e962c9` in ChatGPT Community for Linux (`ilysenko/codex-desktop-linux`).

## Functional requirements

### R1 — Opt-in integration

The custom runtime behavior must be disabled by default and activated only through an explicit Community Edition feature/configuration choice.

### R2 — No manual post-update replacement

The solution must not require manually overwriting `/opt/codex-desktop/resources/codex` after each Community/OpenAI update.

### R3 — Preserve official package verification

The signed official OpenAI Linux package remains the upstream package/provenance baseline. Custom runtime substitution must happen only after normal upstream verification/extraction succeeds.

### R4 — Background completion behavior

The selected custom Codex runtime must provide behavior equivalent to the referenced patch:

- background unified-exec completion produces model-visible pushed input after the original `exec_command` yielded;
- idle sessions wake on completion;
- active turns can receive the pushed completion;
- inline terminal results do not generate duplicate pushed completion;
- model-facing `exec_command` / `write_stdin` guidance discourages empty polling while preserving polling for real interaction/intermediate-output needs.

### R5 — Update persistence

When the Community native updater rebuilds from a new official OpenAI package, the enabled custom-runtime feature/configuration must be preserved and re-evaluated automatically.

### R6 — Compatibility gate

The feature must not substitute a custom Codex runtime unless compatibility with the current official Desktop/bundled Codex baseline has been established using deterministic checks defined by implementation-time evidence.

### R7 — Fail closed

If compatibility cannot be established, patch application/rebase fails, or acceptance checks fail, the build/update must not silently install the stale/incompatible custom runtime.

### R8 — Source/ref traceability

Every custom runtime build must have durable provenance sufficient to identify:

- source repository;
- source/upstream revision;
- patch revision or equivalent change set;
- resulting runtime version/build identity.

### R9 — Upstream equivalence detection

Before carrying the custom patch forward to a refreshed upstream baseline, determine whether official Codex already provides equivalent behavior. If equivalence is proven, custom patch divergence should be retired for that baseline.

### R10 — Generic integration boundary

The Community Edition integration should be generic enough to support a controlled replacement Codex runtime rather than hard-coding permanent dependence on `tekacs/codex`. The initial preset/provider may use `tekacs/codex`.

## Safety / integrity requirements

### R11 — No hidden production mutation during development

Development and validation must not mutate the user's installed production ChatGPT Community runtime until an explicit deployment/install step is approved.

### R12 — Atomic package behavior

The intended delivery unit is a rebuilt Community package/app artifact. Avoid partially modifying an installed application tree as the normal mechanism.

### R13 — Rollback

The design must preserve a practical route back to the official bundled Codex runtime or previous known-good Community package if the replacement runtime fails acceptance or runtime verification.

## Verification requirements

### R14 — Patch-level tests

Carry or reproduce tests proving wake gating, pushed completion delivery and duplicate suppression.

### R15 — Integration smoke tests

Verify at minimum:

- Desktop starts with the selected runtime;
- Desktop ↔ Codex app-server communication initializes successfully;
- a short command returns inline normally;
- a deliberately yielding background command completes and wakes/delivers completion without empty polling;
- interactive or intermediate-output `write_stdin` use remains functional;
- disabling the feature returns the package to official bundled-runtime behavior.

### R16 — Update-path verification

Test at least one package rebuild/update path showing that feature selection persists and the compatibility gate is re-run against the new official baseline.

## Non-goals

- Forking or rewriting the entire ChatGPT Community application.
- Bypassing OpenAI package signature/provenance verification.
- Keeping a historical `tekacs/codex` binary forever regardless of upstream changes.
- Unlocking server-side ChatGPT account features or rollouts.
- General-purpose arbitrary binary injection without compatibility and provenance controls.

# M02-T05 Evidence — Static MVP review and handoff readiness

Date: 2026-09-12
Executor: ChatGPT
Review type: integrated source/static review under best-effort M02 contract
Build/runtime execution: NOT AVAILABLE / NOT CLAIMED

## Reviewed inputs

- `planning/M02_BEST_EFFORT_MVP_PIVOT.md`
- `openspec/changes/custom-codex-runtime-m02/`
- `implementation/evidence/M02-T03_RUNTIME_PATCH_PREPARATION.md`
- `implementation/patches/M02-T03_CODEX_C4017A87_WAKEUP_ADAPTATION.md`
- `implementation/evidence/M02-T04_COMMUNITY_PATCH_PREPARATION.md`
- `implementation/community-overlay/linux-features/custom-codex-runtime/`
- M01-T05 compatibility matrix
- exact refreshed `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
- exact Community baseline `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`

## Review verdict

**GREEN FOR `M02_MVP_HANDOFF_READY` PREPARATION CHECKPOINT**.

This is not a build/runtime GREEN verdict. It means the source/material handoff is coherent enough for Codex to execute without restarting the project.

## Static review findings corrected before handoff

### 1. Runtime API drift left explicit instead of guessed

The reference patch used historical `Session::inject_or_start`. Current OpenAI source no longer exposes it. Current `inject_no_new_turn` explicitly does not start an idle turn, so it cannot satisfy strict idle wake.

The runtime adaptation recipe now marks the active-or-idle wake binding as the single compile-level source-drift point Codex must resolve against current turn-start internals, with exact semantic constraints and tests. No fake compile success is claimed.

### 2. Community runtime-hook manifest shape

Initial overlay draft represented `runtimeHooks.prelaunch` as a string. Current Community baseline uses an object descriptor with `source`, `name`, and `mode`.

Corrected before handoff to:

```json
"prelaunch": {
  "source": "diagnose-overrides.sh",
  "name": "custom-codex-runtime-overrides.sh",
  "mode": "0755"
}
```

This matches the refreshed baseline manifest contract.

### 3. Artifact architecture binding

Initial provenance gate bound target triple to controlled settings but did not independently prove that the target triple matched official package architecture.

Corrected before handoff. Admission now maps:

- official `amd64`/`x86_64` -> `x86_64-*` runtime target;
- official `arm64`/`aarch64` -> `aarch64-*` runtime target;
- unsupported/contradictory architecture -> reject.

Prepared tests include the mismatch rejection.

### 4. Rejection diagnostics durability

Initial stage implementation wrote successful diagnostics into the candidate tree, but an outer failed candidate transaction can delete the rejected candidate.

Corrected before handoff. Success/rejection diagnostics are now also written beside `CODEX_PATCH_REPORT_JSON` in the persistent per-transaction report directory when that path is available. Rejection diagnostics record gate state (when readable), reason, metadata/provenance paths and explicit override environment. Prepared tests cover this external report copy.

## Runtime-side review

### PREPARED / STATICALLY REVIEWED

- exact upstream base pinned: `c4017a87aacc7558002b7cb510025e967c1d765e`;
- exact reference patch pinned: `9ffcf8db9078eae43d4111ff94259795c1e962c9`;
- reference parent recorded: `ba573b4b10937d955559e6b45e8a199276b7424d`;
- strict equivalence verdict for refreshed public upstream: NOT EQUIVALENT;
- current files/functions mapped;
- completion fragment, wake flag, duplicate-suppression invariant, watcher ordering and tool guidance specified;
- current API drift explicitly identified;
- expected Cargo build/test commands prepared;
- expected provenance fields prepared;
- owned carrier relationship defined.

### VERIFIED PASS

Source facts/readbacks only:

- refreshed OpenAI base SHA exists/readable;
- reference patch commit exists/readable;
- current watcher lacks the required reference wake path;
- current model tool descriptions do not provide the frozen anti-completion-poll guidance;
- current `codex-cli` package declares binary `codex`.

No Rust test/build PASS is claimed.

### UNKNOWN / REQUIRES CODEX

- exact implementation of current idle-turn wake helper;
- Rust compilation;
- Rust tests;
- runtime version and SHA-256;
- wakeup behavior;
- exact Desktop compatibility.

## Community-side review

### PREPARED / STATICALLY REVIEWED

- disabled-by-default feature manifest;
- controlled settings whitelist;
- official package metadata binding;
- stock candidate-vs-verified-upstream `resources/codex` digest equality before substitution;
- stock SHA/version capture;
- Community source commit binding;
- PASS/FAIL/UNKNOWN fail-closed handling;
- source/ref/target/build provenance matching;
- binary digest verification;
- target architecture consistency check;
- candidate-only temp-copy + rename replacement;
- final candidate digest readback;
- success/rejection diagnostics;
- transaction-report diagnostics copy;
- explicit runtime-override warnings;
- prepared unit/package-mechanics tests;
- no core updater fork and no live-tree mutation.

### VERIFIED PASS

Source facts/readbacks only:

- Community baseline remains `249cd4b64d42434f51417fec4a318750d461b676`;
- current installer verifies/extracts official package before feature staging;
- feature stage hooks receive candidate `INSTALL_DIR` and verified `CODEX_UPSTREAM_APP_DIR`;
- stage hooks execute before final build-info and before outer promotion;
- failed candidate build prevents promotion;
- existing manifest schema uses runtime-hook descriptor objects;
- existing build-info supports exact official package and Community source identity.

No Community Node/shell/package test PASS is claimed.

### UNKNOWN / REQUIRES CODEX

- overlay parses/runs without small source-drift adjustments in exact checkout;
- repository Node/shell test results;
- candidate/package build result;
- artifact identity;
- runtime provenance generated by actual build;
- package mechanics PASS fixtures on exact candidate;
- Desktop integration;
- update persistence.

## Frozen invariant review

No prepared change requires reopening these decisions:

- package-level authority is candidate-tree `resources/codex`;
- official package verification remains first;
- feature is opt-in/default-off;
- no `CODEX_CLI_PATH`-only design;
- no live installed-tree overwrite;
- no post-install replacement hack;
- no second updater/background replacement service;
- only PASS admits custom substitution;
- FAIL/UNKNOWN reject;
- feature off reconstructs stock official runtime;
- explicit runtime overrides remain explicit and diagnosed;
- new official package tuple invalidates old admission;
- production installation remains unauthorized.

## Prepared test/acceptance matrix for Codex

### Runtime patch

- formatting;
- shell/tool-spec guidance tests;
- inline command;
- yielded background command;
- wake flag false/true paths;
- idle completion wake;
- active-turn push;
- duplicate suppression;
- interactive/intermediate `write_stdin`;
- final output success/failure semantics.

### Community package mechanics

- feature OFF -> stock runtime digest/version;
- enabled controlled selection -> admitted custom runtime digest;
- FAIL -> candidate rejection;
- UNKNOWN -> candidate rejection;
- missing/incomplete/stale provenance -> rejection;
- target architecture mismatch -> rejection;
- provenance readback;
- success/rejection transaction diagnostics;
- final candidate digest;
- explicit override diagnostics;
- stock reconstruction;
- existing candidate promotion/rollback remains intact.

### Exact Desktop / later gates

- app-server initialize/session smoke;
- Desktop startup;
- ordinary short command;
- yielded background command;
- idle wake;
- active-turn push;
- duplicate suppression;
- valid `write_stdin` interaction;
- feature-off Desktop smoke;
- changed official baseline invalidates prior PASS;
- update-builder persistence and re-evaluation;
- rollback readiness.

## Independent review note

The workflow recommends a fresh independent normal ChatGPT review for major architecture/complex state work. This session performed the strongest integrated static review available and corrected concrete issues above. A separate independent-chat review was not executed and is not represented as PASS. Codex should still begin by inspecting the durable state and refreshed source rather than trusting executor narrative.

## T05 preparation conclusion

No remaining source-level issue found by this review requires a strategic architecture/user decision. Remaining uncertainty is exactly the build/runtime/package/Desktop/update evidence the accepted strategy assigns to Codex. The project is therefore eligible for checkpoint `M02_MVP_HANDOFF_READY` once the cumulative handoff, Task Board, OpenSpec task state and PROJECT.md are reconciled.

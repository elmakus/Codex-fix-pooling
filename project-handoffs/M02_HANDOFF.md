# M02 Handoff — Best-effort MVP ready for Codex execution

Status: GREEN FOR PREPARATION HANDOFF
Checkpoint: `M02_MVP_HANDOFF_READY`
Accepted implementation head: `1298fae794050c40894ad9abfa69d5556d3790dd`
Acceptance evidence: `implementation/evidence/M02-T05_STATIC_MVP_REVIEW.md`

This checkpoint means the strongest practical source-level MVP and deterministic execution package has been prepared in normal ChatGPT. It does **not** mean the Rust runtime, Community package, Desktop compatibility, wakeup behavior, or update persistence are green.

## Goal for Codex

Finish the environment-dependent implementation/build/test/debug/verification work without restarting the architecture project.

Core instruction:

> This is the maximum best-effort MVP ChatGPT could prepare without the target build/runtime environment. Do not restart the project. Inspect and use the prepared implementation, adapt only where real build/source/runtime evidence requires it, then finish build/test/debug/verification.

## Workflow authority

- workflow: `elmakus/chatgpt-codex-project-workflow:main`
- entrypoint: `CHATGPT.md`
- project: `elmakus/Codex-fix-pooling`
- canonical branch: `main`
- current checkpoint: `M02_MVP_HANDOFF_READY`
- durable handoff: `project-handoffs/M02_HANDOFF.md`
- active OpenSpec: `openspec/changes/custom-codex-runtime-m02/`

Codex must recover durable state from the repository, verify current `main`/HEAD, and run the workflow Refresh Gate before applying anything. Do not trust remembered external HEADs.

## Exact external baselines prepared by ChatGPT

### Runtime

- current selected OpenAI upstream base: `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
- immutable reference change: `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`
- reference parent: `ba573b4b10937d955559e6b45e8a199276b7424d`
- strict equivalence on refreshed public OpenAI baseline: **NOT EQUIVALENT**
- preferred owned carrier: `elmakus/codex` if divergence remains necessary
- carrier repository state during ChatGPT prep: absent/not accessible (404), not a blocker

### Community

- exact Community source baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Linux Desktop provenance baseline: `26.908.40834`
- package authority seam: candidate-tree replacement of `resources/codex`

If any external baseline moved, inspect the current source first. Adapt prepared work only where real source/build evidence requires it. Do not silently move the provenance baseline or reference patch.

## Frozen architecture and safety invariants

Do not reopen these without concrete contradictory evidence:

1. Official OpenAI Linux package verification remains first and unchanged.
2. Capture original stock `resources/codex` identity before custom substitution.
3. Normal package-owned runtime authority is candidate `resources/codex`.
4. Do not redesign around `CODEX_CLI_PATH` alone.
5. `remote-mobile-control` has a distinct `CODEX_REMOTE_CONTROL_CODEX_PATH`; explicit overrides are diagnosed, not silently erased.
6. Feature id is `custom-codex-runtime`; opt-in and default-off.
7. Custom substitution happens only during managed candidate construction.
8. No normal live-tree overwrite.
9. No post-install replacement hack.
10. No second updater or background binary replacement service.
11. Feature OFF reconstructs stock runtime from the newly verified official payload.
12. Feature-off restoration is distinct from updater package rollback.
13. Compatibility states are exactly `PASS`, `FAIL`, `UNKNOWN`.
14. Only `PASS` may authorize custom candidate substitution.
15. `FAIL` and `UNKNOWN` fail closed.
16. Every new official Desktop package tuple invalidates prior compatibility admission.
17. Production installation remains unauthorized until separately approved by the user.

## Runtime material prepared by ChatGPT

Authoritative evidence:

`implementation/evidence/M02-T03_RUNTIME_PATCH_PREPARATION.md`

Current-source adaptation recipe:

`implementation/patches/M02-T03_CODEX_C4017A87_WAKEUP_ADAPTATION.md`

### What is already prepared

- exact upstream/reference provenance;
- refreshed four-part strict-equivalence analysis;
- mapping to current unified-exec/context/tool-description files;
- concrete `ExecCompletion` fragment shape;
- concrete anti-completion-poll `exec_command` / `write_stdin` guidance;
- `wake_on_exit` duplicate-suppression invariant;
- watcher ordering requirements;
- current process-manager wiring requirements;
- test matrix;
- carrier/rebase recipe;
- expected build/provenance commands.

### Deliberately unresolved compile-level drift

The historical patch called `Session::inject_or_start`. Current `openai/codex@c4017a87` no longer exposes that API. Current `inject_no_new_turn` explicitly does not start an idle turn and is therefore not strict-equivalent.

Codex must bind the completion delivery to current turn-start internals or add a narrow equivalent helper with these exact semantics:

- active turn: inject one completion ResponseItem into the already active turn;
- idle session: start/wake a normal turn using that completion input;
- preserve current turn/root provenance rules;
- do not misuse mailbox/inter-agent semantics merely to get a wake;
- inline terminal output must not cause a second pushed completion.

This is UNKNOWN until it compiles and integration tests prove it.

## Community material prepared by ChatGPT

Authoritative evidence:

`implementation/evidence/M02-T04_COMMUNITY_PATCH_PREPARATION.md`

Actual overlay to apply to the exact Community checkout:

`implementation/community-overlay/linux-features/custom-codex-runtime/`

Prepared files:

- `feature.json`
- `README.md`
- `stage.sh`
- `stage.js`
- `diagnose-overrides.sh`
- `test.js`

### Implemented source behavior

- disabled-by-default feature manifest;
- controlled settings only; no arbitrary runtime path in settings;
- builder inputs separated from runtime override settings;
- exact verified upstream package metadata binding;
- exact Community source commit binding;
- candidate stock `resources/codex` must match verified upstream extracted runtime before substitution;
- stock runtime SHA-256 and version capture;
- provenance source/upstream/reference/target/build matching;
- target triple must match official package architecture;
- actual custom runtime SHA-256 must match provenance;
- gate must be `PASS` and build status must be `PASS`;
- FAIL/UNKNOWN/stale/incomplete/mismatch conditions reject candidate;
- candidate-only temporary copy + rename to `resources/codex`;
- final candidate digest verification;
- candidate and transaction-report diagnostics;
- runtime explicit override diagnostics;
- no core updater replacement and no live-tree mutation.

Static review corrected the runtime-hook manifest to the current Community descriptor schema and hardened architecture/rejection-diagnostic handling before this handoff.

## Ordered Codex execution

Follow this order. Do not skip directly to installation.

### 1. Inspect

- read workflow `CHATGPT.md` and only needed execution/handoff contracts;
- read `PROJECT.md`, Task Board, this handoff, T03/T04/T05 evidence, active OpenSpec and M01-T05 gate;
- inspect prepared runtime adaptation and Community overlay before editing.

### 2. Refresh

- verify project `main` and handoff checkpoint;
- refresh `openai/codex` and `ilysenko/codex-desktop-linux`;
- re-run strict four-part upstream-equivalence check;
- if current OpenAI upstream now satisfies all four semantics, record exact evidence and use upstream-equivalent instead of carrying unnecessary divergence;
- otherwise keep the controlled patch path;
- verify exact official Linux package tuple before candidate admission.

### 3. Apply/adapt runtime

If divergence remains required:

- create/use owned `elmakus/codex` carrier;
- preserve exact base relation to selected OpenAI commit;
- implement the prepared adaptation recipe;
- solve only concrete current API drift, especially active-or-idle turn start;
- keep the frozen four semantics intact;
- do not blindly transplant old large model JSON/template diffs.

### 4. Build runtime and record identity

From `codex-rs/`, expected starting commands:

```bash
cargo fmt -- --check
cargo test -p codex-core shell_spec
cargo test -p codex-core unified_exec
cargo test -p codex-core pending_input
cargo build --release -p codex-cli --bin codex
./target/release/codex --version
sha256sum ./target/release/codex
file ./target/release/codex
```

Refine test filters to current names if required, but do not omit semantic coverage.

Record exact:

- carrier repository/commit;
- upstream base SHA;
- reference patch SHA;
- adapted patch commit(s);
- target triple/architecture;
- rustc/cargo/toolchain identity;
- build command/profile;
- runtime version;
- binary SHA-256;
- build/test results.

### 5. Apply Community overlay

Against the exact refreshed Community checkout, start from the prepared overlay rather than re-designing the feature.

Expected copy shape:

```bash
cp -a implementation/community-overlay/linux-features/custom-codex-runtime \
  /path/to/codex-desktop-linux/linux-features/
```

Adapt only for concrete current source/schema evidence.

### 6. Test Community source/package mechanics

Run at minimum:

```bash
node --test scripts/lib/linux-features.test.js linux-features/custom-codex-runtime/test.js
bash tests/scripts_smoke.sh
```

Then run the current repository-prescribed candidate/native package lanes.

Required package-mechanics cases:

- feature OFF -> stock runtime;
- controlled PASS -> custom runtime selected;
- FAIL -> candidate rejected;
- UNKNOWN -> candidate rejected;
- missing/incomplete provenance -> rejected;
- stale official tuple -> rejected;
- architecture mismatch -> rejected;
- source/provenance readback;
- stock identity captured before replacement;
- final candidate digest equals admitted custom digest;
- success/rejection diagnostics persist;
- explicit runtime overrides are diagnosed;
- stock reconstruction works;
- updater/candidate promotion path remains existing Community path;
- rollback target remains intact.

### 7. Run runtime behavior and exact Desktop gates

Required behavior/integration coverage:

- app-server initialize/session smoke;
- short inline command;
- yielded/background command;
- idle completion wake;
- active-turn pushed completion;
- no duplicate pushed completion after inline terminal result;
- legitimate intermediate-output polling;
- legitimate interactive `write_stdin`;
- Desktop startup/integration;
- feature-off Desktop smoke;
- rollback readiness.

For each, record `PASS`, `FAIL`, or `UNKNOWN`. Never convert missing evidence to PASS.

### 8. Repair concrete incompatibilities

If compile/build/test fails:

- preserve exact command, logs, failure symptom and source location;
- repair the smallest current-source incompatibility consistent with frozen invariants;
- update OpenSpec only if actual implementation reality changes a contract;
- do not discard candidate-tree authority, fail-closed admission, official trust, or duplicate-suppression semantics merely to get a green build.

Strategic contradiction/architecture invalidation should use the workflow blocker/escalation path. Routine implementation fixes remain Codex implementation detail.

### 9. Verify changed-baseline/update behavior

Where environment permits, continue into the changed-official-tuple checks:

- prior PASS must become invalid/stale;
- refresh upstream equivalence/patch;
- rebuild or reselect a candidate runtime;
- re-run admission/compatibility gates;
- verify enabled feature intent persists through existing update-builder path;
- verify feature-off rebuild returns stock runtime;
- verify rollback remains package rollback, not feature-off semantics.

These are not already green; they remain M05-class verification until evidence exists.

### 10. Persist durable evidence

Codex must update repository truth, not just return a chat summary:

- cards/Task Board as appropriate for the execution continuation;
- exact result commits/PRs;
- runtime/build/package identities;
- PASS/FAIL/UNKNOWN evidence;
- logs/readbacks for failures;
- OpenSpec reconciliation if required;
- PROJECT.md/current milestone state;
- cumulative handoff/next checkpoint.

## PREPARED / STATICALLY REVIEWED

- architecture/seam and fail-closed contracts;
- strict upstream non-equivalence analysis for `c4017a87`;
- runtime current-source adaptation recipe;
- runtime test/build/provenance checklist;
- actual Community feature overlay;
- admission/provenance/candidate replacement implementation;
- package-mechanics test source;
- static cross-component review and corrections;
- deterministic execution ordering.

## VERIFIED PASS

Only source/readback facts verified in ChatGPT:

- exact Git refs listed above existed/readable during preparation;
- current public OpenAI source lacked strict-equivalent wakeup/tool-guidance behavior;
- current Community installer still stages features inside candidate construction after official payload staging and before promotion;
- current Community manifest schema uses object runtime-hook descriptors;
- current Codex `codex-cli` crate declares binary `codex`.

No compile/package/runtime/Desktop test is represented here as PASS.

## UNKNOWN / REQUIRES CODEX BUILD OR RUNTIME TEST

- whether runtime adaptation compiles without further current-API edits;
- exact active-or-idle turn-start implementation;
- runtime unit/integration tests;
- resulting runtime version/SHA/architecture identity;
- Community overlay repository tests;
- Community candidate/native package build;
- controlled PASS package substitution on a real candidate;
- wakeup behavioral PASS;
- exact Desktop/app-server compatibility;
- update persistence/change-baseline refresh;
- production suitability.

## Production boundary

Do not modify/install into the production ChatGPT Community installation merely because build/tests become green. Complete verification and durable evidence first. Installation through the managed Community path requires separate explicit user authorization.

## Next durable starting point

Codex should start here, not from M01 research:

1. `PROJECT.md`
2. `implementation/TASK_BOARD.yaml`
3. `project-handoffs/M02_HANDOFF.md`
4. `implementation/evidence/M02-T05_STATIC_MVP_REVIEW.md`
5. `implementation/evidence/M02-T03_RUNTIME_PATCH_PREPARATION.md`
6. `implementation/patches/M02-T03_CODEX_C4017A87_WAKEUP_ADAPTATION.md`
7. `implementation/evidence/M02-T04_COMMUNITY_PATCH_PREPARATION.md`
8. `implementation/community-overlay/linux-features/custom-codex-runtime/`
9. `openspec/changes/custom-codex-runtime-m02/`
10. `implementation/evidence/M01-T05_COMPATIBILITY_GATE.md`

Do not restart architecture discovery unless refreshed evidence directly contradicts the frozen assumptions above.

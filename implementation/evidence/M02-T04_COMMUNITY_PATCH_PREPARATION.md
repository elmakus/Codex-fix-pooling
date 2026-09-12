# M02-T04 Evidence — Best-effort custom-codex-runtime Community patch

Date: 2026-09-12
Executor: ChatGPT
Status: PREPARED / STATICALLY REVIEWED / NOT PACKAGE-BUILD-VERIFIED

## Refresh Gate

Exact Community target remains:

`ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`

No source drift invalidated the frozen M02 seam.

Current Community construction order is still:

1. resolve and verify official OpenAI Linux package;
2. extract official package;
3. copy official app payload into candidate `INSTALL_DIR`;
4. patch ASAR only when selected features require it;
5. run declarative feature staging and feature stage hooks against the candidate;
6. create launcher/branding;
7. write build-info;
8. outer transaction promotes only a successfully built candidate.

`run_linux_feature_stage_hooks` passes `SCRIPT_DIR`, candidate `INSTALL_DIR`, `WORK_DIR`, `ARCH`, and verified extracted `CODEX_UPSTREAM_APP_DIR` to feature hooks. This makes candidate construction the correct insertion point; no live installed tree needs to be overwritten.

## Prepared source overlay

Prepared against the exact baseline under:

`implementation/community-overlay/linux-features/custom-codex-runtime/`

Files:

- `feature.json` — disabled-by-default feature manifest; candidate stage hook; prelaunch diagnostics hook;
- `README.md` — controlled settings/build-input/admission contract;
- `stage.sh` — minimal Node stage entrypoint;
- `stage.js` — fail-closed stock capture, provenance/admission validation, candidate-tree replacement, final digest check and diagnostics;
- `diagnose-overrides.sh` — warnings for explicit `CODEX_CLI_PATH` / `CODEX_REMOTE_CONTROL_CODEX_PATH` bypasses;
- `test.js` — prepared unit/package-mechanics tests.

Direct modification of `ilysenko/codex-desktop-linux` was intentionally avoided. Codex should copy/apply this overlay to the refreshed exact source and adapt only for real source/build evidence.

## Feature contract implemented

The manifest is:

- id: `custom-codex-runtime`;
- `defaultEnabled: false`;
- no ASAR patch;
- no second updater/package service;
- one candidate `stageHook`;
- one prelaunch diagnostic hook.

The feature uses existing `features.json` settings. `stage.js` accepts only:

- `provider`;
- `source_repository`;
- `source_ref`;
- `upstream_repository`;
- `upstream_ref`;
- `patch_source_repository`;
- `patch_source_ref`;
- `target_triple`;
- `build_profile`.

Unknown keys fail. Provider is fixed to `managed-artifact`. Upstream and reference-patch refs must be full Git SHAs. Repository fields are constrained to HTTPS GitHub repository URLs. No arbitrary local executable path is accepted through feature settings.

## Controlled build-input boundary

The prepared implementation deliberately separates controlled intent/settings from build-produced artifact paths.

Candidate construction receives:

- `CODEX_CUSTOM_CODEX_RUNTIME_BINARY` — exact built runtime artifact;
- `CODEX_CUSTOM_CODEX_RUNTIME_PROVENANCE` — exact admission/provenance JSON.

These are builder inputs, not runtime selection overrides. They are consumed only while constructing the candidate. The feature never sets `CODEX_CLI_PATH`, never sets `CODEX_REMOTE_CONTROL_CODEX_PATH`, and never writes an already-installed live tree.

This boundary lets Codex first build/prove the exact runtime, then feed the resulting artifact and evidence into the existing Community candidate transaction without creating a second updater.

Long-term changed-baseline automatic rebuild/persistence remains M05 execution evidence; M02 only prepares the candidate integration and ensures the existing update-builder is the authority that will need to supply the same controlled inputs after each new official tuple.

## Official baseline capture before substitution

Before replacement `stage.js` requires:

- candidate `INSTALL_DIR/resources/codex` exists and is not a symlink;
- verified extracted `CODEX_UPSTREAM_APP_DIR/resources/codex` exists and is not a symlink;
- their SHA-256 values are equal before any custom mutation;
- verified upstream package metadata exists through `CODEX_UPSTREAM_LINUX_METADATA_JSON`;
- exact package version, architecture, repository path and `.deb` SHA-256 are present;
- Community source commit is resolved from packaged `source-info.json`, the existing `CODEX_LINUX_SOURCE_COMMIT` override, or Git; if none gives a full SHA, admission cannot PASS;
- stock `resources/codex` SHA-256 is captured;
- stock `resources/codex --version` is captured when it executes successfully; a failed version probe is recorded as UNKNOWN rather than guessed.

This keeps official verification first and stock identity capture before substitution.

## Provenance/admission checks

A production custom artifact is admissible only when provenance contains:

- `gate_state: PASS`;
- `build_status: PASS`;
- controlled source/upstream/reference repositories and refs matching feature settings;
- full resolved custom source commit;
- target triple/build profile matching feature settings;
- toolchain identity;
- build command;
- runtime version;
- runtime SHA-256;
- admission tuple bound to exact official package version/architecture/SHA-256 and exact Community source commit.

The actual binary SHA-256 is recomputed and must equal provenance.

`FAIL` and `UNKNOWN` explicitly reject candidate construction. Missing/incomplete provenance, stale official tuple, Community source mismatch or artifact digest mismatch also reject it.

## Candidate-tree replacement

Only after all checks PASS:

1. custom runtime is copied to a temporary path beside candidate `resources/codex`;
2. mode is set executable;
3. temporary file is renamed onto candidate `resources/codex`;
4. final candidate SHA-256 is re-read;
5. final digest must equal admitted runtime digest;
6. `.codex-linux/custom-codex-runtime.json` is written with stock baseline, custom provenance, gate state and final candidate runtime identity.

This is candidate-tree replacement only. It creates no normal live-tree overwrite and no post-install binary replacement service.

## Feature OFF / stock reconstruction

The existing Community feature framework invokes only enabled feature hooks. Therefore with `custom-codex-runtime` disabled this overlay does not execute at all; `stage_official_linux_payload` leaves the newly verified official `resources/codex` in the candidate. This is the stock reconstruction path.

It is intentionally separate from `codex-update-manager rollback`, which continues to represent previous-package rollback.

## Explicit override diagnostics

The prelaunch hook logs warnings if either explicit runtime override is present:

- `CODEX_CLI_PATH`;
- `CODEX_REMOTE_CONTROL_CODEX_PATH`.

The hook does not clear the variables. This preserves explicit override semantics while making a package-authority bypass visible for debugging.

## Prepared tests

Adjacent `test.js` includes source-level tests for:

- controlled settings success;
- rejection of arbitrary local runtime-path settings;
- pinned upstream/reference SHA requirements;
- exact PASS provenance admission;
- FAIL rejection;
- UNKNOWN rejection;
- stale official-package tuple rejection;
- runtime artifact digest mismatch rejection;
- candidate replacement and final digest equality;
- unrelated candidate resource preservation.

Repository-level framework tests still need to be run/extended after overlay application to prove disabled hook selection, enabled hook selection and full stage-hook environment behavior on the exact Community checkout.

Status: **PREPARED, NOT EXECUTED**.

## Static consistency review

The prepared overlay preserves frozen invariants:

- official signed package trust path remains unchanged and first;
- feature remains opt-in/default-off;
- normal runtime authority is candidate `resources/codex`;
- no design around `CODEX_CLI_PATH` alone;
- only PASS authorizes substitution;
- FAIL/UNKNOWN fail closed;
- stock identity is captured before replacement;
- candidate digest is verified after replacement;
- feature off retains official stock runtime;
- no second updater;
- no background replacement daemon;
- no normal live-tree mutation;
- updater transaction remains responsible for promotion/rollback.

## Exact Codex apply/build instructions for this overlay

After refreshing Community source and confirming base SHA:

```bash
# from the project checkout containing this handoff material
cp -a implementation/community-overlay/linux-features/custom-codex-runtime \
  /path/to/codex-desktop-linux/linux-features/

cd /path/to/codex-desktop-linux
node --test scripts/lib/linux-features.test.js linux-features/custom-codex-runtime/test.js
# run repository smoke lane required by current AGENTS/docs
bash tests/scripts_smoke.sh
```

Then provide exact runtime artifact/provenance builder inputs and run the normal Community candidate build/package flow. Do not bypass `install.sh`/update-builder transaction to test substitution by overwriting production files.

## UNKNOWN / non-claims

The following remain UNKNOWN until Codex executes them:

- Node/shell tests actually green in exact Community checkout;
- overlay needs no small lint/schema adaptation after insertion;
- full stage hook sees all expected inherited builder environment in every package/update-builder lane;
- Community candidate build succeeds;
- native package build succeeds;
- resulting candidate/package artifact identities;
- custom runtime itself builds;
- strict wakeup behavior PASS;
- exact Desktop/app-server compatibility PASS;
- update persistence across a changed official baseline.

No production Community installation or upstream repository was modified.

## T04 conclusion

The Community side is now source-prepared rather than prose-only: a real feature overlay implements controlled settings, stock identity capture, exact baseline/provenance binding, PASS/FAIL/UNKNOWN rejection, candidate-tree substitution, final digest verification, feature-off stock behavior and explicit override diagnostics while reusing the existing candidate transaction. Package/runtime verification remains explicitly transferred to Codex.

# Design — custom-codex-runtime M02

## Selected substitution seam

M02 uses candidate-tree replacement of `resources/codex`.

This is preferred over a staged runtime selected only by `CODEX_CLI_PATH` because the current native remote-mobile cold-start path independently resolves the bundled `resources/codex` and only supports a separate `CODEX_REMOTE_CONTROL_CODEX_PATH` override. Replacing the candidate-tree bundled runtime preserves one package-level executable authority for the ordinary Desktop path, shared-app-server fallback and native remote-mobile fallback.

## Build flow

```text
verified official package
  -> extracted candidate tree
  -> capture official package + stock codex identity
  -> resolve/build custom runtime
  -> capture immutable custom provenance
  -> evaluate compatibility gate
     PASS    -> replace candidate resources/codex
     FAIL    -> reject custom-enabled candidate
     UNKNOWN -> reject custom-enabled candidate
  -> verify replacement digest/executable
  -> existing Community package builder
  -> existing update-manager promotion/rollback flow
```

No live installed tree is modified during candidate construction.

## Configuration model

Settings describe controlled source intent and a named build profile. Immutable resolved provenance is build output, not user-entered truth.

The feature implementation should keep provider-specific details behind a small provider/build abstraction only where needed for the initial controlled carrier. It must not become a general arbitrary binary injection framework.

Expected initial provider behavior:
- prefer owned `elmakus/codex` when divergence is required;
- retain `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9` as patch source provenance;
- if strict upstream equivalence is later proven for a refreshed baseline, permit an `upstream-equivalent` no-patch provenance state rather than carrying needless divergence.

## Identity model

Two identities must never be conflated:

1. Official baseline identity: verified Desktop package tuple plus original bundled `resources/codex` identity.
2. Custom candidate identity: exact source/upstream/patch/build/toolchain/result identity.

Gate decisions are tied to both. Human-readable version strings are supplementary only.

## Fail-closed placement

Compatibility and provenance checks run before substitution and before managed package promotion. This reuses the existing Community failure boundary: a rejected candidate never becomes the active package.

UNKNOWN is deliberately first-class. It covers missing or ambiguous evidence and is not treated as a soft PASS.

## Feature-off restoration

Because the chosen seam replaces the candidate-tree bundled binary, stock restoration is achieved by reconstructing from the verified official payload with the feature disabled. The package does not need to retain two Codex binaries simultaneously.

This differs from package rollback:
- feature-off restoration creates a new stock candidate from the official payload;
- package rollback reinstalls the immediately previous managed package through existing updater behavior.

Both remain supported.

## Explicit override interaction

Existing environment overrides can bypass the package-selected runtime. Package-level diagnostics/tests must detect at least `CODEX_CLI_PATH` and `CODEX_REMOTE_CONTROL_CODEX_PATH` where relevant and avoid falsely claiming that the packaged custom runtime is the active authority when an override points elsewhere.

No requirement is added in M02 to remove those existing expert/test overrides.

## Security/integrity posture

- existing signed official package verification is unchanged and remains prerequisite;
- custom provenance is additive and does not replace upstream trust verification;
- no arbitrary executable path from feature settings is accepted as a trusted custom runtime;
- no post-install downloader/updater writes into the active app tree;
- package promotion and rollback remain owned by existing Community mechanisms.

## Deferred concerns

M03 owns strict wakeup semantics and patch-level behavioral proof.
M04 owns full exact Desktop/app-server compatibility and runtime selection acceptance.
M05 owns changed-baseline refresh, persistence and stale-PASS invalidation across a real update scenario.

# Custom Codex Runtime

Opt-in feature that replaces `resources/codex` **only inside a Community candidate tree** after the official OpenAI Linux package has been verified/extracted and only when exact custom-runtime admission metadata says `PASS`.

## Settings

Enable `custom-codex-runtime` in the normal gitignored `linux-features/features.json`. The feature accepts only these controlled keys:

```json
{
  "enabled": ["custom-codex-runtime"],
  "settings": {
    "custom-codex-runtime": {
      "provider": "managed-artifact",
      "source_repository": "https://github.com/elmakus/codex",
      "source_ref": "<carrier commit or branch intent>",
      "upstream_repository": "https://github.com/openai/codex",
      "upstream_ref": "c4017a87aacc7558002b7cb510025e967c1d765e",
      "patch_source_repository": "https://github.com/tekacs/codex",
      "patch_source_ref": "9ffcf8db9078eae43d4111ff94259795c1e962c9",
      "target_triple": "x86_64-unknown-linux-gnu",
      "build_profile": "release"
    }
  }
}
```

No arbitrary local runtime path is accepted as feature settings.

## Controlled builder inputs

Candidate construction requires two builder-supplied paths:

- `CODEX_CUSTOM_CODEX_RUNTIME_BINARY` — the exact runtime artifact produced/selected by the controlled Codex execution;
- `CODEX_CUSTOM_CODEX_RUNTIME_PROVENANCE` — JSON admission/provenance for that exact artifact.

These are build inputs, not runtime-selection environment variables. They never cause live-tree replacement. The existing Community installer/update-builder remains responsible for creating and promoting the candidate package.

The provenance file must include at least:

```json
{
  "gate_state": "PASS",
  "build_status": "PASS",
  "source_repository": "https://github.com/elmakus/codex",
  "source_ref": "<configured source ref>",
  "resolved_source_commit": "<40-char carrier commit>",
  "upstream_repository": "https://github.com/openai/codex",
  "upstream_ref": "c4017a87aacc7558002b7cb510025e967c1d765e",
  "patch_source_repository": "https://github.com/tekacs/codex",
  "patch_source_ref": "9ffcf8db9078eae43d4111ff94259795c1e962c9",
  "target_triple": "x86_64-unknown-linux-gnu",
  "build_profile": "release",
  "toolchain": "<rustc/cargo identity>",
  "build_command": "cargo build --release -p codex-cli --bin codex",
  "runtime_version": "<codex --version>",
  "runtime_sha256": "<64 hex>",
  "admission": {
    "official_package_version": "<exact verified package version>",
    "official_architecture": "<exact package architecture>",
    "official_package_sha256": "<exact verified .deb SHA-256>",
    "community_source_commit": "<exact codex-desktop-linux source SHA>"
  }
}
```

`FAIL`, `UNKNOWN`, missing provenance, source/baseline mismatch, digest mismatch, unknown Community source commit, or a pre-mutated candidate stock runtime all reject candidate construction.

## Candidate transaction

The stage hook runs after `stage_official_linux_payload` has copied the verified official application into `INSTALL_DIR` and before final build metadata/package promotion. It first proves candidate `resources/codex` is byte-identical to `CODEX_UPSTREAM_APP_DIR/resources/codex`, captures its SHA-256/version, validates exact upstream-package metadata and Community source identity, validates the custom artifact/provenance tuple, then replaces only candidate `resources/codex`.

The final candidate digest is re-read and must match admitted provenance. Diagnostics are written to `.codex-linux/custom-codex-runtime.json`.

When the feature is disabled its stage hook is not selected by the existing feature framework; candidate construction therefore retains the stock `resources/codex` copied from the newly verified official package. This is feature-off stock reconstruction, distinct from updater package rollback.

## Explicit overrides

The package-owned authority is `resources/codex`. The prelaunch hook logs warnings when `CODEX_CLI_PATH` or `CODEX_REMOTE_CONTROL_CODEX_PATH` is explicitly set because those values can bypass package-selected authority on known launch paths. It does not silently clear user overrides.

## Tests

Adjacent tests cover settings validation, PASS admission, FAIL/UNKNOWN rejection, digest/baseline mismatch, candidate replacement/digest verification, and framework disabled/enabled selection. Runtime/Desktop/wakeup acceptance remains outside this source-only feature test.

During ChatGPT M02 preparation these tests are **PREPARED, NOT EXECUTED** until Codex applies this overlay to the exact Community source and runs the repository test/build lanes.

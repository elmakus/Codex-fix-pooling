# M01-T03 Evidence — Runtime override, feature framework, and update persistence seams

Date: 2026-09-12
Executor: ChatGPT
Audited Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`

## Runtime selection

The stock Community build stages the verified official package's `resources/codex` unchanged as part of the whole application payload.

Current source demonstrates an explicit alternate-CLI seam:

- Nix modules can select another CLI package and set a default `CODEX_CLI_PATH`.
- The shared-app-server-socket feature preserves an already explicit `CODEX_CLI_PATH`; otherwise it resolves to `$CODEX_LINUX_APP_DIR/resources/codex`.
- Its tests assert the stock default path.
- Attached CLI help/version calls deliberately execute the bundled `resources/codex`.

Therefore the runtime-selection precedence already supports the concept:

```text
explicit CODEX_CLI_PATH
    > wrapper/module supplied default override
    > bundled <app>/resources/codex
```

This is an existing integration seam, not a new arbitrary injection concept.

## Linux feature framework contract

`linux-features/` is explicitly documented as the only optional-integration boundary.

Key properties at the audited baseline:

- every optional feature is disabled by default;
- every feature has `feature.json` + README;
- user selection lives in gitignored `features.json`;
- settings live under `settings.<feature-id>`;
- unknown IDs, duplicate IDs, malformed settings, default-enabled manifests, unmet requirements and conflicts fail validation;
- features can provide declarative app resources, runtime hooks, package resources/dependencies/hooks and a last-resort stage hook;
- runtime hooks can emit environment variables before Desktop launch;
- enabled-feature snapshots are recorded in build metadata and validated again at package/update time;
- disabled features are not probed during updater rebuilds;
- enabled-feature drift rejects the update candidate.

This is a strong fit for an opt-in `custom-codex-runtime` boundary and already satisfies the architectural requirement that the capability remain disabled by default.

## Update persistence flow

Native packages preserve both enabled feature IDs and their settings in the packaged minimal update-builder.

The updater flow is:

1. discover the official OpenAI stable Linux package through signed APT metadata;
2. verify signed `InRelease`, Packages digest and package SHA-256;
3. treat unchanged version/architecture/SHA tuple as no-op;
4. download/cache exact official package;
5. invoke the packaged update-builder;
6. extract the new official payload;
7. apply **only** locally enabled features using their packaged validated snapshot;
8. reject candidate on enabled-feature drift or build/validation failure;
9. produce the managed candidate package beside the active install;
10. defer promotion until ChatGPT exits;
11. atomically exchange candidate with active package;
12. retain the immediately previous managed package as rollback target;
13. use a durable journal to recover interrupted promotion.

This directly supports R5/R7/R12/R13/R16 without introducing a second update mechanism.

## Fail-closed behavior already present

Relevant existing fail-closed surfaces include:

- package signature/index/hash/payload failures do not replace the working app;
- installer candidate failure leaves existing installation unchanged;
- feature validation/drift errors reject the candidate;
- candidate promotion occurs atomically rather than mutating a live tree piecemeal;
- running-app guard cannot be silently overridden by automated local operations;
- legacy/incompatible updater state does not replace the installed package;
- previous managed artifact remains available for rollback.

A custom-runtime compatibility failure therefore belongs **inside candidate construction before promotion**, where failure naturally rejects the candidate.

## Candidate M02 integration seams, ranked

This ranking is evidence for M02 design; it does not freeze implementation yet.

### Rank 1 — Feature-staged managed runtime + package-level `CODEX_CLI_PATH`

Pattern:

- preserve official `resources/codex` in the staged app as the stock baseline;
- feature acquires/builds a candidate runtime in candidate-build context;
- compatibility gate runs before candidate acceptance;
- stage the custom binary at a feature-owned app path;
- set `CODEX_CLI_PATH` through the feature runtime/launcher hook only after compatibility succeeds.

Advantages:

- uses an existing runtime-selection seam;
- preserves stock runtime bytes inside the package for straightforward feature-off restoration/debugging;
- opt-in lifecycle and updater persistence come from the existing feature system;
- failure can reject the candidate before promotion;
- avoids writing the installed app after package construction.

Questions for M02:

- whether official Desktop always honors `CODEX_CLI_PATH` for all Desktop-owned app-server launches on the exact baseline;
- how update-builder safely obtains/builds the candidate runtime without bloating or weakening trust;
- how provenance metadata is embedded.

### Rank 2 — Feature-time replacement of candidate `resources/codex`

Pattern:

- copy official app first;
- run compatibility/build gate;
- replace `resources/codex` only in the candidate tree before native package creation.

Advantages:

- Desktop follows the normal bundled path with no environment override dependency;
- still atomic because replacement happens before package promotion.

Costs/risks:

- candidate no longer contains the stock runtime at the normal path;
- feature-off restoration requires a fresh rebuild from verified official payload rather than switching path inside the same artifact;
- must ensure updater/build reports clearly record that the official binary was intentionally substituted;
- easier to obscure provenance if metadata is weak.

### Rank 3 — Post-install overwrite / external updater

Rejected as normal architecture.

It bypasses the feature/update-builder candidate transaction, creates drift under `/opt/codex-desktop`, complicates rollback and violates the accepted no-manual-post-update architecture. No current evidence justifies it.

## Minimal insertion point for compatibility gate

Regardless of Rank 1 vs Rank 2, the gate should occur:

```text
verified official package acquired/extracted
    -> official baseline identity captured
    -> custom runtime acquired/built with provenance
    -> compatibility + patch behavior checks
    -> only on PASS stage/select replacement
    -> package candidate acceptance
    -> atomic promotion later
```

`UNKNOWN`, source refresh failure, patch failure or protocol/behavior failure must abort the custom candidate. The implementation must not silently substitute a stale runtime and must not silently downgrade to an untested custom binary.

Whether failure should fail the entire update or produce a stock-only update while leaving the feature logically enabled is a product/contract detail for M02/M05 and should be specified explicitly rather than inferred.

## Rollback constraints

Two distinct rollback levels exist and should not be conflated:

1. **Feature rollback** — disable custom runtime and rebuild from the same/new verified official package, restoring stock runtime selection.
2. **Package rollback** — `codex-update-manager rollback` installs the immediately previous managed package retained by the updater.

M02 should preserve both. A runtime override must not destroy updater ability to identify and reinstall the previous managed artifact.

## T03 conclusion

- A package-level integration seam exists; there is no architecture blocker.
- `CODEX_CLI_PATH` is a real, already-supported runtime-selection mechanism.
- Linux features are the correct opt-in extension boundary and persist ID/settings through packaged updater rebuilds.
- `codex-update-manager` already provides verified acquisition, candidate construction, drift rejection, atomic promotion and previous-package rollback.
- M02 should reuse these mechanisms and should not create a second updater or post-install mutation path.
- Best current fit is a feature-staged custom runtime selected by `CODEX_CLI_PATH`, subject to M02 verifying exact Desktop launch-path coverage; candidate-tree replacement of `resources/codex` remains a valid fallback seam.

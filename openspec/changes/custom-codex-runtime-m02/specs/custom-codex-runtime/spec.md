# Specification — custom-codex-runtime

## Feature identity and enablement

- Feature id MUST be `custom-codex-runtime` unless implementation proves a naming conflict before code is written.
- Feature MUST be disabled by default.
- Enabling the feature expresses intent to build a managed package candidate with a custom Codex runtime, subject to all gates below.
- Enabling the feature does not itself authorize substitution.

## Settings schema

The feature settings contract MUST expose a controlled source/build description, not a free-form arbitrary binary path. Minimum logical fields:

```yaml
settings:
  custom-codex-runtime:
    provider: <provider-id>
    source_repository: <owner/repo-or-canonical-url>
    source_ref: <commit-ish requested by configuration>
    upstream_repository: <canonical upstream repository>
    upstream_ref: <exact resolved upstream commit sha>
    patch_source_repository: <repository-or-null>
    patch_source_ref: <exact commit sha-or-null>
    target_triple: <target architecture/triple>
    build_profile: <named supported build profile>
```

Implementation MAY represent these fields differently in JSON/YAML or derive immutable resolved fields during build, but the durable build evidence MUST distinguish configured intent from resolved immutable identity.

Free-form shell commands in feature settings are out of scope for M02. Build logic MUST come from controlled implementation code/build profiles.

## Official baseline identity

Before any custom substitution, build evidence MUST capture at least:
- official Desktop package version;
- package architecture;
- verified package SHA-256 or equivalent exact package identity already established by Community;
- Community source commit/build identity used to reconstruct the package;
- original candidate-tree `resources/codex` path;
- original bundled Codex SHA-256;
- original bundled Codex reported version when obtainable without weakening fail-closed behavior.

Official verification/extraction MUST complete through the existing trusted Community path before custom runtime acquisition/build/substitution proceeds.

## Custom runtime provenance

For every candidate custom runtime, durable provenance MUST capture at least:
- provider id;
- configured source repository/ref;
- exact resolved source commit SHA;
- canonical upstream repository and exact upstream baseline SHA;
- patch source repository/ref when divergence is required;
- patch/change-set identity or explicit `upstream-equivalent` status when no patch is carried;
- target architecture/triple;
- build profile and reproducible build command/recipe identifier;
- relevant toolchain identity sufficient to reproduce or diagnose the build;
- resulting runtime version output when available;
- resulting runtime SHA-256;
- build result status.

A candidate with incomplete required provenance is `UNKNOWN` and MUST NOT be substituted.

## Compatibility gate

Gate states are exactly:

```text
PASS
FAIL
UNKNOWN
```

Only PASS authorizes replacement of candidate-tree `resources/codex`.

FAIL covers a deterministic negative result such as source/build incompatibility, protocol/fixture failure, patch application failure or a required acceptance check that ran and failed.

UNKNOWN covers missing identity, unavailable required evidence, unresolved source relation, skipped/unavailable required check, ambiguous result or any state that cannot establish compatibility.

Neither FAIL nor UNKNOWN may silently downgrade to an unverified custom runtime.

For M02, a controlled fixture/candidate MAY prove gate mechanics without claiming full M03/M04 compatibility. Any such fixture PASS MUST be clearly labeled as M02 package-mechanics evidence, not production compatibility authorization.

## Candidate-tree substitution

When feature is enabled:

1. acquire and verify official package using existing Community logic;
2. extract/reconstruct candidate tree;
3. capture official package and stock `resources/codex` identity;
4. resolve/build custom runtime and capture provenance;
5. evaluate applicable M02 compatibility/build gates;
6. on PASS only, replace candidate-tree `resources/codex` with the accepted custom executable;
7. verify resulting path is executable and its digest matches recorded custom runtime identity;
8. continue normal managed package construction.

Replacement MUST occur only in candidate construction. The active installed tree MUST NOT be modified in place as the normal feature mechanism.

No second updater, post-install overwrite service or shadow runtime updater may be introduced.

## Disabled behavior / stock restoration

When feature is disabled:
- build/update reconstruction MUST use the verified official payload;
- official `resources/codex` MUST remain unmodified by this feature;
- no custom runtime acquisition/build is required for package correctness;
- no stale custom binary from a previous candidate may be copied into the new candidate.

Disabling the feature restores stock behavior on the next managed rebuild. Package rollback to the immediately previous managed package remains a separate existing mechanism.

## Update invalidation

Compatibility authorization is bound to the exact official package tuple and stock runtime identity recorded for the candidate.

Any change to official package version/architecture/package digest or original stock runtime digest invalidates the previous custom-runtime PASS. The feature MUST require a fresh evaluation before custom substitution for the new tuple.

Full changed-baseline persistence and refresh acceptance belongs to M05, but M02 implementation MUST store enough identity to make this invalidation enforceable.

## Alternate runtime authorities

The candidate-tree seam is selected specifically because current native Desktop, shared-app-server fallback and remote-mobile native cold-start fallback converge on `resources/codex` when explicit overrides are absent.

Implementation/tests MUST diagnose explicit runtime override variables that can bypass the candidate path, including at minimum `CODEX_CLI_PATH` and `CODEX_REMOTE_CONTROL_CODEX_PATH` where applicable. M02 MUST NOT claim package-level custom-runtime authority when an explicit override points elsewhere.

## Diagnostics and evidence

Every feature-enabled candidate attempt MUST produce durable diagnostics sufficient to answer:
- which official package was used;
- which stock runtime was present before replacement;
- which custom source/build was attempted;
- gate state and reasons;
- whether replacement occurred;
- final `resources/codex` digest if a package candidate was produced.

Diagnostics MUST NOT claim PASS when required checks were unavailable. Missing evidence maps to UNKNOWN.

## Failure behavior

If custom runtime build/acquisition, provenance capture, gate evaluation or replacement verification fails:
- the custom-runtime candidate MUST be rejected;
- the active installed package MUST remain untouched;
- failure MUST be diagnosable from build/update evidence.

Whether a future updater may deliberately produce a stock-only update while the feature remains logically enabled is NOT authorized by this M02 contract. Until separately specified, enabled custom-runtime failure means the custom-enabled candidate is rejected rather than silently changing feature semantics.

## M02 acceptance boundary

M02 package-level verification MUST cover:
- feature disabled -> stock candidate behavior;
- feature enabled + controlled PASS fixture/candidate -> intended replacement path;
- FAIL -> no custom replacement candidate;
- UNKNOWN -> no custom replacement candidate;
- provenance metadata readback;
- failed candidate construction leaves current package unchanged in the isolated test model;
- stock rebuild restoration;
- compatibility with existing previous-package rollback mechanics to the extent testable without production mutation.

M02 MUST NOT mark R4/R14, complete R15, or R16 satisfied.

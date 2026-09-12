# M02-T01 Evidence — Desktop runtime-selection coverage and substitution seam

Date: 2026-09-12
Executor: ChatGPT
Project baseline at start: `elmakus/Codex-fix-pooling@97d01f6c88dd6b1784f451534f42cbdb5be2dbfc`
Audited Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
Official Linux Desktop baseline: `26.908.40834`

## Verdict

**Freeze M02 substitution seam as: candidate-tree replacement of `resources/codex`.**

The preferred M01 candidate — a feature-staged runtime selected solely through package-level `CODEX_CLI_PATH` — is not sufficiently universal on the exact current Community baseline.

`CODEX_CLI_PATH` is a real supported Desktop/runtime-selection seam and covers the ordinary Desktop-owned Codex/app-server path, including the shared-app-server-socket feature. However, the optional `remote-mobile-control` feature has a separate cold-start daemon path that defaults directly to `$CODEX_LINUX_APP_DIR/resources/codex` and uses a different explicit override, `CODEX_REMOTE_CONTROL_CODEX_PATH`. Therefore one package-level `CODEX_CLI_PATH` does not govern every relevant Codex authority path in scope.

Using candidate-tree replacement preserves one authoritative executable location for the ordinary Desktop path, shared app-server path, and remote-mobile bundled fallback without creating a two-variable selection contract.

## Refresh Gate

Execution began after durable project recovery and current-source refresh.

- Project `main` was recovered at `97d01f6c88dd6b1784f451534f42cbdb5be2dbfc` before the card start transition.
- `ilysenko/codex-desktop-linux:main` remains `249cd4b64d42434f51417fec4a318750d461b676`.
- That Community commit is the current repair commit for official Linux `26.908.40834` and records the same official release identity already used by M01.
- No material launcher/feature/update architecture drift invalidated M01's two candidate seams.
- Capability Gate outcome: `EXECUTE IN CHATGPT` under `chatgpt_only`; current GitHub read/write capability satisfies the card.

No production runtime inspection was needed because current source contains an explicit path exception that decides the seam question.

## Runtime-selection trace

### 1. Stock launcher / ordinary Desktop

`launcher/start.sh.template` establishes `CODEX_LINUX_APP_DIR`, launches the official Desktop executable, and treats `resources/codex` as a required bundled resource in diagnostics.

The current Community project also documents and implements alternate CLI selection through `CODEX_CLI_PATH` in its Nix wrappers/modules. The Nix module contract says an optional CLI package is baked into the Desktop launcher as the default `CODEX_CLI_PATH`, an explicit environment value still wins, and when unset Desktop uses the official bundled CLI.

This establishes that the ordinary Desktop-owned Codex/app-server spawn path honors `CODEX_CLI_PATH`.

### 2. Shared app-server socket

`linux-features/shared-app-server-socket/socket-env.sh` resolves:

```text
cli_path=${CODEX_CLI_PATH:-$CODEX_LINUX_APP_DIR/resources/codex}
```

and emits that value back into the launcher environment as `CODEX_CLI_PATH`.

Its tests explicitly cover both the stock fallback and an explicit replacement path. The attached CLI/authority logic records and validates the executable backing the shared app-server authority.

Conclusion: the shared-app-server-socket path is compatible with a package-level `CODEX_CLI_PATH` override.

### 3. Remote mobile control — decisive exception

`linux-features/remote-mobile-control/README.md` explicitly states that its feature-owned cold-start hook starts the app-server daemon through the official Codex executable bundled in the Linux package.

The same README states:

```text
The hook uses $CODEX_LINUX_APP_DIR/resources/codex
```

and documents a separate test/override variable:

```text
CODEX_REMOTE_CONTROL_CODEX_PATH=/path/to/codex
```

Current `cold-start-hook.sh` implements exactly that precedence:

```text
CODEX_REMOTE_CONTROL_CODEX_PATH
    > $CODEX_LINUX_APP_DIR/resources/codex
```

It does **not** fall back through `CODEX_CLI_PATH`.

Therefore a custom runtime staged elsewhere and selected only by `CODEX_CLI_PATH` can produce split authority:

- Desktop/app-server uses custom runtime;
- remote-mobile cold-start daemon uses stock `resources/codex` unless a second override is also supplied.

That violates the desired single, package-level substitution contract and complicates compatibility/provenance claims.

### 4. Remote-control proxy / declarative owner

The remote-mobile-control documentation also supports a declarative/Nix topology where Desktop starts `codex app-server proxy` and a systemd user service owns `codex app-server --remote-control`. That topology has its own package/module CLI selection semantics.

This does not rescue the single-variable native package design: M02 must work for the normal packaged Community feature architecture without requiring Nix-specific service ownership.

### 5. Computer Use

The Linux Computer Use implementation is a separate plugin/native backend (`codex-computer-use-linux`). Current source does not establish another independent Codex CLI authority path that would favor `CODEX_CLI_PATH` over replacement of the bundled runtime. Computer Use therefore does not alter the seam decision.

## Seam comparison

### Rank 1 — staged runtime + package-level `CODEX_CLI_PATH`

Strengths retained from M01:
- stock `resources/codex` remains byte-preserved in the candidate;
- feature-off restoration can be path selection rather than payload reconstruction;
- ordinary Desktop and shared socket already support the environment override.

Current decisive weakness:
- one `CODEX_CLI_PATH` does not cover remote-mobile cold-start daemon selection;
- fixing that while keeping Rank 1 would require M02 to define and synchronize multiple runtime-selection variables/paths, expanding the seam beyond the approved simple package-level override concept;
- that creates additional drift, diagnostics and fail-closed obligations without technical benefit over replacing the one canonical bundled executable in the candidate tree.

Result: **rejected for M02 as the frozen universal seam.**

### Rank 2 — candidate-tree replacement of `resources/codex`

Pattern:
1. acquire and verify official package;
2. extract candidate tree;
3. capture official `resources/codex` identity before mutation;
4. acquire/build custom runtime with exact provenance;
5. run compatibility and patch-behavior gate;
6. only on PASS replace candidate-tree `resources/codex`;
7. build managed package candidate;
8. promote later through existing atomic updater flow.

Why it wins:
- ordinary Desktop continues using the normal bundled path;
- shared-app-server-socket fallback resolves to the replaced bundled path when no explicit override is present;
- remote-mobile native cold-start fallback resolves to the same replaced bundled path;
- no new multi-variable runtime-selection contract is needed;
- the existing updater still constructs a complete candidate before atomic promotion;
- FAIL/UNKNOWN can abort candidate construction before the installed package changes.

Trade-off accepted:
- the candidate package no longer retains stock Codex bytes at the normal executable location;
- feature-off restoration therefore means reconstructing a stock candidate from the verified official package, not toggling an environment path inside the same already-built package.

This is acceptable because the updater already rebuilds candidates from the verified official package and retains the previous managed package for package-level rollback.

## Constraints handed to M02-T02 OpenSpec

T02 must specify the candidate-tree replacement contract with at least these invariants:

1. **Official baseline first.** Verify/acquire the official OpenAI package and record the exact package tuple before custom-runtime work.
2. **Capture stock runtime identity before replacement.** Record hash/version/path and package provenance for the original `resources/codex`.
3. **PASS-only mutation.** Custom runtime may replace candidate-tree `resources/codex` only after all applicable compatibility/provenance/behavior gates are PASS.
4. **FAIL/UNKNOWN fail closed.** Neither state may produce a candidate that silently contains an unverified custom runtime.
5. **No live-tree overwrite.** Replacement happens only inside candidate construction before package creation/promotion.
6. **Feature disabled = stock rebuild.** Disabling `custom-codex-runtime` must construct the candidate from the verified official payload with the original official `resources/codex` untouched.
7. **Atomic updater unchanged.** Reuse the existing update-builder/updater promotion and rollback model; do not create a second updater.
8. **Provenance is explicit.** Build/package metadata must distinguish official package identity, original stock Codex identity, custom source/carrier/patch identity, resulting custom binary identity, and compatibility-gate result.
9. **Per-update invalidation.** A new official package tuple invalidates prior compatibility PASS and requires a new gate before replacement.
10. **No hidden alternate authority.** Tests must confirm relevant native Desktop/shared-socket/remote-mobile paths all resolve to the candidate's intended `resources/codex` when the feature is enabled, except explicit user/test overrides which must be diagnosed and governed separately.

## Required checks performed

- refreshed current Community `main` and official release baseline;
- inspected current launcher contract;
- inspected `CODEX_CLI_PATH` usage and Nix/Desktop selection documentation;
- inspected shared-app-server-socket launcher hook and tests;
- inspected remote-mobile-control documentation and cold-start runtime override behavior;
- reviewed candidate/updater constraints carried from M01 against current source.

No external repository was modified. No custom Codex fork was created. No custom runtime was built. No production installation/runtime was changed. No OpenSpec was created in T01.

## Acceptance result

GREEN.

All relevant runtime-selection categories in card scope were traced sufficiently to decide the seam. A known `CODEX_CLI_PATH` exception is explicit, the fallback candidate-tree mechanism preserves the accepted fail-closed/atomic package architecture, and T02 now has one concrete seam to specify.

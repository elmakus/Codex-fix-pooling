# TP_M01-T05 Evidence — TP_M02 strategy and refreshed runtime-delivery compatibility assumptions

Date: 2026-09-12
Executor: ChatGPT
Pinned source baseline: `openai/codex@944d6fd1ba4baab69dbedd205282dc72ec20abb5`
Pinned Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
Official Linux package: `26.908.40834`
Inputs:
- `TP_M01-T02_PRUNING_EQUIVALENCE.md` — `NOT_EQUIVALENT`
- `TP_M01-T03_SAFETY_CONTRACT.md`
- `TP_M01-T04_BENCHMARK_AND_REGRESSION_MATRIX.md`

## 1. Selected TP_M02 path

**REIMPLEMENT_EQUIVALENT_BEHAVIOR**

This is the single selected strategy for TP_M02.

### Why not `NO_CUSTOM_PATCH`

Rejected because T02 established `NOT_EQUIVALENT` on the pinned official source baseline. Current upstream context reduction does not provide the required request-time old-tool-output policy and lacks multiple safety dimensions.

### Why not direct historical cherry-pick/rebase

A direct carry of `d70b903` is not preferred because current architecture has materially evolved:

- `run_sampling_request` now has retry-time prompt reconstruction from canonical history;
- tool-output payloads/metadata are richer;
- current source has additional output classes such as `ToolSearchOutput`;
- current context/token accounting is broader than the historical patch assumed;
- upstream has per-tool truncation, multiple compaction paths and context-window recovery rewrites;
- T03 deliberately strengthens safety to fail closed for unknown/structured/durability-sensitive outputs;
- historical 40k/20k constants are benchmark inputs rather than accepted final product constants.

Trying to preserve the old diff would create accidental coupling to obsolete seams. The historical patch remains behavioral provenance and a test oracle input.

### Meaning of reimplementation

TP_M02 should implement the minimum current-baseline feature satisfying the accepted T03/T04 contracts, preserving the historical intent where still valid:

- explicit opt-in pruning feature;
- request-time transformation only for normal pruning;
- old eligible output replacement after recency/protection/minimum-benefit gates;
- fail-closed protected-output classification;
- standard/custom parity for eligible text outputs;
- retry/regenerated-request coverage;
- measurable request-token reduction hooks/tests;
- exact provenance.

No unrelated `tekacs/custom-cli` changes are imported.

## 2. Patch-carrier recommendation

If custom Codex code remains required, use an **owned controlled patch carrier/fork** based on the exact selected `openai/codex` source revision, with pruning kept as an isolated commit/change set and provenance metadata.

Preferred properties:

- upstream base SHA explicit;
- pruning change SHA explicit;
- reimplementation marked as behaviorally derived from `tekacs/codex@d70b903...`, not represented as a direct rebase when it is not;
- no unrelated custom stack;
- reproducible build identity;
- easy retirement when upstream becomes equivalent;
- capability remains independently traceable from the background-exec wakeup patch even if both later share one runtime artifact.

TP_M01 does **not** create/modify the fork.

## 3. Refreshed Community delivery assumptions

### Official package remains the provenance baseline

Current Community source still requires/extracts the verified official Linux package and expects an executable bundled Codex at `resources/codex`. For package `26.908.40834`, Community pins official package repository paths/hashes and records the official release ID.

Conclusion: R16 remains viable. A pruning integration does not need to weaken official package verification; it should layer custom runtime selection after the official package has been verified and established as the compatibility baseline.

### `resources/codex` remains the default runtime

Current docs/source state that the official package's bundled `resources/codex` is used by default. Launch/package paths verify its presence.

Conclusion: stock runtime remains the deterministic fallback when pruning is disabled or a compatibility gate fails.

### `CODEX_CLI_PATH` is a real runtime-selection seam

Current Community source independently confirms alternate CLI/runtime selection support:

- Nix modules support an alternate CLI and set default `CODEX_CLI_PATH`;
- shared-app-server-socket explicitly preserves an already-selected `CODEX_CLI_PATH` and otherwise falls back to `${CODEX_LINUX_APP_DIR}/resources/codex`;
- feature/runtime hooks can emit environment variables before the official ChatGPT executable starts.

Conclusion: a generic custom-runtime feature can select a vetted runtime without inventing a second post-install binary replacement mechanism.

### Opt-in Linux feature framework remains suitable

`linux-features/` still supports opt-in tracked/local features with:

- `feature.json` metadata;
- staged resources;
- runtime hooks;
- package resources/dependencies/hooks;
- custom build/install hooks;
- self-tests.

No optional feature is enabled by default.

Conclusion: pruning runtime selection can remain explicit and independently disableable.

### Updater persistence remains suitable but must not imply compatibility reuse

Current feature documentation explicitly states that native packages preserve enabled feature IDs/settings in the packaged update-builder bundle and `codex-update-manager` rebuilds keep those opt-in features across auto-updates.

This preserves **feature intent**, not a prior compatibility verdict.

Required pruning rule for later milestones:

- after a new official package baseline is detected, rerun upstream-equivalence and compatibility gates;
- never blindly reuse an old custom runtime because the feature remained enabled;
- if refresh/build/compatibility fails, package/select the verified official bundled runtime and surface the pruning feature as unavailable/failed-closed for that baseline.

## 4. Bundled runtime identity limitation

T01 established:

- package identity and bundled-binary provenance to the official package are deterministic;
- public source does not currently provide a safe deterministic mapping from that exact `resources/codex` binary to an `openai/codex` source SHA.

This does **not** block TP_M02 source-level reimplementation, because TP_M02 can target an exact explicitly pinned official source revision and prove its semantics there.

It **does** prohibit claiming Desktop compatibility merely from source recency. TP_M04 must establish compatibility empirically/protocol-wise against the exact official package/bundled runtime baseline before selection.

## 5. Compatibility gate inputs

Before ChatGPT Community may select a pruning-capable custom runtime, later milestones must record and verify at least:

### Official/Desktop baseline identity

- Community repository SHA;
- official package version;
- official package repository path per architecture;
- official package SHA-256;
- official release ID when available;
- hash/identity of extracted bundled `resources/codex` where build tooling can obtain it;
- bundled runtime `--version`/build output when available.

### Custom runtime provenance

- exact `openai/codex` upstream/base SHA;
- pruning patch/reimplementation SHA;
- build/toolchain identity sufficient for reproduction;
- resulting custom binary hash and version output;
- TP_M02 semantic-test evidence;
- later TP_M03 effectiveness/quality evidence.

### Desktop/app-server compatibility

Against the exact official Desktop package:

- custom runtime starts under the same app-server invocation expected by Desktop;
- protocol initialization succeeds;
- ordinary thread/turn request works;
- standard/custom tool call and output roundtrip works;
- no schema/protocol mismatch appears in smoke logs;
- normal command execution/continuation works;
- feature disabled/failed gate uses stock `resources/codex` successfully;
- app exits/restarts/update flow does not leave a stale override selected.

### Update refresh gate

On every official package refresh:

1. pin new official package identity;
2. check upstream pruning equivalence again;
3. if still needed, refresh/rebuild pruning on a current source baseline;
4. rerun TP_M02 semantic tests;
5. rerun required TP_M03 quality/effectiveness subset;
6. rerun exact Desktop compatibility smoke;
7. only then select custom runtime;
8. otherwise fail closed to official bundled runtime.

## 6. Fail-closed runtime-selection semantics

Custom runtime MUST NOT be selected when any of these is unknown/red:

- upstream equivalence state;
- custom runtime provenance;
- semantic pruning tests;
- protected-output safety tests;
- required request-token benchmark/quality acceptance;
- exact Desktop/package compatibility smoke;
- updater refresh/rebuild result.

Failure mode is stock official `resources/codex`, not a stale pruning binary and not a best-effort historical `tekacs` build.

## 7. Generic runtime-delivery boundary decision

The existing Community feature/runtime seam is sufficient as the architectural direction. Do **not** create a second pruning-specific package replacement system.

Target later integration shape:

`verified official package -> feature/update build -> compatibility-gated custom runtime resource -> CODEX_CLI_PATH selection -> official ChatGPT executable`

with stock fallback:

`verified official package -> resources/codex`

The eventual generic feature can be shared with the wakeup workstream while preserving independent patch provenance, enablement and acceptance evidence.

## 8. Just-in-time OpenSpec decision before TP_M02

**OpenSpec is REQUIRED just-in-time before TP_M02 implementation.**

Reason: TP_M02 will introduce a new behavior/configuration contract with safety-sensitive request transformation and potentially durable feature/config/provenance semantics. This now meets the workflow's OpenSpec criteria; TP_M01 research itself appropriately skipped OpenSpec.

Minimal TP_M02 OpenSpec should freeze only the implementation-relevant behavior contract:

- explicit feature enable/disable behavior;
- request-time/non-destructive history invariant;
- eligible vs protected output classification and fail-closed behavior;
- recency/protection/minimum-benefit threshold semantics without prematurely hardcoding unsupported values;
- retry/regenerated-request application;
- standard/custom output parity;
- observable pruning/provenance evidence needed for tests.

Do not prematurely include Community updater/package-selection contracts that belong to later integration milestones unless TP_M02 implementation actually crosses that boundary.

## 9. Requirement coverage synthesis

- R1 independent capability: preserved by isolated pruning behavior/change provenance.
- R2 no whole-stack dependency: selected strategy is minimal reimplementation only.
- R11 upstream equivalence: T02 `NOT_EQUIVALENT`; recheck required on refresh.
- R12 compatibility gate: explicitly deferred to exact Desktop/runtime validation before selection.
- R13 fail closed: explicit stock-runtime fallback semantics.
- R14 provenance: exact base/change/build/binary identity required.
- R15 update persistence with re-evaluation: feature intent may persist; verdict/runtime may not.
- R16 official package provenance: retained as baseline.
- R17 no hidden production mutation: none performed in TP_M01.
- R18 rollback/disable: stock `resources/codex` is required fallback path; full operational proof remains later.
- R22 Desktop smoke: explicit TP_M04 compatibility input.
- R23 update-path verification: explicit refresh sequence for later milestone.

## 10. Independent synthesis review

Questions:

- Does `NOT_EQUIVALENT` justify custom code? **Yes**, subject to later implementation/quality gates.
- Is historical cherry-pick the safest current strategy? **No**; current request/retry/context architecture has moved enough to prefer behavior-equivalent reimplementation.
- Is safety unresolved? **No strategic blocker**; T03 converts unknown categories to fail-closed protection and defers only evidence-driven numeric selection.
- Is effectiveness measurable? **Yes**; T04 defines source-grounded paired request-token measurement.
- Does Community still provide a usable generic integration seam? **Yes**; verified official package, feature hooks, `CODEX_CLI_PATH`, updater feature persistence are all current-source-grounded.
- Does unknown bundled-binary→source-SHA mapping invalidate TP_M02? **No** for source-level implementation; **yes** for any premature Desktop compatibility claim or runtime substitution.
- Should TP_M02 start without OpenSpec? **No**; create/reconcile a minimal JIT OpenSpec first.

## 11. TP_M01 synthesis result

Selected TP_M02 strategy: **REIMPLEMENT_EQUIVALENT_BEHAVIOR** on an owned, exact-upstream-based patch carrier, with minimal isolated divergence and JIT OpenSpec before coding.

No blocker prevents completing TP_M01 discovery. Desktop/runtime substitution remains prohibited until later exact compatibility evidence exists.

No pruning implementation, fork mutation, Community package modification or production runtime mutation was performed.

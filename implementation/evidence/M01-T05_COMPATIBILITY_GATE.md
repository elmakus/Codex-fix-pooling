# M01-T05 Evidence — Compatibility gate and minimum downstream test matrix

Date: 2026-09-12
Executor: ChatGPT

## Purpose

This document freezes the M01 admission rule for any future `custom-codex-runtime` substitution. It is a research/design contract, not an implemented gate.

Core rule:

> A custom Codex runtime may replace or override the official bundled runtime only when the gate result for the exact official Desktop baseline is `PASS`. `FAIL` and `UNKNOWN` both prohibit custom substitution.

## Gate result semantics

### PASS

Every required identity, provenance, patch-behavior and exact-Desktop compatibility check is available, coherent and green for one exact baseline/candidate pair.

Only PASS is eligible for staging/selection in a managed candidate package.

### FAIL

At least one required check produced contrary evidence, including but not limited to:

- package/runtime identity mismatch;
- patch/rebase failure;
- protocol method/field/notification incompatibility;
- app-server startup/initialize/session failure;
- wakeup semantics failure;
- duplicate completion;
- broken interactive `write_stdin`;
- feature-off not restoring stock behavior;
- stale candidate carried across update baseline.

FAIL rejects custom substitution and must preserve diagnostics.

### UNKNOWN

Required evidence is unavailable, ambiguous or not strong enough to prove compatibility, including:

- exact official runtime identity cannot be bound;
- source relation cannot be established and dynamic compatibility has not yet compensated for it;
- exact Desktop app-server smoke cannot be run;
- required protocol/behavior test did not execute;
- upstream equivalence is only suspected.

UNKNOWN is fail-closed: no custom substitution.

## Gate inputs

### G0 — Exact official baseline identity

Required:

- official Desktop package version;
- architecture;
- signed APT repository path;
- official `.deb` SHA-256;
- exact `codex-desktop-linux` source SHA used for the Community rebuild;
- bundled `resources/codex --version` when safely observable;
- bundled `resources/codex` SHA-256 when artifact bytes are available.

The T01 package SHA is authoritative for the tested signed package. A missing standalone bundled-runtime digest does not permit guessing a source revision.

### G1 — Candidate custom runtime provenance

Required:

- source repository (`elmakus/codex` carrier expected);
- exact OpenAI upstream base SHA/ref;
- exact carrier commit SHA;
- reference patch provenance (`tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`) or documented equivalent change set;
- patch application/rebase result;
- target architecture;
- resulting binary SHA-256;
- resulting `--version` output;
- reproducible build command/toolchain identity sufficient to audit the artifact.

A binary with incomplete provenance cannot PASS.

### G2 — Baseline/source relationship and upstream-equivalence state

Record one source relation classification:

- deterministic;
- safely derivable with documented additional verification;
- unavailable.

Then record strict R4 upstream-equivalence verdict:

- `EQUIVALENT`;
- `NOT_EQUIVALENT`;
- `UNKNOWN`.

Rules:

- source similarity/version proximity never yields PASS by itself;
- `EQUIVALENT` retires the patch for that baseline; the stock/equivalent runtime should be used instead of maintaining divergence;
- `NOT_EQUIVALENT` means patch behavior must be provided by the candidate;
- `UNKNOWN` never authorizes patch retirement.

An unavailable exact source mapping does not permanently block the project if the later exact-Desktop protocol/behavior evidence can independently prove the candidate compatible, but until those tests are green the result remains UNKNOWN.

### G3 — Candidate build / patch integrity

Before Desktop integration:

- patch/rebase applies without unresolved conflict;
- candidate builds successfully for target architecture;
- no silent conflict resolution changes intended semantics;
- patch-level tests are green;
- provenance metadata corresponds to the actual produced binary.

Any mismatch => FAIL.

### G4 — Strict wakeup behavior

When upstream is not already strictly equivalent, require all R4/R14 checks:

1. short command completes inline normally;
2. yielded background unified-exec command later produces model-visible completion;
3. idle session wakes on that completion;
4. active turn receives pushed completion;
5. inline terminal result does not generate duplicate pushed completion;
6. `exec_command`/`write_stdin` model guidance discourages completion-only empty polling;
7. explicit/intermediate-output/interactive `write_stdin` remains functional.

All required checks must PASS before substitution can PASS.

### G5 — Exact Desktop/app-server compatibility

Run against the exact official Desktop package baseline bound in G0, using the candidate runtime from G1.

Minimum compatibility path:

- candidate app-server mode can be launched through the actual Desktop-selected CLI path;
- initialization succeeds with the Desktop's real client info/capabilities;
- expected initialize response is accepted;
- thread start/resume/read/session lifecycle used by the smoke flow succeeds;
- turn start succeeds and expected item/notification flow is received;
- ordinary short command/tool operation works;
- model/account/config operations needed by the Desktop smoke flow do not return unknown-method/schema errors;
- no deserialization/required-field/protocol errors appear in logs;
- background completion behavior reaches the Desktop-owned session path.

Because current app-server initialize does not negotiate a general wire protocol version, source version matching is not a substitute for this dynamic gate.

### G6 — Package/feature selection and rollback readiness

Require:

- feature disabled => stock official `resources/codex` path/behavior;
- feature enabled + gate PASS => exact expected custom binary is selected;
- feature enabled + gate FAIL/UNKNOWN => custom binary is not silently selected;
- candidate construction fails safely before promotion when required custom-runtime validation fails;
- package retains practical rollback through stock rebuild and updater previous-package rollback.

### G7 — Update refresh

A new official package tuple invalidates the prior compatibility PASS.

For every new official version/architecture/SHA tuple:

1. repeat G0;
2. repeat source/equivalence decision G2;
3. if divergence still needed, refresh carrier from new selected source baseline;
4. repeat candidate provenance/build G1/G3;
5. repeat wake behavior G4;
6. repeat exact Desktop compatibility G5;
7. only then allow new custom selection;
8. preserve updater atomic promotion/rollback semantics.

A stale previously green custom binary cannot inherit PASS across a new official baseline.

## Rejection diagnostics contract

A rejected candidate should preserve enough durable evidence to state:

- official baseline tuple;
- custom candidate provenance tuple;
- gate stage that failed or remained unknown;
- exact command/test/check name;
- relevant exit/error/schema/protocol information;
- whether stock installed package remained untouched;
- whether previous managed rollback artifact remains available.

Do not reduce rejection evidence to `incompatible` without the stage/reason.

## Minimum downstream acceptance/test matrix

M01 defines this matrix; it does not execute downstream implementation tests.

| Check | Required owner | Purpose |
|---|---|---|
| official package tuple + candidate provenance | M02 | Bind exact inputs and build output |
| custom runtime build succeeds | M02 | Ensure buildable managed artifact |
| feature disabled selects stock runtime | M02 | R1 / rollback baseline |
| feature enabled selects candidate only on gate PASS | M02 | Fail-closed package selection |
| FAIL/UNKNOWN rejects custom substitution | M02 | R6/R7 |
| source/patch/build identity recorded | M02 | R8 |
| short inline unified-exec result | M03 | No regression / duplicate baseline |
| yielded background completion | M03 | R4 core behavior |
| idle-session wake | M03 | R4 |
| active-turn pushed delivery | M03 | R4 |
| duplicate suppression | M03 | R4/R14 |
| model guidance discourages empty polling | M03 | R4 |
| interactive/intermediate `write_stdin` | M03 | Preserve valid interaction |
| Desktop starts with selected candidate | M04 | R15 |
| app-server initialize succeeds | M04 | Protocol admission |
| Desktop thread/session lifecycle smoke | M04 | Detect schema/protocol drift |
| Desktop ordinary command/tool flow | M04 | R15 |
| background completion reaches Desktop-owned session | M04 | End-to-end wake path |
| feature-off Desktop rollback smoke | M04 | Stock restoration |
| updater preserves feature ID/settings | M05 | R5/R16 |
| new official baseline invalidates old PASS | M05 | No stale compatibility carryover |
| upstream equivalence retires divergence cleanly | M05 | R9 |
| patch refresh failure rejects custom candidate | M05 | R7 |
| atomic promotion + previous managed package rollback | M05 | R12/R13 |

## M02 design prerequisites produced by M01

M02 may now design the feature boundary knowing:

- official package trust/provenance path is fixed and must remain first;
- exact source mapping may be unavailable and cannot be guessed;
- app-server has no general top-level protocol-version negotiation;
- strict runtime compatibility must therefore include exact Desktop dynamic smoke;
- Linux feature framework is the proper opt-in boundary;
- `CODEX_CLI_PATH` is the preferred first seam, with candidate-tree `resources/codex` replacement as fallback if launch-path coverage proves insufficient;
- packaged update-builder already preserves validated enabled feature/settings snapshots;
- compatibility failure belongs before candidate promotion;
- current public OpenAI main is not strictly equivalent to the reference patch;
- owned `elmakus/codex` is the controlled patch carrier when divergence is needed.

## Current M01 gate state for actual substitution

M01 has **not** built or admitted a custom runtime.

For the current exact Desktop baseline, actual substitution status remains:

**UNKNOWN / NOT AUTHORIZED**

because no candidate runtime was built and no exact Desktop integration test was run. This is expected: M01 defines the gate; M02-M05 provide the evidence that can eventually turn a concrete baseline/candidate pair into PASS.

## Internal consistency review

- FAIL and UNKNOWN both preserve stock behavior: consistent with R6/R7.
- Upstream equivalence removes divergence rather than perpetuating a fork: consistent with R9/A5.
- New official package invalidates old compatibility: prevents protocol drift carryover.
- Package candidate construction precedes atomic promotion: consistent with R12.
- Feature-off stock rebuild plus previous-package rollback provide two practical rollback layers: consistent with R13.
- No production/runtime mutation is needed to complete M01: consistent with R11.

## T05 conclusion

The compatibility gate is sufficiently defined to constrain M02 without freezing code-specific implementation details prematurely. Only an evidence-complete PASS for one exact official Desktop baseline and one exact candidate runtime can authorize substitution. All missing/inconclusive evidence is UNKNOWN and fails closed.

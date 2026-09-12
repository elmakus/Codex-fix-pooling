# M02-T03 Evidence — Runtime patch provenance and carrier recipe

Date: 2026-09-12
Executor: ChatGPT
Status: PREPARED / STATICALLY REVIEWED / NOT COMPILE-VERIFIED

## Refresh Gate

Project execution was refreshed before implementation. The current selected upstream is:

- `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
- reference patch: `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`
- reference parent: `ba573b4b10937d955559e6b45e8a199276b7424d`
- Community source remains `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- official Desktop provenance baseline remains `26.908.40834` as established by M01/M02-T01.

The preferred owned carrier `elmakus/codex` is currently absent/not accessible (GitHub repository lookup returned 404). Under the accepted best-effort strategy this is not a blocker: the patch source and current-source adaptation are durably prepared here, and Codex can create/use the owned carrier during execution.

## Strict upstream-equivalence verdict

Verdict for public `openai/codex@c4017a87`: **NOT EQUIVALENT**.

Strict equivalence requires all four semantics.

### 1. Yielded/background completion wakes an idle session

Current `codex-rs/core/src/unified_exec/async_watcher.rs` still waits for process exit/output drain and emits normal terminal tool events, but its `spawn_exit_watcher` has no `wake_on_exit` gate and no model-input injection on completion.

Result: FAIL for strict equivalence.

### 2. Completion is pushed into an already active turn

Current Session injection APIs can inject into an active turn, but no source path connects yielded unified-exec exit to a model-visible completion input.

Result: FAIL for strict equivalence.

### 3. No duplicate pushed completion after inline terminal return

Because current upstream has no proven pushed exec-completion path, it also has no equivalent wake gate whose false state suppresses a second model-visible result after an inline terminal return.

Result: FAIL for strict equivalence.

### 4. Tool guidance discourages completion-only empty polling

Current `shell_spec.rs` still describes `exec_command` as returning output/session ID and `write_stdin` as returning recent output. Its schema explicitly supports empty polling, but the model-facing descriptions do not distinguish completion-only polling from legitimate interaction/intermediate-output use and do not tell the model to wait for a runtime completion notification.

Result: FAIL for strict equivalence.

Therefore patch retirement is not allowed for this refreshed public upstream.

## Reference patch provenance

The immutable reference commit is `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`, commit message `wake model when background exec commands complete`.

The reference change adds/changes these areas:

- contextual `ExecCompletion` model input;
- context module export;
- `exec_command` and `write_stdin` tool descriptions and tests;
- unified-exec async exit watcher;
- process-entry wake state and unified-exec process-manager paths/tests;
- active-turn pushed-input regression coverage;
- bundled model guidance/regression coverage.

The commit records 191 changed lines overall (+168/-23).

## Current-source mapping and drift

The core architecture remains recognizable on `c4017a87`, but the historical patch cannot be blindly cherry-picked.

Stable/mappable surfaces:

- `codex-rs/core/src/context/` remains the contextual-fragment boundary;
- `codex-rs/core/src/tools/handlers/shell_spec.rs` still owns unified `exec_command` / `write_stdin` model tool descriptions;
- `ProcessEntry` still carries `initial_exec_command_active` and unified-exec ownership in `codex-rs/core/src/unified_exec/mod.rs`;
- `spawn_exit_watcher` remains the post-exit/output-drain terminal boundary;
- `process_manager.rs` owns current process creation/yield/refresh/watcher wiring.

Material drift:

- the current watcher includes newer `model_info`, plugin-attribution, interaction-lock and deferred-network-denial logic that must be preserved;
- process-management code is more split than the historical reference;
- historical `Session::inject_or_start` is no longer present;
- current `Session::inject_no_new_turn` explicitly records idle input without starting a new turn, so it cannot substitute for the idle-wakeup semantic;
- current bundled model templates have drifted substantially, so the historical broad `models.json` textual diff should not be transplanted blindly.

## Prepared implementation material

Durable adaptation recipe:

`implementation/patches/M02-T03_CODEX_C4017A87_WAKEUP_ADAPTATION.md`

It contains concrete current-source edits for:

- `ExecCompletion` construction and registration;
- exact tool guidance language;
- `wake_on_exit` state and Release/Acquire invariant;
- watcher completion construction and ordering;
- current process-manager wiring;
- test matrix;
- carrier relationship;
- build/test/provenance commands.

One compile-level integration point remains deliberately unresolved: the exact current Session API that must both inject into an active turn and start/wake an idle turn. Codex must bind or reintroduce this narrow helper against the current turn-start internals and prove it by tests. This is an explicit UNKNOWN, not omitted work.

## Carrier recipe

If divergence is still required when Codex executes:

1. create/use `elmakus/codex` as owned maintenance carrier;
2. establish exact upstream base `c4017a87aacc7558002b7cb510025e967c1d765e`;
3. create a dedicated wakeup branch from that exact base;
4. inspect immutable reference `9ffcf8db9078eae43d4111ff94259795c1e962c9` and this adaptation recipe;
5. implement/adapt only source drift necessary to preserve the four frozen semantics;
6. run formatting/tests/build;
7. record exact carrier commit and resulting binary identity.

Do not carry an old prebuilt binary forward.

## Expected runtime build/provenance commands

The current `codex-rs/cli/Cargo.toml` package is `codex-cli` and declares binary `codex`. Expected commands from `codex-rs/` are:

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

Codex may refine test filters to exact current names after inspection, but must execute the semantic coverage listed below.

## Required runtime semantic checks

- short inline command;
- yielded background command;
- idle completion wake;
- active-turn pushed completion;
- duplicate suppression after inline completion;
- completion-only empty polling discouraged by model-facing guidance;
- legitimate intermediate-output `write_stdin`;
- legitimate interactive `write_stdin`;
- final output correctness for success/failure paths.

Status in ChatGPT: **PREPARED, NOT EXECUTED**.

## Required immutable provenance after build

Codex must record:

- source repository and exact carrier commit;
- upstream repository and exact base SHA;
- reference patch source and SHA;
- exact adapted change-set/commit;
- target triple/architecture;
- Rust/Cargo/toolchain identity;
- exact build command/profile;
- `codex --version` output;
- resulting binary SHA-256;
- patch/test/build result.

Until these exist, runtime build identity is UNKNOWN.

## UNKNOWN / non-claims

The following remain explicitly UNKNOWN after T03 preparation:

- whether the adaptation compiles against `c4017a87`;
- exact final current Session active-or-idle wake API implementation;
- Rust unit/integration test results;
- resulting runtime version/SHA-256/architecture;
- strict wakeup behavioral PASS;
- compatibility with official Desktop `26.908.40834`;
- Community package build compatibility;
- update persistence.

No production installation or external upstream repository was modified.

## T03 conclusion

T03 preparation is complete under the accepted best-effort contract. Current public upstream is not strictly equivalent, the exact reference provenance and current baseline are pinned, the main source drift is identified, an actionable current-source adaptation recipe and test/build/provenance checklist are durable, and all environment-dependent proof remains explicitly UNKNOWN for Codex.

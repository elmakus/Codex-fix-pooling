# M02-T03 — Codex wakeup adaptation against openai/codex@c4017a87

Status: BEST-EFFORT / STATICALLY REVIEWED / NOT COMPILE-VERIFIED
Target upstream: `openai/codex@c4017a87aacc7558002b7cb510025e967c1d765e`
Reference patch: `tekacs/codex@9ffcf8db9078eae43d4111ff94259795c1e962c9`
Reference parent: `ba573b4b10937d955559e6b45e8a199276b7424d`

This is the current-source adaptation recipe Codex should implement on an owned carrier. It is intentionally not represented as an already-compiling patch because the current upstream removed the reference patch's `Session::inject_or_start` API. The source-level changes below are otherwise mapped to current files/functions.

## 1. Completion fragment

Add `codex-rs/core/src/context/exec_completion.rs` with the same semantic payload as the reference patch:

```rust
use codex_protocol::models::ContentItemKind;
use codex_utils_output_truncation::TruncationPolicy;
use codex_utils_output_truncation::truncate_text;

use super::ContextualUserFragment;

const EXEC_OUTPUT_TOKENS: usize = 8_000;

pub(crate) struct ExecCompletion {
    body: String,
}

impl ExecCompletion {
    pub(crate) fn new(
        call_id: &str,
        process_id: i32,
        command: &[String],
        exit_code: i32,
        output: &str,
    ) -> Self {
        let command = command.join(" ");
        let output = truncate_text(output, TruncationPolicy::Tokens(EXEC_OUTPUT_TOKENS));
        Self {
            body: format!(
                "<exec-command-completed call-id=\"{call_id}\" process-id=\"{process_id}\" exit-code=\"{exit_code}\">\n<command>{command}</command>\n<output>\n{output}\n</output>\n</exec-command-completed>"
            ),
        }
    }
}

impl ContextualUserFragment for ExecCompletion {
    fn role(&self) -> &'static str { "user" }
    fn content_kind(&self) -> ContentItemKind {
        ContentItemKind("exec.completion".to_string())
    }
    fn markers(&self) -> (&'static str, &'static str) { Self::type_markers() }
    fn body(&self) -> String { self.body.clone() }
    fn type_markers() -> (&'static str, &'static str) { ("", "") }
}
```

Register/export `exec_completion` from `codex-rs/core/src/context/mod.rs` beside the other contextual fragments.

## 2. Model-facing tool guidance

In `codex-rs/core/src/tools/handlers/shell_spec.rs`, preserve all current schema fields and Windows guidance, but replace the base descriptions with:

```rust
let description = concat!(
    "Runs a command in a PTY, returning output or a session ID for ongoing interaction. ",
    "If the command is still running after yielding, treat it as background work. ",
    "Do not poll for completion with write_stdin, ps, pgrep, or similar liveness checks just to see whether it finished. ",
    "Wait for the runtime completion notification instead. ",
    "Only check again if you need intermediate output for the next step, must interact with the process, or are diagnosing a problem. ",
    "If there is no other independent work to do, end your turn."
);
```

Use it as the `exec_command` description, appending the current `windows_shell_guidance()` exactly as current upstream does.

Replace the `write_stdin` function description with:

```rust
concat!(
    "Writes characters to an existing unified exec session and returns recent output. ",
    "Do not use empty polls to check whether a background command has finished. ",
    "Use this only when you need intermediate output for the next step or must interact with the running process. ",
    "Background exec completions arrive through a separate runtime completion notification."
).to_string()
```

Do **not** remove the `chars`, `yield_time_ms`, or interactive polling schema: legitimate interaction/intermediate-output polling must continue to work.

Update `shell_spec_tests.rs` snapshots/expected descriptions to match. Keep all current schema expectations intact.

## 3. Yield/duplicate-suppression state

In `codex-rs/core/src/unified_exec/mod.rs`, extend current `ProcessEntry`:

```rust
wake_on_exit: Arc<std::sync::atomic::AtomicBool>,
```

The invariant is:

- new process: `false`;
- if the original `exec_command` returns terminal output inline: remains `false`;
- when the original call yields a still-live process/session id: set `true` before returning the yielded response;
- any current path that discovers/returns a still-live entry after the initial response must preserve/set `true` consistently;
- exit watcher reads the flag with `Ordering::Acquire`.

This is the duplicate-suppression boundary. Do not replace it with event de-duplication: the question is whether model-visible completion input should be pushed at all.

Current upstream moved much of this logic to `codex-rs/core/src/unified_exec/process_manager.rs`. Add the field to every current `ProcessEntry` constructor and test fixture there / in `mod_tests.rs` / `process_manager_tests.rs`.

## 4. Exit watcher

In `codex-rs/core/src/unified_exec/async_watcher.rs`:

- import `AtomicBool`, `ContextualUserFragment`, and `ExecCompletion`;
- add `wake_on_exit: Arc<AtomicBool>` to `spawn_exit_watcher`;
- after output drain + deferred network-denial settlement + interaction lock, determine failure and exit code using current logic;
- if `wake_on_exit.load(Ordering::Acquire)` is true, resolve the final aggregated transcript and construct one `ExecCompletion` before the normal terminal event consumes/moves values;
- preserve the current terminal `ToolEmitter`/`model_info`/plugin-attribution behavior unchanged;
- after the normal terminal event has been emitted, deliver the completion through the current active-or-idle injected-input path;
- only one completion may be delivered.

Conceptual current-source shape:

```rust
let failure = process.failure_message();
let exit_code = failure
    .as_ref()
    .map_or_else(|| process.exit_code().unwrap_or(-1), |_| -1);

let completion = if wake_on_exit.load(Ordering::Acquire) {
    let output = resolve_aggregated_output(&transcript, String::new()).await;
    Some(ContextualUserFragment::into(ExecCompletion::new(
        &call_id,
        process_id,
        &command,
        exit_code,
        &output,
    )))
} else {
    None
};

// Keep the current success/failure ToolEmitter path here.

if let Some(completion) = completion {
    session_ref.<CURRENT_ACTIVE_OR_IDLE_WAKE_API>(vec![completion]).await;
}
```

`<CURRENT_ACTIVE_OR_IDLE_WAKE_API>` is the one deliberately unresolved compile-level symbol in this preparation. The historical reference used `Session::inject_or_start`. Current `c4017a87` exposes `inject_if_running` and `inject_no_new_turn`, but `inject_no_new_turn` explicitly records idle input without starting a turn, so it is **not** strict-equivalent for idle wake. Codex must bind this call to the current turn-start path or add a narrowly-scoped Session helper restoring the reference semantics:

1. active turn -> enqueue ResponseItem into the active turn's pending input and trigger steer processing;
2. no active turn -> start a normal model turn rooted in the current session/thread using the completion ResponseItem;
3. preserve current turn/root provenance rules;
4. do not use a mailbox/inter-agent semantic wrapper for an exec completion merely to obtain wake behavior.

This API adaptation must be backed by tests before it can be considered verified.

## 5. Watcher wiring

At the current `spawn_exit_watcher(...)` call in `process_manager.rs`:

- create/store one `Arc<AtomicBool>` in the `ProcessEntry`;
- pass the same Arc to `spawn_exit_watcher`;
- do not create a separate flag for the watcher and the process entry.

The Release write when the caller has definitively yielded and the Acquire read at exit preserve the intended handoff.

## 6. Tests to port/adapt

Prepare/retain these tests in current locations:

- `shell_spec_tests.rs`: anti-completion-poll guidance and legitimate-interaction language;
- unified-exec manager: inline completion keeps wake flag false;
- unified-exec manager: yielded/live response sets wake flag true;
- async watcher: false flag emits terminal event but no pushed model completion;
- async watcher: true flag emits exactly one pushed completion after terminal output settles;
- active-turn integration: completion enters the already active turn;
- idle-session integration: completion starts/wakes a turn;
- duplicate suppression: inline terminal result produces no later completion input;
- interactive `write_stdin`: non-empty/intermediate-output path still behaves normally.

All tests in this file are **PREPARED REQUIREMENTS, NOT EXECUTED** in ChatGPT.

## 7. Models-manager guidance

The reference commit also edited bundled model instruction text and added `models-manager` regression coverage for background exec guidance. Current upstream has significantly changed model templates. Do not blindly transplant the historical giant `models.json` diff.

Instead, after the core tool-description change is compiling, inspect the current model template generation path and add only the minimal current-baseline regression required to ensure no bundled model instruction overrides/reintroduces completion-only polling. Treat this as a source-drift adaptation, not a reason to drop requirement 4.

## 8. Carrier recipe

When divergence is still required:

```bash
git clone https://github.com/openai/codex.git elmakus-codex
git -C elmakus-codex checkout c4017a87aacc7558002b7cb510025e967c1d765e
git -C elmakus-codex switch -c background-exec-wakeup-c4017a87
# add owned remote/fork after the user-owned fork exists
git -C elmakus-codex remote add carrier https://github.com/elmakus/codex.git
# implement/adapt this recipe; reference exact historical change while reviewing:
git -C elmakus-codex show 9ffcf8db9078eae43d4111ff94259795c1e962c9
```

If the owned fork is created via GitHub rather than clone-first, preserve the exact same upstream base relationship.

## 9. Expected build/test commands

From `codex-rs/`:

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

Codex should refine test filters if current Cargo test naming requires it, but must not omit the semantic matrix above. The `codex-cli` crate declares the `codex` binary and is the intended build target.

## 10. Acceptance boundary

This recipe is source-reviewed against `c4017a87` but **not compiled**. In particular, the current active-or-idle turn-start API binding remains UNKNOWN until Codex compiles and runs the integration tests. Nothing in this document is a runtime/Desktop compatibility PASS.

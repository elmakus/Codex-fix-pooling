# Research — background exec wakeup patch and ChatGPT Community integration

## Question

How can the `tekacs/codex` commit `9ffcf8db9078eae43d4111ff94259795c1e962c9` be made usable from ChatGPT Community for Linux in a maintainable way?

## Source patch

Source repository: `tekacs/codex`

Commit: `9ffcf8db9078eae43d4111ff94259795c1e962c9`

Commit title: `wake model when background exec commands complete`

The patch changes Codex unified exec behavior so that a process which outlives the original `exec_command` call can push a model-visible completion event when it exits. The completion is delivered through the same active-or-idle pushed-input path used elsewhere, so an active turn can receive it and an idle session can wake. The patch also suppresses duplicate completion delivery when the original call already returned the terminal result inline.

The patch updates tool guidance so the model is explicitly told not to empty-poll background commands with `write_stdin`, `ps`, `pgrep`, or equivalent liveness checks merely to detect completion. Polling remains appropriate when intermediate output or interaction is actually required.

The commit itself states that the custom patch may be removed after upstream implements strictly equivalent behavior. Equivalence requires idle-session wakeup, active-turn delivery, no duplicate inline result, and aligned model-facing tool guidance.

## ChatGPT Community for Linux baseline

Project: `ilysenko/codex-desktop-linux`

The project is an unofficial distribution which verifies and repackages OpenAI's signed official Linux `.deb`. The official Electron runtime, native modules, bundled `codex`, `rg`, code-mode host and other payload components are reused from the verified package.

The official bundled Codex runtime is expected at:

`resources/codex`

and becomes:

`/opt/codex-desktop/resources/codex`

in a normal native installation.

The project's packaging and launcher logic checks that this bundled Codex exists and is executable.

## Existing extensibility relevant to this project

`codex-desktop-linux` already has an opt-in Linux feature framework. Features can provide staged resources, runtime hooks, package hooks and custom build/install hooks. Enabled feature selections are preserved by the native update-builder flow, so an enabled feature can be re-applied when the Community package is rebuilt after a new official OpenAI package is discovered.

The project also already understands alternative Codex CLI selection in some integrations. In particular, the Nix module exposes an alternate CLI package mechanism and the shared-app-server-socket feature preserves an explicit `CODEX_CLI_PATH` when supplied.

This proves that an alternate CLI/runtime is not conceptually foreign to the project, although the normal native package path still uses the verified bundled `resources/codex` by default.

## Preferred integration model

Do not manually overwrite `/opt/codex-desktop/resources/codex` after each update.

Preferred model:

1. Verify/extract the signed official OpenAI Linux package exactly as Community Edition already does.
2. Preserve the official package as the compatibility baseline and provenance source.
3. If an explicit custom-runtime feature is enabled, obtain/build a compatible Codex runtime carrying the background-exec wakeup behavior.
4. Verify compatibility against the current official Desktop/bundled Codex baseline.
5. Replace or redirect the Codex runtime only after the compatibility gate succeeds.
6. Package the resulting Community Edition normally.
7. Ensure the updater reconstructs the same feature on future updates.

## Why a generic feature is preferable to a tekacs-specific hack

The durable capability should be modeled as a generic custom Codex runtime integration, for example `custom-codex-runtime`, rather than permanently coupling Community Edition to `tekacs/codex`.

The first provider/preset may point to `tekacs/codex` and the background-exec wakeup patch, but the integration contract should allow the source/ref to change. This matters because:

- the patch is explicitly temporary until upstream equivalence exists;
- `tekacs/codex` can drift from OpenAI upstream;
- an owned fork such as `elmakus/codex` may later be preferable for controlled rebases;
- future fixes may need the same mechanism.

## Primary technical risk

The main risk is protocol/runtime skew.

OpenAI may update Desktop and the app-server protocol while a pinned custom Codex build remains based on an older upstream revision. A naive permanent pin could therefore produce a Desktop ↔ Codex combination that starts successfully but is behaviorally incompatible.

The integration must fail closed: if compatibility cannot be established, do not silently substitute an old custom runtime.

## Compatibility gate questions

Planning/implementation must determine:

- how the official bundled `resources/codex` exposes its version/build/revision;
- whether that maps deterministically to an `openai/codex` source revision;
- whether the custom patch can be rebased automatically or must be refreshed manually per upstream baseline;
- what smoke/protocol tests prove enough Desktop/app-server compatibility before packaging;
- what should happen when upstream already contains equivalent behavior.

## Upstream-removal condition

The project should not maintain a permanent divergence merely because the patch once existed. A future refresh must test whether official Codex already provides equivalent completion wakeup behavior. If yes, custom patching should be retired for that baseline.

## Research conclusion

The integration appears technically feasible and the Community Edition feature/update architecture is a good fit. The design should be a compatibility-gated, opt-in custom Codex runtime feature applied during package reconstruction, not a post-install binary hack and not a forever-pinned historical `tekacs` binary.

# M01-T02 Evidence — Codex source mapping and Desktop/app-server protocol baseline

Date: 2026-09-12
Executor: ChatGPT
External repositories: read-only

## Inputs

- T01 audited Community baseline: `ilysenko/codex-desktop-linux@249cd4b64d42434f51417fec4a318750d461b676`
- Official Desktop package baseline: `26.908.40834`, architecture-specific immutable `.deb` hashes recorded by T01
- Current `openai/codex:main` at execution-time research: `89c8bcf37d64be69e4c8286f4541c1a84ed312a4`

T01 could not execute the bundled runtime because isolated network access to `persistent.oaistatic.com` was unavailable. No runtime version/source revision was guessed.

## Source mapping verdict

Classification for the exact current bundled runtime: **unavailable from repository metadata alone**.

The current `codex-desktop-linux` package metadata binds the exact signed Desktop `.deb`, but it does not record an `openai/codex` Git commit for the bundled `resources/codex` binary. Desktop version `26.908.40834` is not a Codex source revision and must not be converted into one by date/version proximity.

### Safe derivation procedure when artifact bytes are available

1. Verify the exact official `.deb` against the T01 architecture-specific SHA-256.
2. Extract only to an isolated workspace.
3. Record:
   - `resources/codex --version`
   - SHA-256 of `resources/codex`
   - architecture/file identity.
4. Search `openai/codex` releases/tags for the exact reported CLI version.
5. Resolve the candidate release tag to its exact Git commit.
6. Compare the bundled runtime digest against an official public release asset digest for the same architecture **when such an asset exists and is byte-comparable**.
7. Only if the identity chain uniquely matches may the bundled runtime be classified as deterministically mapped to that public commit/tag.
8. If version matches but binary digest does not match a public release asset, or no uniquely corresponding public build exists, classify the source revision as `unavailable` and rely on protocol/behavior compatibility instead of guessing.

Public `openai/codex` releases demonstrate versioned `rust-v...` tags and digest-bearing architecture assets, so this procedure is viable when the exact bundled binary is available. It is not evidence that the Desktop bundle necessarily equals one of those public assets.

## App-server wire model

Current `openai/codex` publishes generated app-server protocol schemas under `codex-rs/app-server-protocol/schema/`.

The generated `ClientRequest` is a tagged request union whose currently exposed methods include the compatibility-critical families:

- `initialize`
- `thread/start`, `thread/resume`, `thread/read`, `thread/list`, thread metadata/attachment/section operations
- `turn/start`, `turn/steer`, `turn/interrupt`
- `model/list`
- config/account/auth operations
- MCP/app/plugin/skills operations
- command execution and filesystem operations
- server-specific experimental methods.

The size and active evolution of this union makes protocol skew a real risk: a replacement that merely starts can still be incompatible with methods/fields expected by the Desktop.

## Initialization / negotiation finding

Current `InitializeParams` contains:

- `clientInfo`
- optional `capabilities`

`ClientInfo` carries client `name`, optional `title`, and client `version`.

`InitializeCapabilities` currently includes capability declarations such as:

- `experimentalApi`
- `requestAttestation`
- notification opt-outs
- MCP extension declarations.

Current `InitializeResponse` carries runtime information including:

- `userAgent`
- `codexHome`
- `platformFamily`
- `platformOs`.

### Critical conclusion

There is **no explicit app-server protocol-version field** in the current top-level initialize request/response contract equivalent to a negotiated wire-version number.

Therefore successful process launch + `initialize` is necessary but not sufficient compatibility evidence. Compatibility has to be proven against the concrete request/response/notification subset used by the exact Desktop baseline.

Client capability negotiation exists, but it does not turn arbitrary older/newer app-server schemas into a generally negotiated backward-compatible protocol.

## Drift-sensitive protocol surfaces

### 1. Process/transport invocation

The selected CLI must still support the app-server mode/transport expected by Desktop. Community integrations already treat the CLI path as the authority binary, and current `openai/codex` documents `codex app-server` lifecycle use by desktop/mobile clients.

### 2. Initialize contract

Drift in required `clientInfo`, capability flags, initialization errors, or response fields can break startup or feature negotiation.

### 3. Thread lifecycle

Current `ThreadStartParams` exposes many optional but meaningful fields: model/provider, cwd, approval policy/reviewer, sandbox mode, config, instructions, personality, ephemeral state and source classifications. Desktop may depend on a subset that older runtimes do not understand or newer runtimes may interpret differently.

### 4. Turn lifecycle

Current `TurnStartParams` includes thread ID, input array, trigger/source metadata, tool output, cwd, approval/sandbox overrides, model/service tier/reasoning/personality and output schema. Field drift here can produce behavioral incompatibility even if JSON parsing succeeds.

### 5. Notifications and item schemas

Desktop behavior depends not only on request acceptance but on server notifications and serialized thread/turn/item structures. Renamed methods, new required fields, changed item variants, different completion ordering, or missing notifications are compatibility-sensitive.

### 6. Feature/experimental surface

`experimentalApi` and extension declarations gate portions of the protocol. A runtime may initialize successfully while lacking an experimental method/field expected by the Desktop baseline.

### 7. Auth/account/config/model surfaces

Desktop commonly relies on account/auth state, model discovery/configuration and persisted thread state. Those must be included in later smoke coverage instead of testing only shell execution.

## Desktop-side visibility limitation

The exact signed Desktop renderer/app code lives in the official `app.asar`. The audited Community repository preserves the signed `app.asar` by default but does not provide a canonical static manifest listing every app-server method used by Desktop `26.908.40834`.

Because artifact acquisition was unavailable in this execution environment, this card does not pretend to enumerate the exact Desktop method subset from renderer code.

This is not a reason to weaken compatibility. It implies that the later compatibility gate must include an **exact-baseline dynamic Desktop/app-server smoke test** rather than trusting source-version similarity alone.

## Inputs required by T05 compatibility gate

For any candidate replacement runtime, the gate should at minimum bind:

1. exact official Desktop `.deb` version, architecture and SHA-256;
2. exact replacement source/ref/build provenance;
3. replacement binary SHA-256 and `--version` output;
4. ability to launch the app-server mode expected by Desktop;
5. successful `initialize` with the Desktop's actual client/capability payload;
6. successful thread start/resume/read path;
7. successful turn start and expected server notifications/items;
8. ordinary tool/command path required by Desktop;
9. required model/account/config operations exercised by the exact Desktop smoke flow;
10. absence of unknown-method / deserialize / required-field errors in the tested flow;
11. later R4-specific background-exec wake behavior tests.

If exact source mapping remains unavailable but all exact-baseline protocol and behavior tests pass, compatibility can still potentially be established by evidence. Source-version similarity alone can never produce PASS.

## T02 conclusion

- Exact bundled-runtime → public `openai/codex` source revision: **UNAVAILABLE with current evidence**.
- A safe deterministic derivation procedure is documented for when exact artifact bytes become available.
- Current app-server initialization has client capabilities but no general top-level protocol-version negotiation.
- Protocol drift is therefore a first-class compatibility risk across initialize, thread, turn, notifications/items, feature flags, auth/config/model and app-server invocation.
- T05 must be behavior/schema evidence based and fail closed; it may not depend on guessed source ancestry.
